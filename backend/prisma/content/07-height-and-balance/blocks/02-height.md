---
position: 2
tree: [20, 10, 30, 5]
transcript: "Height, a quick recap. You met height in lesson 1. A leaf has height 1. An empty tree has height 0. The height of a node is 1 plus the larger height of its two subtrees. It is the same height as before: the number of nodes on the longest way down. On this tree, 5 and 30 are leaves, so each has height 1. 10 has height 2. 20 has height 3. We need these numbers to work out the balance factor next."
terms:
  height: [20, 10, 5]
---

## Height: a quick recap

You met **height** in lesson 1. Here is the reminder:

- A leaf has height **1**.
- An empty tree has height **0**.
- The height of a node is **1 plus the larger height of its two subtrees**.

It is the same height as before: the number of nodes on the longest way down.

On this tree:

- `5` and `30` are leaves → **1**
- `10` → 1 + max(1, 0) = **2**
- `20` → 1 + max(2, 1) = **3**

Next we use these heights to work out the balance factor.
