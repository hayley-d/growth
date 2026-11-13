---
title: Motivation
description: How the app keeps students engaged.
---

We designed for motivation with Keller's ARCS model, which splits motivation into four conditions that have to be met for people to become and stay motivated: Attention, Relevance, Confidence and Satisfaction (Boyer, n.d.). Earlier instructional design models were shaped by behaviourism and cognitivism and paid little attention to motivation. ARCS was the first to show how to design lessons that motivate the learner (Boyer, n.d.).

When thinking about ways to motivate the learner we considered the expectancy-value theory which says a learner keeps going when the work seems worth doing and success seems possible (Boyer, n.d.). Attention and relevance speak to the first part and confidence speaks to the second. Satisfaction is what makes the learner want to come back.

Keller's model lists strategies under each condition and expects the designer to choose the ones that suit the audience (Drew, 2026). Growth is pre-lecture tutoring for COS212 students, who need these trees to pass the module, so they arrive with some motivation already. That shaped our choices. Keller warns that strategies should not take time away from the objectives, and that a class that is already motivated does not need a pile of extra tactics (Keller, 1987, p. 7). So we picked a few strategies under each condition and left out decoration.

The table below gives an overview. The sections after it explain each choice and the Keller strategy behind it.

| Condition | The learner's question | Main features in Growth |
| --- | --- | --- |
| Attention | Is this interesting? | Animations, code traces, interactive blocks, linked terms, the playground |
| Relevance | Does this matter to me? | Learning style blocks, choice of code language, applied uses of each traversal |
| Confidence | Can I do this? | Stated objectives, small trees, hints, adaptive questions, retries, progress bars |
| Satisfaction | Was it worth it? | Instant feedback, lesson end screen, mastery before and after, unlocking, playground goals |

## Attention

Keller suggests varying the format of instruction and the style of presentation (Drew, 2026). A lesson in Growth does not stay on one kind of block for long. A text step is followed by a diagram, then an animation, then a code trace or a small task. The app has eleven block types in total, including animations, code traces, copying and deleting a tree, working out heights, building an expression tree and a traversal quiz. Almost all of them draw the tree. This way we ensure that the app shows a visual representation of any important object or relationship.

Keller recommends building problem-solving activities in at regular intervals and using simulations that allow the learner to take part (Drew, 2026). The traversal quiz asks the learner to tap nodes in the right order. The copy and delete blocks say "Press Step to start copying." and "Press Step to start deleting.", so the learner drives the walkthrough and does not just watch it. Additionally, pointing at an underlined word lights up the matching nodes on the tree.

Keller recommends real-world examples in e-learning content (Drew, 2026), and lists case studies as a way to make ideas concrete (Keller, 1987, p. 4). The traversal lessons show where each order is used, which the Relevance section covers. An additional case study feature was planned to further leverage this idea, but was cut due to time constraints

The playground gives the learner a choice of what to explore. Its setup asks "What topic?", "How do you want to explore?" and "What tree do you want to start with?", and the learner can pick "Watch it run" or "Interact with the tree". This encourages active participation as the learner can configure different playgrounds and explore different topics in different ways.

## Relevance

During onboarding the learner answers a short quiz built around everyday situations. The result sets one of four styles: visual, auditory, reading/writing or kinesthetic. From then on each lesson step adds a block made for that style and the other styles stay one click away under "Other ways to learn this". The learner can change their style in Settings at any time. This matches Keller's strategies of providing meaningful alternative ways to reach a goal and personal choices about how to work (Keller, 1987, p. 4). The [Learning styles](../learning-styles/) page explains the blocks themselves.

Code traces follow the same idea. The learner chooses pseudocode, Java or Rust in Settings. Java is the language used in COS212, so the trace builds on skills they will use in the module.

Keller also suggests stating how the instruction connects to what the learner will do later (Keller, 1987, p. 4). Each traversal lesson shows what the order is used for. Pre-order copies a tree and gives prefix notation. Post-order deletes a tree safely, works out heights and gives postfix notation. In-order gives the keys of a search tree in sorted order.

## Confidence

Confidence is about whether the learner expects to succeed. Keller notes that unconfident people worry more about failing and about how they look to others (Keller, 1987, p. 5). Most of Keller's confidence strategies are about making success visible and reachable.

