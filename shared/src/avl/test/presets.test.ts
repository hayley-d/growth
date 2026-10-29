import { describe, expect, it } from "vitest";

import { type AvlNode, insertKey, type Preset, presets, removeKey, toKeys } from "@shared/avl";

const build = (keys: readonly number[]) =>
  keys.reduce<AvlNode | null>((root, key) => insertKey(root, key), null);

const heightOf = (node: AvlNode | null): number =>
  node ? 1 + Math.max(heightOf(node.left), heightOf(node.right)) : 0;

const expectValidAvl = (node: AvlNode | null) => {
  if (!node) return;
  expect(node.height).toBe(heightOf(node));
  expect(Math.abs(heightOf(node.left) - heightOf(node.right))).toBeLessThanOrEqual(1);
  if (node.left) expect(node.left.key).toBeLessThan(node.key);
  if (node.right) expect(node.right.key).toBeGreaterThan(node.key);
  expectValidAvl(node.left);
  expectValidAvl(node.right);
};

const findKey = (node: AvlNode | null, key: number): AvlNode | null => {
  if (!node) return null;
  if (node.key === key) return node;
  return findKey(key < node.key ? node.left : node.right, key);
};

const presetNamed = (name: string): Preset => {
  const preset = presets.find((item) => item.name === name);
  if (!preset) throw new Error(name);
  return preset;
};

const apply = (preset: Preset) => {
  const root = build(preset.keys);
  return preset.operation.kind === "insert"
    ? insertKey(root, preset.operation.key)
    : removeKey(root, preset.operation.key);
};

describe("presets", () => {
  it("names the four rotations and the three delete shapes", () => {
    expect(presets.map((preset) => preset.name)).toEqual([
      "Insert causes a left-left rotation",
      "Insert causes a right-right rotation",
      "Insert causes a left-right rotation",
      "Insert causes a right-left rotation",
      "Delete a leaf",
      "Delete a node with one child",
      "Delete a node with two children",
    ]);
  });

  it.each([
    ["Insert causes a left-left rotation", "left", "left"],
    ["Insert causes a right-right rotation", "right", "right"],
    ["Insert causes a left-right rotation", "left", "right"],
    ["Insert causes a right-left rotation", "right", "left"],
  ] as const)("%s inserts %s then %s and rotates", (name, first, second) => {
    const preset = presetNamed(name);
    expect(preset.operation.kind).toBe("insert");
    if (preset.operation.kind !== "insert") return;
    const root = build(preset.keys);
    const key = preset.operation.key;
    expectValidAvl(root);
    expect(toKeys(root)).not.toContain(key);
    const firstChild = root && (first === "left" ? root.left : root.right);
    expect(firstChild).not.toBeNull();
    if (!root || !firstChild) return;
    expect(key < root.key).toBe(first === "left");
    expect(key < firstChild.key).toBe(second === "left");
    const next = insertKey(root, key);
    expect(next.key).not.toBe(root.key);
    expect(toKeys(next)).toContain(key);
    expectValidAvl(next);
  });

  it("deletes a leaf", () => {
    const preset = presetNamed("Delete a leaf");
    expect(preset.operation.kind).toBe("delete");
    if (preset.operation.kind !== "delete") return;
    const node = findKey(build(preset.keys), preset.operation.key);
    expect(node?.left).toBeNull();
    expect(node?.right).toBeNull();
    expect(toKeys(apply(preset))).not.toContain(preset.operation.key);
    expectValidAvl(apply(preset));
  });

  it("deletes a node with one child", () => {
    const preset = presetNamed("Delete a node with one child");
    expect(preset.operation.kind).toBe("delete");
    if (preset.operation.kind !== "delete") return;
    const node = findKey(build(preset.keys), preset.operation.key);
    expect(Boolean(node?.left) === Boolean(node?.right)).toBe(false);
    expect(toKeys(apply(preset))).not.toContain(preset.operation.key);
    expectValidAvl(apply(preset));
  });

  it("deletes a node with two children", () => {
    const preset = presetNamed("Delete a node with two children");
    expect(preset.operation.kind).toBe("delete");
    if (preset.operation.kind !== "delete") return;
    const root = build(preset.keys);
    const node = findKey(root, preset.operation.key);
    expect(node?.left).not.toBeNull();
    expect(node?.right).not.toBeNull();
    const next = removeKey(root, preset.operation.key);
    expect(toKeys(next)).not.toContain(preset.operation.key);
    expect(next?.key).not.toBe(preset.operation.key);
    expectValidAvl(next);
  });
});
