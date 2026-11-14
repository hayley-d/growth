---
title: Analysis
description: Who the learners are, where they use Growth and how the content is broken down.
---

Analysis is our information gathering for the project. It covers the learners, the performance gap, the learning environment, our constraints and the content.

## Background and stakeholders
 
The COS212 lecturer at the University of Pretoria asked for an app that gives students tutor-style practice before a lecture (Department of Computer Science, 2026). We chose one data structure and one algorithm from the core list in CS2023, and our choice was the AVL tree with the tree traversals, insertion and deletion. The spec also says we cannot assume the learners know anything about them, and that the app must include assessment that can give a struggling student extra scaffolding before the lecture.
 
| Stakeholder | What they need from Growth |
| --- | --- |
| COS212 lecturer | Students who arrive at the trees lecture having already met the ideas |
| COS212 students | A way to prepare for lectures on their own that does not leave them confused |
| Examination panel and peer groups | A working prototype |
| Our team of five | A prototype we can finish and demonstrate in the time we have |
 

## Who the learners are

Growth is built for second year students taking COS212, Data Structures and Algorithms, at the University of Pretoria. 

They use Growth before lectures, on their own. They need to know trees to pass COS212, so they come to Growth with some motivation already. The [Motivation](../motivation/) page explains how that shaped our choices.

### Learner profile

| | |
| --- | --- |
| Stage | Second year undergraduates at the University of Pretoria. |
| Course | COS212, Data Structures and Algorithms |
| Prior knowledge | Basic programming, stacks and queues. |
| Where and when | Alone, on their own time, before a lecture. |
| Devices | Laptop, phone or tablet |
| Language | English as that is what COS212 is taught in. |
| How much they differ | Confidence with progrmming and data structures will vary. |

To keep the profile concrete, here is the student we picture when we make design choices. Emmanuel just started second year and passed COS110. He hasn't seen a tree before, and he is a bit nervous about COS212 because friends told him data structures are difficult. He opens Growth on his laptop the evening before a lecture so that he can be prepared. 

### What we assume they know

We only assume what the modules before COS212 teach.

- Basic programming knowledge in C++. This is covered by COS110 and COS132. 
- Knowledge of stacks and queues which COS212 covers before the tree content. 

### What we don't assume

- We don't assume the learner has seen any kind of tree.
- We do not assume the learner knows what recursion is.

## The performance gap
 
By the end of Growth the learner should be able to describe a binary search tree, carry out the four traversals by hand, check whether a tree is a valid AVL tree and fix an imbalance with the right rotation. The [Learning objectives](../objectives/) page lists the six course outcomes and every lesson objective.

 When most learners open Growth they can do none of the above. For them the gap exists because they haven’t reached the topic yet, not because of low motivation or a poor learning environment. Some students may be repeating COS212 and will have seen trees before. For them the gap is more likely about practice or understanding than about never having met the material, so Growth works as revision, and the skip-ahead test lets them move past what they already know. In both cases the gap can be closed before the lecture, which is the point of the app.
 
### Learners who already know some of it

Some students will have worked with trees before. We don't force them through every lesson. A locked lesson offers "Take the test to skip ahead", and passing that test completes every lesson up to it. The [Presentation](../presentation/) page covers this.

## Learning environment

### Where and when

Growth is used a COS212 lecture, on the learner's own time. There is no lecturer or tutor in the room, so the app has to do the explaining and the helping ([Scaffolding](../scaffolding/)). It is also self-paced. The learner can pause, step back and replay any animation, and there are no timers on lessons or tests.

### Devices

Growth is a web app, so it runs in the browser on whatever the learner has, whether that is a laptop, a phone or a tablet. The app is responsive with no sideways scrolling ([SE requirements](../../se/requirements/)). 

## Constraints
 
- We had around four weeks and a team of five ([Instructional design approach](../approach/)).
- Because of the time limit and having no access to students, we decided to stop at a beta. 
- We could not try the app with real COS212 students.
- We did not have the COS212 slides or textbook, so we could not check that our notation, code style and definitions match how the module teaches them.

## Content

The data structure is the AVL tree, and the algorithms are the traversals, insertion and deletion. A learner can't follow a rotation without knowing what a binary tree, a traversal and height are, so the course has two units.

| Unit | Lessons | Ends with |
| --- | --- | --- |
| 1. Binary trees and traversals | 1. What is a binary tree, 2. Pre-order, 3. In-order, 4. Post-order, 5. Level-order | 6. Traversal checkpoint |
| 2. AVL trees | 7. Height and balance factor, 8. Single rotations, 9. Double rotations, 10. Inserting into an AVL tree, 11. Deleting from an AVL tree | 12. AVL final challenge |

Each lesson is broken into tasks, and each task has its own objective. The [Learning objectives](../objectives/) page lists them. 

Each task is taught through learning activities. A lesson is a set of steps, and each step has one main activity:

- reading a short explanation next to a diagram of the tree
- watching an animation, such as a rotation
- stepping through a code trace with the call stack
- tapping the nodes of a tree in traversal order
- building a tree in the playground

Under each step, "Other ways to learn this" holds the same idea in another form ([Learning styles](../learning-styles/)). Every lesson ends with a note in the learner's own words and a five-question test. A checkpoint tests the whole unit before the next one opens.


### Existing materials

COS212 students should have a textbook and lecture slides. We did not have access to either, so Growth is not built from them. We took the topics and outcomes from CS2023 (Kumar et al., 2024), and wrote the lessons ourselves. 

## Goals 
 
The goal is that a COS212 student who works through Growth arrives at a lecture able to explain binary trees, traversals and to do AVL operations.
 
