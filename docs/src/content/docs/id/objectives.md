---
title: Learning objectives
description: What students should be able to do after using the app.
---

Each lesson has a short list of things the learner should be able to do by the end of it. The wording on this page is the same as the `objectives` list in each lesson's content file, and the learner sees the same list in the "What you'll learn" box at the start of every lesson. This aligns with constructive alignment which says that learning outcomes should be defined before the learning takes place (Biggs, n.d).

The questions that test them are described in [Assessment: Question types](../storyboards/assessment/question-types/).

## How we wrote them

A learning outcome should be observable and measurable. Each outcome should contain three parts: an action verb, a topic, and the level of mastery expected (Marshall, 2026). We wrote every objective that way. "List the nodes of a tree in post-order" starts with the action, names the topic, and the mastery is implied by the task. 

Each objective also had to be testable inside the app. Again considering constructive alignment where teaching should optimise the student's chance of achieving the outcomes (Biggs, n.d). The outcome, the activity that teaches it and the assessment that checks it all point at the same thing (Marshall, 2026). If we couldn't think of a question the app could mark for an objective, we rewrote the objective.

To decide how hard each objective is, we used the revised Bloom's taxonomy. It has six levels of cognitive process: Remember, Understand, Apply, Analyse, Evaluate and Create (Anderson and Krathwohl, 2001). Every question in the app stores one of these levels in its `bloomsLevel` field, so the level is part of the data, not only part of this document.

Bloom's isn't always easy to apply to computing tasks. Thompson et al. (2008) found that teachers often disagree about the level of the same programming question. They suggest judging a question by what the learner actually has to do to answer it, not by the verb in the question. We followed that advice. Tracing code, for example, can be Apply or Analyse, depending on whether the learner simply follows the steps or has to stop and reason about the state of the program at a given point.

## Where this sits in CS2023

The AVL tree belongs to the ACM/IEEE-CS/AAAI Computer Science Curricula 2023 (CS2023), in the knowledge unit **AL-Foundational: Foundational Data Structures and Algorithms**. That unit is CS Core, which means CS2023 expects every computer science graduate to cover it (Kumar et al., 2024). The SE document's [introduction](../../se/introduction/) gives the same reference.

The app covers these CS Core topics from that unit:

| Code | CS2023 topic (quoted) | Where we cover it |
| --- | --- | --- |
| 1a | "Dictionary operations (insert, delete, find)" | BST insert in lesson 1, AVL insert and delete in lessons 10 and 11 |
| 9a | "Binary, n-ary, and search trees" | Lesson 1 and the traversals (binary and search trees only) |
| 9b | "Balanced (e.g., AVL, Red-Black, Heap)" | All of unit 2, AVL only |
| 11c | "uninformed depth/breadth-first tree search" | Pre-, in- and post-order as depth-first, level-order as breadth-first |

The illustrative learning outcomes (ILOs) we target are numbered as they are in CS2023 (Kumar et al., 2024):

| Code | CS2023 illustrative learning outcome (quoted) |
| --- | --- |
| ILO 1a | "Explain its definition, properties, representation(s), and associated ADT operations." |
| ILO 1b | "Explain step-by-step how the ADT operations associated with the data structure transform it." |
| ILO 2 | "For each algorithm in this unit explain step-by-step how the algorithm operates." |

CS2023 has its own four skill levels, and it lines them up with revised Bloom's. **Explain** covers Remember and Understand. **Apply** matches Apply. **Evaluate** covers Analyse and Evaluate. **Develop** matches Create. It also states that "Explain is the pre-requisite skill for the other three levels" (Kumar et al., 2024). This table is what lets us connect each objective's Bloom's level to a CS2023 skill level.

CS2023 also recommends a skill level for each core topic. Trees (topic 9) should reach Explain. Depth-first and breadth-first search (11c) should reach Apply. Balanced trees (9b) should reach Apply, with three hours suggested (Kumar et al., 2024). Our objectives meet each of these. Most of the AVL objectives go a step further, to Analyse, which CS2023 counts as Evaluate.

Some things we leave out on purpose. ILO 4 asks learners to develop several solutions to a problem and evaluate them against each other. That needs open-ended design work, and it belongs in a full course rather than a tutor for one data structure. 

## Course outcomes

Marshall (2026) suggests keeping the number of outcomes manageable, at five to eight. Across twelve lessons we have far more lesson objectives than that, so we grouped them under six course outcomes. Every lesson objective serves one of these.

After finishing Growth, the learner will be able to:

