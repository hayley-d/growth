fn inorder(node: Option<&Node>) {
    let Some(node) = node else { return }; // @step inorder.check-empty inorder.empty
    inorder(node.left.as_deref()); // @step inorder.go-left
    visit(node); // @step inorder.visit
    inorder(node.right.as_deref()); // @step inorder.go-right
}
