---
position: 3
style: reading-writing
tree: [30, 20, 40, 35, 50]
transcript: "Write the fix. On the tree with 30 at the root, 20 and 40 as its children, and 35 and 50 under 40, delete 20. Write the first unbalanced node and its balance factor. Write the balance factor of its heavy child. Then write which rotation fixes it and what the tree looks like afterwards."
write: true
answer: |
  After `20` is removed:

  - `30`: left height 0, right height 2, balance factor -2. This is the first unbalanced node.
  - Its heavy child `40`: left height 1, right height 1, balance factor 0.

  The heavy side is the right side, and `40` does not lean left. One **left rotation** at `30` fixes it.

  `40` becomes the root, `30` is its left child, `35` moves under `30`, and `50` stays on the right. The tree is still 3 levels tall.
---

## Write the fix

On this tree, delete `20`.

Write the **first unbalanced node** and its balance factor.

Write the balance factor of its **heavy child**.

Then write the **rotation** that fixes it, and how the tree looks afterwards.
