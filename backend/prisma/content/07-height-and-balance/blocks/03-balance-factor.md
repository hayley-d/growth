---
position: 3
tree: [20, 10, 30, 5]
transcript: "Balance factor. The balance factor of a node is the height of its left subtree minus the height of its right subtree. Use the same tree. For node 20, left height is 2 and right height is 1, so the balance factor is 2 minus 1, which is 1. For node 10, left height is 1 and right height is 0, so the balance factor is 1. Leaves 5 and 30 both have balance factor 0."
terms:
  "balance factor": [20]
---

## Balance factor

The **balance factor** of a node is:

**height(left) − height(right)**

A leaf has height 1. An empty subtree has height 0.

On the same tree:

- `20`: left height 2, right height 1 → BF = **1**
- `10`: left height 1, right height 0 → BF = **1**
- `5` and `30`: both leaves → BF = **0**
