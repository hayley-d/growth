Node rotateLeft(Node node) {
    if (node.right == null) return node; // @step rotate-left.check-pivot rotate-left.no-pivot
    Node pivot = node.right; // @step rotate-left.pick-pivot
    node.right = pivot.left; // @step rotate-left.move-inner-subtree
    pivot.left = node; // @step rotate-left.lift-pivot
    updateHeight(node); updateHeight(pivot); // @step rotate-left.update-heights
    return pivot; // @step rotate-left.done
}
