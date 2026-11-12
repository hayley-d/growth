import { type AvlNode, findNode, largestKey, layoutTree, openSpots, parentOf } from "@shared/avl";
import type { RotateCommand } from "@/lib/playground/commands";
import type { PlaygroundAction } from "@/lib/playground/playground-reducer";
import type { DragSource, DropTarget } from "@/lib/playground/use-pointer-drag";

export type TreeSlot = {
  id: string;
  x: number;
  y: number;
  low: number;
  high: number;
  parentKey: number | null;
  side: "left" | "right" | null;
};

export const slotOffset = 0.4;

export const emptySlots = (tree: AvlNode | null): TreeSlot[] => {
  const positions = new Map(layoutTree(tree).map((position) => [position.key, position]));
  return openSpots(tree, 1, largestKey).flatMap((spot) => {
    if (spot.parentKey === null || spot.side === null) return [{ ...spot, id: "root", x: 0, y: 0 }];
    const position = positions.get(spot.parentKey);
    if (!position) return [];
    const offset = spot.side === "left" ? -slotOffset : slotOffset;
    return [
      {
        ...spot,
        id: `${spot.parentKey}-${spot.side}`,
        x: position.x + offset,
        y: position.y + 1,
      },
    ];
  });
};

export const fitsSlot = (key: number, slot: TreeSlot) => key >= slot.low && key <= slot.high;

export const explainWrongSlot = (key: number, slot: TreeSlot, tree: AvlNode | null): string => {
  const where =
    slot.parentKey === null ? "That spot" : `That spot is ${slot.side} of ${slot.parentKey}, so it`;
  const range = `only takes keys from ${slot.low} to ${slot.high}`;
  const hint = tree ? ` Start at the root: is ${key} smaller or bigger than ${tree.key}?` : "";
  return `${key} can't go there. ${where} ${range}.${hint}`;
};

export type RotationDrop = { ok: true; command: RotateCommand } | { ok: false; message: string };

export const rotationForDrop = (
  tree: AvlNode | null,
  childKey: number,
  ontoKey: number,
): RotationDrop => {
  const parent = parentOf(tree, childKey);
  if (!parent || parent.key !== ontoKey) {
    const known = parent
      ? `${childKey}'s parent is ${parent.key}.`
      : `${childKey} is the root, so it has no parent.`;
    return { ok: false, message: `Drop a node on its own parent to rotate. ${known}` };
  }
  const direction = parent.left?.key === childKey ? "right" : "left";
  return { ok: true, command: { kind: "rotate", direction, key: ontoKey } };
};

const refusal = (command: string, message: string): PlaygroundAction => ({
  type: "refuse",
  command,
  message,
  via: "dragged",
});

export const dropToAction = (
  tree: AvlNode | null,
  isAvl: boolean,
  source: DragSource,
  target: DropTarget,
): PlaygroundAction | null => {
  if (source.kind === "new") {
    if (target.kind !== "slot") return null;
    const slot = emptySlots(tree).find((each) => each.id === target.slotId);
    if (!slot) return null;
    const alreadyInTree = findNode(tree, source.key) !== null;
    if (!alreadyInTree && !fitsSlot(source.key, slot)) {
      return refusal(`insert ${source.key}`, explainWrongSlot(source.key, slot, tree));
    }
    return { type: "run", command: { kind: "insert", keys: [source.key] }, via: "dragged" };
  }
  if (target.kind === "bin") {
    return { type: "run", command: { kind: "delete", key: source.key }, via: "dragged" };
  }
  if (target.kind === "predict") return { type: "predict-add", key: source.key };
  if (target.kind !== "node" || !isAvl) return null;
  const rotation = rotationForDrop(tree, source.key, target.key);
  return rotation.ok
    ? { type: "run", command: rotation.command, via: "dragged" }
    : refusal(`drop ${source.key} on ${target.key}`, rotation.message);
};
