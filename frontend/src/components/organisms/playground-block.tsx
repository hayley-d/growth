import { RotateCcw } from "lucide-react";
import { useMemo, useReducer, useState } from "react";

import { type AvlNode, checkGoal, type TraversalOrder, toKeys } from "@shared/avl";
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
import { parseCommand } from "@/lib/playground/commands";
import { createSession, playgroundReducer } from "@/lib/playground/playground-reducer";
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
  const { allowedOperations, goal } = properties;
  if (allowedOperations.includes("traverse") || goal?.kind === "traversal") {
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
  const root = useMemo(() => buildTree(startingKeys), [startingKeys]);
  const order = goal?.kind === "traversal" ? goal.order : "preorder";
  const expected = goal?.kind === "traversal" ? goal.keys : toKeys(root);
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

type BuildOperation = "insert" | "delete" | "search";

const buildOperations: readonly BuildOperation[] = ["insert", "delete", "search"];

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
  goal?.kind === "containsKeys" ? goal.keys : [];

const buildSuggestions = (
  tree: AvlNode | null,
  operations: readonly BuildOperation[],
  goal: PlaygroundGoal | undefined,
  salt: number,
) => {
  const keys = toKeys(tree);
  const missing = goalKeys(goal).find((key) => !keys.includes(key));
  const free = missing === undefined ? suggestKey(tree, salt) : String(missing);
  const middle = keys[Math.floor(keys.length / 2)];
  const suggestions: Record<BuildOperation, string | null> = {
    insert: free === "" ? null : `insert ${free}`,
    delete: middle === undefined ? null : `delete ${middle}`,
    search: middle === undefined ? null : `search ${middle}`,
  };
  return operations.flatMap((operation) => suggestions[operation] ?? []);
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
  const [session, dispatch] = useReducer(playgroundReducer, lessonSetup, (setup) => ({
    ...createSession(setup),
    tree: buildTree(startingKeys),
  }));
  const run = session.run;
  const player = useStepPlayer(run?.steps ?? [], String(run?.id ?? 0));
  const step = run ? player.step : null;
  const shownTree = step ? step.tree : session.tree;
  const operations = buildOperations.filter((operation) => allowedOperations.includes(operation));
  const examples = operations.map((operation) => `${operation} n`);
  const reached =
    goal !== undefined &&
    goal.kind !== "traversal" &&
    checkGoal(session.tree, goal) &&
    (!run || player.isLast);

  const handleRun = (text: string) => {
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
    const allowed = parsed.ok && operations.some((operation) => operation === parsed.command.kind);
    if (parsed.ok && !allowed) {
      dispatch({
        type: "refuse",
        command: text.trim().toLowerCase().replace(/\s+/g, " "),
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
