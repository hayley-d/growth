void updateHeight(Node node) {
    node.height = 1 + Math.max(height(node.left), height(node.right)); // @step update-height.compute-height
    node.balance = height(node.left) - height(node.right); // @step update-height.compute-balance
}
