---
position: 4
style: reading-writing
tree: [50, 30, 70, 20, 40, 60, 90, 45, 55, 80, 100, 110]
transcript: "Write every fix. On the tree with 50 at the root, delete 20. Write each node on the way up that becomes unbalanced, in order, with its balance factor. For each one, write the rotation that fixes it. Then write why the second node became unbalanced."
write: true
answer: |
  After `20` is removed, walk up from `30`.

  1. `30`: balance factor -2. Its right child `40` leans right, so rotate `30` **left**. `40` now tops that subtree, which is one level shorter than before.
  2. `40`: fine. It is the new top of the fixed subtree.
  3. `50`: left height 2, right height 4, balance factor -2. Its right child `70` leans right, so rotate `50` **left**. `70` becomes the root.

  The root became unbalanced because the first rotation made the left side one level shorter. A delete can shorten a subtree, so the check has to continue all the way to the root.
---

## Write every fix

On this tree, delete `20`.

Write each node on the way up that becomes **unbalanced**, in order, with its balance factor.

For each one, write the **rotation** that fixes it.

Then write **why** the second node became unbalanced.
