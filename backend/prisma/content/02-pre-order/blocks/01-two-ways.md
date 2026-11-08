---
position: 1
transcript: "Two ways to traverse a tree. A traversal is when you visit every node in a tree. There are two main ways to traverse a tree. Breadth-first search goes one level at a time down the tree. It uses a queue, a line where the first node in is the first node out. Put the root in the queue. Then, until the queue is empty, take the node at the front, visit it, and add its children to the back. On the tree in the next step, you visit 8 and the queue holds 4 and 12. You visit 4 and the queue holds 12, 2 and 6. You visit 12 and the queue holds 2, 6, 10 and 14. The leaves come out last. The order is 8, 4, 12, 2, 6, 10, 14. Depth-first search is the other way to traverse a tree. It uses a stack, a pile where the last thing in is the first thing out. Each time you go down to a child, it goes on top of the stack. When a branch ends, you take the top off and go back up to the node underneath. That's how depth-first goes all the way down one branch before it tries the next. In code, this stack is the call stack, which you'll see in the traces. Depth-first search comes in three orders: pre-order, in-order and post-order. All three use a stack. What differs is when each node gets visited. We start with pre-order traversal, where each node is visited before anything below it."
---

## Two ways to traverse a tree

A traversal is when you visit every node in a tree. There are two main ways to traverse a tree.

**Breadth-first search** goes one level at a time down the tree. It uses a **queue**, a line where the first node in is the first node out. Put the root in the queue. Then, until the queue is empty, take the node at the front, visit it, and add its children to the back.

On the tree in the next step, the queue goes like this:

| Visit | Queue after |
| --- | --- |
| 8 | 4, 12 |
| 4 | 12, 2, 6 |
| 12 | 2, 6, 10, 14 |

The leaves come out last. The order is 8, 4, 12, 2, 6, 10, 14.

**Depth-first search** is the other way to traverse a tree. It uses a **stack**, a pile where the last thing in is the first thing out. Each time you go down to a child, it goes on top of the stack. When a branch ends, you take the top off and go back up to the node underneath. That's how depth-first goes all the way down one branch before it tries the next. In code, this stack is the call stack, which you'll see in the traces.

Depth-first search comes in three orders: pre-order, in-order and post-order. All three use a stack. What differs is when each node gets visited.

We start with **pre-order** traversal, where each node is visited before anything below it.
