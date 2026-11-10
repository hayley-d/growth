void postorder(Node node) {
    if (node == null) return; // @step postorder.check-empty postorder.empty
    postorder(node.left); // @step postorder.go-left
    postorder(node.right); // @step postorder.go-right
    visit(node); // @step postorder.visit
}