1. Describe a binary tree and a binary search tree using the correct terms: root, parent, child, leaf, subtree, depth and height. *(Understand · ILO 1a)*
2. Carry out the four traversals by hand and trace the code that runs them. *(Apply · ILO 2)*
3. Explain which traversal suits a task, such as copying a tree, deleting one or printing keys in sorted order. *(Understand · ILO 2)*
4. Check whether a tree is a valid AVL tree using heights and balance factors. *(Evaluate · ILO 1a)*
5. Identify each of the four imbalance cases and fix it with the right rotation. *(Analyse and Apply · ILO 1b)*
6. Insert keys into and delete keys from an AVL tree step by step, keeping it balanced. *(Apply · ILO 1b, topic 1a)*

## Binary trees and traversals

The CS2023 column gives the topic code and then the ILO, using the codes in the tables above.

| Lesson | Objective | Bloom's | CS2023 |
| --- | --- | --- | --- |
| 1. What is a binary tree | Name the root, parents, children and leaves of a binary tree | Remember | 9a · ILO 1a |
| | Say what a subtree is and find the left and right subtree of a node | Understand | 9a · ILO 1a |
| | Work out the depth and the height of a node | Apply | 9a · ILO 1a |
| | Insert keys into a binary search tree by going left for smaller keys and right for bigger ones | Apply | 9a, 1a · ILO 1b |
| 2. Pre-order | List the nodes of a tree in pre-order | Apply | 11c · ILO 2 |
| | Trace the recursive pre-order code and say which calls wait on the call stack | Analyse | 11c, 5 · ILO 2 |
| | Explain why copying a tree and prefix expressions use pre-order | Understand | 11c · ILO 2 |
| 3. In-order | List the nodes of a tree in in-order | Apply | 11c · ILO 2 |
| | Say how the in-order code differs from the pre-order code | Understand | 11c · ILO 2 |
| | Explain why the in-order of a search tree gives its keys in sorted order | Understand | 9a, 11c · ILO 1a |
| 4. Post-order | List the nodes of a tree in post-order | Apply | 11c · ILO 2 |
| | Explain why deleting a whole tree and working out heights use post-order | Understand | 11c · ILO 2 |
| | Compare pre-order, in-order and post-order on one tree | Analyse | 11c · ILO 2 |
| 5. Level-order | List the nodes of a tree in level-order | Apply | 11c · ILO 2 |
| | Explain why level-order uses a queue and a loop instead of recursion | Understand | 11c, 6 · ILO 2 |
| | Compare level-order with pre-order, in-order and post-order on one tree | Analyse | 11c · ILO 2 |
| 6. Traversal checkpoint | Tell the four traversals apart | Analyse | 11c · ILO 2 |

Some of these levels need a reason.

Listing the nodes in a traversal is Apply, not Remember. The learner can't recall the answer, because every question uses a tree they haven't seen before. They have to carry out the procedure on it. CS2023 lists "trace" as an Apply verb for the same reason (Kumar et al., 2024).

Tracing the recursive code is marked Analyse because of the second half of the objective. Saying which calls are waiting on the stack when a particular node is visited means splitting one run into its parts and reasoning about the state at that moment. Following the code line by line would be Apply. Stopping it partway and explaining the state is Analyse (Thompson et al., 2008).

"Say how the in-order code differs from the pre-order code" is Understand rather than Analyse. The two functions differ by one line. Spotting that difference is a matter of reading the code with understanding.

"Tell the four traversals apart" is Analyse. The checkpoint gives the learner an output and asks which traversal produced it, so they have to distinguish between four procedures that look alike. "Distinguish" and "differentiate" are Analyse verbs in revised Bloom's, and they appear under Evaluate in the CS2023 table (Kumar et al., 2024).

## AVL trees

| Lesson | Objective | Bloom's | CS2023 |
| --- | --- | --- | --- |
| 7. Height and balance factor | Explain why a binary search tree built from sorted keys makes search time O(n) | Understand | 9a, 9b · ILO 1a |
| | Work out the height of a node or tree (a leaf has height 1, empty has height 0) | Apply | 9b · ILO 1a |
| | Work out the balance factor of a node as left height minus right height | Apply | 9b · ILO 1a |
| | Say whether a tree is a valid AVL tree by checking that every balance factor is -1, 0 or 1 | Evaluate | 9b · ILO 1a |
| 8. Single rotations | Recognise a left-left and a right-right imbalance from the balance factors | Analyse | 9b · ILO 1b |
| | Do a right rotation and a left rotation, saying which node moves up and where the inner subtree goes | Apply | 9b · ILO 1b |
| | Explain why a rotation keeps the keys in sorted (in-order) order | Understand | 9b, 11c · ILO 1a |
| 9. Double rotations | Recognise a left-right and a right-left imbalance from the balance factors of a node and its taller child | Analyse | 9b · ILO 1b |
| | Do a left-right and a right-left double rotation, saying which rotation happens first and which node becomes the new root of the subtree | Apply | 9b · ILO 1b |
| | Explain why a single rotation can't fix a left-right or right-left imbalance | Understand | 9b · ILO 1a |
| 10. Inserting into an AVL tree | Insert a key as in a binary search tree, then update the heights on the way back up to the root | Apply | 9b, 1a · ILO 1b |
| | Find the lowest unbalanced node after an insert and name its imbalance case | Analyse | 9b · ILO 1b |
| | Explain why one rotation, single or double, is enough to rebalance the tree after an insert | Understand | 9b · ILO 1a |
| 11. Deleting from an AVL tree | Delete a leaf, a node with one child and a node with two children, using the in-order successor for the last | Apply | 9b, 1a · ILO 1b |
| | Rebalance every unbalanced node on the path from the deleted node back to the root | Apply | 9b · ILO 1b |
| | Explain why a delete can need more than one rotation when an insert needs at most one | Understand | 9b · ILO 1a |
| 12. AVL final challenge | Insert, delete and rotate in one AVL tree | Apply | 9b, 1a · ILO 1b |