The first is to state the learning goals clearly (Keller, 1987, p. 5). The first step of every lesson lists its objectives under "What you'll learn". The [Learning objectives](../objectives/) page explains how they were written. Next is explaining the criteria for evaluation. The test rule is five questions, and 80% to pass. The app does not show that pass mark before a test starts yet.

Keller suggests that material should be organised by increasing difficulty, so that it gives the learner a "conquerable" challenge (Keller, 1987, p. 5). The lessons build on one another in a fixed order. Most trees in the lessons and questions have seven nodes, which keeps each challenge small enough to conquer. Generated test questions adapt between attempts. After each answer the app updates its estimate of the learner's skill, and the next test pitches its generated questions, on a scale of 1 to 5, to match it. A run of correct answers leads to harder questions next time, and mistakes bring them back down.

Hints are revealed one at a time, and the button shows how many are left, so a stuck learner can get exactly the help they need. This ties back to Keller's suggestion of low-risk practice (Keller, 1987, p. 5). A wrong answer in a lesson's traversal quiz gets "Not quite. Try again.", and the tap-the-traversal task has a "Start again" button. A failed test can be retaken. If a learner leaves a test halfway, they are told "Your answers so far are saved. You can pick up where you left off."

Self-evaluation tools tied to the stated goals are another suggested strategy (Keller, 1987, p. 5). The lesson progress bar reads "Step X of Y". The dashboard has a progress bar for each unit and a mastery meter for each lesson that moves from "Just started" through "Getting there" to "Strong". Splitting the course into two units makes the next milestone feel closer, which supports confidence (Boyer, n.d.). The [Dashboard section](../presentation/#dashboard) of the presentation page explains the layout.

Finally, Keller suggests that learners should become more independent over time (Keller, 1987, p. 5). The test lets a confident learner skip ahead and passing it completes every earlier lesson. A learner who already knows pre-order does not have to sit through it again.

## Satisfaction

Satisfaction is what the learner gets out of finishing. Keller's main concern here is control. Satisfaction should come from the learner seeing their own progress, not from the app handing out prizes for doing what it asked (Keller, 1987, p. 6). So we leaned on natural consequences and feedback, and kept extrinsic rewards small.

After each test question the learner sees "Correct" or "Not quite", with an explanation, and the correct answer is replayed on the tree. This is Keller's informative feedback when it is immediately useful and feedback straight after the task (Keller, 1987, p. 5). The results page lists "Topics to go over again" with links back to the relevant lessons, so a fail still ends with a clear next step.

A completed lesson ends on a tick and "You finished" followed by the lesson's title. Passing a test shows the score, points and the mastery rating before and after. The before-and-after view shows that the effort changed something. On the map the lesson gets a tick and the next one unlocks. When the last lesson is done the dashboard says "You've finished the course". These map back to Keller's suggestion of frequent, small reinforcements (Keller, 1987, p. 5).

Keller also advises avoiding surveillance and avoiding external evaluations where learners can judge their own work (Keller, 1987, p. 5). Mastery is only visible to the learner, and there are no timers on lessons or tests.

## Daily challenge and leaderboard

A daily challenge gives learners one problem a day. An optional leaderboard ranks that day's attempts by the time taken to finish.

This is a deliberate exception to the rules above. A ranking by time is an external evaluation, which Keller's satisfaction strategies advise against, and it brings back the time pressure we kept out of lessons and tests. We think it is still worth having for one kind of learner. Keller's need-matching strategy offers people driven by achievement a chance to meet a standard of excellence "under conditions of moderate risk" (Keller, 1987, p. 4), and a daily challenge with a time fits that. The risk is kept moderate as the learner chooses to appear on the board with "Show me on the leaderboard" in Settings, and is hidden otherwise. The challenge is outside the course content, so a slow time never affects mastery or progress. And the board resets every day.

## References

Boyer, A. (n.d.) *Keller’s ARCS Model of Motivational Design*. Available at: https://idaho.pressbooks.pub/thuff/chapter/kellers-arcs-model-of-motivational-design/ (Accessed: 12 November 2026).

Drew, C. (2026) *ARCS Model of Motivational Design in E-Learning (John Keller)*. Helpful Professor, 6 October 2026. Available at: https://helpfulprofessor.com/arcs-model-of-motivation-keller/ (Accessed: 12 November 2026).

Keller, J.M. (1987) 'Development and use of the ARCS model of instructional design', *Journal of Instructional Development*, 10(3), pp. 2–10. doi: 10.1007/BF02905780.
