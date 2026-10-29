import { type AvlNode, insertKey, toKeys } from "@shared/avl/src/avl-tree";

const largestKey = 99;
const allKeys = Array.from({ length: largestKey }, (_, index) => index + 1);

export const createRandom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
};

const insertRandomKey = (root: AvlNode | null, random: () => number) => {
  const keys = toKeys(root);
  const unusedKeys = allKeys.filter((key) => !keys.includes(key));
  const key = unusedKeys[Math.floor(random() * unusedKeys.length)];
  return key === undefined ? root : insertKey(root, key);
};

export const randomTree = ({ size, seed }: { size: number; seed: number }): AvlNode | null => {
  const random = createRandom(seed);
  let root: AvlNode | null = null;
  for (let count = 0; count < size; count += 1) root = insertRandomKey(root, random);
  return root;
};
