---
title: Introduction
description: The problem, who the app is for, and the data structure and algorithm we chose.
---

## The problem

COS212 (Data Structures and Algorithms) at the University of Pretoria teaches data structures, a topic that students often find difficult to wrap their heads around. Growth is designed as a pre-lecture tool for it. Students work through the data structure before the lecture to help them grasp the content in the lecture and build intuitive understanding.

## The users

The users are COS212 students with no prior knowledge of AVL trees. The [Learners](../../id/learners/) page of the ID document describes them in more detail.

## Data structure and algorithm

We chose the **AVL tree**. It is a binary search tree that maintains balance by checking the height of subtrees after every change. The algorithms the app teaches are:

- traversals (in-order, pre-order and post-order)
- insertion
- deletion
- rebalancing with the four rotations

Rebalancing tends to be where students get stuck, which is why we chose it. Rotations are difficult to visualise in code but easy to understand via animations.

## CS2023 reference

The AVL tree sits in the ACM/IEEE CS2023 curriculum under **AL-Foundational: Foundational Data Structures and Algorithms**, which is **CS Core**:

- Topic 9, Trees: 9a binary, n-ary and search trees, and 9b balanced trees (for example AVL, Red-Black and Heap).
- Topic 1a, Abstract Data Type operations: dictionary operations (insert, delete, find).
