---
position: 5
transcript: "Where level-order is used. Level-order visits the nodes closest to the root first. That makes it useful for finding the node closest to the root that matches a condition, like the shallowest empty spot. It is also how you print or draw a tree one row at a time, and how you find the height of a tree by counting the rows. Outside trees, the same queue idea is how a search over a map or a network finds the fewest steps from a start point, because it checks everything one step away before anything two steps away."
---

## Where level-order is used

Level-order visits the nodes closest to the root first. That is what makes it useful.

- **Finding the closest match.** To find the node nearest the root that meets a condition, such as the shallowest node with no children, stop at the first one the queue gives you. Every deeper node would only be further away.
- **Printing or drawing a tree row by row.** Each time the queue empties a row, you know where one row ends and the next begins. This is how a tree is laid out on screen.
- **Finding the height.** Count the rows the queue works through. The number of rows is the height.
- **Shortest paths.** The same queue idea is how a search over a map or a network finds the fewest steps from a start point. It checks everything one step away before anything two steps away.

The depth-first orders go deep first, so they can't give you any of these in one pass.
