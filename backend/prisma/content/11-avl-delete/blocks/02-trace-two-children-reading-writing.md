---
position: 2
style: reading-writing
tree: [40, 20, 60, 10, 30, 50, 70]
transcript: "Write the successor. On the tree with 40 at the root, 20 and 60 as its children, 10 and 30 under 20, and 50 and 70 under 60, delete 40. Write the path you follow to find the in-order successor. Then write which key ends up at the root, and which node is removed."
write: true
answer: |
  `40` has two children, so it needs its in-order successor.

  Path: go **right** to `60`, then go **left** until there is no left child. That stops at `50`.

  `50` is copied into the root. Then the old `50` is removed. It was a leaf, so it is just taken away.

  `60` now has only a right child, `70`, with a balance factor of -1. That is fine, so nothing is rotated.
---

## Write the successor

On this tree, delete `40`.

Write the **path** you follow to find the in-order successor.

Then write **which key** ends up at the root and **which node** is removed.
