import type { StepKey } from "@shared/avl/src/algorithm-steps";

type KeyAtNode = { key: number; node: number };
type KeyOnly = { key: number };
type NodeOnly = { node: number };
type MaybeNode = { node: number | null };
type KeyAtMaybeNode = { key: number; node: number | null };
type BalanceAtNode = { node: number; balance: number };
type ChildBalance = { node: number; child: number; childBalance: number };
type RebalanceCase = { node: number; balance: number; child: number; childBalance: number };
type Rotation = { node: number; pivot: number };
type QueuedNode = { node: number; queued: number };
type ChildCheck = { node: number; child: number | null };

const checkEmptyMessage = ({ node }: KeyAtMaybeNode) =>
  node === null ? "This spot is empty." : `${node} is here, so this spot isn't empty.`;

const smallerMessage = ({ key, node }: KeyAtNode) =>
  key < node ? `Is ${key} smaller than ${node}? Yes.` : `Is ${key} smaller than ${node}? No.`;

const biggerMessage = ({ key, node }: KeyAtNode) =>
  key > node
    ? `Is ${key} bigger than ${node}? Yes.`
    : `Is ${key} bigger than ${node}? No, they are the same.`;

const intoSubtreeMessage =
  (action: string, side: "left" | "right") =>
  ({ key, node }: KeyAtNode) =>
    `${action} ${key} ${action === "Insert" ? "into" : "from"} the ${side} subtree of ${node}.`;

const liftPivotMessage =
  (side: "left" | "right") =>
  ({ node, pivot }: Rotation) =>
    `${pivot} moves up, and ${node} becomes its ${side} child.`;

const checkPivotMessage =
  (side: "left" | "right") =>
  ({ node, pivot }: { node: number; pivot: number | null }) =>
    pivot === null
      ? `Does ${node} have a ${side} child? No.`
      : `Does ${node} have a ${side} child? Yes, ${pivot}.`;

const updateHeightsMessage = ({ node, pivot }: Rotation) =>
  `Update the heights of ${node} and then ${pivot}.`;

const rotationDoneMessage = ({ pivot }: Rotation) => `${pivot} is now the top of this subtree.`;

const visitMessage = ({ node }: { node: number; visited: number }) => `Visit ${node}.`;

const traversalCheckMessage = ({ node }: MaybeNode) =>
  node === null ? "Is this subtree empty? Yes." : `Is this subtree empty? No, ${node} is here.`;

const emptyMessage = (_variables: { node: null }) => "There's nothing here, so go back up.";

const leftSubtreeMessage = ({ node }: NodeOnly) => `Go to the left subtree of ${node}.`;

const rightSubtreeMessage = ({ node }: NodeOnly) => `Go to the right subtree of ${node}.`;

const updateOnWayUpMessage = ({ node }: NodeOnly) =>
  `Back at ${node}. Update its height and balance factor.`;

const rebalanceOnWayUpMessage = ({ node }: NodeOnly) => `Now make sure ${node} is still balanced.`;

const childCheckMessage =
  (side: "left" | "right") =>
  ({ node, child }: ChildCheck) =>
    child === null
      ? `Does ${node} have a ${side} child? No.`
      : `Does ${node} have a ${side} child? Yes, ${child}.`;

const nodeCount = (count: number) => (count === 1 ? "1 node" : `${count} nodes`);

