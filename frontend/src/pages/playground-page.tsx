import { Navigate, useSearch } from "@tanstack/react-router";
import { type PointerEvent, useCallback, useEffect, useMemo, useReducer, useState } from "react";

import { type AlgorithmCode, type AvlNode, createRandom, largestKey, toKeys } from "@shared/avl";
import { CommandLog } from "@/components/molecules/command-log";
import { DragGhost } from "@/components/molecules/drag-ghost";
import { PlaygroundNotice } from "@/components/molecules/playground-notice";
import { SetupPills } from "@/components/molecules/setup-pills";
import { StepControls } from "@/components/molecules/step-controls";
import { StepMessage } from "@/components/molecules/step-message";
import { CodeTrace } from "@/components/organisms/code-trace";
import { DraggableTree } from "@/components/organisms/draggable-tree";
import { HandsOnTools } from "@/components/organisms/hands-on-tools";
import { PlaygroundConsole } from "@/components/organisms/playground-console";
import { PlaygroundTools } from "@/components/organisms/playground-tools";
import { TraceLayout } from "@/components/organisms/trace-layout";
import { TraversalPrediction } from "@/components/organisms/traversal-prediction";
import { TreeView } from "@/components/organisms/tree-view";
import { TreeViewport } from "@/components/organisms/tree-viewport";
import { type PlaygroundCommand, parseKey } from "@/lib/playground/commands";
import { dropToAction, emptySlots } from "@/lib/playground/drop-rules";
import { withUnbalanced } from "@/lib/playground/node-states";
import {
  type CommandSource,
  createSession,
  playgroundReducer,
} from "@/lib/playground/playground-reducer";
import { unbalancedKeys } from "@/lib/playground/run-command";
import { type PlaygroundSetup, toSearch, toSetup, traversalNames } from "@/lib/playground/setup";
import { usePlaygroundSnippets } from "@/lib/playground/use-playground-snippets";
import {
  type DragSource,
  type DropTarget,
  usePointerDrag,
} from "@/lib/playground/use-pointer-drag";
import { speak } from "@/lib/speak";
import { phaseOf } from "@/lib/step-phases";
import { useStepPlayer } from "@/lib/use-step-player";

const avlCodes: readonly AlgorithmCode[] = [
  "insert",
  "delete",
  "search",
  "rotate-left",
  "rotate-right",
  "rebalance",
  "update-height",
];

const suggestKey = (tree: AvlNode | null, salt: number) => {
  const taken = new Set(toKeys(tree));
  const random = createRandom(salt + taken.size * 7919);
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const key = 1 + Math.floor(random() * largestKey);
    if (!taken.has(key)) return String(key);
  }
  return "";
};

const avlWatchSuggestions = (tree: AvlNode | null, salt: number) => {
  const keys = toKeys(tree);
  const free = suggestKey(tree, salt);
  const middle = keys[Math.floor(keys.length / 2)];
  const largest = keys.at(-1);
  return [
    ...(free === "" ? [] : [`insert ${free}`]),
    ...(middle === undefined ? [] : [`delete ${middle}`]),
    ...(largest === undefined ? [] : [`search ${largest}`]),
    "random 9",
    "clear",
    "help",
  ];
};

const idleMessage = (setup: PlaygroundSetup) => {
  const order = traversalNames[setup.traversal].toLowerCase();
  if (setup.topic === "traversal") {
    return setup.explore === "interact"
      ? "Put the nodes in the order you think the walk visits them, then check."
      : `Press Walk to run the ${order} walk, or type ${setup.traversal}.`;
  }
  return setup.explore === "interact"
    ? "Drag the new key onto the tree where you think it belongs."
    : "Type a command to see it run.";
};

export function PlaygroundPage() {
  const search = useSearch({ from: "/_app/playground/play" });
  const setup = toSetup(search);
  if (!setup) return <Navigate to="/playground" search={search} replace />;
  return <PlaygroundSession key={JSON.stringify(toSearch(setup))} setup={setup} />;
}

