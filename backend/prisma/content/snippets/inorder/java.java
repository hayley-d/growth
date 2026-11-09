void inorder(Node node) {
    if (node == null) return; // @step inorder.check-empty inorder.empty
    inorder(node.left); // @step inorder.go-left
    visit(node); // @step inorder.visit
    inorder(node.right); // @step inorder.go-right
}
