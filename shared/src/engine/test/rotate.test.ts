import { describe, expect, it } from "vitest";

import type { AvlNode } from "@shared/avl";
import { insertBst, isAvl, rotate } from "@shared/engine";

const build = (keys: number[]): AvlNode => {
  const [first, ...rest] = keys;
  if (first === undefined) throw new Error("empty");
  return rest.reduce<AvlNode>(insertBst, insertBst(null, first));
};

describe("rotate", () => {
  it("rotates right at 30 and returns the two steps", () => {
    const root = build([30, 20, 10]);
    const result = rotate(root, 30, "right");

    expect(root.key).toBe(30);
    expect(root.left?.key).toBe(20);
    expect(root.left?.left?.key).toBe(10);
    expect(result).toEqual({
      ok: true,
      tree: result.ok ? result.tree : null,
      steps: [
        {
          stepKey: "rotate.select",
          tree: root,
          nodeStates: { 30: "unbalanced" },
          message: "Select 30 for a right rotation.",
          variables: { key: 30, kind: "right" },
        },
        {
          stepKey: "rotate.rotate-right",
          tree: result.ok ? result.tree : null,
          nodeStates: { 30: "active" },
          message: "Rotate right at 30.",
          variables: { key: 30, kind: "right" },
        },
      ],
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(isAvl(result.tree)).toBe(true);
  });

  it("returns a reason when the node has no left child", () => {
    expect(rotate(build([30]), 30, "right")).toEqual({
      ok: false,
      reason: "Node 30 has no left child",
    });
  });

  it("returns a reason when the key is missing", () => {
    expect(() => rotate(build([30]), 9, "right")).not.toThrow();
    expect(rotate(build([30]), 9, "right")).toEqual({
      ok: false,
      reason: "Node 9 is not in the tree",
    });
  });
});
