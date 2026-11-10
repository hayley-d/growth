---
position: 1
transcript: "Left-left. A node with balance factor plus 2 whose left child has balance factor plus 1 is the left-left case. There is too much weight on the left of the left. The drawing is a stick: 30 at the top, 20 on its left, 10 on the left of 20. A leaf has height 1. An empty child has height 0. Balance factor is left height minus right height. 10 has height 1 and balance factor 0. 20 has height 2 and balance factor plus 1. 30 has height 3 and balance factor plus 2. Fix it with one right rotation on the unbalanced node, 30. After a delete, the heavy child can have balance factor 0. One rotation still fixes it when the child leans the same way, or not at all. Practice questions call the unbalanced node the pivot. The step player calls the child that moves up the pivot. In this lesson we say the unbalanced node, the question's pivot, and its child."
---

## Left-left

A node with balance factor **+2** whose left child has balance factor **+1** is the **left-left** case. There is too much weight on the left of the left.

A leaf has height 1. An empty child has height 0. Balance factor is **height(left) − height(right)**.

```
    30
   /
  20
 /
10
```

- `10` is a leaf: height 1, BF 0
- `20`: left height 1, right height 0 → height 2, BF **+1**
- `30`: left height 2, right height 0 → height 3, BF **+2**

Fix it with **one right rotation** on the unbalanced node (`30`).

After a delete, the heavy child can have balance factor 0. One rotation still fixes it when the child leans the same way, or not at all.

Practice questions call the unbalanced node the **pivot**. The step player calls the child that moves up the pivot. In this lesson we say "the unbalanced node (the question's pivot)" and "its child".
