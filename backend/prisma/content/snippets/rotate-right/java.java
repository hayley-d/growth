Node rotateRight(Node node) {
    if (node.left == null) return node; // @step rotate-right.check-pivot rotate-right.no-pivot
    Node pivot = node.left; // @step rotate-right.pick-pivot
    node.left = pivot.right; // @step rotate-right.move-inner-subtree
    pivot.right = node; // @step rotate-right.lift-pivot
    updateHeight(node); updateHeight(pivot); // @step rotate-right.update-heights
    return pivot; // @step rotate-right.done
}
