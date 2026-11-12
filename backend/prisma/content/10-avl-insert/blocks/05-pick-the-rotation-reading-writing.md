---
position: 5
style: reading-writing
transcript: "Write the rule. A node has a balance factor of minus 2 and its right child has a balance factor of 1. Write which case this is and which rotations fix it, in order. Then write why nothing above the fixed node needs a fix."
write: true
answer: |
  The node leans right and its right child leans left, so this is the right-left case.

  Rotate the right child right first, then rotate the node left.

  After the fix the subtree is as tall as before the insert, so the nodes above it keep their balance factors.
---

## Write the rule

A node has a balance factor of **-2**. Its right child has a balance factor of **1**.

Write which **case** this is and which **rotations** fix it, in order.

Then write **why** nothing above the fixed node needs a fix.
