---
position: 1
style: reading-writing
tree: [30, 20, 40, 10]
transcript: "Write the recipe. In your own words, write the three parts of an AVL insert. Then write the path that inserting 5 takes down the tree with 30 at the root, 20 and 40 as its children, and 10 under 20."
write: true
answer: |
  1. Go down: place the key like in a plain binary search tree.
  2. Walk back up: update the height of each node on the path.
  3. Fix the first node whose balance factor is -2 or 2 with a rotation.

  The path for `5` is `30` → `20` → `10`, and `5` becomes the left child of `10`.
---

## Write the recipe

In your own words, write the **three parts** of an AVL insert.

Then write the **path** that inserting `5` takes down this tree.
