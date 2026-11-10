import { type AvlNode, randomTree, toKeys, traceTraversal } from "@shared/avl";
import { commandText, type PlaygroundCommand, parseCommand } from "@/lib/playground/commands";
import { checkPrediction } from "@/lib/playground/prediction";
import { type PlaygroundRun, runCommand, type Tone } from "@/lib/playground/run-command";
import { type PlaygroundSetup, startSize, startTree, traversalNames } from "@/lib/playground/setup";

export type CommandSource = "typed" | "dragged" | "tapped";

export type LogEntry = {
  id: number;
  command: string;
  message: string;
  tone: Tone;
  via: CommandSource;
  replayable: boolean;
};

export type Notice = { tone: Tone; message: string };

export type PlaygroundSession = {
  setup: PlaygroundSetup;
  tree: AvlNode | null;
  autoBalance: boolean;
  run: (PlaygroundRun & { id: number }) | null;
  log: LogEntry[];
  notice: Notice | null;
  seed: number;
  nextId: number;
  prediction: number[];
  marks: boolean[] | null;
};

export type PlaygroundAction =
  | { type: "command"; text: string; via: CommandSource }
  | { type: "run"; command: PlaygroundCommand; via: CommandSource }
  | { type: "replay"; id: number }
  | { type: "refuse"; command: string; message: string; via: CommandSource }
  | { type: "new-tree" }
  | { type: "predict-add"; key: number }
  | { type: "predict-undo" }
  | { type: "predict-clear" }
  | { type: "predict-check" };

export const maxLogEntries = 30;

export const createSession = (setup: PlaygroundSetup): PlaygroundSession => ({
  setup,
  tree: startTree(setup),
  autoBalance: true,
  run: null,
  log: [],
  notice: null,
  seed: setup.seed,
  nextId: 1,
  prediction: [],
  marks: null,
});

const addLog = (
  session: PlaygroundSession,
  entry: Omit<LogEntry, "id">,
): Pick<PlaygroundSession, "log" | "nextId"> => ({
  log: [...session.log, { ...entry, id: session.nextId }].slice(-maxLogEntries),
  nextId: session.nextId + 1,
});

const nextSeed = (seed: number) => (seed % 2147483646) + 1;

const refuseSession = (
  session: PlaygroundSession,
  command: string,
  message: string,
  via: CommandSource,
): PlaygroundSession => ({
  ...session,
  run: null,
  notice: { tone: "bad", message },
  ...addLog(session, { command, message, tone: "bad", via, replayable: false }),
});

const runText = (
  session: PlaygroundSession,
  text: string,
  via: CommandSource,
): PlaygroundSession => {
  const parsed = parseCommand(text, session.setup);
  if (!parsed.ok) {
    return refuseSession(
      session,
      text.trim().toLowerCase().replace(/\s+/g, " "),
      parsed.message,
      via,
    );
  }
  const { command } = parsed;
  const seed = command.kind === "random" ? nextSeed(session.seed) : session.seed;
  const outcome = runCommand(
    { tree: session.tree, autoBalance: session.autoBalance, setup: session.setup, seed },
    command,
  );
  const treeChanged = outcome.tree !== session.tree;
  return {
    ...session,
    seed,
    tree: outcome.tree,
    autoBalance: outcome.autoBalance,
    run: outcome.run ? { ...outcome.run, id: session.nextId } : null,
    notice: { tone: outcome.tone, message: outcome.message },
    prediction: treeChanged ? [] : session.prediction,
    marks: treeChanged ? null : session.marks,
    ...addLog(session, {
      command: commandText(command),
      message: outcome.message,
      tone: outcome.tone,
      via,
      replayable: outcome.ok && command.kind !== "help" && command.kind !== "balance",
    }),
  };
};

const checkWalk = (session: PlaygroundSession): PlaygroundSession => {
  if (!session.tree || session.prediction.length === 0) return session;
  const order = session.setup.traversal;
  const traced = traceTraversal(session.tree, order);
  const checked = checkPrediction(session.prediction, traced.result);
  const tone = checked.right ? "good" : "warn";
  return {
    ...session,
    run: {
      id: session.nextId,
      label: `${traversalNames[order]} walk`,
      steps: traced.steps,
      walk: traced.result,
    },
    marks: checked.marks,
    notice: { tone, message: checked.message },
    ...addLog(session, {
      command: `predict ${session.prediction.join(" ")}`,
      message: checked.message,
      tone,
      via: "tapped",
      replayable: false,
    }),
  };
};

export const playgroundReducer = (
  session: PlaygroundSession,
  action: PlaygroundAction,
): PlaygroundSession => {
  if (action.type === "command") return runText(session, action.text, action.via);
  if (action.type === "run") return runText(session, commandText(action.command), action.via);
  if (action.type === "replay") {
    const entry = session.log.find((logged) => logged.id === action.id);
    return entry?.replayable ? runText(session, entry.command, "typed") : session;
  }
  if (action.type === "refuse") {
    return refuseSession(session, action.command, action.message, action.via);
  }
  if (action.type === "new-tree") {
    const seed = nextSeed(session.seed);
    const size = startSize(session.setup.start);
    const tree = randomTree({ size, seed });
    return {
      ...session,
      seed,
      tree,
      autoBalance: true,
      run: null,
      prediction: [],
      marks: null,
      notice: { tone: "info", message: `A new random tree with ${size} keys.` },
    };
  }
  if (action.type === "predict-add") {
    if (!toKeys(session.tree).includes(action.key)) return session;
    if (session.prediction.includes(action.key)) {
      return {
        ...session,
        notice: {
          tone: "warn",
          message: `${action.key} is already in your prediction. Each node is visited once.`,
        },
      };
    }
    return { ...session, prediction: [...session.prediction, action.key], marks: null };
  }
  if (action.type === "predict-undo") {
    return { ...session, prediction: session.prediction.slice(0, -1), marks: null };
  }
  if (action.type === "predict-clear") return { ...session, prediction: [], marks: null };
  return checkWalk(session);
};
