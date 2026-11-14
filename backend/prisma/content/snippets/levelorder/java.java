import java.util.ArrayDeque;
import java.util.Queue;

void levelorder(Node root) {
    Queue<Node> queue = new ArrayDeque<>();
    if (root != null) queue.add(root); // @step levelorder.enqueue-root
    while (!queue.isEmpty()) { // @step levelorder.check-queue
        Node node = queue.remove(); // @step levelorder.dequeue
        visit(node); // @step levelorder.visit
        if (node.left != null) { // @step levelorder.check-left
            queue.add(node.left); // @step levelorder.enqueue-left
        }
        if (node.right != null) { // @step levelorder.check-right
            queue.add(node.right); // @step levelorder.enqueue-right
        }
    }
}
