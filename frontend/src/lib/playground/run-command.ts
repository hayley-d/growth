import {
  type AvlNode,
  canRotate,
  checkGoal,
  findNode,
  insertKey,
  type RotationDirection,
  type Step,
  type TreeMode,
  toKeys,
  traceBstInsert,
  traceBstRemove,
  traceInsert,
  traceRemove,
  traceRotateLeft,
  traceRotateRight,
  traceSearch,
  traceTraversal,
} from "@shared/avl";
import { findUnbalanced, insertBst, removeBst } from "@shared/engine";
import { helpText, type PlaygroundCommand } from "@/lib/playground/commands";
import {
  maxPlaygroundKeys,
  type PlaygroundSetup,
  randomTreeFor,
  traversalNames,
} from "@/lib/playground/setup";

export type PlaygroundRun = {
  label: string;
  steps: Step[];
  walk: number[] | null;
};

export type Tone = "good" | "warn" | "bad" | "info";

export type CommandContext = {
  tree: AvlNode | null;
  autoBalance: boolean;
  setup: Pick<PlaygroundSetup, "topic" | "traversal" | "explore">;
  seed: number;
  treeMode?: TreeMode;
};

export type CommandOutcome = {
  ok: boolean;
  tree: AvlNode | null;
  autoBalance: boolean;
  run: PlaygroundRun | null;
  message: string;
  tone: Tone;
};

const hasKey = (tree: AvlNode | null, key: number) => findNode(tree, key) !== null;

const listKeys = (keys: readonly number[]) =>
  keys.length < 2 ? keys.join("") : `${keys.slice(0, -1).join(", ")} and ${keys.at(-1)}`;

export const unbalancedKeys = (tree: AvlNode | null): number[] =>
  findUnbalanced(tree).map((node) => node.key);

const isOrAre = (keys: readonly number[]) => `${listKeys(keys)} ${keys.length > 1 ? "are" : "is"}`;

const unbalancedNote = (tree: AvlNode | null) => {
  const flagged = unbalancedKeys(tree);
  return flagged.length === 0 ? null : `${isOrAre(flagged)} now unbalanced.`;
};

const rebuildAsAvl = (tree: AvlNode | null) =>
  toKeys(tree).reduce<AvlNode | null>((built, key) => insertKey(built, key), null);

const fail = (context: CommandContext, message: string): CommandOutcome => ({
  ok: false,
  tree: context.tree,
  autoBalance: context.autoBalance,
  run: null,
  message,
  tone: "bad",
});

const done = (
  context: CommandContext,
  changes: Partial<CommandOutcome> & Pick<CommandOutcome, "message">,
): CommandOutcome => ({
  ok: true,
  tree: context.tree,
  autoBalance: context.autoBalance,
  run: null,
  tone: "good",
  ...changes,
});

const runInsert = (context: CommandContext, keys: readonly number[]): CommandOutcome => {
  const taken = keys.find((key) => hasKey(context.tree, key));
  if (taken !== undefined) {
    return fail(context, `${taken} is already in the tree. Each key can only be in it once.`);
  }
  if (toKeys(context.tree).length + keys.length > maxPlaygroundKeys) {
    return fail(
      context,
      `The playground holds up to ${maxPlaygroundKeys} keys. Delete one or clear the tree first.`,
    );
  }
  const isBst = context.treeMode === "bst";
  if (!isBst && !context.autoBalance) {
    const tree = keys.reduce<AvlNode | null>((built, key) => insertBst(built, key), context.tree);
    const note = unbalancedNote(tree);
    return done(context, {
      tree,
      tone: note ? "warn" : "good",
      message: note
        ? `${listKeys(keys)} went in with no rotations. ${note} Rotate it back into shape.`
        : `${listKeys(keys)} went in, and the tree is still an AVL tree.`,
    });
  }
  const traced = keys.reduce<{ tree: AvlNode | null; steps: Step[] }>(
    (built, key) => {
      const inserted = isBst ? traceBstInsert(built.tree, key) : traceInsert(built.tree, key);
      return { tree: inserted.result, steps: [...built.steps, ...inserted.steps] };
    },
    { tree: context.tree, steps: [] },
  );
  return done(context, {
    tree: traced.tree,
    run: { label: `Insert ${listKeys(keys)}`, steps: traced.steps, walk: null },
    message: `Step through to watch ${listKeys(keys)} go in.`,
  });
};