The AVL unit has the only Evaluate objective in the course: deciding whether a tree is a valid AVL tree. Anderson and Krathwohl (2001) place *checking* under Evaluate, which means judging something against a set criterion. That is exactly this task. The learner computes every balance factor and then makes a yes-or-no judgement against the AVL rule.

Recognising an imbalance case is Analyse for a similar reason. The learner has to look at the balance factors of a node and its child, and from them work out which of four cases they are in. Doing the rotation once the case is known is Apply. We kept these as separate objectives on purpose. A learner who can perform a right rotation but picks the wrong one for the tree has a different gap from one who can't rotate at all, and the test feedback should be able to tell them apart.

## What each level looks like in a question

Every written question in the content files has a Bloom's level. These are real prompts from the app, one for each level we use:

| Bloom's | Question prompt | Lesson | Why this level |
| --- | --- | --- | --- |
| Remember | "In the in-order code, which line is visit(node) on?" | 3 | The answer is a fact the learner has seen and can recall directly. |
| Understand | "Why does in-order give the keys of a search tree in sorted order?" | 3 | The learner has to explain the connection between the search tree rule and the traversal. |
| Apply | "Tap the nodes of this tree in in-order." | 3 | The learner runs the procedure on a new tree. |
| Analyse | "In-order runs on this tree. What is on the stack when 10 is visited?" | 3 | The learner stops a run partway and reasons about its state. |
| Analyse | "This is meant to be a binary search tree, but one key is in the wrong place. Which one?" | 1 | The learner has to check each part of the tree against the rule to find the one that breaks it. |

Generated questions, which the app builds fresh from a random tree each time, are all Apply. They ask for a traversal order or a height on a tree the learner hasn't seen, and that is a procedure, not a recall task.

The level also decides what kind of question works best. Remember and Understand fit multiple choice and short text answers. Apply fits the tap-to-order questions, where the learner taps nodes in sequence. The AVL lessons are planned to use the build-tree and predict-rotation question types, which suit Apply and Analyse. The [Assessment](../assessment/) page covers the question types in more detail.

## The levels climb

Within each unit the objectives move up the taxonomy. Lesson 1 starts with naming parts of a tree, which is Remember, and ends with inserting into a search tree, which is Apply. The traversal lessons each start with listing, which is Apply, and end with comparing, which is Analyse. The AVL unit starts with working out heights and ends with full inserts and deletes.

This order is deliberate. Marshall (2026) notes that each Bloom's level must be mastered in order, and CS2023 makes the same point in its own terms. 

## Skipping ahead

Two lessons are checkpoints. A learner who can already do what a checkpoint tests can take it early from the skill map, without working through the lessons first. 

## References

Anderson, L.W. and Krathwohl, D.R. (eds.) (2001) *A taxonomy for learning, teaching, and assessing: a revision of Bloom's taxonomy of educational objectives*. New York: Longman.

Biggs, J. (n.d) *Constructive Alignment in university teaching*. University of Hong Kong.

Kumar, A.N., Raj, R.K. et al. (2024) *Computer Science Curricula 2023*. New York: Association for Computing Machinery. Available at: https://doi.org/10.1145/3664191 (Accessed: 12 November 2026).

Marshall, L. (2026) *L07 – Assessment of learning* [Lecture slides]. COS750: Educational Software Development, University of Pretoria.

Thompson, E., Luxton-Reilly, A., Whalley, J.L., Hu, M. and Robbins, P. (2008) 'Bloom's taxonomy for CS assessment', *Proceedings of the Tenth Australasian Computing Education Conference (ACE 2008)*, Wollongong, Australia. CRPIT 78, pp. 155–161.
