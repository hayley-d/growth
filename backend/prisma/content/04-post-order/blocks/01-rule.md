---
position: 1
transcript: "The post-order rule. In post-order traversal the visit now moves to the end, after both recursive calls. Meaning the node only gets visited after both its left subtree and its right subtree. Line 1: postorder of node. Line 2: if node is empty, return. Line 3: postorder of node dot left. Line 4: postorder of node dot right. Line 5: visit node."
---

## The post-order rule

In post-order traversal the visit now moves to the end, after both recursive calls. Meaning the node only gets visited after both its left subtree and its right subtree.

```
postorder(node):
  if node is empty: return
  postorder(node.left)
  postorder(node.right)
  visit(node)
```
