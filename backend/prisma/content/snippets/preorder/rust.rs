fn preorder(node: Option<&Node>) {
    let Some(node) = node else { return }; // @step preorder.check-empty preorder.empty
    visit(node); // @step preorder.visit
    preorder(node.left.as_deref()); // @step preorder.go-left
    preorder(node.right.as_deref()); // @step preorder.go-right
}
