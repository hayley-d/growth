---
position: 3
style: reading-writing
tree: [30, 20, 40, 10]
transcript: "Write the walk back up. On the tree with 30 at the root, 20 and 40 as its children, and 10 under 20, insert 5. Write the path down. Then write the height and balance factor of each node on the way back up. Write which node is the first unbalanced one and which rotation fixes it."
write: true
answer: |
  Path down: `30` → `20` → `10` → `5` goes left of `10`.

  - `5`: height 1, BF 0
  - `10`: height 2, BF 1
  - `20`: height 3, BF 2 ← first unbalanced node

  Its left child `10` leans left, so one right rotation at `20` fixes it. `30` is never touched.
---

## Write the walk back up

On this tree, insert `5`.

Write the **path** down. Then write the **height and balance factor** of each node on the way back up.

Write which node is the **first unbalanced** one, and which rotation fixes it.
