---
title: Learning theories
description: The learning theories we apply and where.
---

Growth runs before the COS212 lecture, with no lecturer present, so whatever learning happens has to come from what the learner does on the screen.

The L01 lecture splits the field into behaviourism, cognitivism, constructivism and transformative learning (Marshall, 2026a). Every one of them shows up somewhere in the app. 

| Theory | Definition | Where it is in Growth |
| --- | --- | --- |
| Behaviourism | An observable shift in behaviour driven by environmental stimuli, reinforcement and punishment (National University, 2023a) | "Correct" and "Not quite" after each test answer, the 80% pass requirement, points, practice mode |
| Cognitivism | Learning primarily occurs as students actively analyse and structure new information (National University, 2022) | One idea per step, the visible call stack, terms that light up nodes, the answer replay, the mastery meter |
| Constructivism | Learners build their own understanding through social and environmental engagement rather than passively absorbing information (National University, 2023b) | Lesson 1 names each part on a tree the learner watched grow, the playground, the "Explain it in your own words" note |
| Transformative | Learners change their perspective through reflection and experience (Pace, 2026) | The stick tree at the start of lesson 7 |

## Behaviourism

Behaviourism treats learning as a change in behaviour driven by environmental stimuli, reinforcement and punishment (National University, 2023a).

Every test question is answered and then marked on the spot with "Correct" or "Not quite". There is no batch of results at the end. The lesson moves in small frames too. The progress bar reads "Step X of Y", and each step asks the learner to do something, such as tap a node, step through the code or type an answer, before the next step comes.

A lesson only counts as complete when the learner passes its five-question test at 80%. The learner unlocks the next lesson by getting the answers right, and there is no other way to unlock it.

We also have a points system. A correct answer earns points, and an answer given after using hints earns fewer. The question card warns that "Using hints lowers your score." before the learner opens one. In behaviourist terms the warning is a small, known cost attached to a behaviour we would like to see less of, which is leaning on hints too early.

In practice mode the learner picks a topic, such as traversals, and gets generated questions until they stop, with feedback after each one. Here we use repetition with immediate reinforcement.

