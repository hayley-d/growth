---
title: Alpha and beta
description: How far each item got in development and what we changed.
---

This page covers the iterative development phase of SAM 2, as described in [Instructional design approach](../approach/). The storyboards show how we designed each item. This page picks up after the design proof and shows what happened once the item was built.

## Alpha Testing

Each item was built into an alpha first. When we used the alpha and found something wrong, we fixed it, and the fixed version became the beta.

| Item | What we found | What we changed for the beta |
| --- | --- | --- |
| [Binary trees](../storyboards/lessons/binary-tree/) and traversals (lessons 1 to 5) | The trees in this unit were built as AVL trees, so they rebalanced themselves even though the learner hadn't learnt about AVL trees yet | Trees in the first unit are now plain binary search trees, in the lessons, the code traces and the generated questions |
| In-order test question | "In the in-order code, which line is visit(node) on?" could only be answered with the code in front of you, and the test doesn't show it | The question now asks if visit(node) comes 1st, 2nd or 3rd |
| [Playground](../storyboards/playground/playground/) | Checking a traversal compared the learner's answer to the keys in sorted order, so a correct pre-order was marked wrong. Nodes already in the tree couldn't be dragged, and the empty screen mentioned commands in hands-on mode, where there are none | The check uses the real traversal order, nodes in the tree can be moved, and the empty screen only says "Press New tree to start" |
| [Build tree questions](../storyboards/assessment/question-types/) | There was no way to remove a node placed by mistake, and big trees didn't fit in the code trace | We added a Delete button for the selected node and zoom for large trees |
| Practice mode | Practice changed the learner's mastery, and the summary showed raw ratings that meant nothing to a learner | Practice no longer changes mastery. The summary shows mastery before and after, and the session is drawn as a tree that grows with each answer |

## Beta test (14 November)

We ran the beta test ourselves. Each of us worked through Growth as if we were a new learner: onboarding, lesson 1 and its test, a traversal lesson, an AVL lesson, the playground, practice mode and the daily challenge. While working through it we noted anything that blocked us, any answer that was marked wrong when it was right, wording that was confusing and anything that was hard to use with a keyboard or a screen reader.

| Item | What we found in the beta test | What we changed |
| --- | --- | --- |
| [Build tree questions](../storyboards/assessment/question-types/) in practice mode | Nothing said how to rotate the tree. The rotate buttons only show up once a node is picked, so we didn't know where to start | We added an info tip next to the Insert button that explains how to pick a node to rotate or delete it |
| [Daily challenge](../motivation/#daily-challenge-and-leaderboard) with two accounts | After one of us finished the challenge, signing out and in as someone else showed the challenge as done for them too. The app kept the first learner's data in the browser after the switch, and progress and practice could leak the same way | The app now drops everything it has stored for the last learner when they sign out or someone else signs in |
| [Daily challenge](../motivation/#daily-challenge-and-leaderboard) | There was no way to leave the challenge once it was open | We added a close button, like the one on lesson tests. If the clock is running, it first warns that the clock keeps going and that there is still only one go |
| [Daily challenge](../motivation/#daily-challenge-and-leaderboard) start screen | The screen said a clock would run, but not that the time only appears on the leaderboard if you turn it on, or that it never affects mastery. Those are the reasons we give for allowing a timer at all | We added a line saying both, with a link to Settings, set out the rules with an icon and words each, and renamed the button "Start the clock" |
| [Playground](../storyboards/playground/playground/) setup preview | A deep, lopsided random tree grew past the bottom of the preview box and covered the chips that show the traversal order | The preview tree now shrinks to fit its box, however deep it is |
| [Lesson 8 and 9 tests](../storyboards/lessons/rotations/) | The "which rotation fixes it" questions asked us to insert or delete a key first. Deleting isn't taught until lesson 11, and inserting into an AVL tree isn't taught until lesson 10 | These questions now show a tree that is already out of balance and only ask which rotation fixes it and where. Insert questions start in lesson 10 and delete questions in lesson 11, and a test checks this |
| [Lesson 8 test](../storyboards/lessons/rotations/) | "What key is the new root?" only described the tree in words, so we had to picture it ourselves | The question now draws the tree before the rotation |
| [Lesson 1](../storyboards/lessons/binary-tree/) subtrees | The picture of the subtrees only showed after the text, so we had to go back and forth. The picture also marked 8 as part of the left subtree, but the text and the test question say it is 4, 2 and 6 | The text and the picture are now one slide. The words "left subtree" and "right subtree" light up their nodes in the tree, and 8 is no longer marked |

The biggest limitation is that we already know the content. A real learner seeing binary trees for the first time will get stuck in places we won't, so this test is better at finding bugs than at telling us whether Growth teaches well.

## Why we stopped here

SAM says the beta should be tested with real learners before the gold version is built. We didn't have access to COS212 students in the time we had, and Growth is a prototype, so we stopped at beta. If we carried on, the next step would be a beta test with COS212 students before their lecture, and then a gold version once we had worked through their feedback. The [Evaluation](../evaluation/) page describes how we would run that test.
