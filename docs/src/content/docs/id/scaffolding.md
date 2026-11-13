---
title: Scaffolding
description: What happens when a student struggles.
---

Growth is used before a COS212 lecture, usually alone. Nobody is sitting next to the learner to assist them when they get stuck on a concept. When developing Growth we wanted to ensure that the learner would not feel unsupported.

Scaffolding is closely tied to Vygotsky's zone of proximal development, which the [Learning theories](../theories/#constructivism) page already covers. To summarise, help is aimed at the gap between what the learner can do alone and what they can do with support (Vygotsky, 1978). A later review by van de Pol, Volman and Beishuizen (2010) condenses good scaffolding down to three properties. It is contingent on what the learner is doing right now. It fades. And responsibility shifts to the learner over time. 

## What counts as struggling

| Signal | Where | What the app does |
| --- | --- | --- |
| A wrong tap | Tap-the-traversal tasks in lessons | Says which beat is still open, doesn't advance, offers "Start again" |
| A wrong check | Traversal quiz, playground prediction | "Not quite. Try again.", or names the exact place that's wrong. "Show answers" appears only after a failed check |
| The learner asks | Test and practice questions | Reveals the next hint |
| A wrong answer | Test and practice questions | "Not quite", an explanation, and for generated questions a step-by-step replay on the learner's own tree |
| A failed test | Results page | "Topics to go over again", with a link back to each lesson, and a retake with new questions |
| A falling rating | Behind the scenes | The next generated questions get easier |

## Hints

Every test question carries hints. Hand-written ones have two or three, and generated ones always have three. They come out one at a time behind a "Hint (N left)" button, and each one is narrower than the last. The first restates the rule. The second points at the part of the tree that matters. The third gets close to the answer without handing it over.

Here are the hints for "Tap the nodes of this tree in pre-order", exactly as written:

> Start at the root.
>
> Finish everything under 4 before you go to 12.
>
> The left subtree gives 4, 2, 6.

And here are the hints for the generated "Is this an AVL tree?" question, which work the same way on whatever tree the generator drew:

> An AVL tree is a binary search tree where the two subtrees of every node differ in height by at most 1.
>
> Check the balance factor of every node, not just the root.
>
> Write each node's height next to it, working from the leaves up, then subtract the right height from the left.

Relating back to van de Pol, this is contingent help. The learner decides how much help they need. 

