---
position: 1
transcript: "Why balance matters. A plain binary search tree puts smaller keys on the left and bigger keys on the right. That is fine when the tree stays bushy. Insert the keys 1, 2, 3, 4 with no rebalancing and each new key hangs under the last one. The tree becomes a stick. Search for 4 then walks 1, then 2, then 3, then 4. That is one step per key, so search is O of n, not O of log n. AVL trees fix this. After each insert they rebalance, so the tree stays bushy and search stays fast."
---

## Why balance matters

A plain binary search tree puts smaller keys on the left and bigger keys on the right. That is fine when the tree stays bushy.

Insert the keys `1`, `2`, `3`, `4` with **no** rebalancing and each new key hangs under the last one. The tree becomes a stick:

```
1
 \
  2
   \
    3
     \
      4
```

Search for `4` then walks `1 → 2 → 3 → 4`. That is one step per key, so search is **O(n)**, not **O(log n)**.

AVL trees fix this. After each insert they rebalance, so the tree stays bushy and search stays fast.
