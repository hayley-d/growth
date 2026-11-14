---
position: 5
transcript: "Why a delete can need more rotations. After an insert, one rotation brings the subtree back to the height it had before, so nothing above it changes. After a delete, a rotation can leave the subtree one level shorter. Then the node above can become unbalanced too, so the walk continues. It can go all the way to the root, with a rotation at each node that is out of range. A rotation is picked the same way as for an insert. One extra case: if the heavy child has a balance factor of 0, one single rotation is enough."
---

## Why a delete can need more than one rotation

| | Insert | Delete |
| --- | --- | --- |
| Rotations at most | **One** fix | **One per level**, up to the root |
| Height after the fix | Same as before the insert | Can be **one shorter** |
| Why | Nothing above sees a change | The node above may now be out of balance |

Pick each rotation the same way as for an insert. Look at the node and its **heavy child**.

There is one extra case. If the heavy child has a balance factor of **0**, one **single** rotation is enough.

So after a delete, **keep walking up** until you pass the root.
