---
title: Content design
description: How the content is chunked and ordered, and how each lesson is built.
---

## Chunking and ordering

### Across the course

The course goes from simple to complex. Unit 1 teaches plain binary search trees and the four traversals. Unit 2 builds the AVL tree on top of that. Each lesson only needs the lessons before it.

- Lesson 1 starts with a single node and builds up to a seven-node tree. No code appears until lesson 2.
- Lesson 7 starts from a plain binary search tree and shows it turning into a stick. Height and balance factor come from that problem.
- Single rotations come before double rotations, because a double rotation is two single ones.
- Rotations come before insertion and deletion. Lessons 10 and 11 then put rotations to work, so the learner already knows each piece.

Each unit ends with a checkpoint, lesson 6 and lesson 12, that tests the whole unit before the learner moves on.

### Across the traversals

Pre-order comes first because it is the most direct recursive traversal. The node is visited the moment the call starts. In-order uses the same code, and the lesson says so: "This is similar to the pre-order code with `visit(node)` on line 4 instead of line 3." Post-order moves the visit to the end. The learner only has to learn one new thing per lesson, which is where `visit(node)` goes.

Level-order comes last because it is the odd one out. It swaps recursion for a queue and a loop.

### Within a lesson

Each step teaches one idea. The [Learning theories](../theories/) page covers why, using Miller's limit on short-term memory. 

Most lesson trees have seven nodes. That is because it is large enough to show the pattern and small enough to follow, which the [Presentation](../presentation/#cognitive-load) page explains under cognitive load.

## Worked examples, visualisations and interactive steps

### Worked examples

Sweller and Cooper (1985) found that learners who studied worked examples learnt faster than learners who solved the same problems from scratch. Our learners haven't seen trees or recursion before ([Analysis](../learners/)). So every traversal lesson shows a worked example first. The code trace steps through the code line by line, with the call stack and the tree next to it, before the learner does any of it alone.

### Visualisations

Trees are easier to understand when you can see them, so every lesson step shows a diagram of the tree next to the text. In a code trace, the tree is shown next to the code.

We also draw the call stack. Recursion is hard to follow from the code alone, because the code doesn't show which calls are waiting. With the stack on screen, the learner can see each call wait and then finish. 

### Interactive steps

Watching isn't enough on its own. Hundhausen, Douglas and Stasko (2002) reviewed studies on algorithm visualisation and found that what learners do with a visualisation matters more than how good it looks. Learners who only watched an animation often did no better than learners who had none.

So the learner does something in most steps:

- steps the code trace forward and back at their own pace
- taps the nodes of a tree in traversal order
- builds a tree in the playground and runs a traversal on it
- answers a question before the next step, such as "Predict first"

## How a lesson follows Merrill's First Principles

Merrill (2002) looked at a range of instructional design models and found five principles they share. Learning is promoted when it is built around a real task, and when the learner's prior knowledge is activated, the new skill is demonstrated, the learner applies it and then integrates it into what they do. We used these as a check on each lesson.

| Principle | In Growth | Example |
| --- | --- | --- |
| Task-centred | Each lesson opens with what the algorithm is for or the problem it solves | Lesson 7, "Why balance matters", shows a stick tree where search is O(n) |
| Activation | The first steps connect to something the learner already knows | Lesson 2 recaps the stack from COS110. Lesson 3 compares its code to pre-order. Lesson 7 starts from a plain binary search tree |
| Demonstration | The rule, the code and a code trace with the call stack | Lesson 2 traces pre-order on a three-node tree, then "Why calls wait" shows only the tree and the stack |
| Application | The learner taps nodes, works through the bigger trace and takes the lesson test, with hints and feedback | The five-question test at the end of each lesson ([Assessment](../assessment/)) |
| Integration | The learner explains it in their own words and uses it somewhere new | The lesson 2 note asks "Why does preorder(8) stay on the stack while its left subtree runs?". The playground, and steps like "Where level-order is used" |

Integration is our weakest phase. Merrill means using the new skill in the learner's own work, and Growth keeps it inside the app. There is no task that asks the learner to write a traversal in Java. We left that to the COS212 practicals, since Growth is used before the lecture.

We chose Merrill over Gagné's Nine Events of Instruction. Gagné gives a finer checklist, but by the time we looked at both, our lessons were already split into rule, trace, use and practice. Merrill's phases matched that split, so it was easier to design against.

## References

Hundhausen, C.D., Douglas, S.A. and Stasko, J.T. (2002) 'A meta-study of algorithm visualization effectiveness', *Journal of Visual Languages and Computing*, 13(3), pp. 259–290.

Merrill, M.D. (2002) 'First principles of instruction', *Educational Technology Research and Development*, 50(3), pp. 43–59.

Sweller, J. and Cooper, G.A. (1985) 'The use of worked examples as a substitute for problem solving in learning algebra', *Cognition and Instruction*, 2(1), pp. 59–89.
