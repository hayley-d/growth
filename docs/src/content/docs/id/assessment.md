---
title: Assessment
description: How we check what students have learnt.
---

Every question in an assessment is written against a lesson objective, so the assessment, the activities and the outcomes line up, which is what constructive alignment asks for (Marshall, 2026c). The [Learning objectives](../objectives/) page explains how the objectives themselves were written.

## Where learners are assessed

Learners are assessed in three places.

| Where | What it is | Stakes | What it decides |
| --- | --- | --- | --- |
| Inside a lesson | Tap tasks, traversal quizzes, write-in boxes, playground checks, the "Explain it in your own words" note | None. Nothing is scored | Nothing. The learner can always continue |
| Lesson test | Five questions drawn from the lesson's pool, 80% to pass | Low. It can be retaken | Whether the lesson is complete and the next one unlocks |
| Checkpoint | Five questions drawn from every lesson in the unit. Lesson 6 covers the traversals unit, and the final checkpoint draws from the whole course | Low. It can be retaken | Whether the unit is complete |

## Formative and summative

Formative assessment is used to monitor learning and usually has low stakes. Summative assessment evaluates the learning at the end of a programme and has high stakes (Marshall, 2026c).

By that definition, everything in Growth is formative. Nothing the learner does here counts towards their COS212 mark, and the app is used before the lecture. We think that is correct for a pre-lecture tutor.

Within the app, though, the assessments play two roles. The checks inside a lesson are formative. They happen while the learner is still learning, give an answer on the spot and are not recorded. The lesson tests and checkpoints play the summative role within the course. They come at the end of a lesson or a unit, and they decide whether the learner moves on. The skip-ahead test is a third use of the same test. A learner who already knows a topic can choose "Take the test to skip ahead" from a locked lesson, and passing it completes every earlier lesson.

Criterion-referenced assessment measures work against a set of criteria. Our pass mark is a fixed criterion of 80%. Ipsative assessment compares a student with their own earlier performance, and the results page does this directly by showing mastery before and after the test. Norm-referenced assessment ranks students against each other. We did not include this type of assessment in the app (Marshall, 2026c).

## Question types

The question format supports five kinds of question: multiple choice, short text, order nodes, build tree and predict rotation. The [question types storyboard](../storyboards/assessment/question-types/) shows how a learner answers each kind and how we got there. The traversal lessons use the first three. Build tree and predict rotation are for the AVL lessons.

There are two types of questions: written and generated. We wrote these by hand, and each received two or three hints, an explanation and a link to the lesson to review if the learner gets it wrong. Generated questions are built from a template with a fresh tree every time, at an easy, medium or hard level. The learner can see the same template twice and still get a different tree.

A test draws five questions at random from the pool and a retake draws five new ones. The generated questions are pitched to the learner and their difficulty is chosen when the test starts, from the learner's mastery of that lesson. Additionally, every answer updates that mastery for the next attempt.

## How the questions map to objectives and Bloom's

Each question stores its revised Bloom's level (Anderson and Krathwohl, 2001). The tables below give every written question in lessons 1 to 5 and 7 to 11, with the objective it tests. The generated templates take one row per lesson. The two checkpoints, lesson 6 and lesson 12, draw on the lessons before them and have one objective each, so we summarise them by what they test instead.

**Lesson 1: What is a binary tree**

| Question | Type | Bloom's | Objective |
| --- | --- | --- | --- |
| Which node is the root of this tree? | Multiple choice | Remember | Name the root, parents, children and leaves |
| Which of these nodes is a leaf? | Multiple choice | Remember | Name the root, parents, children and leaves |
| How many leaves does this tree have? | Text | Remember | Name the root, parents, children and leaves |
| Which node is the parent of 6? | Multiple choice | Remember | Name the root, parents, children and leaves |
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
| In-order runs on this tree. What is on the stack when 10 is visited? | Multiple choice | Analyse | Trace the recursive in-order code and say which calls wait |

**Lesson 4: Post-order**

| Question | Type | Bloom's | Objective |
| --- | --- | --- | --- |
| Which two orders visit 2 before 4 on this tree? | Multiple choice | Analyse | Compare pre-order, in-order and post-order |
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

