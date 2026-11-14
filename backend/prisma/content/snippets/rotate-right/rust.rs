fn rotate_right(mut node: Box<Node>) -> Box<Node> {
    if node.left.is_none() { return node; } // @step rotate-right.check-pivot rotate-right.no-pivot
    let mut pivot = node.left.take().unwrap(); // @step rotate-right.pick-pivot
    node.left = pivot.right.take(); // @step rotate-right.move-inner-subtree
    pivot.right = Some(node); // @step rotate-right.lift-pivot
    update_height(pivot.right.as_mut().unwrap()); // @step rotate-right.update-heights
    update_height(&mut pivot);
    pivot // @step rotate-right.done
}
