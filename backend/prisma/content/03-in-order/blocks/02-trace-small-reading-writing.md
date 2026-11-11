---
position: 2
style: reading-writing
tree: [40, 20, 60, 10]
transcript: "Write the stack. The tree has 40 at the root, with 20 on its left and 60 on its right. 20 has 10 on its left. Write down the call stack, top first, each time a call starts or finishes on this tree. Leave out the calls on empty nodes."
write: true
answer: |
  1. `inorder(40)`
  2. `inorder(20)`, `inorder(40)`
  3. `inorder(10)`, `inorder(20)`, `inorder(40)`
  4. `inorder(20)`, `inorder(40)`
  5. `inorder(40)`
  6. `inorder(60)`, `inorder(40)`
  7. `inorder(40)`
  8. empty
---

## Write the stack

Write down the call stack, top first, each time a call starts or finishes on this tree. Leave out the calls on empty nodes.
