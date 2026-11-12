fn delete(node: Option<Box<Node>>, key: i32) -> Option<Box<Node>> {
    let Some(mut node) = node else { return None }; // @step delete.check-empty delete.not-found
    if key < node.key { // @step delete.compare
        node.left = delete(node.left.take(), key); // @step delete.go-left
    } else if key > node.key { // @step delete.check-bigger
        node.right = delete(node.right.take(), key); // @step delete.go-right
    } else if node.left.is_none() || node.right.is_none() { // @step delete.check-children
        return node.left.or(node.right); // @step delete.replace-with-child
    } else {
        let successor = smallest_key(node.right.as_deref().unwrap()); // @step delete.find-successor
        node.key = successor; // @step delete.copy-successor
        node.right = delete(node.right.take(), successor); // @step delete.remove-successor
    }
    update_height(&mut node); // @step delete.update-height
    Some(rebalance(node)) // @step delete.rebalance
}
