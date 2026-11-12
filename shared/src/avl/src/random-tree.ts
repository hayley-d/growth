import {
  type AvlNode,
  insertBst,
  insertKey,
  type TreeMode,
  toKeys,
} from "@shared/avl/src/avl-tree";

export const largestKey = 99;
export const allKeys = Array.from({ length: largestKey }, (_, index) => index + 1);

export const createRandom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
};

const insertRandomKey = (root: AvlNode | null, random: () => number, mode: TreeMode) => {
  const keys = toKeys(root);
  const unusedKeys = allKeys.filter((key) => !keys.includes(key));
  const key = unusedKeys[Math.floor(random() * unusedKeys.length)];
  if (key === undefined) return root;
  return mode === "bst" ? insertBst(root, key) : insertKey(root, key);
};

export const randomTree = ({
  size,
  seed,
  mode = "avl",
}: {
  size: number;
  seed: number;
  mode?: TreeMode;
}): AvlNode | null => {
  const random = createRandom(seed);
  let root: AvlNode | null = null;
  for (let count = 0; count < size; count += 1) root = insertRandomKey(root, random, mode);
  return root;
};
