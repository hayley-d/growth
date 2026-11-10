---
position: 2
tree: [20, 10, 30, 5]
transcript: "Height. A leaf has height 1. An empty tree has height 0. The height of a node is 1 plus the larger height of its two subtrees. Look at this tree. 20 is at the root. 10 is on its left with child 5. 30 is on its right. Heights from the leaves up: 5 has height 1, 30 has height 1, 10 has height 2, and 20 has height 3. So the height of the whole tree is 3."
---

## Height

A leaf has height **1**. An empty tree has height **0**.

The height of a node is **1 plus the larger height of its two subtrees**.

Heights from the leaves up:

- `5` → 1 (leaf)
- `30` → 1 (leaf)
- `10` → 1 + max(1, 0) = **2**
- `20` → 1 + max(2, 1) = **3**

So the height of the whole tree is **3**.
