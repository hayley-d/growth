import { RotateCcw } from "lucide-react";
import { useMemo, useReducer, useState } from "react";

import {
  type AvlNode,
  canRotate,
  checkGoal,
  type TraversalOrder,
  TreeTraversal,
  toKeys,
} from "@shared/avl";
import type { PlaygroundGoal, TreeOperation } from "@shared/schemas";
import { Button } from "@/components/atoms/button";
import { GoalReached } from "@/components/molecules/goal-reached";
import { PlaygroundNotice } from "@/components/molecules/playground-notice";
import { StepControls } from "@/components/molecules/step-controls";
import { StepMessage } from "@/components/molecules/step-message";
import { TraversalStaff } from "@/components/molecules/traversal-staff";
import { PlaygroundConsole } from "@/components/organisms/playground-console";
import { TreeView } from "@/components/organisms/tree-view";
import { TreeViewport } from "@/components/organisms/tree-viewport";
import { buildTree } from "@/lib/lesson/animation-steps";
import { emptyTaps, isFinished, tapMessage, tapNode } from "@/lib/lesson/traversal-taps";
import { useTreeMode } from "@/lib/lesson/tree-mode";
import { parseCommand } from "@/lib/playground/commands";
import { createSession, playgroundReducer } from "@/lib/playground/playground-reducer";
import { unbalancedKeys } from "@/lib/playground/run-command";
import type { PlaygroundSetup } from "@/lib/playground/setup";
import { suggestKey } from "@/lib/playground/suggest-key";
import { speak } from "@/lib/speak";
import { phaseOf } from "@/lib/step-phases";
import { useStepPlayer } from "@/lib/use-step-player";
import { cn } from "@/lib/utils";

const orderNames: Record<TraversalOrder, string> = {
  preorder: "pre-order",
  inorder: "in-order",
  postorder: "post-order",
  levelorder: "level order",
};

type PlaygroundBlockProperties = {
  startingKeys: readonly number[];
  allowedOperations: readonly TreeOperation[];
  instructions: string;
  goal?: PlaygroundGoal;
  className?: string;
};

export function PlaygroundBlock(properties: PlaygroundBlockProperties) {
  if (properties.allowedOperations.includes("traverse")) {
    return <TraversePlayground {...properties} />;
  }
  return <BuildPlayground {...properties} />;
}

function Instructions({ text }: { text: string }) {
  return <p className="text-xl leading-snug font-semibold sm:text-2xl">{text}</p>;
}

function TraversePlayground({
  startingKeys,
  instructions,
  goal,
  className,
}: PlaygroundBlockProperties) {
  const mode = useTreeMode();
  const root = useMemo(() => buildTree(startingKeys, mode), [startingKeys, mode]);
  const order = goal?.kind === "traversal" ? goal.order : "preorder";
  const expected = useMemo(
    () =>
      goal?.kind === "traversal"
        ? goal.keys
        : [...new TreeTraversal(root, order)].map((node) => node.key),
    [goal, root, order],
  );
  const orderName = orderNames[order];
  const [taps, setTaps] = useState(emptyTaps);
  const finished = isFinished(taps, expected);
  const badges: Record<number, number> = {};
  taps.placed.forEach((key, index) => {
    badges[key] = index + 1;
  });

  return (
    <section aria-label="Your turn" className={cn("flex min-w-0 flex-col gap-4", className)}>
      <Instructions text={instructions} />
      <div className="h-60 rounded-xl border bg-card p-3 sm:h-72">
        <TreeView
          root={root}
          manual
          badges={badges}
          onSelectKey={(key) => setTaps((current) => tapNode(current, key, expected))}
          label={`Tree to walk in ${orderName}. Tap the nodes in order.`}
          className="h-full"
        />
      </div>
      <TraversalStaff beats={expected.length} placed={taps.placed} wrong={taps.wrong} />
      {finished ? (
        <GoalReached message={tapMessage(taps, expected, orderName)} />
      ) : (
        <p aria-live="polite" className="rounded-md bg-muted px-4 py-3 font-medium">
          {tapMessage(taps, expected, orderName)}
        </p>
      )}
      <Button
        type="button"
        variant="outline"
        className="min-h-11 self-start"
        onClick={() => setTaps(emptyTaps)}
      >
        <RotateCcw aria-hidden />
        Start again
      </Button>
    </section>
  );
}

const lessonOperations = ["insert", "delete", "search", "rotateLeft", "rotateRight"] as const;

type LessonOperation = (typeof lessonOperations)[number];

const isLessonOperation = (operation: TreeOperation): operation is LessonOperation =>
  lessonOperations.some((each) => each === operation);

const operationExample: Record<LessonOperation, string> = {
  insert: "insert n",
  delete: "delete n",
  search: "search n",
  rotateLeft: "rotate left n",
  rotateRight: "rotate right n",
};

const commandAllowed = (text: string, allowed: readonly LessonOperation[]) => {
  const typed = text.trim().toLowerCase().replace(/\s+/g, " ");
  if (typed === "" || typed === "help") return true;
  if (typed.startsWith("rotate left")) return allowed.includes("rotateLeft");
  if (typed.startsWith("rotate right")) return allowed.includes("rotateRight");
  const word = typed.split(" ")[0] ?? "";
  return allowed.some((operation) => operation === word);
};

const lessonSetup: PlaygroundSetup = {
  topic: "avl",
  traversal: "inorder",
  explore: "watch",
  start: "empty",
  seed: 1,
};

