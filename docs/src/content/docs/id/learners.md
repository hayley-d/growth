---
title: Analysis
description: Who the learners are, where they use Growth and how the content is broken down.
---

Analysis covers more than the learners. It also covers the learning environment and the content (Marshall, 2026d). This page covers all three.

## Who the learners are

Growth is built for second year students taking COS212, Data Structures and Algorithms, at the University of Pretoria. 

They use Growth before the lecture on trees, on their own. They need to know trees to pass COS212, so they come to Growth with some motivation already. The [Motivation](../motivation/) page explains how that shaped our choices.

## What we assume they know

We only assume what the modules before COS212 teach.

- Programming in C++: COS132 covers basics for programming in C++ so it is assumed the learners have basic programming knowledge but it is also not required. 
- Lists, stacks and queues: COS212 covers linear data structures before the tree content so it is assumed the learner already knows how these work. 
## What we don't assume

- We don't assume the learner has seen any kind of tree, so Growth starts from what a node is.
- We do not assume the learner knows what recursion is.
- COS212 uses Java, but the modules before it use C++. Code traces start in pseudocode, and the learner can switch to Java when they are ready.

## How lesson 1 starts from zero

Lesson 1 assumes nothing about trees. The first step, "What is a binary tree", shows a tree with one key in it. It defines a node, an edge and the root using that one key. "The binary search tree rule" then gives the rule for adding a key: smaller goes left and bigger goes right.

The learner then adds the first three keys and fills the tree to seven nodes. Only once the tree exists does the lesson name its pieces, the parents, children and leaves, and then the subtrees, depth and height. The lesson ends in the playground, where the learner builds the same tree themselves.

## How lesson 2 introduces recursion

The pre-order code in lesson 2 is the first recursive function the learner sees. The step that shows the code explains each line. The line that stops at an empty node is the base case, and the two lines that call pre-order on the subtrees make it recursive.

The next step recaps what a stack is, using the stack they know from COS110, and then runs the code with the call stack on screen. "Why calls wait" then hides the code and keeps only the tree and the stack, so the learner can see `preorder(20)` wait while `preorder(10)` runs. The [Scaffolding](../scaffolding/) page explains this as modelling, and [Learning theories](../theories/) explains why we chose to show the call stack.

## Learners who already know some of it

Some students will have met trees before. We don't force them through every lesson. A locked lesson offers "Take the test to skip ahead", and passing that test completes every lesson up to it. The [Presentation](../presentation/) page covers this.

## Learning environment

### Where and when

Growth is used before the COS212 lecture on trees, on the learner's own time. There is no lecturer or tutor in the room, so the app has to do the explaining and the helping. That is why every lesson has hints, feedback on wrong answers and other ways to learn each step ([Scaffolding](../scaffolding/)). It is also self-paced. The learner can pause, step back and replay any animation, and there are no timers on lessons or tests.

### Devices

Growth is a web app, so it runs in the browser on whatever the learner has, whether that is a laptop, a phone or a tablet. The app is responsive with no sideways scrolling ([SE requirements](../../se/requirements/)). 

### Our tools and timeline

We had around four weeks and a team of five ([Instructional design approach](../approach/)). We built Growth as a web app with React and a backend that stores each learner's progress, mastery and test attempts. The time limit is we stopped at a beta.

## Content

We broke the topic down from the top. The data structure is the AVL tree, and the algorithms are the traversals, insertion and deletion ([SE introduction](../../se/introduction/)). A learner can't follow a rotation without knowing what a binary tree, a traversal and height are, so the course has two units.

| Unit | Lessons | Ends with |
| --- | --- | --- |
| 1. Binary trees and traversals | 1. What is a binary tree, 2. Pre-order, 3. In-order, 4. Post-order, 5. Level-order | 6. Traversal checkpoint |
| 2. AVL trees | 7. Height and balance factor, 8. Single rotations, 9. Double rotations, 10. Inserting into an AVL tree, 11. Deleting from an AVL tree | 12. AVL final challenge |

Each lesson is broken into tasks, and each task has its own objective. The [Learning objectives](../objectives/) page lists them. For example, lesson 2 has three tasks: listing the nodes in pre-order, tracing the code and saying which calls wait on the stack, and explaining why copying a tree uses pre-order.

Each task is taught through learning activities. A lesson is a set of steps, and each step has one main activity:

- reading a short explanation next to a diagram of the tree
- watching an animation, such as a rotation
- stepping through a code trace with the call stack
- tapping the nodes of a tree in traversal order
- building a tree in the playground

Under each step, "Other ways to learn this" holds the same idea in another form ([Learning styles](../learning-styles/)). Every lesson ends with a note in the learner's own words and a five-question test. A checkpoint tests the whole unit before the next one opens.

## References

Marshall, L. (2026d) *L11 – Educational software development: lifecycles and instructional design* [Lecture slides]. COS750: Educational Software Development, University of Pretoria.
