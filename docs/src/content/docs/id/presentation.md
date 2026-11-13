---
title: Presentation design
description: How the app looks and paces the learning.
---

## Layout

Every page has the same frame. A nav bar runs across the top and the content sits below it. The only thing in the nav bar that changes between screens is which link is marked as active. The logo is on the left, three links sit in the middle, and the learner's avatar is on the right.

We kept the nav bar minimal, because we wanted to reduce the mental load on the learner.

![The Growth nav bar on a dark background. The Growth logo of three coloured nodes sits on the left, the links Dashboard, Learn and Playground sit in the middle with Learn underlined as the active page, and a pink circle with the initials DA sits on the right.](../../../assets/id/presentation/navbar.webp)

*Figure 1: The nav bar, with the Learn page active.*

Below the nav bar the content sits in a centred column with generous margins, which limits competing visual elements and keeps attention on one area.

The app only has a dark theme since bright nodes on a dark background pop, and the trees are the main focus of the content. Learners who need more contrast get their own scheme (see [Colour](#colour)).

### Dashboard

We ordered the dashboard by what we think a learner wants first.

The first item on the page is a large card for the next lesson, with a single button to continue with the next lesson. Pressing the button opens the lesson directly, so the learner does not have to go through the Learn page first. This helps reduce the amount of decisions the learner has to make. Hick's law states that the time it takes to make a decision increases with the number of options available (Lau, 2024). Offering one option removes that cost, and the learner can spend their effort on the lesson instead.

![The Growth dashboard on a dark background. A greeting reads "Welcome back, Dev." Under "Continue learning" a card shows the topic "Binary trees and traversals", the lesson "Post-order" and a cyan "Continue: Post-order" button. Under "Your progress" an overall bar reads 25%, with a pink bar for "Binary trees and traversals" at 50% and an empty bar for "AVL trees" at 0%. Under "Your mastery" four cards, What is a binary tree, Pre-order, In-order and Post-order, each show "Mastery 0% · Just started"](../../../assets/id/presentation/dashboard.webp)

*Figure 2: The dashboard, with the next lesson at the top and progress and mastery below it.*

The progress section follows with an overall progress bar broken down into one bar per unit, and each unit bar carries one dot per lesson. This links a percentage back to actual lessons. A learner who sees 50% can count the dots and see that it means two of four lessons, which a percentage on its own does not show.

The mastery section sits at the bottom as a grid of cards, each with a small progress bar. We considered it the least urgent information on the page, so it is placed last. The progress and mastery bars support the confidence component of Keller's ARCS model (Boyer, n.d.). This enables the learners to see how far they have come and how close they are to the next milestone, helping success feel achievable (Boyer, n.d.). The [Motivation](../motivation/) page covers this in more detail.

### Skill tree

The Learn page presents the course as a skill tree. Since the app teaches tree traversals and AVL trees, we chose to draw the learning path as a binary tree. The map itself is then an example of the structure the learner is studying.

Lessons and checkpoints are nodes on the tree. Lessons are circles, and checkpoints are rounded squares with a star and the label "Quiz". We used different shapes so that colour-blind learners can tell lessons and checkpoints apart without relying on colour.

Each node has one of three states. A completed node is filled and shows a tick. The current node is larger and shows a play icon. A locked node has a dashed outline and a padlock. Colour also indicates the state, but the icon and outline mean the learner never depends on colour alone. The current node pulses gently, which draws attention to where the learner should continue.

![The Learn page. Two progress bars sit at the top, "Binary trees and traversals" at 50% and "AVL trees" at 0%. Below is a tree of twelve nodes. Lessons 1, 2 and 3 are pink circles with ticks. Lesson 4, Post-order, is a larger yellow circle with a play icon and the label "You are here". The other lessons are dashed grey circles with padlocks, and the two quizzes are dashed grey squares with padlocks. A striped yellow line joins the finished lessons to the current one. Labels hang under each node on dotted lines.](../../../assets/id/presentation/skilltree.webp)

*Figure 3: The skill tree, with finished, current and locked lessons.*

Two progress bars sit above the tree, one for each unit. They divide the course into two smaller goals. Completing half of one unit feels closer than completing a quarter of the whole course, and goals that feel attainable support learner confidence (Boyer, n.d.).

The lesson names are shown below the nodes on dotted lines, in lesson order from left to right. This was deliberate as a learner who has not yet studied in-order traversal cannot read the lesson order from the shape of the tree, but they can still follow the labels.

### Playground

The playground begins with a short setup form. It asks which topic the learner wants, how they want to explore it, and which tree to start with. Each question is a dropdown with a small number of options. Topic has two options, how to explore has two and the starting tree has three. If the learner chooses Traversals, a further dropdown asks which of the four traversal orders to use.

Our aim was to give the learner control without overwhelming them with choice. A playground that shows every tool at once offers flexibility, but it gives no indication of where to begin. The setup form asks a few short questions, and the playground then only shows the tools relevant to the learner's answers. The [playground storyboard](../storyboards/playground/playground/) documents how this design developed over three iterations.

![The playground setup page. On the left, a panel with three ticked questions, "What topic?" set to Tree building, "How do you want to explore?" set to Interact with the tree and "What tree do you want to start with?" set to A small random tree, followed by a cyan Start button. On the right, a dotted preview area shows a small tree with 86 at the root, 81 and 87 below it, and 29 and 83 under 81. Each node has a small balance badge, and node 29 has a cyan ring.](../../../assets/id/presentation/playground-setup.webp)

*Figure 4: The playground setup, with a preview of the tree.*

### Lessons

The lesson page is arranged from top to bottom in the order the learner uses it.

The header contains a close button that returns to the map, the unit and lesson titles, and a progress bar with a step counter. The counter lets the learner see how much of the lesson remains at any point.

The first step opens with a "What you'll learn" box that lists the lesson objectives. Each step then shows the Listen button, the core block and one extra block, labelled either "Picked for you" or "Another way to see it". The remaining blocks for that step are collapsed under "Other ways to learn this". How the extra block is chosen is described on the [Learning styles](../learning-styles/) page.

A fixed bar at the bottom of the screen holds the Back and Continue buttons, and the arrow keys perform the same actions. Continue is never blocked by a question. Requiring an answer at every step would check understanding, but it would also slow down learners who already understand the step. We treat lessons as a low-stakes space and leave formal checking to the lesson test. Allowing learners to move through the lesson at their own pace also follows Mayer's segmenting principle (Digital Learning Institute, n.d.).

The current step is stored in the URL. If the learner refreshes the page or returns later, they continue from the same step.

The final step asks the learner to write a short note in their own words, which is saved automatically. The end screen then offers two options: "Take the test" or "Back to the map".

## Colour

The app offers three colour schemes, which the learner selects on the Settings page. The choice is available before logging in, and once the learner is logged in it is saved to their profile so it applies on any device.

The default scheme uses teal, pink and lime on a dark background. The high contrast scheme uses pure black and white with stronger borders and thicker focus rings, for learners with low vision. WCAG requires a contrast ratio of at least 4.5:1 for normal text (W3C, 2023), and we wanted this scheme to exceed that requirement comfortably. The colour-blind friendly scheme replaces the accent colours with the Okabe–Ito palette, a set of colours chosen to remain distinguishable under the common forms of colour blindness (Okabe and Ito, 2008). It only changes the accent colours. Text and backgrounds are unchanged.

Across all three schemes we followed one rule: colour is never the only way information is shown. This matches WCAG success criterion 1.4.1, Use of Colour (W3C, 2023).

On the skill tree, lessons and checkpoints have different shapes, and each state has its own icon. In the step player, each phase of an AVL operation has its own shape: walking the tree is a circle, updating heights is a square, rebalancing is a diamond and rotating is a triangle. Tree nodes change their outline as well as their fill. A new node has a thicker ring, a node being deleted has a dashed outline and a cross, and an unbalanced node shows an emphasised balance badge. Each node's state is also included in its accessible name for screen readers.

In the step player, the tree walk phase is grey. Walking down the tree is the least AVL-specific part of an operation, while rotations are the focus of the course. Giving rotations the strongest colours and keeping the walk neutral lets the learner see an upcoming rotation in the step dots before reaching it. The [step player storyboard](../storyboards/playground/step-player/) explains this decision further.

## Animation

Each animation in the lessons serves a teaching purpose. Nodes move to their new position over 450 ms rather than jumping, so the learner can follow where each node goes during a rotation. Without this, the learner would have to compare the tree before and after to work it out. Diagrams are drawn one level at a time, so larger trees build up gradually. The step message changes at the same moment a node moves, which applies Mayer's temporal contiguity principle (see [Learning styles](../learning-styles/)).

The learner controls the timing. Every step player starts paused on the first step. The learner can step forward and back, jump to the first or last step, select any step dot, or press Play at 0.5×, 1× or 2× speed. No lesson content plays automatically. Autoplay would set the pace for the learner, and control over pace matters most for a learner who is struggling.

Some animations are decorative. Nodes on the skill tree drift slightly, the current node pulses, and lesson steps slide in from the direction of travel. These give the app a sense of movement, but they are not essential. All of them are turned off when the learner's device is set to reduce motion, as are the node movement and level-by-level drawing. Those learners see each change immediately. This follows WCAG success criterion 2.3.3, Animation from Interactions (W3C, 2023), since motion on screen can cause dizziness or nausea for some people.

## Pacing

Lessons unlock one at a time, in order. AVL trees build on the earlier binary tree content. A learner cannot follow a rotation without first understanding concepts such as height and depth, so the course does not allow later lessons to be opened before earlier ones.

Completing a lesson's steps does not unlock the next lesson on its own. A lesson is marked as complete when the learner passes its test, which has five questions and a pass mark of 80%. Learners who already know the material are not forced through every lesson. A locked lesson offers "Take the test to skip ahead", and passing that test completes every lesson up to that point. Checkpoints between units test the whole unit, and the final checkpoint covers the full course. The [Assessment](../assessment/) page has more detail.

Tests show one question at a time. Feedback is given immediately after each answer, either "Correct" or "Not quite", with an explanation and, for some questions, a replay of the correct answer on the tree. Hints are revealed one at a time, and the question card states that using hints lowers the score, so the learner can make an informed choice. The [Scaffolding](../scaffolding/) page covers the support given to learners who struggle.

There are no timers in the app. Time pressure adds stress without supporting the learning objectives, and learners should be able to take as long as they need on a difficult operation such as a double rotation.

## Cognitive load

Working memory has a limited capacity. Sweller's cognitive load theory distinguishes intrinsic load, which comes from the complexity of the material itself, from extraneous load, which comes from the way the material is presented (Sweller, 1988). AVL rotations cannot be made simpler than they are, but the presentation can avoid adding to the load.

We can't make a rotation less complex, but we can control how much of it the learner meets at once. Sweller calls this element interactivity, meaning how many pieces of information the learner has to hold and relate at the same time (Sweller, 2010). Each step teaches a single idea, and lesson trees contain only the nodes needed to show it. A learner works out heights and balance factors on their own in lesson 7 before lesson 8 asks them to use both during a rotation. A small random tree in the playground has five keys, which is enough to show a rotation without adding nodes the learner has to track.

The effort we do want from the learner goes into making sense of the material, which Sweller calls germane load (Sweller, 2010). Cutting extraneous load leaves room for it. The note at the end of each lesson asks the learner to explain the idea in their own words, and the code trace asks them to follow the call stack instead of only watching the answer.

Most of our design decisions target extraneous load. Each step shows one extra block and collapses the rest. Answers to writing tasks stay hidden until the learner presses Show answer. The step player's key only lists the phases that appear in the current run, so a traversal does not show a key entry for rotations. The playground's code panel can be hidden, and the setup form ensures the playground only shows the tools the learner asked for. The minimal nav bar serves the same purpose.

These choices overlap with Mayer's coherence and segmenting principles, which are discussed on the [Learning styles](../learning-styles/) page.

## Accessibility

Several accessibility features support the presentation choices above. Every step player can be operated by keyboard: Space plays and pauses, the arrow keys move between steps, and Home and End jump to the first and last step. The current step dot is marked with `aria-current="step"`, so screen readers announce it. Touch targets are at least 44 pixels so they can be tapped reliably on a phone. The Listen button reads each step aloud using the browser's built-in speech, so no additional software is required.

## References

Boyer, A. (n.d.) *Keller’s ARCS Model of Motivational Design*. Available at: https://idaho.pressbooks.pub/thuff/chapter/kellers-arcs-model-of-motivational-design/ (Accessed: 12 November 2026).

Digital Learning Institute (n.d.) *Mayer's 12 Principles of Multimedia Learning (With Practical Examples)*. Available at: https://www.digitallearninginstitute.com/blog/mayers-principles-multimedia-learning (Accessed: 11 November 2026).

Okabe, M. and Ito, K. (2008) *Color Universal Design (CUD): How to make figures and presentations that are friendly to colorblind people*. Available at: https://jfly.uni-koeln.de/color/ (Accessed: 12 November 2026).

Lau, S. (2024) *Hick's Law*. Available at: https://thedecisionlab.com/reference-guide/design/hicks-law (Accessed: 12 November 2026).

Sweller, J. (1988) 'Cognitive load during problem solving: effects on learning', *Cognitive Science*, 12(2), pp. 257–285.

Sweller, J. (2010) 'Element interactivity and intrinsic, extraneous, and germane cognitive load', *Educational Psychology Review*, 22(2), pp. 123–138.

W3C (2023) *Web Content Accessibility Guidelines (WCAG) 2.2*. Available at: https://www.w3.org/TR/WCAG22/ (Accessed: 12 November 2026).
