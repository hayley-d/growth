---
position: 1
tree: [50, 30, 70, 20, 40, 60]
transcript: "The three delete cases. First find the key, like in a plain binary search tree. Then look at how many children the node has. With no children, the node is a leaf and you just remove it. With one child, the child takes the node's place. With two children, find the in-order successor, which is the smallest key in the right subtree. Copy the successor's key into the node, then remove the successor from the right subtree. After any case, walk back up the path and update the heights. On this tree, 20 is a leaf, 70 has one child, and 50 has two children."
terms:
  "in-order successor": [60]
---

## The three delete cases

First **find** the key, like in a plain binary search tree. Then count its children.

1. **No children (a leaf).** Just remove it.
2. **One child.** The child takes its place.
3. **Two children.** Find the **in-order successor**: the smallest key in the node's **right subtree**. Copy its key into the node. Then remove the successor from the right subtree.

After any case, walk back up the path and update the heights.

On this tree, `20` is a leaf, `70` has one child, and `50` has two children.
