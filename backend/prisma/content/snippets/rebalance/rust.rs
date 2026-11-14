fn rebalance(mut node: Box<Node>) -> Box<Node> {
    if node.balance.abs() <= 1 { return node; } // @step rebalance.check rebalance.balanced
    if node.balance > 1 { // @step rebalance.check-side
        if node.left.as_ref().unwrap().balance >= 0 { // @step rebalance.check-left-child
            return rotate_right(node); // @step rebalance.case-left-left
        }
        node.left = Some(rotate_left(node.left.take().unwrap())); // @step rebalance.case-left-right
        return rotate_right(node); // @step rebalance.finish-left-right
    }
    if node.right.as_ref().unwrap().balance <= 0 { // @step rebalance.check-right-child
        return rotate_left(node); // @step rebalance.case-right-right
    }
    node.right = Some(rotate_right(node.right.take().unwrap())); // @step rebalance.case-right-left
    rotate_left(node) // @step rebalance.finish-right-left
}