const listOr = (items: readonly string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} or ${items.at(-1)}`;

const goalKeys = (goal: PlaygroundGoal | undefined) =>
  goal?.kind === "containsKeys" || goal?.kind === "traversal" ? goal.keys : [];

const rotationSuggestions = (tree: AvlNode | null, allowed: readonly LessonOperation[]) =>
  unbalancedKeys(tree).flatMap((key) => {
    const lines: string[] = [];
    if (allowed.includes("rotateRight") && canRotate(tree, key, "right")) {
      lines.push(`rotate right ${key}`);
    }
    if (allowed.includes("rotateLeft") && canRotate(tree, key, "left")) {
      lines.push(`rotate left ${key}`);
    }
    return lines;
  });

const buildSuggestions = (
  tree: AvlNode | null,
  operations: readonly LessonOperation[],
  goal: PlaygroundGoal | undefined,
  salt: number,
) => {
  const keys = toKeys(tree);
  const missing = goalKeys(goal).find((key) => !keys.includes(key));
  const free =
    missing !== undefined
      ? String(missing)
      : goal?.kind === "traversal"
        ? ""
        : suggestKey(tree, salt);
  const middle = keys[Math.floor(keys.length / 2)];
  const suggestions: Record<LessonOperation, string | null> = {
    insert: free === "" ? null : `insert ${free}`,
    delete: middle === undefined ? null : `delete ${middle}`,
    search: middle === undefined ? null : `search ${middle}`,
    rotateLeft: null,
    rotateRight: null,
  };
  return [
    ...rotationSuggestions(tree, operations),
    ...operations.flatMap((operation) => suggestions[operation] ?? []),
  ];
};

function BuildPlayground(properties: PlaygroundBlockProperties) {
  const [attempt, setAttempt] = useState(0);
  return (
    <BuildSession
      key={attempt}
      {...properties}
      onStartAgain={() => setAttempt((current) => current + 1)}
    />
  );
}

function BuildSession({
  startingKeys,
  allowedOperations,
  instructions,
  goal,
  className,
  onStartAgain,
}: PlaygroundBlockProperties & { onStartAgain: () => void }) {
  const mode = useTreeMode();
  const operations = allowedOperations.filter(isLessonOperation);
  const manualRotation = operations.some(
    (operation) => operation === "rotateLeft" || operation === "rotateRight",
  );
  const setup: PlaygroundSetup = manualRotation
    ? { ...lessonSetup, explore: "interact" }
    : lessonSetup;
  const [session, dispatch] = useReducer(playgroundReducer, setup, (initial) => ({
    ...createSession(initial),
    tree: buildTree(startingKeys, mode),
    treeMode: mode,
    autoBalance: !manualRotation,
  }));
  const run = session.run;
  const player = useStepPlayer(run?.steps ?? [], String(run?.id ?? 0));
  const step = run ? player.step : null;
  const shownTree = step ? step.tree : session.tree;
  const examples = operations.map((operation) => operationExample[operation]);
  const reached = goal !== undefined && checkGoal(session.tree, goal) && (!run || player.isLast);

  const handleRun = (text: string) => {
    const typed = text.trim().toLowerCase().replace(/\s+/g, " ");
    if (typed !== "" && typed !== "help" && !commandAllowed(typed, operations)) {
      dispatch({
        type: "refuse",
        command: typed,
        message: `Here you can use ${listOr(examples)}.`,
        via: "typed",
      });
      return;
    }
    const parsed = parseCommand(text, lessonSetup);
    if (parsed.ok && parsed.command.kind === "help") {
      dispatch({
        type: "reply",
        command: "help",
        message: `Here you can use ${listOr(examples)}.`,
        via: "typed",
      });
      return;
    }
    dispatch({ type: "command", text, via: "typed" });
  };

  return (
    <section aria-label="Your turn" className={cn("flex min-w-0 flex-col gap-4", className)}>
      <Instructions text={instructions} />
      {session.notice ? (
        <PlaygroundNotice tone={session.notice.tone} message={session.notice.message} />
      ) : null}
      {shownTree ? (
        <TreeViewport className="h-64 sm:h-72">
          <TreeView root={shownTree} nodeStates={step?.nodeStates} className="h-full" />
        </TreeViewport>
      ) : (
        <p className="grid min-h-48 place-items-center rounded-xl border bg-card text-muted-foreground">
          The tree is empty.
        </p>
      )}
      {step ? (
        <div className="flex flex-col gap-3">
          <StepMessage
            message={step.message}
            stepNumber={player.index + 1}
            stepCount={player.stepCount}
            onListen={speak}
          />
          <StepControls
            player={player}
            phases={(run?.steps ?? []).map((each) => phaseOf(each.stepKey))}
          />
        </div>
      ) : null}
      {reached ? <GoalReached message="Goal reached. Every key is where it belongs." /> : null}
      <Button type="button" variant="ghost" className="min-h-11 self-start" onClick={onStartAgain}>
        <RotateCcw aria-hidden />
        Start again
      </Button>
      <PlaygroundConsole
        entries={session.log}
        prompt="tree"
        placeholder={examples[0] ?? ""}
        suggestions={buildSuggestions(session.tree, operations, goal, session.nextId)}
        emptyText={`Type a command below, like ${listOr(examples)}, or tap one to fill it in.`}
        busy={player.isPlaying}
        onRun={handleRun}
        onReplay={(id) => dispatch({ type: "replay", id })}
      />
    </section>
  );
}
