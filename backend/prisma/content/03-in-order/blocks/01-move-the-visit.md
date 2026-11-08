---
position: 1
transcript: "Move the visit: in-order. Now move the visit line so it sits between the two calls. That's in-order: left subtree, then the node, then the right subtree. Line 1: inorder of node. Line 2: if node is empty, return. Line 3: inorder of node dot left. Line 4: visit node. Line 5: inorder of node dot right. Nothing else changes. Step through it and watch where 10 gets visited."
---

## Move the visit: in-order

Now move the visit line so it sits _between_ the two calls. That's **in-order**: left subtree, then the node, then the right subtree.

```
inorder(node):
  if node is empty: return
  inorder(node.left)
  visit(node)
  inorder(node.right)
```

Nothing else changes. Step through it and watch where 10 gets visited.
