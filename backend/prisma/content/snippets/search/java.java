Node search(Node root, int key) {
    Node node = root;
    while (node != null) { // @step search.check-empty
        if (key == node.key) return node; // @step search.compare search.found
        if (key < node.key) { // @step search.check-smaller
            node = node.left; // @step search.go-left
        } else {
            node = node.right; // @step search.go-right
        }
    }
    return null; // @step search.not-found
}
