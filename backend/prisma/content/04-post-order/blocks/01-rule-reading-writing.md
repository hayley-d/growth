---
position: 1
style: reading-writing
tree: [8, 4, 12, 2, 6]
transcript: "Write the lines that run. The tree has 8 at the root, with 4 on its left and 12 on its right. 4 has children 2 and 6. Write down each line of the code that runs on this tree, in order, starting with postorder of 8. Leave out the checks for empty nodes."
write: true
answer: |
  `postorder(8)`, `postorder(4)`, `postorder(2)`, `visit(2)`, `postorder(6)`, `visit(6)`, `visit(4)`, `postorder(12)`, `visit(12)`, `visit(8)`.
---

## Write the lines that run

Write down each line of the code that runs on this tree, in order, starting with `postorder(8)`. Leave out the checks for empty nodes.
