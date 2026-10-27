---
title: Instructional design approach
description: We follow SAM, why we picked it, how each step shows up in the app, and how it fits with our Agile SE method.
---

## The model: SAM 
For this project we folloed Michael Allen's Successive Approximation Model (SAM).
Instead of a more ridgid approach where we would finish one stage before the next
SAM builds rough versions then tests then and improves upon them in small loops.
Where each loop imporves upon the last getting you closer to the final product.

SAM consists of 3 phases:

1. **Preparation.** Gather what we know about the learners, the topic and the limits of the project. Then hold a **Savvy Start** which is a short brainstorm where the team sketches rough prototypes. 
2. **Iterative design.** Plan the project, then loop through design, prototype and review phases.
3. **Iterative development.** Build the course in rounds with a **design proof**, then **alpha version**, **beta version** and **gold version**. Each round loops through **develop → implement → evaluate**.

## Why we picked SAM 2

1. **Fast Development**
When we recieved the project specification we had 4 weeks to develop the application with a 
team of 5 people. SAM enables rapid development so we can develop everything fast and then revist items when we have time.

2. **Compatible with Agile**
SAM matches our selected software engineering appraoch well. We selected Agile 
as our software engineering approach and SAM works in the same fashion with 
multiple iterations.

3. **Felxibility**
SAM allows us to try variations of a solution and work towards something that works for 
our application rather than making a single decision and finding out that it does not work
down the line.

4. **Rapid Prototypes**
In the preparation phase we develop rapid prototypes which help us get
ideas for what we want to do without having to spend to much time on
the prototyping since the project is under strict time constraints.


## How each step shows up

| SAM step | What we did | Where it shows in the app | Where it is in this document |
| --- | --- | --- | --- |
| Information gathering | Read the brief and the CS2023 outcomes for AVL trees and traversal. Worked out who COS212 students are and what they already know. | The scope: traversal first, then AVL. | [Introduction](/growth/id/introduction/), [Learners](/growth/id/learners/), [Learning objectives](/growth/id/objectives/) |
| Savvy Start | Wrote a product spec and storyboards. Built five throwaway prototypes of the learning path and picked "the path is a tree". | The skill map, where the lessons are the nodes of a tree. | [Content design](/growth/id/content/), [Presentation design](/growth/id/presentation/) |
| Project planning | Planned the content work: which lessons and quizzes to build, in what order, and who reviews each one. Each piece became a ticket on the Agile board. | None directly. | The SE document's [Approach](/growth/se/approach/) |
| Additional design | Set the order of the 12 lessons, the quizzes, hints and scaffolding, the learning styles and the three colour schemes. Reviewed each with the team. | Lessons, quizzes, hints and the colour schemes in Settings. | [Learning theories](/growth/id/theories/), [Learning styles](/growth/id/learning-styles/), [Motivation](/growth/id/motivation/), [Assessment](/growth/id/assessment/), [Scaffolding](/growth/id/scaffolding/) |
| Design proof | One lesson and its quiz working end to end, so we can check the design before building the rest. | The first traversal lesson and quiz. | [Content design](/growth/id/content/), [Assessment](/growth/id/assessment/) |
| Alpha | Every lesson, question and hint in place, reviewed by the team. | The whole course on the `staging` branch. | [Evaluation](/growth/id/evaluation/) |
| Beta | We will try the app with a few students and fix what they struggle with. | The fixed course on `staging`. | [Evaluation](/growth/id/evaluation/) |
| Gold | The version we demo. | The release on `master`. | This document as handed in. |

## SAM and Agile

We use SAM for the learning content and Agile for the software. Both SAM and Agile 
work in short loops, where you build something and expect to change it later on. 
The difference is what they build and who they ask.

| | SAM (ID) | Agile (SE) |
| --- | --- | --- |
| Focus | What and how students learn | Working software |
| Unit of work | A design → prototype → review loop | A ticket, done in an iteration |
| Feedback from | Learners and the subject expert | The team and the people who use the app |
| Prototypes | Rough | Working pieces that stay in the code |
| Releases | Design proof, alpha, beta, gold | Feature branches into `staging`, then `staging` into `master` |
| Done when | Students learn what the objective says | The code works, passes checks and is reviewed |

In practice the two run side by side. Each SAM loop turns into tickets on the Agile board. A ticket that changes what students see is only done when the content has been reviewed as well as the code.

## References

Elm Learning (n.d.) *The SAM (Successive Approximation Model) approach to eLearning*. Available at: https://elmlearning.com/hub/instructional-design/sam-successive-approximation-model/ (Accessed: 27 October 2026).
