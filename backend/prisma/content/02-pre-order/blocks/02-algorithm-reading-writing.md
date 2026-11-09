---
position: 2
style: reading-writing
transcript: "Write the lines that run. Here's a small tree. 8 is at the root, with 4 on its left and 12 on its right. 4 has children 2 and 6. Write down each line of the code that runs, in order, starting with preorder of 8. Leave out the checks for empty nodes. The answer is: preorder of 8, visit 8, preorder of 4, visit 4, preorder of 2, visit 2, preorder of 6, visit 6, preorder of 12, visit 12."
---

## Write the lines that run

Here's a small tree:

```
      8
     / \
    4   12
   / \
  2   6
```

Write down each line of the code that runs, in order, starting with `preorder(8)`. Leave out the checks for empty nodes.

Answer: `preorder(8)`, `visit(8)`, `preorder(4)`, `visit(4)`, `preorder(2)`, `visit(2)`, `preorder(6)`, `visit(6)`, `preorder(12)`, `visit(12)`.
