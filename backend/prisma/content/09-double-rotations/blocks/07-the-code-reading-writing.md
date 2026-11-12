---
position: 7
style: reading-writing
transcript: "Write rebalance in your own words. Write the steps for a node with balance factor plus 2, then the mirror steps for a node with balance factor minus 2. Say when the code does one rotation and when it does two."
write: true
answer: |
  - Balance factor +2: if the left child's balance factor is 0 or more, rotate right at the node. Otherwise rotate left at the left child, then rotate right at the node.
  - Balance factor −2: if the right child's balance factor is 0 or less, rotate left at the node. Otherwise rotate right at the right child, then rotate left at the node.
  - One rotation when the child leans the same way or not at all. Two when it leans the other way.
---

## Write rebalance in your own words

Write the steps for a node with balance factor **+2**. Then write the mirror steps for balance factor **−2**.

Say when the code does one rotation and when it does two.
