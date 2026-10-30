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
  [`${order}.empty`, `${order}.visit`, `${order}.go-left`, `${order}.go-right`] as const;

const rotationSteps = <Code extends "rotate-left" | "rotate-right">(code: Code) =>
  [
    `${code}.no-pivot`,
    `${code}.pick-pivot`,
    `${code}.move-inner-subtree`,
    `${code}.lift-pivot`,
    `${code}.update-heights`,
  ] as const;

export const stepKeysByAlgorithm = {
  insert: [
    "insert.create-node",
    "insert.compare",
    "insert.go-left",
    "insert.go-right",
    "insert.duplicate",
  ],
  delete: [
    "delete.not-found",
    "delete.compare",
    "delete.go-left",
    "delete.go-right",
    "delete.replace-with-child",
    "delete.find-successor",
    "delete.copy-successor",
  ],
  search: [
    "search.compare",
    "search.found",
    "search.go-left",
    "search.go-right",
    "search.not-found",
  ],
  "rotate-left": rotationSteps("rotate-left"),
  "rotate-right": rotationSteps("rotate-right"),
  rebalance: [
    "rebalance.check",
    "rebalance.balanced",
    "rebalance.case-left-left",
    "rebalance.case-left-right",
    "rebalance.case-right-right",
    "rebalance.case-right-left",
  ],
  "update-height": ["update-height.compute-height", "update-height.compute-balance"],
  preorder: depthFirstSteps("preorder"),
  inorder: depthFirstSteps("inorder"),
  postorder: depthFirstSteps("postorder"),
  levelorder: [
    "levelorder.enqueue-root",
    "levelorder.dequeue",
    "levelorder.visit",
    "levelorder.enqueue-left",
    "levelorder.enqueue-right",
    "levelorder.done",
  ],
} as const satisfies StepKeyCatalogue;

export type StepKey = (typeof stepKeysByAlgorithm)[AlgorithmCode][number];

export const isAlgorithmCode = (code: string): code is AlgorithmCode =>
  (algorithmCodes as readonly string[]).includes(code);
