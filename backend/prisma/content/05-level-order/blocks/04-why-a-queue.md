---
position: 4
transcript: "Why a queue. In pre-order, in-order and post-order the call stack decides what happens next. The most recent call is the one that runs, so the code dives down into a subtree. Level-order needs the opposite. A node waits until every node ahead of it has been visited. The node that joined first has to leave first, and that is exactly what a queue does. If you swapped the queue for a stack, the node you added last would come out first, and you would head down the tree instead of across it."
---

## Why a queue

In the depth-first orders the **call stack** decides what happens next. The most recent call runs first, so the code dives down into a subtree before it comes back.

Level-order needs the opposite. A node has to wait until every node ahead of it has been visited. The node that joined the line first leaves first, and that's exactly what a **queue** does.

If you swapped the queue for a stack, the node you added last would come out first, and you'd head down the tree instead of across it.
