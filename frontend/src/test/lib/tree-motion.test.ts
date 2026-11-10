import { describe, expect, it } from "vitest";

import { edgeLink } from "@/lib/tree-motion";

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
