---
title: Alpha and beta
description: How far each item got in development and what we changed.
---

This page covers the iterative development phase of SAM 2, as described in [Instructional design approach](../approach/). The storyboards show how we designed each item. This page picks up after the design proof and shows what happened once the item was built.

## Where each item got to

Each item was built into an alpha first. When we used the alpha and found something wrong, we fixed it, and the fixed version became the beta.

| Item | Stage | What we found in the alpha | What we changed for the beta |
| --- | --- | --- | --- |
| [Binary trees](../storyboards/lessons/binary-tree/) and traversals (lessons 1 to 5) | Beta | The trees in this unit were built as AVL trees, so they rebalanced themselves even though the learner hadn't learnt about AVL trees yet | Trees in the first unit are now plain binary search trees, in the lessons, the code traces and the generated questions |
| In-order test question | Beta | "In the in-order code, which line is visit(node) on?" could only be answered with the code in front of you, and the test doesn't show it | The question now asks if visit(node) comes 1st, 2nd or 3rd |
| [Playground](../storyboards/playground/playground/) | Beta | Checking a traversal compared the learner's answer to the keys in sorted order, so a correct pre-order was marked wrong. Nodes already in the tree couldn't be dragged, and the empty screen mentioned commands in hands-on mode, where there are none | The check uses the real traversal order, nodes in the tree can be moved, and the empty screen only says "Press New tree to start" |
| [Build tree questions](../storyboards/assessment/question-types/) | Beta | There was no way to remove a node placed by mistake, and big trees didn't fit in the code trace | We added a Delete button for the selected node and zoom for large trees |
| Practice mode | Beta | Practice changed the learner's mastery, and the summary showed raw ratings that meant nothing to a learner | Practice no longer changes mastery. The summary shows mastery before and after, and the session is drawn as a tree that grows with each answer |
| Lessons 6 to 12, code trace and step player | Alpha | These are tested in the beta test on 14 November | |

The results of the beta test go below, and any fixes that come out of it will be added to this table.

## Beta test (14 November)

We ran the beta test ourselves. Each of us worked through Growth as if we were a new learner: onboarding, lesson 1 and its test, a traversal lesson, an AVL lesson, the playground and practice mode. While working through it we noted anything that blocked us, any answer that was marked wrong when it was right, wording that was confusing and anything that was hard to use with a keyboard or a screen reader.

The biggest limitation is that we already know the content. A real learner seeing binary trees for the first time will get stuck in places we won't, so this test is better at finding bugs than at telling us whether Growth teaches well.

:::note[To write]
- What we found
- What we fixed, and what we left and why
:::

## Why we stopped here

SAM says the beta should be tested with real learners before the gold version is built. We didn't have access to COS212 students in the time we had, and Growth is a prototype, so we stopped at beta. If we carried on, the next step would be a beta test with COS212 students before their lecture, and then a gold version once we had worked through their feedback. The [Evaluation](../evaluation/) page describes how we would run that test.
