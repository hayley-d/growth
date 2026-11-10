---
position: 4
tree: [40, 20, 60, 10, 30, 50, 70]
transcript: "The AVL rule. Every node's balance factor must be minus 1, 0 or 1. The tree on screen is a valid AVL tree. Every node has balance factor 0. Now contrast that with a stick from a plain binary search tree with no rebalancing. Insert 1, 2, 3, 4 and you get a line. Heights: 4 is 1, 3 is 2, 2 is 3, 1 is 4. Balance factors: 4 is 0, 3 is minus 1, 2 is minus 2, 1 is minus 3. Nodes 1 and 2 break the AVL rule because their balance factors sit outside minus 1 to 1."
---

## The AVL rule

An AVL tree is a binary search tree where **every** node's balance factor is **-1, 0 or 1**.

On the bushy tree above, every node has BF **0**. That is a valid AVL tree.

A plain BST with no rebalancing can break the rule. Insert `1`, `2`, `3`, `4` and you get a stick:

```
1
 \
  2
   \
    3
     \
      4
```

Heights: `4 → 1`, `3 → 2`, `2 → 3`, `1 → 4`.

Balance factors: `4 → 0`, `3 → -1`, `2 → -2`, `1 → -3`.

Nodes `1` and `2` are illegal for AVL: their balance factors sit outside -1 to 1. (The on-screen AVL insert path would rebalance instead of leaving this stick.)
