fn insert(node: Option<Box<Node>>, key: i32) -> Box<Node> {
    let Some(mut node) = node else { return Box::new(Node::new(key)) }; // @step insert.check-empty insert.create-node
    if key < node.key { // @step insert.compare
        node.left = Some(insert(node.left.take(), key)); // @step insert.go-left
    } else if key > node.key { // @step insert.check-bigger
        node.right = Some(insert(node.right.take(), key)); // @step insert.go-right
    } else {
        return node; // @step insert.duplicate
    }
    update_height(&mut node); // @step insert.update-height
    rebalance(node) // @step insert.rebalance
}
