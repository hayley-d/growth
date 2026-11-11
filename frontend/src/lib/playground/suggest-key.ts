import { type AvlNode, createRandom, largestKey, toKeys } from "@shared/avl";

export const suggestKey = (tree: AvlNode | null, salt: number) => {
  const taken = new Set(toKeys(tree));
  const random = createRandom(salt + taken.size * 7919);
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const key = 1 + Math.floor(random() * largestKey);
    if (!taken.has(key)) return String(key);
  }
  return "";
};
