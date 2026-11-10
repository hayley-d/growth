import { describe, expect, it } from "vitest";

import { type AvlNode, insertKey } from "@shared/avl";
import {
  dropToAction,
  emptySlots,
  explainWrongSlot,
  fitsSlot,
  rotationForDrop,
} from "@/lib/playground/drop-rules";

const build = (keys: number[]) =>
  keys.reduce<AvlNode | null>((tree, key) => insertKey(tree, key), null);

describe("emptySlots", () => {
  it("offers the root spot on an empty tree", () => {
    expect(emptySlots(null)).toEqual([expect.objectContaining({ id: "root", low: 1, high: 99 })]);
  });

  it("gives every empty child spot its key range", () => {
    const slots = emptySlots(build([30, 20, 40]));
    expect(slots.map((slot) => [slot.id, slot.low, slot.high])).toEqual([
      ["20-left", 1, 19],
      ["20-right", 21, 29],
      ["40-left", 31, 39],
      ["40-right", 41, 99],
    ]);
  });

  it("skips a spot no key can fill", () => {
    expect(emptySlots(build([2, 1])).map((slot) => slot.id)).toEqual(["2-right"]);
  });
});

it("explains why a key doesn't fit a spot", () => {
  const tree = build([30, 20, 40]);
  const slot = emptySlots(tree).find((each) => each.id === "20-right");
  if (!slot) throw new Error("missing slot");
  expect(fitsSlot(25, slot)).toBe(true);
  expect(explainWrongSlot(35, slot, tree)).toBe(
    "35 can't go there. That spot is right of 20, so it only takes keys from 21 to 29. Start at the root: is 35 smaller or bigger than 30?",
  );
});

describe("rotationForDrop", () => {
  const tree = build([30, 20, 40]);

  it("rotates the parent away from the dropped child", () => {
    expect(rotationForDrop(tree, 20, 30)).toEqual({
      ok: true,
      command: { kind: "rotate", direction: "right", key: 30 },
    });
    expect(rotationForDrop(tree, 40, 30)).toEqual({
      ok: true,
      command: { kind: "rotate", direction: "left", key: 30 },
    });
  });

  it("names the real parent when the drop is wrong", () => {
    expect(rotationForDrop(tree, 30, 20)).toEqual({
      ok: false,
      message: "Drop a node on its own parent to rotate. 30 is the root, so it has no parent.",
    });
    expect(rotationForDrop(tree, 40, 20)).toEqual({
      ok: false,
      message: "Drop a node on its own parent to rotate. 40's parent is 30.",
    });
  });
});

describe("dropToAction", () => {
  const tree = build([30, 20, 40]);

  it("inserts a new key dropped on a spot it fits", () => {
    expect(
      dropToAction(tree, true, { kind: "new", key: 25 }, { kind: "slot", slotId: "20-right" }),
    ).toEqual({ type: "run", command: { kind: "insert", keys: [25] }, via: "dragged" });
  });

  it("refuses a new key dropped on a spot it doesn't fit, and says why", () => {
    expect(
      dropToAction(tree, true, { kind: "new", key: 35 }, { kind: "slot", slotId: "20-right" }),
    ).toEqual({
      type: "refuse",
      command: "insert 35",
      message:
        "35 can't go there. That spot is right of 20, so it only takes keys from 21 to 29. Start at the root: is 35 smaller or bigger than 30?",
      via: "dragged",
    });
  });

  it("ignores a new key dropped anywhere but a spot", () => {
    expect(dropToAction(tree, true, { kind: "new", key: 25 }, { kind: "bin" })).toBeNull();
  });

  it("deletes a node dropped on the bin and adds one dropped on the prediction row", () => {
    expect(dropToAction(tree, true, { kind: "node", key: 20 }, { kind: "bin" })).toEqual({
      type: "run",
      command: { kind: "delete", key: 20 },
      via: "dragged",
    });
    expect(dropToAction(tree, false, { kind: "node", key: 20 }, { kind: "predict" })).toEqual({
      type: "predict-add",
      key: 20,
    });
  });

  it("rotates when a child is dropped on its parent, and names the parent otherwise", () => {
    expect(dropToAction(tree, true, { kind: "node", key: 20 }, { kind: "node", key: 30 })).toEqual({
      type: "run",
      command: { kind: "rotate", direction: "right", key: 30 },
      via: "dragged",
    });
    expect(
      dropToAction(tree, true, { kind: "node", key: 40 }, { kind: "node", key: 20 }),
    ).toMatchObject({ type: "refuse", command: "drop 40 on 20" });
  });

  it("does nothing when a node is dropped on a node in a traversal", () => {
    expect(
      dropToAction(tree, false, { kind: "node", key: 20 }, { kind: "node", key: 30 }),
    ).toBeNull();
  });
});
