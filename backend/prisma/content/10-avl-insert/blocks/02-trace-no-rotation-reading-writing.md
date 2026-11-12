---
position: 2
style: reading-writing
tree: [20, 10, 30]
transcript: "Write the walk back up. On the tree with 20 at the root, 10 on the left and 30 on the right, insert 5. Write the path the code goes down. Then write the height and balance factor of each node on the way back up, and say whether anything needs fixing."
write: true
answer: |
  Path down: `20` → `10` → `5`.

  - `5`: height 1, BF 0
  - `10`: height 2, BF 1
  - `20`: height 3, BF 1

  Every BF is between -1 and 1, so nothing needs fixing.
---

## Write the walk back up

On this tree, insert `5`.

Write the **path** the code goes down. Then write the **height and balance factor** of each node on the way back up, and say whether anything needs fixing.
