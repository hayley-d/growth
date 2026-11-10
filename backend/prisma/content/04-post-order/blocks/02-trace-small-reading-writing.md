---
position: 2
style: reading-writing
tree: [40, 20, 60, 10]
transcript: "Write the stack. The tree has 40 at the root, with 20 on its left and 60 on its right. 20 has 10 on its left. Write down the call stack, top first, each time a call starts or finishes on this tree. Leave out the calls on empty nodes. The answer is: one, postorder of 40. Two, postorder of 20, postorder of 40. Three, postorder of 10, postorder of 20, postorder of 40. Four, postorder of 20, postorder of 40. Five, postorder of 40. Six, postorder of 60, postorder of 40. Seven, postorder of 40. Eight, empty."
---

## Write the stack

Write down the call stack, top first, each time a call starts or finishes on this tree. Leave out the calls on empty nodes.

Answer:

1. `postorder(40)`
2. `postorder(20)`, `postorder(40)`
3. `postorder(10)`, `postorder(20)`, `postorder(40)`
4. `postorder(20)`, `postorder(40)`
5. `postorder(40)`
6. `postorder(60)`, `postorder(40)`
7. `postorder(40)`
8. empty
