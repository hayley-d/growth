Node delete(Node node, int key) {
    if (node == null) return null; // @step delete.check-empty delete.not-found
    if (key < node.key) { // @step delete.compare
        node.left = delete(node.left, key); // @step delete.go-left
    } else if (key > node.key) { // @step delete.check-bigger
        node.right = delete(node.right, key); // @step delete.go-right
    } else if (node.left == null || node.right == null) { // @step delete.check-children
        return node.left != null ? node.left : node.right; // @step delete.replace-with-child
    } else {
        int successor = smallestKey(node.right); // @step delete.find-successor
        node.key = successor; // @step delete.copy-successor
        node.right = delete(node.right, successor); // @step delete.remove-successor
    }
    updateHeight(node); // @step delete.update-height
    return rebalance(node); // @step delete.rebalance
}
