---
title: Instructional design approach
description: We follow SAM 2, why we picked it, how each step shows up in the app, and how it fits with our Agile SE method.
---

## The model: SAM 2

We follow SAM 2, the two-phase version of Michael Allen's Successive Approximation Model. Instead of finishing one stage before the next, SAM builds rough versions early, shows them to people, and improves them in small loops. Each loop gets a little closer to the final course.

SAM 2 has a short preparation step and then two phases that repeat:

1. **Preparation.** Gather what we know about the learners, the topic and the limits of the project. Then hold a **Savvy Start**: a short brainstorm where the team sketches rough prototypes and throws most of them away.
2. **Iterative design.** Plan the project, then loop through **design → prototype → review** until the design holds up.
3. **Iterative development.** Build the course in rounds: a **design proof**, then **alpha**, **beta** and **gold**. Each round loops through **develop → implement → evaluate**.

## Why we picked SAM 2

- **The deadline is short.** We have a few weeks and a small team. SAM gets something working early, so problems show up while there is still time to fix them.
- **Trees are visual.** Students struggle with rotations and traversals because they can't picture them. We needed to try visual ideas on screen, not argue about them on paper. SAM is built around prototypes.
- **It matches how we build the software.** Our SE method is Agile. SAM works in the same small loops, so one way of working runs both the code and the content.
- **ADDIE finds problems too late.** ADDIE runs analysis, design, development, implementation and evaluation in order. A weak lesson would only show up in the evaluation at the end, after the content is built. SAM evaluates in every loop.

## How each step shows up

| SAM 2 step | What we did | Where it shows in the app | Where it is in this document |
| --- | --- | --- | --- |
| Information gathering | Read the brief and the CS2023 outcomes for AVL trees and traversal. Worked out who COS212 students are and what they already know. | The scope: traversal first, then AVL. | [Introduction](/growth/id/introduction/), [Learners](/growth/id/learners/), [Learning objectives](/growth/id/objectives/) |
| Savvy Start | Wrote a product spec and storyboards. Built five throwaway prototypes of the learning path and picked "the path is a tree". | The skill map, where the lessons are the nodes of a tree. | [Content design](/growth/id/content/), [Presentation design](/growth/id/presentation/) |
| Project planning | Split the app into features (accounts, skill map, lessons, playground, assessment, case studies, course content, extras) and each feature into tickets. | None directly. | The SE document's [Approach](/growth/se/approach/) |
| Additional design | Set the order of the 12 lessons, the quizzes, hints and scaffolding, the learning styles and the three colour schemes. Reviewed each with the team. | Lessons, quizzes, hints and the colour schemes in Settings. | [Learning theories](/growth/id/theories/), [Learning styles](/growth/id/learning-styles/), [Motivation](/growth/id/motivation/), [Assessment](/growth/id/assessment/), [Scaffolding](/growth/id/scaffolding/) |
| Design proof | One lesson and its quiz working end to end, so we can check the design before building the rest. | The first traversal lesson and quiz. | [Content design](/growth/id/content/), [Assessment](/growth/id/assessment/) |
| Alpha | Every lesson, question and hint in place, reviewed by the team. | The whole course on the `staging` branch. | [Evaluation](/growth/id/evaluation/) |
| Beta | We will try the app with a few students and fix what they struggle with. | The fixed course on `staging`. | [Evaluation](/growth/id/evaluation/) |
| Gold | The version we demo. | The release on `master`. | This document as handed in. |

## SAM 2 and Agile

We use SAM 2 for the content and Agile for the software. They are close cousins. Both work in short loops, build something early and expect to change it. The difference is what they build and who they ask.

| | SAM 2 (ID) | Agile (SE) |
| --- | --- | --- |
| Focus | What and how students learn | Working software |
| Unit of work | A design → prototype → review loop | A ticket, done in a short iteration |
| Feedback from | Learners and the subject expert (the lecturer) | The team and the people who use the app |
| Prototypes | Rough and thrown away, like the five learning paths | Working pieces that stay in the code |
| Releases | Design proof, alpha, beta, gold | Feature branches into `staging`, then `staging` into `master` |
| Done when | Students learn what the objective says | The code works, passes checks and is reviewed |

In practice the two run side by side. Each SAM loop turns into tickets on the Agile board. A ticket that changes what students see is only done when the content has been reviewed as well as the code.

## Reference

Allen, M. W. (2012). *Leaving ADDIE for SAM: An agile model for developing the best learning experiences.* ASTD Press.
