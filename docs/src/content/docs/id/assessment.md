---
title: Assessment
description: How we check what students have learnt.
---

Every question in an assessment is written against a lesson objective, so the assessment, the activities and the outcomes line up, which is what constructive alignment asks for (Marshall, 2026). The [Learning objectives](../objectives/) page explains how the objectives themselves were written.

## Where learners are assessed

Learners are assessed in three places.

| Where | What it is | Stakes | What it decides |
| --- | --- | --- | --- |
| Inside a lesson | Tap tasks, traversal quizzes, write-in boxes, playground checks, the "Explain it in your own words" note | None. Nothing is scored | Nothing. The learner can always continue |
| Lesson test | Five questions drawn from the lesson's pool, 80% to pass | Low. It can be retaken | Whether the lesson is complete and the next one unlocks |
| Checkpoint | Five questions drawn from every lesson in the unit. Lesson 6 covers the traversals unit, and the final checkpoint draws from the whole course | Low. It can be retaken | Whether the unit is complete |

## Formative and summative

Formative assessment is used to monitor learning and usually has low stakes. Summative assessment evaluates the learning at the end of a programme and has high stakes (Marshall, 2026).

By that definition, everything in Growth is formative. Nothing the learner does here counts towards their COS212 mark, and the app is used before the lecture. We think that is correct for a pre-lecture tutor.

Within the app, though, the assessments play two roles. The checks inside a lesson are formative. They happen while the learner is still learning, give an answer on the spot and are not recorded. The lesson tests and checkpoints play the summative role within the course. They come at the end of a lesson or a unit, and they decide whether the learner moves on. The skip-ahead test is a third use of the same test. A learner who already knows a topic can choose "Take the test to skip ahead" from a locked lesson, and passing it completes every earlier lesson.

Criterion-referenced assessment measures work against a set of criteria. Our pass mark is a fixed criterion of 80%. Ipsative assessment compares a student with their own earlier performance, and the results page does this directly by showing mastery before and after the test. Norm-referenced assessment ranks students against each other. We did not include this type of assessment in the app (Marshall, 2026).

## Question types

The question format supports five kinds of question: multiple choice, short text, order nodes, build tree and predict rotation. The [question types storyboard](../storyboards/assessment/question-types/) shows how a learner answers each kind and how we got there. The traversal lessons use the first three. Build tree and predict rotation are for the AVL lessons.

There are two types of questions: written and generated. We wrote these by hand, and each received two or three hints, an explanation and a link to the lesson to review if the learner gets it wrong. Generated questions are built from a template with a fresh tree every time, at an easy, medium or hard level. The learner can see the same template twice and still get a different tree.

A test draws five questions at random from the pool and a retake draws five new ones. The generated questions are pitched to the learner and their difficulty is chosen when the test starts, from the learner's mastery of that lesson. Additionally, every answer updates that mastery for the next attempt.

## How the questions map to objectives and Bloom's

Each question stores its revised Bloom's level (Anderson and Krathwohl, 2001). The tables below give every written question in lessons 1 to 5, with the objective it tests. The generated templates take one row per lesson.

**Lesson 1: What is a binary tree**

| Question | Type | Bloom's | Objective |
| --- | --- | --- | --- |
| Which node is the root of this tree? | Multiple choice | Remember | Name the root, parents, children and leaves |
| Which of these nodes is a leaf? | Multiple choice | Remember | Name the root, parents, children and leaves |
| How many leaves does this tree have? | Text | Understand | Name the root, parents, children and leaves |
| Which node is the parent of 6? | Multiple choice | Understand | Name the root, parents, children and leaves |
| Which nodes are in the left subtree of 8? | Multiple choice | Understand | Find the left and right subtree of a node |
| What is the depth of 14? The root has depth 0. | Text | Apply | Work out the depth and the height of a node |
| Generated: the height of a node, easy to hard | Text | Apply | Work out the depth and the height of a node |
| You insert 5 into this search tree. Where does it go? | Multiple choice | Apply | Insert keys into a binary search tree |
| This is meant to be a binary search tree, but one key is in the wrong place. Which one? | Multiple choice | Analyse | Insert keys into a binary search tree |

**Lesson 2: Pre-order**

| Question | Type | Bloom's | Objective |
| --- | --- | --- | --- |
| preorder(20) has visited 20 and called preorder(10). Which line is preorder(20) paused at? | Multiple choice | Understand | Trace the recursive code and say which calls wait |
| Why do we copy a tree in pre-order? | Multiple choice | Understand | Explain why copying and prefix use pre-order |
| Tap the nodes of this tree in pre-order. | Order nodes | Apply | List the nodes in pre-order |
| Generated: the pre-order of a tree, easy to hard | Order nodes | Apply | List the nodes in pre-order |
| An expression tree has + at the root… Write it in prefix. | Text | Apply | Explain why copying and prefix use pre-order |
| Pre-order runs on this tree. Which calls are on the stack when 6 is visited? | Multiple choice | Analyse | Trace the recursive code and say which calls wait |

**Lesson 3: In-order**

| Question | Type | Bloom's | Objective |
| --- | --- | --- | --- |
| In-order does visit(node), inorder(node.left) and inorder(node.right). Which position is visit(node) in? | Multiple choice | Remember | Say how the in-order code differs from pre-order |
| Why does in-order give the keys of a search tree in sorted order? | Multiple choice | Understand | Explain why in-order gives sorted keys |
| Tap the nodes of this tree in in-order. | Order nodes | Apply | List the nodes in in-order |
| Write this tree's keys in in-order, with a comma and a space between each. | Text | Apply | List the nodes in in-order |
| Generated: the in-order of a tree, easy to hard | Order nodes | Apply | List the nodes in in-order |
| In-order runs on this tree. What is on the stack when 10 is visited? | Multiple choice | Analyse | Say how the in-order code differs from pre-order |

