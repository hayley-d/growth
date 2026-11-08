import { type AvlNode, toKeys, traceInsert, traceRemove } from "@shared/avl/src/avl-tree";
import { allKeys, createRandom, randomTree } from "@shared/avl/src/random-tree";
import type { Step } from "@shared/avl/src/step-recorder";
import type { GeneratorOptions, Rotation } from "@shared/schemas";

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export type GenerateOptions = GeneratorOptions & { seed: number; difficulty: Difficulty };

export type Random = () => number;

export type Operation = "insert" | "delete";

export type CaseInfo = {
  tree: AvlNode;
  key: number;
  result: AvlNode | null;
  rotation: Rotation;
  pivotKey: number | null;
  caseCount: number;
  twoChildren: boolean;
  pivotIsSuccessor: boolean;
};

const sizeWindows: Record<Difficulty, { minimum: number; maximum: number }> = {
  1: { minimum: 3, maximum: 4 },
  2: { minimum: 5, maximum: 6 },
  3: { minimum: 7, maximum: 9 },
  4: { minimum: 10, maximum: 12 },
  5: { minimum: 12, maximum: 15 },
};

const maximumAttempts = 200;
const attemptSeedStep = 256;

const rotationByStepKey: Record<string, Rotation> = {
  "rebalance.case-left-left": "right",
  "rebalance.case-right-right": "left",
  "rebalance.case-left-right": "leftRight",
  "rebalance.case-right-left": "rightLeft",
};

export const createGeneratorRandom = (seed: number, salt: number): Random => {
  const random = createRandom(seed * 8 + salt);
  random();
  random();
  random();
  return random;
};

export const pickFrom = <Item>(items: readonly Item[], random: Random): Item => {
  const item = items[Math.floor(random() * items.length)];
  if (item === undefined) throw new Error("Cannot pick from an empty list");
  return item;
};

export const shuffle = <Item>(items: readonly Item[], random: Random): Item[] =>
  items
    .map((item) => ({ item, order: random() }))
    .sort((first, second) => first.order - second.order)
    .map(({ item }) => item);

const hexDigits = (random: Random, length: number) =>
  Array.from({ length }, () => Math.floor(random() * 16).toString(16)).join("");

export const makeUuid = (random: Random): string => {
  const variant = "89ab".charAt(Math.floor(random() * 4));
  return [
    hexDigits(random, 8),
    hexDigits(random, 4),
    `4${hexDigits(random, 3)}`,
    `${variant}${hexDigits(random, 3)}`,
    hexDigits(random, 12),
  ].join("-");
};

export const sizeFor = (seed: number, difficulty: Difficulty, attempt = 0): number => {
  const { minimum, maximum } = sizeWindows[difficulty];
  return minimum + (Math.abs(Math.trunc(seed) + attempt) % (maximum - minimum + 1));
};

export const treeSizeBounds = (difficulty: Difficulty) => sizeWindows[difficulty];

export const makePlainTree = (seed: number, difficulty: Difficulty): AvlNode => {
  const tree = randomTree({ size: sizeFor(seed, difficulty), seed });
  if (!tree) throw new Error("Generated an empty tree");
  return tree;
};

export const unusedKeys = (tree: AvlNode | null): number[] => {
  const used = new Set(toKeys(tree));
  return allKeys.filter((key) => !used.has(key));
};

export const findNode = (node: AvlNode | null, key: number): AvlNode | null => {
  if (!node) return null;
  if (key === node.key) return node;
  return findNode(key < node.key ? node.left : node.right, key);
};

const describeSteps = (steps: readonly Step[]) => {
  const cases = steps.filter((step) => step.stepKey in rotationByStepKey);
  const [first] = cases;
  const rotation = (first && rotationByStepKey[first.stepKey]) ?? "none";
  const node = first?.variables.node;
  return {
    rotation,
    pivotKey: typeof node === "number" ? node : null,
    caseCount: cases.length,
  };
};

const smallestKey = (node: AvlNode): number => (node.left ? smallestKey(node.left) : node.key);

