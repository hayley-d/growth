fn postorder(node: Option<&Node>) {
    let Some(node) = node else { return }; // @step postorder.check-empty postorder.empty
    postorder(node.left.as_deref()); // @step postorder.go-left
    postorder(node.right.as_deref()); // @step postorder.go-right
    visit(node); // @step postorder.visit
}
