fn rotate_left(mut node: Box<Node>) -> Box<Node> {
    if node.right.is_none() { return node; } // @step rotate-left.check-pivot rotate-left.no-pivot
    let mut pivot = node.right.take().unwrap(); // @step rotate-left.pick-pivot
    node.right = pivot.left.take(); // @step rotate-left.move-inner-subtree
    pivot.left = Some(node); // @step rotate-left.lift-pivot
    update_height(pivot.left.as_mut().unwrap()); // @step rotate-left.update-heights
    update_height(&mut pivot);
    pivot // @step rotate-left.done
}
