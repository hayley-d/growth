Node rebalance(Node node) {
    if (Math.abs(node.balance) <= 1) return node; // @step rebalance.check rebalance.balanced
    if (node.balance > 1) { // @step rebalance.check-side
        if (node.left.balance >= 0) { // @step rebalance.check-left-child
            return rotateRight(node); // @step rebalance.case-left-left
        }
        node.left = rotateLeft(node.left); // @step rebalance.case-left-right
        return rotateRight(node); // @step rebalance.finish-left-right
    }
    if (node.right.balance <= 0) { // @step rebalance.check-right-child
        return rotateLeft(node); // @step rebalance.case-right-right
    }
    node.right = rotateRight(node.right); // @step rebalance.case-right-left
    return rotateLeft(node); // @step rebalance.finish-right-left
}