const runDelete = (context: CommandContext, key: number): CommandOutcome => {
  if (!hasKey(context.tree, key)) {
    return fail(context, `${key} isn't in the tree, so there's nothing to delete.`);
  }
  const isBst = context.treeMode === "bst";
  if (!isBst && !context.autoBalance) {
    const tree = removeBst(context.tree, key);
    const note = unbalancedNote(tree);
    return done(context, {
      tree,
      tone: note ? "warn" : "good",
      message: note
        ? `${key} is gone, with no rotations. ${note}`
        : `${key} is gone, and the tree is still an AVL tree.`,
    });
  }
  const traced = isBst ? traceBstRemove(context.tree, key) : traceRemove(context.tree, key);
  return done(context, {
    tree: traced.result,
    run: { label: `Delete ${key}`, steps: traced.steps, walk: null },
    message: `Step through to watch ${key} come out.`,
  });
};

const runSearch = (context: CommandContext, key: number): CommandOutcome => {
  if (!context.tree) return fail(context, "The tree is empty, so there's nothing to search.");
  const traced = traceSearch(context.tree, key);
  return done(context, {
    run: { label: `Search for ${key}`, steps: traced.steps, walk: null },
    message: traced.result
      ? `${key} is in the tree. Step through to see the path.`
      : `${key} isn't in the tree. Step through to see where the search stops.`,
  });
};

const runRotate = (
  context: CommandContext,
  direction: RotationDirection,
  key: number,
): CommandOutcome => {
  if (context.autoBalance) {
    return fail(context, "Rotating by hand needs auto-balance off. Switch it off first.");
  }
  if (!hasKey(context.tree, key)) return fail(context, `${key} isn't in the tree.`);
  if (!canRotate(context.tree, key, direction)) {
    return fail(
      context,
      `${key} has no ${direction === "left" ? "right" : "left"} child, so it can't rotate ${direction}.`,
    );
  }
  const traced =
    direction === "left" ? traceRotateLeft(context.tree, key) : traceRotateRight(context.tree, key);
  const valid = checkGoal(traced.result, { kind: "validAvl" });
  return done(context, {
    tree: traced.result,
    run: { label: `Rotate ${key} ${direction}`, steps: traced.steps, walk: null },
    tone: valid ? "good" : "warn",
    message: valid
      ? "It's an AVL tree again. Every balance factor is between -1 and 1."
      : `Not yet. ${isOrAre(unbalancedKeys(traced.result))} still unbalanced.`,
  });
};

const runBalance = (context: CommandContext, on: boolean): CommandOutcome => {
  if (!on) {
    return done(context, {
      autoBalance: false,
      tone: "info",
      message:
        "Auto-balance is off. New keys go in with no rotations, and unbalanced nodes are flagged.",
    });
  }
  const needsRebuild = unbalancedKeys(context.tree).length > 0;
  return done(context, {
    autoBalance: true,
    tree: needsRebuild ? rebuildAsAvl(context.tree) : context.tree,
    message: needsRebuild
      ? "Auto-balance is back on, so the tree was rebuilt as an AVL tree."
      : "Auto-balance is back on.",
  });
};

const runWalk = (context: CommandContext, order: PlaygroundSetup["traversal"]): CommandOutcome => {
  if (!context.tree)
    return fail(context, "The tree is empty. Build one first, like tree 50 30 70.");
  const traced = traceTraversal(context.tree, order);
  return done(context, {
    run: { label: `${traversalNames[order]} walk`, steps: traced.steps, walk: traced.result },
    message: `The ${traversalNames[order].toLowerCase()} walk visits ${traced.result.join(", ")}.`,
  });
};

const runTree = (context: CommandContext, keys: readonly number[]): CommandOutcome =>
  done(context, {
    tree: keys.reduce<AvlNode | null>((built, key) => insertBst(built, key), null),
    message: `A tree of ${keys.length} keys, put in in that order with no balancing.`,
  });

const runRandom = (context: CommandContext, size: number): CommandOutcome =>
  done(context, {
    tree: randomTreeFor(context.setup.topic, size, context.seed),
    autoBalance: true,
    message: `A random tree with ${size} keys.`,
  });

export const runCommand = (context: CommandContext, command: PlaygroundCommand): CommandOutcome => {
  if (command.kind === "insert") return runInsert(context, command.keys);
  if (command.kind === "delete") return runDelete(context, command.key);
  if (command.kind === "search") return runSearch(context, command.key);
  if (command.kind === "rotate") return runRotate(context, command.direction, command.key);
  if (command.kind === "balance") return runBalance(context, command.on);
  if (command.kind === "walk") return runWalk(context, command.order);
  if (command.kind === "tree") return runTree(context, command.keys);
  if (command.kind === "random") return runRandom(context, command.size);
  if (command.kind === "clear") return done(context, { tree: null, message: "The tree is empty." });
  return done(context, { tone: "info", message: helpText(context.setup) });
};