Across the 28 written questions the spread is six Remember, six Understand, eleven Apply and five Analyse. Every generated question in this unit is Apply. That weighting was selected because CS2023 sets Apply as the skill level for traversals (Kumar et al., 2024), so most of the assessment is spent there. There are no Evaluate or Create questions in the traversal unit, for the reasons given on the objectives page.

Remember and Understand questions are mostly multiple choice, where the options can carry the common mistakes. Apply questions ask the learner to produce an answer, by tapping nodes in order or typing a sequence. The Analyse questions all use a tree the learner has to reason about.

**Lesson 6: Traversal checkpoint**

The checkpoint's objective is "Tell the four traversals apart". It also brings back the terms and heights from lesson 1, because the AVL unit needs them.

| What it tests | Questions | Bloom's |
| --- | --- | --- |
| Tap the nodes of a tree in one of the four orders | 6 written | Apply |
| A traversal visits the nodes in this order. Which traversal is it? | 3 written | Analyse |
| Given two traversals of a tree, find the right child of the root | 2 written | Analyse |
| Terms and heights: what a leaf is, a left subtree, counting leaves, the height of a tree | 4 written | Remember, Understand, Apply |
| Generated: the four traversal orders and the height of a tree, medium and hard | 10 generated | Apply |

**Lesson 7: Height and balance factor**

| Question | Type | Bloom's | Objective |
| --- | --- | --- | --- |
| You insert 1, 2, 3, 4 into a plain binary search tree with no rebalancing. Why can search become O(n)? | Multiple choice | Understand | Explain why sorted keys make search O(n) |
| What is the height of this tree? | Text | Apply | Work out the height of a node or tree |
| Generated: the height of a tree, easy and hard | Text | Apply | Work out the height of a node or tree |
| What is the balance factor of node 20? | Text | Apply | Work out the balance factor of a node |
| Generated: the balance factor of a node, easy and hard | Text | Apply | Work out the balance factor of a node |
| Which statement is the AVL balance rule? | Multiple choice | Understand | Say whether a tree is a valid AVL tree |
| Generated: is this an AVL tree? Easy | Multiple choice | Understand | Say whether a tree is a valid AVL tree |
| This tree came from inserting 1, 2, 3, 4 with no rebalancing. Is it a valid AVL tree? | Multiple choice | Evaluate | Say whether a tree is a valid AVL tree |
| Generated: is this an AVL tree? Hard | Multiple choice | Analyse | Say whether a tree is a valid AVL tree |

**Lesson 8: Single rotations**

| Question | Type | Bloom's | Objective |
| --- | --- | --- | --- |
| Tree 30 with left child 20 with left child 10, after one right rotation at 30. What is the new root? | Text | Remember | Do a right rotation and a left rotation |
| A node has balance factor +2 and its left child has +1. Which one rotation fixes it? | Multiple choice | Understand | Recognise a left-left and a right-right imbalance |
| Generated: predict the rotation, when no rotation is needed | Predict rotation | Understand | Recognise a left-left and a right-right imbalance |
| Insert 10 into this AVL tree. Which rotation fixes it, and which node is the pivot? | Predict rotation | Apply | Recognise a left-left and a right-right imbalance |
| Insert 80 into this AVL tree. Which rotation fixes it, and which node is the pivot? | Predict rotation | Apply | Recognise a left-left and a right-right imbalance |
| Generated: predict the rotation, single rotation | Predict rotation | Apply | Recognise a left-left and a right-right imbalance |
| 50 leans too far left. Rotate it to fix the tree. | Build tree | Apply | Do a right rotation and a left rotation |
| 50 leans too far right. Rotate it to fix the tree. | Build tree | Apply | Do a right rotation and a left rotation |
| Only one node in this tree is unbalanced. Rotate it to fix the tree. | Build tree | Apply | Do a right rotation and a left rotation |
| Why is the tree still a valid search tree after a rotation? | Multiple choice | Analyse | Explain why a rotation keeps the keys sorted |

**Lesson 9: Double rotations**