export const stepMessages = {
  "insert.check-empty": checkEmptyMessage,
  "insert.create-node": ({ key }: KeyOnly) => `So ${key} goes here as a new node.`,
  "insert.compare": smallerMessage,
  "insert.go-left": intoSubtreeMessage("Insert", "left"),
  "insert.check-bigger": biggerMessage,
  "insert.go-right": intoSubtreeMessage("Insert", "right"),
  "insert.duplicate": ({ key }: KeyAtNode) => `${key} is already in the tree, so nothing changes.`,
  "insert.update-height": updateOnWayUpMessage,
  "insert.rebalance": rebalanceOnWayUpMessage,
  "delete.check-empty": checkEmptyMessage,
  "delete.not-found": ({ key }: KeyOnly) => `So ${key} isn't in the tree, and nothing changes.`,
  "delete.compare": smallerMessage,
  "delete.go-left": intoSubtreeMessage("Delete", "left"),
  "delete.check-bigger": biggerMessage,
  "delete.go-right": intoSubtreeMessage("Delete", "right"),
  "delete.check-children": ({ key, children }: { key: number; children: number }) =>
    children === 2
      ? `Found ${key}. Does it have at most one child? No, it has two.`
      : `Found ${key}. Does it have at most one child? Yes, it has ${children === 1 ? "one" : "none"}.`,
  "delete.replace-with-child": ({ key, child }: { key: number; child: number | null }) =>
    child === null
      ? `${key} has no children, so it is simply removed.`
      : `${key} has one child, so ${child} takes its place.`,
  "delete.find-successor": ({ key, successor }: { key: number; successor: number }) =>
    `Its in-order successor is ${successor}, the smallest key in the right subtree of ${key}.`,
  "delete.copy-successor": ({ successor }: { key: number; successor: number }) =>
    `Copy ${successor} into this node.`,
  "delete.remove-successor": ({ successor }: { key: number; successor: number }) =>
    `Now delete the old ${successor} from the right subtree.`,
  "delete.update-height": updateOnWayUpMessage,
  "delete.rebalance": rebalanceOnWayUpMessage,
  "search.check-empty": ({ key, node }: KeyAtMaybeNode) =>
    node === null
      ? `There's no node here, so there's nowhere left to look for ${key}.`
      : `${node} is here, so keep looking.`,
  "search.compare": ({ key, node }: KeyAtNode) =>
    key === node ? `Is ${key} equal to ${node}? Yes.` : `Is ${key} equal to ${node}? No.`,
  "search.found": ({ key }: KeyAtNode) => `Found ${key}, so the search is over.`,
  "search.check-smaller": smallerMessage,
  "search.go-left": ({ node }: KeyAtNode) => `Move to the left child of ${node}.`,
  "search.go-right": ({ node }: KeyAtNode) => `Move to the right child of ${node}.`,
  "search.not-found": ({ key }: KeyOnly) => `${key} isn't in the tree.`,
  "rotate-left.check-pivot": checkPivotMessage("right"),
  "rotate-left.no-pivot": ({ node }: { node: number; pivot: null }) =>
    `So ${node} can't rotate left, and nothing changes.`,
  "rotate-left.pick-pivot": ({ pivot }: Rotation) => `The right child ${pivot} becomes the pivot.`,
  "rotate-left.move-inner-subtree": ({ node }: Rotation & { innerSubtree: number | null }) =>
    `The pivot's left subtree moves across to become the right subtree of ${node}.`,
  "rotate-left.lift-pivot": liftPivotMessage("left"),
  "rotate-left.update-heights": updateHeightsMessage,
  "rotate-left.done": rotationDoneMessage,
  "rotate-right.check-pivot": checkPivotMessage("left"),
  "rotate-right.no-pivot": ({ node }: { node: number; pivot: null }) =>
    `So ${node} can't rotate right, and nothing changes.`,
  "rotate-right.pick-pivot": ({ pivot }: Rotation) => `The left child ${pivot} becomes the pivot.`,
  "rotate-right.move-inner-subtree": ({ node }: Rotation & { innerSubtree: number | null }) =>
    `The pivot's right subtree moves across to become the left subtree of ${node}.`,
  "rotate-right.lift-pivot": liftPivotMessage("right"),
  "rotate-right.update-heights": updateHeightsMessage,
  "rotate-right.done": rotationDoneMessage,
  "rebalance.check": ({ node, balance }: BalanceAtNode) =>
    Math.abs(balance) <= 1
      ? `Is the balance factor of ${node} between -1 and 1? Yes, it is ${balance}.`
      : `Is the balance factor of ${node} between -1 and 1? No, it is ${balance}.`,
  "rebalance.balanced": ({ node }: BalanceAtNode) =>
    `So ${node} is balanced, and nothing needs to move.`,
  "rebalance.check-side": ({ node, balance }: BalanceAtNode) =>
    balance > 1
      ? `Is ${node} left heavy? Yes, its balance factor is ${balance}.`
      : `Is ${node} left heavy? No, its balance factor is ${balance}, so it is right heavy.`,
  "rebalance.check-left-child": ({ child, childBalance }: ChildBalance) =>
    childBalance >= 0
      ? `Does the left child ${child} lean left or not at all? Yes, its balance factor is ${childBalance}.`
      : `Does the left child ${child} lean left or not at all? No, its balance factor is ${childBalance}.`,
  "rebalance.case-left-left": ({ node }: RebalanceCase) =>
    `This is the left-left case: rotate ${node} right.`,
  "rebalance.case-left-right": ({ node, child }: RebalanceCase) =>
    `This is the left-right case: rotate ${child} left first, then ${node} right.`,
  "rebalance.finish-left-right": ({ node }: NodeOnly) =>
    `The left child now leans left, so rotate ${node} right.`,
  "rebalance.check-right-child": ({ child, childBalance }: ChildBalance) =>
    childBalance <= 0
      ? `Does the right child ${child} lean right or not at all? Yes, its balance factor is ${childBalance}.`
      : `Does the right child ${child} lean right or not at all? No, its balance factor is ${childBalance}.`,
  "rebalance.case-right-right": ({ node }: RebalanceCase) =>
    `This is the right-right case: rotate ${node} left.`,
  "rebalance.case-right-left": ({ node, child }: RebalanceCase) =>
    `This is the right-left case: rotate ${child} right first, then ${node} left.`,
  "rebalance.finish-right-left": ({ node }: NodeOnly) =>
    `The right child now leans right, so rotate ${node} left.`,
  "update-height.compute-height": ({ node, height }: { node: number; height: number }) =>
    `${node} now has height ${height}: one more than its taller child.`,
  "update-height.compute-balance": ({
    node,
    balance,
    leftHeight,
    rightHeight,
  }: BalanceAtNode & { leftHeight: number; rightHeight: number }) =>
    `The balance factor of ${node} is ${balance}: left height ${leftHeight} minus right height ${rightHeight}.`,
  "preorder.check-empty": traversalCheckMessage,
  "preorder.empty": emptyMessage,
  "preorder.visit": visitMessage,
  "preorder.go-left": leftSubtreeMessage,
  "preorder.go-right": rightSubtreeMessage,
  "inorder.check-empty": traversalCheckMessage,
  "inorder.empty": emptyMessage,
  "inorder.visit": visitMessage,
  "inorder.go-left": leftSubtreeMessage,
  "inorder.go-right": rightSubtreeMessage,
  "postorder.check-empty": traversalCheckMessage,
  "postorder.empty": emptyMessage,
  "postorder.visit": visitMessage,
  "postorder.go-left": leftSubtreeMessage,
  "postorder.go-right": rightSubtreeMessage,
  "levelorder.enqueue-root": ({ node }: { node: number | null; queued: number }) =>
    node === null
      ? "The tree is empty, so the queue starts empty."
      : `Put the root ${node} in the queue.`,
  "levelorder.check-queue": ({ queued, visited }: { queued: number; visited: number }) =>
    queued > 0
      ? `Is the queue empty? No, it holds ${nodeCount(queued)}.`
      : visited === 0
        ? "Is the queue empty? Yes, so there's nothing to visit."
        : "Is the queue empty? Yes, so every node has been visited.",
  "levelorder.dequeue": ({ node }: QueuedNode) => `Take ${node} from the front of the queue.`,
  "levelorder.visit": visitMessage,
  "levelorder.check-left": childCheckMessage("left"),
  "levelorder.enqueue-left": ({ node }: QueuedNode) => `Put its left child ${node} in the queue.`,
  "levelorder.check-right": childCheckMessage("right"),
  "levelorder.enqueue-right": ({ node }: QueuedNode) => `Put its right child ${node} in the queue.`,
} satisfies { [Key in StepKey]: (variables: never) => string };

export type StepMessageVariables<Key extends StepKey> = Parameters<(typeof stepMessages)[Key]>[0];

export const describeStep = <Key extends StepKey>(
  stepKey: Key,
  variables: StepMessageVariables<Key>,
): string => (stepMessages[stepKey] as (variables: StepMessageVariables<Key>) => string)(variables);
