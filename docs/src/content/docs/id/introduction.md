---
title: Introduction
description: Why the app exists and what it teaches.
---

## Purpose

COS212 (Data Structures and Algorithms) is a module that many students often struggle with. Growth is designed as a pre-lecture tool for it. Students work through the data structure before the lecture to help them grasp the content in the lecture.

They use Growth before the lecture on their own.
The [Analysis](../learners/) page describes the learners and where they use Growth in more detail.

## Data structure and algorithm

We chose the **AVL tree**. It is a binary search tree that maintains balance by checking the height of subtrees after every change. The algorithms the app teaches are:

- traversals (pre-order, in-order, post-order and level-order)
- insertion
- deletion
- rebalancing with the four rotations

Rebalancing tends to be where students get stuck, which is why we chose it. Rotations are difficult to visualise in code but easy to understand via animations. We often show them side by side.

A learner can't follow a rotation without understanding binary trees and their traversals, so the course has two units:

| Unit | Lessons | Ends with |
| --- | --- | --- |
| 1. Binary trees and traversals | 1. What is a binary tree, 2. Pre-order, 3. In-order, 4. Post-order, 5. Level-order | 6. Traversal checkpoint |
| 2. AVL trees | 7. Height and balance factor, 8. Single rotations, 9. Double rotations, 10. Inserting into an AVL tree, 11. Deleting from an AVL tree | 12. AVL final challenge |

## CS2023 reference

The AVL tree belongs to the ACM/IEEE-CS/AAAI Computer Science Curricula 2023 (CS2023), in the knowledge unit **AL-Foundational: Foundational Data Structures and Algorithms**. That unit is CS Core, which means CS2023 expects every computer science graduate to cover it (Kumar et al., 2024).

The app covers these CS Core topics from that unit:

| Code | CS2023 topic (quoted) | Where we cover it |
| --- | --- | --- |
| 1a | "Dictionary operations (insert, delete, find)" | BST insert in lesson 1, AVL insert and delete in lessons 10 and 11 |
| 9a | "Binary, n-ary, and search trees" | Lesson 1 and the traversals (binary and search trees only) |
| 9b | "Balanced (e.g., AVL, Red-Black, Heap)" | All of unit 2, AVL only |
| 11c | "uninformed depth/breadth-first tree search" | Pre-, in- and post-order as depth-first, level-order as breadth-first |

The [Learning objectives](../objectives/) page lists the CS2023 learning outcomes and skill levels we target. The SE document's [introduction](../../se/introduction/) gives the same reference.

## References

Kumar, A.N., Raj, R.K. et al. (2024) *Computer Science Curricula 2023*. New York: Association for Computing Machinery. Available at: https://doi.org/10.1145/3664191 (Accessed: 12 November 2026).
