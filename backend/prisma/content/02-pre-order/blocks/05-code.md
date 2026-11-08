---
position: 5
transcript: "The code. Here's the rule as code. A function that calls itself is recursive. Line 1: preorder of node. Line 2: if node is empty, return. Line 3: visit node. Line 4: preorder of node dot left. Line 5: preorder of node dot right. Line 2 stops when there's no node, like the missing child of a leaf. Line 3 visits the node. Lines 4 and 5 run pre-order on the two subtrees."
---

## The code

Here's the rule as code. A function that calls itself is **recursive**.

```
preorder(node):
  if node is empty: return
  visit(node)
  preorder(node.left)
  preorder(node.right)
```

- Line 2 stops when there's no node, like the missing child of a leaf.
- Line 3 visits the node.
- Lines 4 and 5 run pre-order on the two subtrees.
