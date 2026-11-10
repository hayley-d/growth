import { describe, expect, it } from "vitest";

import { commandText, maxCommandLength, parseCommand } from "@/lib/playground/commands";
import { maxPlaygroundKeys } from "@/lib/playground/setup";

const avl = { topic: "avl", traversal: "inorder", explore: "interact" } as const;
const avlWatch = { ...avl, explore: "watch" } as const;
const postorder = { topic: "traversal", traversal: "postorder", explore: "watch" } as const;

describe("parseCommand for AVL trees", () => {
  it("reads insert with one or more keys", () => {
    expect(parseCommand("insert 42", avl)).toEqual({
      ok: true,
      command: { kind: "insert", keys: [42] },
    });
    expect(parseCommand("  INSERT 5 9 5 ", avl)).toEqual({
      ok: true,
      command: { kind: "insert", keys: [5, 9] },
    });
  });

  it("reads delete, search, rotate and balance", () => {
    expect(parseCommand("delete 20", avl)).toEqual({
      ok: true,
      command: { kind: "delete", key: 20 },
    });
    expect(parseCommand("search 7", avl)).toEqual({
      ok: true,
      command: { kind: "search", key: 7 },
    });
    expect(parseCommand("rotate left 20", avl)).toEqual({
      ok: true,
      command: { kind: "rotate", direction: "left", key: 20 },
    });
    expect(parseCommand("balance off", avl)).toEqual({
      ok: true,
      command: { kind: "balance", on: false },
    });
  });

  it("explains bad keys", () => {
    expect(parseCommand("insert 100", avl)).toEqual({
      ok: false,
      message: "100 is out of range. Keys go from 1 to 99.",
    });
    expect(parseCommand("insert 2.5", avl).ok).toBe(false);
    expect(parseCommand("insert", avl)).toEqual({
      ok: false,
      message: "Give some keys, like insert 42.",
    });
    expect(parseCommand("rotate up 20", avl).ok).toBe(false);
  });

  it("points traversals to Change setup", () => {
    expect(parseCommand("inorder", avl)).toEqual({
      ok: false,
      message: "inorder is a traversal. Use Change setup to play with traversals.",
    });
  });

  it("says when a word is unknown", () => {
    expect(parseCommand("grow 5", avl)).toEqual({
      ok: false,
      message: 'I don\'t know "grow". Type help to see every command.',
    });
  });
});

describe("parseCommand when watching AVL trees", () => {
  it("refuses rotate and balance, which only work hands on", () => {
    for (const text of ["rotate left 20", "balance off"]) {
      const parsed = parseCommand(text, avlWatch);
      expect(parsed.ok).toBe(false);
      expect(parsed.ok ? "" : parsed.message).toContain("Interact with the tree");
    }
  });

  it("still runs insert", () => {
    expect(parseCommand("insert 42", avlWatch).ok).toBe(true);
  });
});

describe("parseCommand for traversals", () => {
  it("only runs the chosen walk", () => {
    expect(parseCommand("postorder", postorder)).toEqual({
      ok: true,
      command: { kind: "walk", order: "postorder" },
    });
    expect(parseCommand("inorder", postorder)).toEqual({
      ok: false,
      message: "This playground is set to post-order. Use Change setup to try in-order.",
    });
  });

  it("builds a tree from keys and blocks AVL commands", () => {
    expect(parseCommand("tree 50 30 70", postorder)).toEqual({
      ok: true,
      command: { kind: "tree", keys: [50, 30, 70] },
    });
    expect(parseCommand("insert 4", postorder).ok).toBe(false);
  });

  it("limits random to maxPlaygroundKeys", () => {
    expect(parseCommand("random", postorder)).toEqual({
      ok: true,
      command: { kind: "random", size: 7 },
    });
    expect(parseCommand(`random ${maxPlaygroundKeys + 1}`, postorder).ok).toBe(false);
    expect(parseCommand("random 7", postorder).ok).toBe(true);
    for (const size of ["0x7", "1e1", "+5", "7.0"]) {
      expect(parseCommand(`random ${size}`, postorder).ok).toBe(false);
    }
  });
});

it("writes each command back as text", () => {
  expect(commandText({ kind: "rotate", direction: "right", key: 30 })).toBe("rotate right 30");
  expect(commandText({ kind: "insert", keys: [1, 2] })).toBe("insert 1 2");
  expect(commandText({ kind: "walk", order: "levelorder" })).toBe("levelorder");
});

describe("maxCommandLength", () => {
  it("fits the longest command the playground accepts", () => {
    const keys = Array.from({ length: maxPlaygroundKeys }, (_, index) => 99 - index);
    expect(commandText({ kind: "insert", keys }).length).toBeLessThanOrEqual(maxCommandLength);
    expect(commandText({ kind: "tree", keys }).length).toBeLessThanOrEqual(maxCommandLength);
  });
});
