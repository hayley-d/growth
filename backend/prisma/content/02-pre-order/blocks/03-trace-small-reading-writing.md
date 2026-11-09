---
position: 3
style: reading-writing
tree: [40, 20, 60, 10]
transcript: "Write the stack. The tree has 40 at the root, with 20 on its left and 60 on its right. 20 has 10 on its left. Write down the call stack, top first, each time a call starts or finishes on this tree. Leave out the calls on empty nodes. The answer is: one, preorder of 40. Two, preorder of 20, preorder of 40. Three, preorder of 10, preorder of 20, preorder of 40. Four, preorder of 20, preorder of 40. Five, preorder of 40. Six, preorder of 60, preorder of 40. Seven, preorder of 40. Eight, empty."
---

## Write the stack

Write down the call stack, top first, each time a call starts or finishes on this tree. Leave out the calls on empty nodes.

Answer:

1. `preorder(40)`
2. `preorder(20)`, `preorder(40)`
3. `preorder(10)`, `preorder(20)`, `preorder(40)`
4. `preorder(20)`, `preorder(40)`
5. `preorder(40)`
6. `preorder(60)`, `preorder(40)`
7. `preorder(40)`
8. empty
