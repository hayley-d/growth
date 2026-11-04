export const algorithmCodes = [
  "insert",
  "delete",
  "search",
  "rotate-left",
  "rotate-right",
  "rebalance",
  "update-height",
  "preorder",
  "inorder",
  "postorder",
  "levelorder",
] as const;

export type AlgorithmCode = (typeof algorithmCodes)[number];

type StepKeyCatalogue = { [Code in AlgorithmCode]: readonly `${Code}.${string}`[] };

const depthFirstSteps = <Order extends "preorder" | "inorder" | "postorder">(order: Order) =>
  [
    `${order}.check-empty`,
    `${order}.empty`,
    `${order}.visit`,
    `${order}.go-left`,
    `${order}.go-right`,
  ] as const;

const rotationSteps = <Code extends "rotate-left" | "rotate-right">(code: Code) =>
  [
    `${code}.check-pivot`,
    `${code}.no-pivot`,
    `${code}.pick-pivot`,
    `${code}.move-inner-subtree`,
    `${code}.lift-pivot`,
    `${code}.update-heights`,
    `${code}.done`,
  ] as const;

export const stepKeysByAlgorithm = {
  insert: [
    "insert.check-empty",
    "insert.create-node",
    "insert.compare",
    "insert.go-left",
    "insert.check-bigger",
    "insert.go-right",
    "insert.duplicate",
    "insert.update-height",
    "insert.rebalance",
  ],
  delete: [
    "delete.check-empty",
    "delete.not-found",
    "delete.compare",
    "delete.go-left",
    "delete.check-bigger",
    "delete.go-right",
    "delete.check-children",
    "delete.replace-with-child",
    "delete.find-successor",
    "delete.copy-successor",
    "delete.remove-successor",
    "delete.update-height",
    "delete.rebalance",
  ],
  search: [
    "search.check-empty",
    "search.compare",
    "search.found",
    "search.check-smaller",
    "search.go-left",
    "search.go-right",
    "search.not-found",
  ],
  "rotate-left": rotationSteps("rotate-left"),
  "rotate-right": rotationSteps("rotate-right"),
  rebalance: [
    "rebalance.check",
    "rebalance.balanced",
    "rebalance.check-side",
    "rebalance.check-left-child",
    "rebalance.case-left-left",
    "rebalance.case-left-right",
    "rebalance.finish-left-right",
    "rebalance.check-right-child",
    "rebalance.case-right-right",
    "rebalance.case-right-left",
    "rebalance.finish-right-left",
  ],
  "update-height": ["update-height.compute-height", "update-height.compute-balance"],
  preorder: depthFirstSteps("preorder"),
  inorder: depthFirstSteps("inorder"),
  postorder: depthFirstSteps("postorder"),
  levelorder: [
    "levelorder.enqueue-root",
    "levelorder.check-queue",
    "levelorder.dequeue",
    "levelorder.visit",
    "levelorder.check-left",
    "levelorder.enqueue-left",
    "levelorder.check-right",
    "levelorder.enqueue-right",
  ],
} as const satisfies StepKeyCatalogue;

export type StepKey = (typeof stepKeysByAlgorithm)[AlgorithmCode][number];

export const isAlgorithmCode = (code: string): code is AlgorithmCode =>
  (algorithmCodes as readonly string[]).includes(code);

export const algorithmOf = (stepKey: StepKey): AlgorithmCode => {
  const dot = stepKey.indexOf(".");
  const code = dot === -1 ? "" : stepKey.slice(0, dot);
  if (!isAlgorithmCode(code)) throw new Error(`Unknown algorithm in step key ${stepKey}`);
  return code;
};
