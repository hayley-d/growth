---
position: 1
style: reading-writing
tree: [8, 4, 12, 2, 6]
transcript: "Write the lines that run. The tree has 8 at the root, with 4 on its left and 12 on its right. 4 has children 2 and 6. Write down each line of the code that runs on this tree, in order, starting with inorder of 8. Leave out the checks for empty nodes."
write: true
answer: |
  `inorder(8)`, `inorder(4)`, `inorder(2)`, `visit(2)`, `visit(4)`, `inorder(6)`, `visit(6)`, `visit(8)`, `inorder(12)`, `visit(12)`.
---

## Write the lines that run

Write down each line of the code that runs on this tree, in order, starting with `inorder(8)`. Leave out the checks for empty nodes.