const evaluate = (tree: AvlNode, key: number, operation: Operation): CaseInfo => {
  const traced = operation === "insert" ? traceInsert(tree, key) : traceRemove(tree, key);
  const node = findNode(tree, key);
  const steps = describeSteps(traced.steps);
  const successorKey =
    operation === "delete" && node?.left && node.right ? smallestKey(node.right) : null;
  return {
    tree,
    key,
    result: traced.result,
    ...steps,
    twoChildren: successorKey !== null,
    pivotIsSuccessor: successorKey !== null && steps.pivotKey === successorKey,
  };
};

export const findCase = ({
  seed,
  difficulty,
  operation,
  accept,
  reservedNodes = 0,
}: {
  seed: number;
  difficulty: Difficulty;
  operation: Operation;
  accept: (info: CaseInfo) => boolean;
  reservedNodes?: number;
}): CaseInfo => {
  for (let attempt = 0; attempt < maximumAttempts; attempt += 1) {
    const attemptSeed = seed * attemptSeedStep + attempt;
    const tree = randomTree({
      size: sizeFor(seed, difficulty, attempt) - reservedNodes,
      seed: attemptSeed,
    });
    if (!tree) continue;
    const candidates = operation === "insert" ? unusedKeys(tree) : toKeys(tree);
    for (const key of shuffle(candidates, createGeneratorRandom(attemptSeed, 7))) {
      const info = evaluate(tree, key, operation);
      if (accept(info)) return info;
    }
  }
  throw new Error(`No ${operation} case found for seed ${seed} at difficulty ${difficulty}`);
};

const isSingle = (rotation: Rotation) => rotation === "left" || rotation === "right";

const isDouble = (rotation: Rotation) => rotation === "leftRight" || rotation === "rightLeft";

export const acceptRotation =
  (difficulty: Difficulty) =>
  (info: CaseInfo): boolean => {
    if (info.caseCount > 1) return false;
    if (difficulty === 1) return info.rotation === "none";
    if (difficulty === 2) return isSingle(info.rotation);
    if (difficulty === 3) {
      return (
        isSingle(info.rotation) || (isDouble(info.rotation) && info.pivotKey === info.tree.key)
      );
    }
    return isDouble(info.rotation);
  };

export const acceptPrediction =
  (difficulty: Difficulty) =>
  (info: CaseInfo): boolean =>
    !info.pivotIsSuccessor && acceptRotation(difficulty)(info);

export const acceptDelete =
  (difficulty: Difficulty) =>
  (info: CaseInfo): boolean => {
    if (info.caseCount > 1) return false;
    if (difficulty === 1) return info.rotation === "none" && !info.twoChildren;
    if (difficulty === 4) return info.twoChildren && info.rotation === "none";
    if (difficulty === 5) return info.twoChildren && info.rotation !== "none";
    return acceptRotation(difficulty)(info);
  };

const rotationSummaries: Record<Exclude<Rotation, "none">, (label: string) => string> = {
  right: (label) =>
    `${label} is left-heavy and its left child is not right-heavy, so one right rotation at that node fixes it.`,
  left: (label) =>
    `${label} is right-heavy and its right child is not left-heavy, so one left rotation at that node fixes it.`,
  leftRight: (label) =>
    `${label} is left-heavy but its left child is right-heavy, so rotate the left child left, then rotate that node right.`,
  rightLeft: (label) =>
    `${label} is right-heavy but its right child is left-heavy, so rotate the right child right, then rotate that node left.`,
};

const pivotLabel = (pivotKey: number, replacedKey: number | null) =>
  replacedKey === null
    ? `Node ${pivotKey}`
    : `The node that took ${replacedKey}'s place (it now holds ${pivotKey})`;

export const describeRotation = (
  rotation: Rotation,
  pivotKey: number | null,
  replacedKey: number | null = null,
): string =>
  rotation === "none" || pivotKey === null
    ? "No node ends up with a balance factor outside -1 to 1, so no rotation is needed."
    : rotationSummaries[rotation](pivotLabel(pivotKey, replacedKey));

export const pivotHint = (
  rotation: Rotation,
  pivotKey: number | null,
  replacedKey: number | null = null,
): string =>
  rotation === "none" || pivotKey === null
    ? "Check every node on the path. None of them reaches a balance factor of -2 or 2."
    : `The lowest unbalanced node is ${replacedKey === null ? pivotKey : `the one that took ${replacedKey}'s place (it now holds ${pivotKey})`}.`;