| Question | Type | Bloom's | Objective |
| --- | --- | --- | --- |
| Tree 30 with left child 10, and 10 has right child 20. After the double rotation, what is the new root? | Text | Remember | Do a left-right and a right-left double rotation |
| A node has balance factor +2 and its left child has −1. Which rotations fix it? | Multiple choice | Understand | Recognise a left-right and a right-left imbalance |
| Insert 25 into this AVL tree. Which rotation fixes it, and which node is the pivot? | Predict rotation | Apply | Recognise a left-right and a right-left imbalance |
| Insert 55 into this AVL tree. Which rotation fixes it, and which node is the pivot? | Predict rotation | Apply | Recognise a left-right and a right-left imbalance |
| Generated: predict the rotation, single, mixed and double | Predict rotation | Apply | Recognise a left-right and a right-left imbalance |
| Generated: predict the rotation, hardest double | Predict rotation | Analyse | Recognise a left-right and a right-left imbalance |
| After a delete, a node has balance factor −2 and its right child has 0. Which rotations fix it? | Multiple choice | Analyse | Recognise a left-right and a right-left imbalance |
| 50 is unbalanced, and the path down from it turns. Rotate to fix the tree. | Build tree | Apply | Do a left-right and a right-left double rotation |
| 30 is unbalanced, and the path down from it turns. Rotate to fix the tree. | Build tree | Apply | Do a left-right and a right-left double rotation |
| Only one node in this tree is unbalanced. Rotate to fix the tree. | Build tree | Apply | Do a left-right and a right-left double rotation |
| A node is left-right. Why does one right rotation on the node not fix it? | Multiple choice | Analyse | Explain why a single rotation can't fix a left-right or right-left imbalance |

**Lesson 10: Inserting into an AVL tree**

| Question | Type | Bloom's | Objective |
| --- | --- | --- | --- |
| What is the order of an AVL insert? | Multiple choice | Remember | Insert a key and update the heights on the way up |
| You insert 3 and update the heights, but don't rebalance yet. What is the balance factor of 10? | Text | Apply | Insert a key and update the heights on the way up |
| 35 was just inserted. In which order does the code check the nodes as it walks back up? | Multiple choice | Apply | Insert a key and update the heights on the way up |
| Insert 45 into this AVL tree and rebalance if needed. Build the tree you get. | Build tree | Apply | Insert a key and update the heights on the way up |
| Generated: insert a key and build the tree you get, easy to hard | Build tree | Apply | Insert a key and update the heights on the way up |
| 5 was just inserted. Walking up from 5, which node do you fix first? | Multiple choice | Apply | Find the lowest unbalanced node and name its case |
| Insert 5 into this AVL tree. Which rotation fixes it, and which node is the pivot? (No rotation needed) | Predict rotation | Apply | Find the lowest unbalanced node and name its case |
| Insert 25 into this AVL tree. Which rotation fixes it, and which node is the pivot? (Single rotation) | Predict rotation | Apply | Find the lowest unbalanced node and name its case |
| Generated: predict the rotation after an insert, easy and medium | Predict rotation | Apply | Find the lowest unbalanced node and name its case |
| Insert 35 into this AVL tree. Which rotation fixes it, and which node is the pivot? (Double rotation) | Predict rotation | Analyse | Find the lowest unbalanced node and name its case |
| Generated: predict the rotation after an insert, hard | Predict rotation | Analyse | Find the lowest unbalanced node and name its case |
| You insert one key into a valid AVL tree. At most how many rebalancing fixes does it need? | Multiple choice | Understand | Explain why one rotation is enough after an insert |

**Lesson 11: Deleting from an AVL tree**

