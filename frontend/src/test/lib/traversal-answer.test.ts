import { expect, it } from "vitest";

import { parseTraversalAnswer } from "@/lib/traversal-answer";

it("reads keys split by commas, spaces or both", () => {
  expect(parseTraversalAnswer("8, 4, 2")).toEqual([8, 4, 2]);
  expect(parseTraversalAnswer("8 4 2")).toEqual([8, 4, 2]);
  expect(parseTraversalAnswer(" 8,4  2, ")).toEqual([8, 4, 2]);
});

it("rejects an empty answer or anything that isn't a key", () => {
  expect(parseTraversalAnswer("")).toBeNull();
  expect(parseTraversalAnswer(" , ")).toBeNull();
  expect(parseTraversalAnswer("8, four, 2")).toBeNull();
  expect(parseTraversalAnswer("8.5")).toBeNull();
});
