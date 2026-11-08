import { describe, expect, it } from "vitest";

import {
  coverHoldMs,
  edgeLink,
  lightDelayMs,
  lightOrder,
  treeEdgeStaggerMs,
} from "@/lib/tree-motion";

const tree = [
  { key: 20, x: 1, parentKey: null },
  { key: 10, x: 0, parentKey: 20 },
  { key: 5, x: 0, parentKey: 10 },
  { key: 30, x: 2, parentKey: 20 },
];

describe("edgeLink", () => {
  it("keeps each end on the same node when parent and child swap", () => {
    const before = edgeLink({ key: 30, x: 2, y: 0 }, { key: 20, x: 1, y: 1 });
    const after = edgeLink({ key: 20, x: 1, y: 0 }, { key: 30, x: 2, y: 1 });

    expect(before.key).toBe("20-30");
    expect(after.key).toBe(before.key);
    expect(before).toMatchObject({ x1: 1, y1: 1, x2: 2, y2: 0, dropStart: true });
    expect(after).toMatchObject({ x1: 1, y1: 0, x2: 2, y2: 1, dropStart: false });
  });
});

describe("lightOrder", () => {
  it("walks lit edges from the root downward, left before right", () => {
    expect(lightOrder(tree, new Set([10, 5, 30]))).toEqual([10, 5, 30]);
  });

  it("skips edges whose child is not on the path", () => {
    expect(lightOrder(tree, new Set([5]))).toEqual([5]);
  });
});

describe("lightDelayMs", () => {
  it("staggers only the edges that just became lit", () => {
    const delays = lightDelayMs([10, 5, 30], new Set([10]), false);

    expect(delays.get(10)).toBeUndefined();
    expect(delays.get(5)).toBe(0);
    expect(delays.get(30)).toBe(treeEdgeStaggerMs);
  });

  it("waits nothing when the snapshot appears at once", () => {
    expect(lightDelayMs([10, 5], new Set(), true).size).toBe(0);
    expect(coverHoldMs(3, true)).toBe(0);
  });
});
