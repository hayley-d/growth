---
position: 1
style: reading-writing
tree: [50, 30, 70, 20, 40, 60]
transcript: "Write the cases. On the tree with 50 at the root, 30 and 70 as its children, 20 and 40 under 30, and 60 under 70, write which delete case applies to 20, to 70 and to 50. Then write what happens to the tree in each case."
write: true
answer: |
  - `20` has no children. It is a leaf, so it is just removed.
  - `70` has one child. `60` takes its place.
  - `50` has two children. Its in-order successor is `60`, the smallest key in its right subtree. `60` is copied into the spot of `50`, then the old `60` is removed.
---

## Write the cases

On this tree, write which **delete case** applies to `20`, to `70` and to `50`.

Then write **what happens** to the tree in each case.
