---
position: 1
tree: [30, 20, 40, 10]
transcript: "The insert recipe. An AVL insert has three parts. First, go down and place the new key like in a plain binary search tree. Smaller keys go left and bigger keys go right. Second, walk back up the same path and update the height of each node. Third, on the way up, check the balance factor of each node. The first node with a balance factor of minus 2 or 2 is the one to fix, with a rotation. On this tree, inserting 5 goes down through 30, then 20, then 10. Then it walks back up through 10, 20 and 30. The labels give each node's balance factor before the insert: 30 and 20 have 1, 10 and 40 have 0."
labels:
  - text: ["30: BF 1"]
    keys: [30]
    place: side
  - text: ["20: BF 1"]
    keys: [20]
    place: side
  - text: ["40: BF 0"]
    keys: [40]
    place: side
  - text: ["10: BF 0"]
    keys: [10]
    place: side
---

## The insert recipe

An AVL insert has **three parts**:

1. **Go down.** Place the new key like in a plain binary search tree. Smaller keys go left, bigger keys go right.
2. **Walk back up.** Return along the same path and update the height of each node.
3. **Fix the first problem.** Check the **balance factor** of each node on the way up. The first node with a balance factor of **-2 or 2** is fixed with a rotation.

On this tree, inserting `5` goes down through `30`, `20` and `10`. Then it walks back up through `10`, `20` and `30`.
