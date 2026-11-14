---
position: 5
style: reading-writing
transcript: "Write the difference. In your own words, write why an insert needs at most one fix, but a delete can need a fix at every level on the way up to the root."
write: true
answer: |
  After an insert, the rotation makes the subtree as tall as it was before the insert. The nodes above see no change, so one fix is enough.

  After a delete, the rotation can leave the subtree one level shorter. The node above now sees a change, so it may be unbalanced too. The check has to continue up to the root.
---

## Write the difference

In your own words, write **why** an insert needs at most one fix, but a delete can need a fix at **every level** on the way up.
