---
position: 5
transcript: "Right-right is the mirror of left-left. A node with balance factor minus 2 whose right child has balance factor minus 1, or 0, is the right-right case. There is too much weight on the right of the right. The drawing is a stick: 10 at the top, 20 on its right, 30 on the right of 20. 30 has height 1 and balance factor 0. 20 has height 2 and balance factor minus 1. 10 has height 3 and balance factor minus 2. Fix it with one left rotation on the unbalanced node, 10. Swap the words: left with right, plus with minus, right rotation with left rotation."
---

## Right-right

Right-right is the **mirror** of left-left. A node with balance factor **−2** whose right child has balance factor **−1** (or 0) is the **right-right** case. There is too much weight on the right of the right.

```
10
 \
  20
   \
    30
```

- `30` is a leaf: height 1, BF 0
- `20`: left height 0, right height 1 → height 2, BF **−1**
- `10`: left height 0, right height 2 → height 3, BF **−2**

Fix it with **one left rotation** on the unbalanced node (`10`).

Swap the words: left with right, + with −, right rotation with left rotation.