We kept the rewards small on purpose. Keller warns that external rewards for doing what the app asked can push out the satisfaction of having learnt something (Keller, 1987), and the [Motivation](../motivation/#satisfaction) page explains how we balanced the two. 

## Cognitivism

Behaviourism only looks at what the learner does. Cognitivism looks at how the learner takes in, organises and stores new information. The lecture splits it into two parts, information processing and social cognitive theory (Marshall, 2026a), and we use both.

### Information processing

Information processing theory treats memory as a set of stores. Input passes through a sensory register into a short-term working memory, and from there it may or may not be encoded into long-term memory (Atkinson and Shiffrin, 1968). Short-term memory is small. Miller (1956) put it at around seven items. Long-term memory, by contrast, has no known limit.

Most of our presentation choices are about optimising short-term memory. Each lesson step teaches one idea. Most lesson trees have seven nodes, which is enough to show a pattern and still small enough to keep track of. The [Presentation](../presentation/#cognitive-load) page covers this under Sweller's cognitive load theory (Sweller, 1988), so we won't repeat it here.

For the depth-first traversals we storyboarded five approaches, and we picked the one where the learner reads the code and then steps through it with the tree, the highlighted line and the call stack on screen together ([depth-first storyboard](../storyboards/lessons/traversals/#decision)). Our call stack panel shows how the call stack looks so the learner sees `preorder(20)` paused at line 4 instead of holding it in their head.

We implemented two methods for getting something from working memory into long-term memory. Key terms in the lesson text have a dotted underline. If the learner hovers over "height" the nodes it corresponds with light up on the tree. This enables the learner to see the word and the picture together, so the learner encodes the term in two forms at once (Paivio, 1986).

![Step 8 of the binary tree lesson, "Depth and height". The word "height" in the text is highlighted yellow. Below, a tree with 8 at the root, 4 and 12 below it and 2, 6, 10 and 14 at the bottom. Nodes 8, 12 and 14 are yellow. A bracket on the right says "Height 3: 3 nodes from the root to a leaf", and a bracket under 14 says "14 has depth 2".](../../../assets/id/learning-styles/visual-2.webp)

*Figure 1: Hovering over "height" lights up the nodes it counts.*

The auditory block in the pre-order lesson turns the rule into a chant, "me, left, right". In-order becomes "left, me, right", and post-order becomes "left, right, me". Saying it out loud is rehearsal. Atkinson and Shiffrin (1968) argue that the longer information is rehearsed in the short-term store, the more likely it is to be transferred to long-term memory. The chant also turns three procedures into one chunk (Miller, 1956). The learner only has to remember one rhythm and where "me" moves to, not three separate rules.

Tests do more than measure. Roediger and Karpicke (2006) found that students who were tested on material remembered more of it a week later than students who spent the same time re-reading it. That is part of why retakes and practice mode use fresh questions. A learner who retakes a test has to recall the procedure again, not recognise an answer they saw five minutes ago.

### Social cognitive theory

Bandura's social cognitive theory says people learn a lot by watching someone else do the task, and that whether they try at all depends on self-efficacy, their belief that they can succeed (Schunk, 2012). 

When a learner gets a generated question wrong, the feedback includes "The correct answer, step by step", which replays the traversal on the learner's own tree in the step player. That is an expert demonstration of the exact problem they just failed, and they can pause and step back through it. Watching the model on a different tree would teach less, because the learner would still have to map it back to their own.

Bandura calls succeeding at the task itself a mastery experience. In Growth these come from the way questions adapt. After each answer the app updates its estimate of the learner's skill, and the next test pitches its generated questions to that estimate. A learner who is struggling gets questions they can pass. A learner who is doing well gets harder ones, so a win still means something. The mastery meter on the dashboard moves from "Just started" through "Getting there" to "Strong", and the results page shows the rating before and after the test. Seeing the meter move after a pass is evidence for the learner that their effort changed something.

The third part of the theory is self-regulation and relates to learners setting goals, watching their own progress and choosing what to do next. Growth leaves several of those choices to the learner. They decide when to open a hint, knowing what it costs. They can choose "Take the test to skip ahead" from a locked lesson if they think they already know the material. In practice mode they pick the topic. The optional leaderboard for the daily challenge adds a little vicarious comparison, and only for learners who switch on "Show me on the leaderboard" in Settings. The [Motivation](../motivation/#daily-challenge-and-leaderboard) page explains why we made that one opt-in.

## Constructivism

Constructivism says learners don't receive knowledge, they build it, and they build it on top of what they already know (Schunk, 2012).

Ben-Ari (2001) makes an argument about computer science that we found interesting. Learners in physics already have a model of the world from everyday life, even when it is a wrong one. Learners in programming often have no useful model of the computer at all, so there is nothing to build on. His conclusion is that computer science has to give learners an explicit model before asking them to construct anything. 

Lesson 1 is our clearest constructivist design. The lesson states the search tree rule at step 2. Then the tree grows one key at a time, and kinesthetic learners insert keys themselves. Root, parent, leaf, subtree, depth and height are each introduced on the tree the learner just watched grow, so every new word attaches to something they have already seen. The lesson ends in the playground, where the learner inserts keys of their own.

The in-order lesson then builds on that rule. The learner already knows everything on the left of a node is smaller. In-order visits the left subtree, then the node, then the right subtree, so the sorted output follows from something the learner discovered two lessons earlier.

The playground is the closest thing we have to Papert's microworld, a small, safe environment where a learner can test ideas by changing things and seeing what happens (Papert, 1980). A learner can insert ten keys in sorted order just to see what the tree does. Papert called this kind of learning by making things constructionism. 

Every lesson ends with a note and the prompt changes per lesson. Lesson 2 asks "Why does preorder(8) stay on the stack while its left subtree runs?", and lesson 5 asks how the level-order queue differs from the call stack. Chi et al. (1989) found that students who explained worked examples to themselves learnt more than those who didn't, and that the better students produced more of these self-explanations. The note is only visible to the learner and it isn't marked. We think that helps, because the learner writes what they actually believe instead of what they think we want.

Hints follow Vygotsky's zone of proximal development, the gap between what a learner can do alone and what they can do with help (Vygotsky, 1978). Each test question has two or three, revealed one at a time, each more specific than the last. The learner takes only as much help as they need to get to the answer themselves. Adaptive difficulty does the same job from the other side by keeping the next test just ahead of where the learner is now.

## Transformative learning, partly

Mezirow describes transformative learning as what happens when an experience doesn't fit a learner's existing frame of reference. He calls that moment a disorienting dilemma. Critical reflection on the assumption that failed follows, and the learner comes out with a revised frame (Mezirow, 1997).

We have one moment that we hope has this effect on the learner. In lesson 1 the learner learns that a binary search tree finds a key by going left or right, halving the search each time. Lesson 7 opens by challenging that belief. Insert 1, 2, 3, 4 with no rebalancing, and every key hangs under the last one. The tree forms a stick, and searching for 4 visits every node. The belief that search trees are fast turns out to depend on an assumption the learner never knew they were making, which is that the tree stays balanced.

The lesson 7 note then asks "Why is stick tree bad for search?". That is the reflection step, the learner has to say which assumption failed. The results page plays a smaller version of the same role after a failed test, with "Topics to go over again" sending the learner back to the lesson where their understanding broke.

We recognise that this is not exactly what Mezirow wrote about adults revising how they see themselves and the world. An assumption about the binary search tree's efficiency is not comparable. However, we include it as the stick tree uses a mechanism influenced by transformative learning.

## References

Atkinson, R.C. and Shiffrin, R.M. (1968) 'Human memory: a proposed system and its control processes', in Spence, K.W. and Spence, J.T. (eds.) *The psychology of learning and motivation*, vol. 2. New York: Academic Press, pp. 89–195.

Ben-Ari, M. (2001) 'Constructivism in computer science education', *Journal of Computers in Mathematics and Science Teaching*, 20(1), pp. 45–73.

Chi, M.T.H., Bassok, M., Lewis, M.W., Reimann, P. and Glaser, R. (1989) 'Self-explanations: how students study and use examples in learning to solve problems', *Cognitive Science*, 13(2), pp. 145–182.

Keller, J.M. (1987) 'Development and use of the ARCS model of instructional design', *Journal of Instructional Development*, 10(3), pp. 2–10. doi: 10.1007/BF02905780.

Marshall, L. (2026a) *L01 – Educational concepts: (teaching and) learning theories* [Lecture slides]. COS750: Educational Software Development, University of Pretoria.

Mezirow, J. (1997) 'Transformative learning: theory to practice', *New Directions for Adult and Continuing Education*, 1997(74), pp. 5–12.

Miller, G.A. (1956) 'The magical number seven, plus or minus two: some limits on our capacity for processing information', *Psychological Review*, 63(2), pp. 81–97.

National University (2022) *Learning theories: five theories of learning in education*. Available at: https://www.nu.edu/blog/theories-of-learning/ (Accessed: 13 November 2026).

National University (2023a) *Behaviorism in education: what is behavioral learning theory?* Available at: https://www.nu.edu/blog/behaviorism-in-education/ (Accessed: 13 November 2026).

National University (2023b) *Constructivism in education: what is constructivism?* Available at: https://www.nu.edu/blog/what-is-constructivism-in-education/ (Accessed: 13 November 2026).

Pace, K. (2026) *What is the transformative learning theory? A complete guide*. Western Governors University, 18 May 2026. Available at: https://www.wgu.edu/blog/what-transformative-learning-theory2007.html (Accessed: 13 November 2026).

Paivio, A. (1986) *Mental representations: a dual coding approach*. New York: Oxford University Press.

Papert, S. (1980) *Mindstorms: children, computers, and powerful ideas*. New York: Basic Books.

Roediger, H.L. and Karpicke, J.D. (2006) 'Test-enhanced learning: taking memory tests improves long-term retention', *Psychological Science*, 17(3), pp. 249–255.

Schunk, D.H. (2012) *Learning theories: an educational perspective*. 6th edn. Boston: Pearson.

Sweller, J. (1988) 'Cognitive load during problem solving: effects on learning', *Cognitive Science*, 12(2), pp. 257–285.

Vygotsky, L.S. (1978) *Mind in society: the development of higher psychological processes*. Cambridge, MA: Harvard University Press.
