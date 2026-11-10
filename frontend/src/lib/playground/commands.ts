import { largestKey, type RotationDirection, type TraversalOrder } from "@shared/avl";
import {
  maxPlaygroundKeys,
  type PlaygroundSetup,
  playgroundTraversals,
  traversalNames,
} from "@/lib/playground/setup";

export type PlaygroundCommand =
  | { kind: "insert"; keys: number[] }
  | { kind: "delete"; key: number }
  | { kind: "search"; key: number }
  | { kind: "rotate"; direction: RotationDirection; key: number }
  | { kind: "balance"; on: boolean }
  | { kind: "walk"; order: TraversalOrder }
  | { kind: "tree"; keys: number[] }
  | { kind: "random"; size: number }
  | { kind: "clear" }
  | { kind: "help" };

export type RotateCommand = Extract<PlaygroundCommand, { kind: "rotate" }>;

type Failure = { ok: false; message: string };

export type ParsedCommand = { ok: true; command: PlaygroundCommand } | Failure;

export const maxCommandLength = 160;

const wholeNumber = /^\d+$/;

const avlWords = new Set(["insert", "delete", "search", "rotate", "balance"]);

const isTraversal = (word: string): word is TraversalOrder =>
  playgroundTraversals.some((order) => order === word);

export const parseKey = (text: string): { key: number } | { message: string } => {
  const trimmed = text.trim();
  if (trimmed === "") return { message: "Type a key first." };
  if (!wholeNumber.test(trimmed)) {
    return {
      message: `"${trimmed}" isn't a whole number. Keys are whole numbers from 1 to ${largestKey}.`,
    };
  }
  const key = Number(trimmed);
  if (key < 1 || key > largestKey) {
    return { message: `${key} is out of range. Keys go from 1 to ${largestKey}.` };
  }
  return { key };
};

const failed = (message: string): Failure => ({ ok: false, message });

const keyOrFailure = (text: string): number | Failure => {
  const parsed = parseKey(text);
  return "key" in parsed ? parsed.key : failed(parsed.message);
};

const parseKeys = (
  parts: readonly string[],
  example: string,
): { ok: true; keys: number[] } | Failure => {
  if (parts.length === 0) return failed(`Give some keys, like ${example}.`);
  const keys: number[] = [];
  for (const part of parts) {
    const key = keyOrFailure(part);
    if (typeof key !== "number") return key;
    if (!keys.includes(key)) keys.push(key);
  }
  if (keys.length > maxPlaygroundKeys) {
    return failed(`The playground holds up to ${maxPlaygroundKeys} keys.`);
  }
  return { ok: true, keys };
};

const parseOneKey = (word: "delete" | "search", parts: readonly string[]): ParsedCommand => {
  if (parts.length !== 1) return failed(`${word} takes one key, like ${word} 20.`);
  const key = keyOrFailure(parts[0] ?? "");
  return typeof key === "number" ? { ok: true, command: { kind: word, key } } : key;
};

const parseAvlCommand = (word: string, parts: readonly string[]): ParsedCommand => {
  if (word === "insert") {
    const parsed = parseKeys(parts, "insert 42");
    return parsed.ok ? { ok: true, command: { kind: "insert", keys: parsed.keys } } : parsed;
  }
  if (word === "delete" || word === "search") return parseOneKey(word, parts);
  if (word === "rotate") {
    const [direction, keyText] = parts;
    if ((direction !== "left" && direction !== "right") || parts.length !== 2) {
      return failed("rotate needs a side and a key, like rotate left 20.");
    }
    const key = keyOrFailure(keyText ?? "");
    return typeof key === "number"
      ? { ok: true, command: { kind: "rotate", direction, key } }
      : key;
  }
  const [setting] = parts;
  if (parts.length !== 1 || (setting !== "on" && setting !== "off")) {
    return failed("Type balance on or balance off.");
  }
  return { ok: true, command: { kind: "balance", on: setting === "on" } };
};

const parseRandom = (parts: readonly string[]): ParsedCommand => {
  if (parts.length === 0) return { ok: true, command: { kind: "random", size: 7 } };
  const [sizeText = ""] = parts;
  const size = Number(sizeText);
  if (parts.length > 1 || !wholeNumber.test(sizeText) || size < 1 || size > maxPlaygroundKeys) {
    return {
      ok: false,
      message: `random takes a size from 1 to ${maxPlaygroundKeys}, like random 7.`,
    };
  }
  return { ok: true, command: { kind: "random", size } };
};

type CommandSetup = Pick<PlaygroundSetup, "topic" | "traversal" | "explore">;

const handOnlyWords = new Set(["rotate", "balance"]);

export const helpText = (setup: CommandSetup) => {
  if (setup.topic === "traversal") {
    return `${setup.traversal}, tree 50 30 70 (builds a tree in that order), random n, clear`;
  }
  return setup.explore === "interact"
    ? "insert n, delete n, search n, balance on/off, rotate left n, rotate right n, random n, clear"
    : "insert n, delete n, search n, random n, clear";
};

export const parseCommand = (text: string, setup: CommandSetup): ParsedCommand => {
  const [word = "", ...parts] = text.trim().toLowerCase().split(/\s+/);
  if (word === "") return { ok: false, message: "Type a command. Try help." };
  if (word === "help") return { ok: true, command: { kind: "help" } };
  if (word === "clear" && parts.length === 0) return { ok: true, command: { kind: "clear" } };
  if (word === "random") return parseRandom(parts);

  if (setup.topic === "traversal") {
    if (isTraversal(word)) {
      if (word !== setup.traversal) {
        return {
          ok: false,
          message: `This playground is set to ${traversalNames[setup.traversal].toLowerCase()}. Use Change setup to try ${traversalNames[word].toLowerCase()}.`,
        };
      }
      return { ok: true, command: { kind: "walk", order: word } };
    }
    if (word === "tree") {
      const parsed = parseKeys(parts, "tree 50 30 70");
      return parsed.ok ? { ok: true, command: { kind: "tree", keys: parsed.keys } } : parsed;
    }
    if (avlWords.has(word)) {
      return {
        ok: false,
        message: `${word} is for Tree building. Use Change setup to play with it. Here, tree 50 30 70 builds a new tree.`,
      };
    }
  } else {
    if (handOnlyWords.has(word) && setup.explore !== "interact") {
      return {
        ok: false,
        message: `${word} is for Interact with the tree. Here the tree always balances itself. Use Change setup to rotate by hand.`,
      };
    }
    if (avlWords.has(word)) return parseAvlCommand(word, parts);
    if (isTraversal(word)) {
      return {
        ok: false,
        message: `${word} is a traversal. Use Change setup to play with traversals.`,
      };
    }
    if (word === "tree") {
      return { ok: false, message: "To add several keys at once, type insert 50 30 70." };
    }
  }
  return { ok: false, message: `I don't know "${word}". Type help to see every command.` };
};

export const commandText = (command: PlaygroundCommand): string => {
  if (command.kind === "insert") return `insert ${command.keys.join(" ")}`;
  if (command.kind === "delete" || command.kind === "search")
    return `${command.kind} ${command.key}`;
  if (command.kind === "rotate") return `rotate ${command.direction} ${command.key}`;
  if (command.kind === "balance") return `balance ${command.on ? "on" : "off"}`;
  if (command.kind === "walk") return command.order;
  if (command.kind === "tree") return `tree ${command.keys.join(" ")}`;
  if (command.kind === "random") return `random ${command.size}`;
  return command.kind;
};
