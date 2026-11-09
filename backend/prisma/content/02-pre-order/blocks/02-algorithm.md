---
position: 2
transcript: "Algorithm. Pre-order traversal visits a node before either of its subtrees. The algorithm has three steps, starting at the root. One, visit the node. Two, visit all the nodes in the left subtree. Three, visit all the nodes in the right subtree. Here's the rules as code. Line 1: preorder of node. Line 2: if node is empty, return. Line 3: visit node. Line 4: preorder of node dot left. Line 5: preorder of node dot right. Line 2 stops when there's no node, like the missing child of a leaf. Line 3 visits the node. Lines 4 and 5 run pre-order on the two subtrees."
---

## Algorithm

Pre-order traversal visits a node before either of its subtrees.

The algorithm has three steps, starting at the root:

1. Visit the node.
2. Visit all the nodes in the left subtree.
3. Visit all the nodes in the right subtree.

Here's the rules as code.

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
