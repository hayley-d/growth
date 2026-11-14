---
position: 1
transcript: "The level-order rule. Level-order visits the tree one row at a time. It starts at the root, then visits the next row from left to right, then the next row, and so on down the tree. To keep its place it uses a queue. A queue is a line where the first node in is the first node out. The code. Line 2: make an empty queue. Line 3: if there is a root, add it to the queue. Line 4: while the queue is not empty, repeat lines 5 to 10. Line 5: take the node at the front of the queue. Line 6: visit it. Lines 7 and 8: if it has a left child, add that child to the back of the queue. Lines 9 and 10: if it has a right child, add that child to the back of the queue. There is no recursion this time. A loop does the work."
---

## The level-order rule

Level-order visits the tree one row at a time. It starts at the root, then does the next row from left to right, then the next row, and so on down the tree.

To keep its place it uses a **queue**, a line where the first node in is the first node out. Here's the rule as code.

```
levelorder(root):
  queue = empty queue
  if root exists: add root to queue
  while queue is not empty:
    node = take the front of the queue
    visit(node)
    if node.left exists:
      add node.left to queue
    if node.right exists:
      add node.right to queue
```

- Line 3 starts the queue with the root.
- Line 5 takes the node at the front, and line 6 visits it.
- Lines 7 to 10 add its children to the back of the queue, left first.

There's no recursion this time. A loop does the work.
