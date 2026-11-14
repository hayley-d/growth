---
position: 5
transcript: "Pick the rotation. Walk up from the new key and stop at the first node with a balance factor of minus 2 or 2. Then look at the child on its heavy side. If the node leans left and its left child leans left, rotate the node right. If the node leans right and its right child leans right, rotate the node left. If the node leans left but its left child leans right, rotate the child left, then the node right. If the node leans right but its right child leans left, rotate the child right, then the node left. After this one fix, the subtree is as tall as before the insert, so nothing above it needs fixing."
---

## Pick the rotation

Walk up from the new key. Stop at the **first** node with a balance factor of **-2 or 2**. Then look at the child on its **heavy side**.

| The node leans | Its heavy child leans | Fix |
| --- | --- | --- |
| Left | Left | Rotate the node **right** |
| Right | Right | Rotate the node **left** |
| Left | Right | Rotate the child **left**, then the node **right** |
| Right | Left | Rotate the child **right**, then the node **left** |

The same side twice needs one rotation. Opposite sides need two.

After this one fix, the subtree is as tall as it was before the insert. So nothing above it needs fixing.