We decided that hints would penalise the learner a bit. A correct answer with no hints scores 1, with one hint 0.75, and with two or more 0.5. The score never changes whether the test is passed, since the pass mark only counts correct answers. A free hint is kinder, but Shute (2008, p. 179) warns that learners can work their way down a hint ladder to skip the thinking. Charging for hints felt like the correct decision, and the card warns the learner with "Using hints lowers your score." The [Assessment](../assessment/#hints) page has more on the feedback side.

## Adaptive difficulty

Each learner has a rating per lesson, starting at 1000. Each generated question has a difficulty from 1 to 5. After every answer the rating moves. The approach comes from adaptive practice systems that adapted chess ratings for learners and questions (Pelánek, 2016). Before the next test, the app picks the difficulty the learner has about a 70% chance of getting right.

We selected 70 as a middle ground. At 50% a learner would probably fail every second question which would discourage them from using the app. At 90% the learner would not be challenged enough.

Tree size is affected by the difficulty. A level-1 tree has 3 or 4 nodes and a level-5 tree has 12 to 15. For AVL questions, difficulty also changes the kind of problem. Level 1 inserts never rotate. Level 2 gets a single rotation. Level 3 might hit a double rotation at the root. Level 4 and up are double rotations, and deletes at levels 4 and 5 remove a node with two children, the second time with a rotation as well. From level 4, balance-factor questions also show the tree before it has been rebalanced.

A struggling learner drops back to trees that have fewer moving parts, which relates back to Wood et al.'s "reducing the degrees of freedom". They describe it as "simplifying the task by reducing the number of constituent acts required to reach solution" (Wood et al., 1976, p. 98). Take a learner who gets a level-4 insert wrong. To answer it, they had to find where the key goes, update heights on the way back up, spot the first node whose balance factor reached ±2, decide between a single and a double rotation, and then do two rotations in the right order. Getting any one of those wrong breaks the whole answer, so the rating drops, and the next test gives them a level-2 question instead. That's a tree of 5 or 6 nodes and only one single rotation. The insert, the height update and finding the unbalanced node are all still there, but the double rotation has been taken out. 

As they get those right, the rating climbs and the double rotation comes back. 

Wood's tutor simplified the task in the moment, halfway through the attempt. Growth only does it between tests, because the difficulty is fixed when a test starts. However, practice mode recalculates the rating after every answer, so the very next question can be easier. 

## Watching it done

Wood et al.'s last function is demonstration, and Collins et al. (1989) make it the first stage of cognitive apprenticeship: the expert *models* the task, then *coaches*, then scaffolds and steps back. Recursion is a good place for modelling, because the interesting part happens where the learner can't see it, inside the call stack.

Every traversal lesson has a code trace the learner steps through. The learner sees `preorder(20)` paused at line 4 instead of having to imagine it. Pre-order step 4, "Why calls wait", hides the code entirely and keeps only the tree and the stack, so the learner looks at the one thing that confuses people most.

When a learner gets a generated test question wrong, "The correct answer, step by step" replays the right answer on their tree. The playground's "Watch it run" mode does the same thing on demand, for learners who want to see an insert or a rotation before they try it.

## Inside a lesson

Lessons 2 to 4 follow the pattern Pearson and Gallagher (1983) call the gradual release of responsibility, usually shortened to "I do, we do, you do". The rule and code come first. Then the learner steps through a trace on a three-node tree, then the bigger seven-node tree, then sees where the order is used. The lesson ends on a tap task with nobody doing it for them. The "we do" stage is thin, to be fair. Stepping through a trace is controlled by the learner but it's still mostly watching, and there's no half-finished example for them to complete.

The tap tasks are where coaching happens. A wrong tap tells the learner they're wrong without giving the right node away.

> Not 6. Beat 3 is still open, try another node.

In the playground, dropping a key in the wrong place gets a message like "5 can't go there. That spot is left of 12, so it only takes keys from 9 to 11. Start at the root: is 5 smaller or bigger than 8?". The last sentence is Wood et al.'s direction maintenance where it sends the learner back to the first decision, which is where most wrong placements actually go wrong.

Writing tasks keep their answer behind "Show answer", so the learner has a go first. The traversal quiz in "Compare all three" only offers "Show answers" after a check has failed. 

The learning style blocks are a more subtle scaffold. If the core explanation of a step doesn't work for a learner, "Other ways to learn this" holds the same idea as a diagram, a chant, a writing task or something to tap. A learner can try a second method without leaving the step. The [Learning styles](../learning-styles/) page describes the blocks themselves.

## Going back

When a learner fails a test the results page lists "Topics to go over again", made from the lessons behind each wrong answer. When the learner retakes a test it generates 5 new questions, as many times as the learner wants. Lessons unlock in order, because an AVL rotation does not make sense to a learner who does not know what height is. Each test also accepts a learner who never completed the lesson. This is the transfer of responsibility from van de Pol et al. The learner decides if they need the support or not.

## Fading

Scaffolding is supposed to come down once the building stands. Unfortunately Growth does not support this feature.

A learner at level 5 still gets three hints. The call stack is still there in the last lesson. The answer replay plays for strong learners as well as weak ones. What rises with mastery is the difficulty, not the independence. 

We don't think leaving full support on harms our learners. The expertise reversal effect warns that guidance which helps novices can get in the way once a learner has moved past it (Kalyuga et al., 2003). In Growth, though, every piece of help is opt-in. A strong learner doesn't have to press "Hint", and they can step past a trace in a second.

Growth is a pre-lecture tool, not exam preparation. Its job is to get a learner into the lecture already knowing what a traversal or a rotation is. Working without support is something the module itself builds up to later.

If we had another sprint, we'd drop hints from three to one at levels 4 and 5. 

## References

Collins, A., Brown, J.S. and Newman, S.E. (1989) 'Cognitive apprenticeship: teaching the crafts of reading, writing, and mathematics', in Resnick, L.B. (ed.) *Knowing, learning, and instruction: essays in honor of Robert Glaser*. Hillsdale, NJ: Lawrence Erlbaum Associates, pp. 453–494.

Kalyuga, S., Ayres, P., Chandler, P. and Sweller, J. (2003) 'The expertise reversal effect', *Educational Psychologist*, 38(1), pp. 23–31. doi: 10.1207/S15326985EP3801_4.

Pearson, P.D. and Gallagher, M.C. (1983) 'The instruction of reading comprehension', *Contemporary Educational Psychology*, 8(3), pp. 317–344. doi: 10.1016/0361-476X(83)90019-X.

Pelánek, R. (2016) 'Applications of the Elo rating system in adaptive educational systems', *Computers & Education*, 98, pp. 169–179. doi: 10.1016/j.compedu.2016.03.017.

Shute, V.J. (2008) 'Focus on formative feedback', *Review of Educational Research*, 78(1), pp. 153–189. doi: 10.3102/0034654307313795.

van de Pol, J., Volman, M. and Beishuizen, J. (2010) 'Scaffolding in teacher–student interaction: a decade of research', *Educational Psychology Review*, 22(3), pp. 271–296. doi: 10.1007/s10648-010-9127-6.

Vygotsky, L.S. (1978) *Mind in society: the development of higher psychological processes*. Cambridge, MA: Harvard University Press.

Wood, D., Bruner, J.S. and Ross, G. (1976) 'The role of tutoring in problem solving', *Journal of Child Psychology and Psychiatry*, 17(2), pp. 89–100. doi: 10.1111/j.1469-7610.1976.tb00381.x.
