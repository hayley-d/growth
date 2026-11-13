---
title: Evaluation
description: How we'd check that the app teaches well.
---

We tested Growth ourselves as a team, which is covered on the [Alpha and beta](../development/) page. That testing finds bugs, but it can't tell us if Growth actually teaches, because we already know the content. This page describes how we would evaluate Growth with real COS212 students.

## Who we would test with

A small group of COS212 students who haven't had the lecture on trees yet. That matches who Growth is built for, a learner who doesn't know the data structure or the algorithm yet.

## What we would measure

### Learning
Each student writes a short pre-test before using Growth and a post-test after. Both tests ask questions written against the [learning objectives](../objectives/), so we can see which objectives improved and which didn't. If an objective doesn't improve, that points us at the lesson that teaches it.

### Test results inside the app
Growth already records every test attempt. We would look at the pass rate for each lesson test and how many attempts it took to pass. A lesson that most students fail the first time is either too hard or doesn't teach what the test asks.

### Hint Use
If most students open all the hints on one question, the question or the lesson before it needs work.

### Time per Lesson
A lesson that takes much longer than the others might be trying to cover too much in one sitting.

### Motivation
A short survey after using Growth, with questions based on the four parts of Keller's ARCS model that we used on the [Motivation](../motivation/) page.

### What students tell us
We would watch a few students use Growth and ask them to think aloud. This shows us where they get confused.

## Looking back on our choices

### What worked

The storyboard rounds caught designs that would not have worked before anyone built them. After the second round of playground storyboards the team felt the screen was too cluttered, so the third round split it into a setup form and the playground itself ([playground storyboard](../storyboards/playground/playground/)). If we had built the first idea, we would have found that out in the alpha and had to rebuild it.

Mapping every question to an objective was worth the time. It is how we found the problems in the next section, and it gave us a way to check the test against what each lesson says it teaches.

### What we got wrong

Growth never fades its support. A learner at the highest mastery level still gets three hints and the call stack ([Scaffolding](../scaffolding/)). Every hint is opt-in, so we don't think this harms a strong learner, but it means Growth doesn't hand responsibility to the learner the way scaffolding is supposed to.

Keller says learners should know the criteria they will be judged on (Keller, 1987, p. 5). The pass mark is 80%, but the app does not show it before a test starts ([Motivation](../motivation/)).

### What we would do differently

- Fade the support for strong learners, starting by dropping hints from three to one at mastery levels 4 and 5.
- Show the pass mark on the screen before each test.

## What we would do with it

The results would feed back into SAM. Anything that needs a design change goes back to a storyboard, and anything that is a bug gets fixed in the beta. Once the students' feedback has been worked through, that version would become the gold version.

## References

Keller, J.M. (1987) 'Development and use of the ARCS model of instructional design', *Journal of Instructional Development*, 10(3), pp. 2–10. doi: 10.1007/BF02905780.
