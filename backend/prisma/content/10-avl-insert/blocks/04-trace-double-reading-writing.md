---
position: 4
style: reading-writing
tree: [30, 20, 40, 10]
transcript: "Write the two rotations. On the tree with 30 at the root, 20 and 40 as its children, and 10 under 20, insert 15. Write the first unbalanced node. Write which way its heavy child leans. Write the two rotations in order."
write: true
answer: |
  Path down: `30` → `20` → `10` → `15` goes right of `10`.

  - `20`: BF 2 ← first unbalanced node
  - Its left child `10` has BF -1, so it leans right.

  Rotate `10` left first, then rotate `20` right. `15` ends up on top of `10` and `20`.
---

## Write the two rotations

On this tree, insert `15`.

Write the **first unbalanced node**. Write which way its **heavy child leans**. Then write the **two rotations** in order.
