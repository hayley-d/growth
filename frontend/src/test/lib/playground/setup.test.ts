import { describe, expect, it } from "vitest";

import { toKeys } from "@shared/avl";
import { playgroundSearchSchema, startTree, toSearch, toSetup } from "@/lib/playground/setup";

describe("playgroundSearchSchema", () => {
  it("drops values it doesn't know", () => {
    expect(playgroundSearchSchema.parse({ topic: "heap", explore: "watch", seed: "abc" })).toEqual({
      explore: "watch",
    });
  });

  it("reads the seed as a number", () => {
    expect(playgroundSearchSchema.parse({ seed: "42" }).seed).toBe(42);
  });
});

describe("toSetup", () => {
  it("needs every answer", () => {
    expect(toSetup({ topic: "avl", explore: "watch" })).toBeNull();
    expect(toSetup({ topic: "traversal", explore: "watch", start: "small" })).toBeNull();
  });

  it("builds a setup and turns back into the same search", () => {
    const search = {
      topic: "traversal",
      traversal: "postorder",
      explore: "interact",
      start: "large",
      seed: 9,
    } as const;
    const setup = toSetup(search);
    expect(setup).toEqual({ ...search });
    expect(setup && toSearch(setup)).toEqual(search);
  });

  it("leaves the traversal out of an AVL search", () => {
    const setup = toSetup({ topic: "avl", traversal: "inorder", explore: "watch", start: "empty" });
    expect(setup && toSearch(setup).traversal).toBeUndefined();
  });
});

describe("startTree", () => {
  it("grows 5, 12 or no keys from the seed", () => {
    expect(toKeys(startTree({ start: "small", seed: 3 }))).toHaveLength(5);
    expect(toKeys(startTree({ start: "large", seed: 3 }))).toHaveLength(12);
    expect(startTree({ start: "empty", seed: 3 })).toBeNull();
    expect(toKeys(startTree({ start: "small", seed: 3 }))).toEqual(
      toKeys(startTree({ start: "small", seed: 3 })),
    );
  });
});
