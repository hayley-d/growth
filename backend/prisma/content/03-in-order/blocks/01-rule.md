---
position: 1
transcript: "The in-order rule. In-order also starts at the root, but the steps are in a different order. One, do in-order on the left subtree. Two, visit the node. Three, do in-order on the right subtree. The code. Line 1: inorder of node. Line 2: if node is empty, return. Line 3: inorder of node dot left. Line 4: visit node. Line 5: inorder of node dot right. This is the pre-order code with visit node on line 4 instead of line 3."
---

## The in-order rule

In-order also starts at the root, but the steps are in a different order:

1. Do in-order on the left subtree.
2. Visit the node.
3. Do in-order on the right subtree.

## The code

```
inorder(node):
  if node is empty: return
  inorder(node.left)
  visit(node)
  inorder(node.right)
```

This is the pre-order code with `visit(node)` on line 4 instead of line 3.