function PlaygroundSession({ setup }: { setup: PlaygroundSetup }) {
  const [session, dispatch] = useReducer(playgroundReducer, setup, createSession);
  const run = session.run;
  const steps = run?.steps ?? [];
  const player = useStepPlayer(steps, String(run?.id ?? 0));
  const step = run ? player.step : null;
  const shownTree = step ? step.tree : session.tree;
  const busy = player.isPlaying;
  const isAvl = setup.topic === "avl";
  const isInteract = setup.explore === "interact";

  const code = usePlaygroundSnippets(isAvl ? avlCodes : [setup.traversal]);

  const [selectedKey, setSelectedKey] = useState<number | null>(null);
  const [codeHidden, setCodeHidden] = useState(false);
  const [newKey, setNewKey] = useState(() => suggestKey(session.tree, setup.seed));

  useEffect(() => {
    setNewKey((current) =>
      toKeys(session.tree).includes(Number(current))
        ? suggestKey(session.tree, session.nextId)
        : current,
    );
  }, [session.tree, session.nextId]);

  const runText = useCallback((text: string, via: CommandSource) => {
    setSelectedKey(null);
    dispatch({ type: "command", text, via });
  }, []);

  const runTyped = useCallback((command: PlaygroundCommand, via: CommandSource) => {
    setSelectedKey(null);
    dispatch({ type: "run", command, via });
  }, []);

  const handleDrop = (source: DragSource, target: DropTarget) => {
    const action = dropToAction(session.tree, isAvl, source, target);
    if (!action) return;
    if (action.type === "run") setSelectedKey(null);
    dispatch(action);
  };

  const { drag, startDrag, consumeClick, ghostRef } = usePointerDrag({
    onDrop: handleDrop,
    onStart: () => {
      if (run && !player.isLast) player.last();
      setSelectedKey(null);
    },
  });

  const handleChipPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (busy) return;
    const parsed = parseKey(newKey);
    if ("key" in parsed) startDrag(event, { kind: "new", key: parsed.key });
  };

  const handleChipClick = () => {
    if (consumeClick()) return;
    const parsed = parseKey(newKey);
    if ("message" in parsed) {
      dispatch({
        type: "refuse",
        command: `insert ${newKey.trim()}`,
        message: parsed.message,
        via: "typed",
      });
      return;
    }
    runTyped({ kind: "insert", keys: [parsed.key] }, "typed");
  };

  const handleNodePointerDown = (event: PointerEvent<HTMLElement>, nodeKey: number) => {
    if (!busy) startDrag(event, { kind: "node", key: nodeKey });
  };

  const handleSelectKey = (nodeKey: number) => {
    if (consumeClick() || busy) return;
    if (!isAvl) {
      dispatch({ type: "predict-add", key: nodeKey });
      return;
    }
    setSelectedKey((current) => (current === nodeKey ? null : nodeKey));
  };

  const flagUnbalanced = isAvl && !session.autoBalance;
  const stepStates = step?.nodeStates;
  const nodeStates = useMemo(() => {
    const states = stepStates ?? {};
    return flagUnbalanced ? withUnbalanced(states, unbalancedKeys(shownTree)) : states;
  }, [stepStates, flagUnbalanced, shownTree]);
  const draggingNew = drag?.moved === true && drag.source.kind === "new";
  const slots = useMemo(
    () => (draggingNew ? emptySlots(session.tree) : []),
    [draggingNew, session.tree],
  );
  const over = drag?.moved ? drag.over : null;
  const activeSlotId = over?.kind === "slot" ? over.slotId : null;
  const dropKey = over?.kind === "node" ? over.key : null;
  const draggingNode = drag?.moved === true && drag.source.kind === "node";
  const viewportClassName = codeHidden ? "h-[34rem]" : "h-80 sm:h-[22rem]";

  const tree = isInteract ? (
    <DraggableTree
      root={shownTree}
      nodeStates={nodeStates}
      showBalance={isAvl}
      slots={slots}
      activeSlotId={activeSlotId}
      selectedKey={selectedKey}
      dropKey={dropKey}
      treeClassName="h-full"
      onNodePointerDown={handleNodePointerDown}
      onSelectKey={handleSelectKey}
    />
  ) : (
    <TreeView root={shownTree} nodeStates={nodeStates} showBalance={isAvl} className="h-full" />
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Playground</h1>
        <SetupPills setup={setup} />
      </div>
      <PlaygroundTools
        setup={setup}
        autoBalance={session.autoBalance}
        busy={busy}
        codeHidden={codeHidden}
        onCommand={(text) => runText(text, "tapped")}
        onNewTree={() => {
          setSelectedKey(null);
          dispatch({ type: "new-tree" });
        }}
        onToggleCode={() => setCodeHidden((current) => !current)}
      />
      <TraceLayout
        codeHidden={codeHidden}
        tree={
          <div className="flex w-full flex-col gap-5 self-start">
            {session.notice ? (
              <PlaygroundNotice tone={session.notice.tone} message={session.notice.message} />
            ) : null}
            {shownTree || slots.length > 0 ? (
              <TreeViewport className={viewportClassName}>{tree}</TreeViewport>
            ) : (
              <p className="grid min-h-48 place-items-center text-center text-muted-foreground">
                The tree is empty.{" "}
                {isAvl ? "Add a key to start." : "Press New tree, or build one with a command."}
              </p>
            )}
            {isInteract && isAvl ? (
              <HandsOnTools
                newKey={newKey}
                selectedKey={selectedKey}
                autoBalance={session.autoBalance}
                busy={busy}
                dragging={draggingNode}
                binActive={over?.kind === "bin"}
                onNewKeyChange={setNewKey}
                onChipPointerDown={handleChipPointerDown}
                onChipClick={handleChipClick}
                onCommand={(text) => runText(text, "tapped")}
              />
            ) : null}
            {isInteract && !isAvl ? (
              <TraversalPrediction
                orderName={traversalNames[setup.traversal]}
                prediction={session.prediction}
                marks={session.marks}
                total={toKeys(session.tree).length}
                busy={busy}
                isOver={over?.kind === "predict"}
                onUndo={() => dispatch({ type: "predict-undo" })}
                onClear={() => dispatch({ type: "predict-clear" })}
                onCheck={() => dispatch({ type: "predict-check" })}
              />
            ) : null}
          </div>
        }
        code={
          <CodeTrace
            step={step}
            snippets={code.snippets}
            language={code.language}
            learnerLanguage={code.learnerLanguage}
            onLanguageChange={code.setLanguage}
            isLoading={code.isLoading}
          />
        }
        message={
          step ? (
            <StepMessage
              message={step.message}
              stepNumber={player.index + 1}
              stepCount={player.stepCount}
              onListen={speak}
            />
          ) : (
            <p className="text-base text-muted-foreground sm:text-lg">{idleMessage(setup)}</p>
          )
        }
        controls={
          run ? (
            <StepControls player={player} phases={steps.map((each) => phaseOf(each.stepKey))} />
          ) : undefined
        }
      />
      {isInteract ? (
        <section aria-label="What you've done" className="rounded-2xl border-2 bg-card p-3 sm:p-4">
          <CommandLog
            entries={session.log}
            busy={busy}
            emptyText="Everything you do shows up here as the command it ran."
            onReplay={(id) => dispatch({ type: "replay", id })}
          />
        </section>
      ) : (
        <PlaygroundConsole
          entries={session.log}
          prompt={isAvl ? "avl" : setup.traversal}
          placeholder={isAvl ? "insert 42" : setup.traversal}
          suggestions={
            isAvl
              ? avlWatchSuggestions(session.tree, session.nextId)
              : [setup.traversal, "tree 50 30 70 20 40 60 80", "random 7", "help"]
          }
          busy={busy}
          onRun={(text) => runText(text, "typed")}
          onReplay={(id) => dispatch({ type: "replay", id })}
        />
      )}
      {drag?.moved ? (
        <DragGhost ref={ghostRef} label={String(drag.source.key)} x={drag.x} y={drag.y} />
      ) : null}
    </div>
  );
}
