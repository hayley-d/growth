use std::collections::VecDeque;

fn levelorder(root: Option<&Node>) {
    let mut queue = VecDeque::new();
    if let Some(root) = root { queue.push_back(root); } // @step levelorder.enqueue-root
    while !queue.is_empty() { // @step levelorder.check-queue
        let node = queue.pop_front().unwrap(); // @step levelorder.dequeue
        visit(node); // @step levelorder.visit
        if let Some(left) = node.left.as_deref() { // @step levelorder.check-left
            queue.push_back(left); // @step levelorder.enqueue-left
        }
        if let Some(right) = node.right.as_deref() { // @step levelorder.check-right
            queue.push_back(right); // @step levelorder.enqueue-right
        }
    }
}