**Lesson 4: Post-order**

| Question | Type | Bloom's | Objective |
| --- | --- | --- | --- |
| Which order visits 8, the root, last? | Multiple choice | Remember | Compare pre-order, in-order and post-order |
| Why do we delete a whole tree in post-order? | Multiple choice | Understand | Explain why deleting and heights use post-order |
| Tap the nodes of this tree in post-order. | Order nodes | Apply | List the nodes in post-order |
| Generated: the post-order of a tree, easy to hard | Order nodes | Apply | List the nodes in post-order |
| An expression tree has + at the root… Write it in postfix. | Text | Apply | List the nodes in post-order |
| An expression tree for 7 − 2 × 3… What is its postfix form? | Multiple choice | Apply | List the nodes in post-order |

**Lesson 5: Level-order**

| Question | Type | Bloom's | Objective |
| --- | --- | --- | --- |
| A queue gives nodes back in which order? | Multiple choice | Remember | Explain why level-order uses a queue |
| Why does level-order use a queue instead of recursion? | Multiple choice | Understand | Explain why level-order uses a queue |
| Level-order starts with only 8 in the queue… What does the queue hold now, front first? | Multiple choice | Apply | Explain why level-order uses a queue |
| Tap the nodes of this tree in level-order. | Order nodes | Apply | List the nodes in level-order |
| Generated: the level-order of a tree, easy to hard | Order nodes | Apply | List the nodes in level-order |
| Which order visits 12 before it visits 2? | Multiple choice | Analyse | Compare level-order with the other three |

Across the 28 written questions the spread is five Remember, eight Understand, eleven Apply and four Analyse. Every generated question is Apply. That weighting was selected because CS2023 sets Apply as the skill level for traversals (Kumar et al., 2024), so most of the assessment is spent there. There are no Evaluate or Create questions in the traversal unit, for the reasons given on the objectives page.

Remember and Understand questions are mostly multiple choice, where the options can carry the common mistakes. Apply questions ask the learner to produce an answer, by tapping nodes in order or typing a sequence. The Analyse questions all use a tree the learner has to reason about.

## The feedback students get

Shute (2008, p. 154) defines formative feedback as "information communicated to the learner that is intended to modify his or her thinking or behavior for the purpose of improving learning". Hattie and Timperley (2007) frame good feedback around three questions the learner needs answered: where am I going, how am I going, and where to next. We used those three questions to check what Growth tells the learner.

### Where am I going?

The first step of every lesson lists its objectives under "What you'll learn", so the learner knows the target before any question is asked.

### How am I going?

Every test question is answered first and marked second. Shute (2008, p. 178) recommends giving feedback only after learners have attempted a solution, and the hint button is the only help offered before an answer is submitted. Feedback then comes immediately: either "Correct" or "Not quite", followed by an explanation of why. Immediate feedback suits our learners. Shute (2008, p. 180) recommends it for low achievers and for anyone learning a new task they find difficult, and a pre-lecture learner seeing content for the first time fits that description. Shute (2008, p. 159) reports that response-specific, elaborated feedback improves achievement more than simple right-or-wrong verification. Generated questions add "The correct answer, step by step", which replays the traversal on the learner's own tree in the step player. That follows another of their guidelines, not to limit feedback to text (Shute, 2008, p. 179).

### Where to next?

The results page shows "Passed" or "Not passed", the score, the points earned and the mastery change. If any answer was wrong, it lists "Topics to go over again", with a link back to each lesson involved.

### Hints

Each question has two or three hints, revealed one at a time with a "Hint (N left)" button, and each step is more specific than the last. Shute (2008, p. 179) warns against progressive hints that always end in the correct answer, because learners can use them to skip the thinking. Ours do not give away the full answer, but the third hint comes close. To stop learners leaning on hints, the button says "Using hints lowers your score.", and an answer given after hints earns fewer points and less mastery than one given without them.

### Feedback inside lessons

Inside the lessons the feedback is lighter and faster, because nothing is at stake. A wrong tap in a traversal task gets a message like "Not 6. Beat 3 is still open, try another node.", which tells the learner the tap was wrong without giving the right node away, and "Start again" clears the attempt. The traversal quizzes answer a wrong check with "Not quite. Try again." and offer "Show answers" once the learner has tried. In the playground, checking an order gives a message like "Place 3 is 10, not 6. Watch the walk to see where it goes.". Write-in boxes keep their answer hidden behind "Show answer", and say plainly that "Only you can see this. It isn't saved."

## References

Anderson, L.W. and Krathwohl, D.R. (eds.) (2001) *A taxonomy for learning, teaching, and assessing: a revision of Bloom's taxonomy of educational objectives*. New York: Longman.

Hattie, J. and Timperley, H. (2007) 'The power of feedback', *Review of Educational Research*, 77(1), pp. 81–112. doi: 10.3102/003465430298487.

Kumar, A.N., Raj, R.K. et al. (2024) *Computer Science Curricula 2023*. New York: Association for Computing Machinery. Available at: https://doi.org/10.1145/3664191 (Accessed: 12 November 2026).

Marshall, L. (2026) *L07 – Assessment of learning* [Lecture slides]. COS750: Educational Software Development, University of Pretoria.

Shute, V.J. (2008) 'Focus on formative feedback', *Review of Educational Research*, 78(1), pp. 153–189. doi: 10.3102/0034654307313795.