| Question | Type | Bloom's | Objective |
| --- | --- | --- | --- |
| You delete 40 from this tree. What happens to it? | Multiple choice | Remember | Delete a leaf, a node with one child and a node with two children |
| You delete 40, the root. Which key takes its place? | Multiple choice | Apply | Delete a leaf, a node with one child and a node with two children |
| You delete 50, the root, from this tree. Which key takes its place? | Text | Apply | Delete a leaf, a node with one child and a node with two children |
| Delete 40 from this AVL tree and rebalance if needed. Build the tree you get. | Build tree | Apply | Delete a leaf, a node with one child and a node with two children |
| Generated: delete a key and build the tree you get, easy to hard | Build tree | Apply | Delete a leaf, a node with one child and a node with two children |
| Delete 50 from this AVL tree and rebalance if needed. Build the tree you get. | Build tree | Apply | Rebalance every unbalanced node on the way back up |
| After a delete, a node has balance factor −2 and its right child has 0. Which fix needs the fewest rotations? | Multiple choice | Understand | Rebalance every unbalanced node on the way back up |
| Delete 10 from this AVL tree. Which rotation fixes it, and which node is the pivot? (No rotation needed) | Predict rotation | Apply | Rebalance every unbalanced node on the way back up |
| Delete 20 from this AVL tree. Which rotation fixes it, and which node is the pivot? (Single rotation) | Predict rotation | Apply | Rebalance every unbalanced node on the way back up |
| Generated: predict the rotation after a delete, easy and medium | Predict rotation | Apply | Rebalance every unbalanced node on the way back up |
| Delete 20 from this AVL tree. Which rotation fixes it, and which node is the pivot? (Double rotation) | Predict rotation | Analyse | Rebalance every unbalanced node on the way back up |
| Delete 60 from this AVL tree. Which rotation fixes it, and which node is the pivot? (Child is balanced) | Predict rotation | Analyse | Rebalance every unbalanced node on the way back up |
| Generated: predict the rotation after a delete, hard | Predict rotation | Analyse | Rebalance every unbalanced node on the way back up |
| A rotation leaves the fixed subtree one level shorter. What does that mean for the nodes above it? | Multiple choice | Understand | Explain why a delete can need more than one rotation |

**Lesson 12: AVL final challenge**

The final challenge's objective is "Insert, delete and rotate in one AVL tree". It has 30 written questions and 21 generated ones, spread over the whole course.

| What it tests | Written | Generated | Bloom's |
| --- | --- | --- | --- |
| The AVL rule and balance factors | 4 | 6 | Understand, Apply, Analyse, Evaluate |
| Single rotations | 4 | | Understand, Apply |
| Double rotations | 5 | | Remember, Understand, Apply, Analyse |
| Inserting | 6 | 3 | Understand, Apply, Analyse |
| Deleting | 7 | 3 | Remember, Apply, Analyse, Evaluate |
| Predicting the rotation | | 3 | Apply, Analyse |
| Traversals and heights from unit 1 | 4 | 6 | Understand, Apply |

Across the 42 written questions in lessons 7 to 11 the spread is four Remember, seven Understand, twenty-four Apply, six Analyse and one Evaluate. CS2023 sets Apply as the skill level for balanced trees (Kumar et al., 2024), so again most of the assessment is spent there. Most of the AVL questions ask the learner to build the tree they get or to predict the rotation, because in this unit the learner has to produce a result rather than recognise one. The Analyse questions are mostly the harder predict-rotation questions, where the learner has to work out the imbalance case before they can say what fixes it. This matches the reason we split "recognise the case" from "do the rotation" on the objectives page.

Unlike the traversal unit, not every generated AVL question is Apply. The easy "Is this an AVL tree?" questions are Understand, and the hard balance factor, "Is this an AVL tree?" and predict-rotation questions are Analyse.

The objectives page lists "Say whether a tree is a valid AVL tree" as the only Evaluate objective. Lesson 7 builds up to it with Understand and Analyse questions and then tests it at the Evaluate level. That question gives the learner a tree built from 1, 2, 3, 4 with no rebalancing and asks if it is a valid AVL tree, so the learner has to judge the tree against the AVL rule. The final challenge tests it again, where two questions ask the learner to judge a claim against the AVL rule. One of them reads "Thabo says this tree is an AVL tree because the root, 40, has balance factor 1. Is he right?"

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

Marshall, L. (2026c) *L07 – Assessment of learning* [Lecture slides]. COS750: Educational Software Development, University of Pretoria.

Shute, V.J. (2008) 'Focus on formative feedback', *Review of Educational Research*, 78(1), pp. 153–189. doi: 10.3102/0034654307313795.
