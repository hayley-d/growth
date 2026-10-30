import type { StepKey } from "@shared/avl/src/algorithm-steps";

type KeyAtNode = { key: number; node: number };
type KeyOnly = { key: number };
type NodeOnly = { node: number };
type BalanceAtNode = { node: number; balance: number };
type RebalanceCase = { node: number; balance: number; child: number; childBalance: number };
type Rotation = { node: number; pivot: number };
type QueuedNode = { node: number; queued: number };

const compareMessage = ({ key, node }: KeyAtNode) => `Compare ${key} with ${node}.`;

const goLeftMessage = ({ key, node }: KeyAtNode) => `${key} is smaller than ${node}, so go left.`;

const goRightMessage = ({ key, node }: KeyAtNode) => `${key} is bigger than ${node}, so go right.`;

const liftPivotMessage =
  (side: "left" | "right") =>
  ({ node, pivot }: Rotation) =>
    `${pivot} moves up, and ${node} becomes its ${side} child.`;

const updateHeightsMessage = ({ node, pivot }: Rotation) =>
  `Update the heights of ${node} and then ${pivot}.`;

const visitMessage = ({ node }: { node: number; visited: number }) => `Visit ${node}.`;

const emptyMessage = (_variables: { node: null }) => "This subtree is empty, so go back up.";

const leftSubtreeMessage = ({ node }: NodeOnly) => `Go to the left subtree of ${node}.`;

const rightSubtreeMessage = ({ node }: NodeOnly) => `Go to the right subtree of ${node}.`;

export const stepMessages = {
  "insert.create-node": ({ key }: KeyOnly) => `This spot is empty, so ${key} goes here.`,
  "insert.compare": compareMessage,
  "insert.go-left": goLeftMessage,
  "insert.go-right": goRightMessage,
  "insert.duplicate": ({ key }: KeyAtNode) => `${key} is already in the tree, so nothing changes.`,
  "delete.not-found": ({ key }: KeyOnly) => `${key} isn't in the tree, so nothing changes.`,
  "delete.compare": compareMessage,
  "delete.go-left": goLeftMessage,
  "delete.go-right": goRightMessage,
  "delete.replace-with-child": ({ key, child }: { key: number; child: number | null }) =>
    child === null
      ? `${key} has no children, so it is simply removed.`
      : `${key} has one child, so ${child} takes its place.`,
  "delete.find-successor": ({ key, successor }: { key: number; successor: number }) =>
    `${key} has two children. Its in-order successor is ${successor}, the smallest key in its right subtree.`,
  "delete.copy-successor": ({ successor }: { key: number; successor: number }) =>
    `Copy ${successor} into this node, then remove the old ${successor} from the right subtree.`,
  "search.compare": compareMessage,
  "search.found": ({ key }: KeyAtNode) => `${key} matches, so the search is over.`,
  "search.go-left": goLeftMessage,
  "search.go-right": goRightMessage,
  "search.not-found": ({ key }: KeyOnly) =>
    `There is nowhere left to look, so ${key} isn't in the tree.`,
  "rotate-left.no-pivot": ({ node }: { node: number; pivot: null }) =>
    `${node} has no right child, so it can't rotate left.`,
  "rotate-left.pick-pivot": ({ pivot }: Rotation) => `The right child ${pivot} becomes the pivot.`,
  "rotate-left.move-inner-subtree": ({ node }: Rotation & { innerSubtree: number | null }) =>
    `The pivot's left subtree moves across to become the right subtree of ${node}.`,
  "rotate-left.lift-pivot": liftPivotMessage("left"),
  "rotate-left.update-heights": updateHeightsMessage,
  "rotate-right.no-pivot": ({ node }: { node: number; pivot: null }) =>
    `${node} has no left child, so it can't rotate right.`,
  "rotate-right.pick-pivot": ({ pivot }: Rotation) => `The left child ${pivot} becomes the pivot.`,
  "rotate-right.move-inner-subtree": ({ node }: Rotation & { innerSubtree: number | null }) =>
    `The pivot's right subtree moves across to become the left subtree of ${node}.`,
  "rotate-right.lift-pivot": liftPivotMessage("right"),
  "rotate-right.update-heights": updateHeightsMessage,
  "rebalance.check": ({ node, balance }: BalanceAtNode) =>
    `Check the balance factor of ${node}. It is ${balance}.`,
  "rebalance.balanced": ({ node, balance }: BalanceAtNode) =>
    `A balance factor of ${balance} is between -1 and 1, so ${node} is balanced.`,
  "rebalance.case-left-left": ({ node, child }: RebalanceCase) =>
    `${node} is left heavy and its left child ${child} leans left too. This is the left-left case: rotate ${node} right.`,
  "rebalance.case-left-right": ({ node, child }: RebalanceCase) =>
    `${node} is left heavy and its left child ${child} leans right. This is the left-right case: rotate ${child} left, then ${node} right.`,
  "rebalance.case-right-right": ({ node, child }: RebalanceCase) =>
    `${node} is right heavy and its right child ${child} leans right too. This is the right-right case: rotate ${node} left.`,
  "rebalance.case-right-left": ({ node, child }: RebalanceCase) =>
    `${node} is right heavy and its right child ${child} leans left. This is the right-left case: rotate ${child} right, then ${node} left.`,
  "update-height.compute-height": ({ node, height }: { node: number; height: number }) =>
    `${node} now has height ${height}: one more than its taller child.`,
  "update-height.compute-balance": ({
    node,
    balance,
    leftHeight,
    rightHeight,
  }: BalanceAtNode & { leftHeight: number; rightHeight: number }) =>
    `The balance factor of ${node} is ${balance}: left height ${leftHeight} minus right height ${rightHeight}.`,
  "preorder.empty": emptyMessage,
  "preorder.visit": visitMessage,
  "preorder.go-left": leftSubtreeMessage,
  "preorder.go-right": rightSubtreeMessage,
  "inorder.empty": emptyMessage,
  "inorder.visit": visitMessage,
  "inorder.go-left": leftSubtreeMessage,
  "inorder.go-right": rightSubtreeMessage,
  "postorder.empty": emptyMessage,
  "postorder.visit": visitMessage,
  "postorder.go-left": leftSubtreeMessage,
  "postorder.go-right": rightSubtreeMessage,
  "levelorder.enqueue-root": ({ node }: QueuedNode) => `Put the root ${node} in the queue.`,
  "levelorder.dequeue": ({ node }: QueuedNode) => `Take ${node} from the front of the queue.`,
  "levelorder.visit": visitMessage,
  "levelorder.enqueue-left": ({ node }: QueuedNode) => `Put its left child ${node} in the queue.`,
  "levelorder.enqueue-right": ({ node }: QueuedNode) => `Put its right child ${node} in the queue.`,
  "levelorder.done": (_variables: { visited: number }) =>
    "The queue is empty, so every node has been visited.",
} satisfies { [Key in StepKey]: (variables: never) => string };

export type StepMessageVariables<Key extends StepKey> = Parameters<(typeof stepMessages)[Key]>[0];

export const describeStep = <Key extends StepKey>(
  stepKey: Key,
  variables: StepMessageVariables<Key>,
): string => (stepMessages[stepKey] as (variables: StepMessageVariables<Key>) => string)(variables);
