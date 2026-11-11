---
position: 1
style: reading-writing
tree: [20, 10, 30, 5, 15]
transcript: "Write the queue. On this tree, write down what the queue holds each time a node is taken from the front and its children have been added. The tree has 20 at the root, 10 and 30 below it, and 5 and 15 below 10. Answer. Start: 20. After 20: 10, 30. After 10: 30, 5, 15. After 30: 5, 15. After 5: 15. After 15: empty."
write: true
answer: |
  1. Start: `20`
  2. After 20: `10, 30`
  3. After 10: `30, 5, 15`
  4. After 30: `5, 15`
  5. After 5: `15`
  6. After 15: empty
---

## Write the queue

Take this tree: 20 is the root, 10 and 30 sit below it, and 5 and 15 sit below 10.

Write down what the queue holds each time a node has been taken from the front and its children have been added. Start with 20 in the queue.
