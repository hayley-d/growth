use std::cmp::max;

fn update_height(node: &mut Node) {
    node.height = 1 + max(height(node.left.as_deref()), height(node.right.as_deref())); // @step update-height.compute-height
    node.balance = height(node.left.as_deref()) - height(node.right.as_deref()); // @step update-height.compute-balance
}
