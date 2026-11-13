---
title: GenAI acknowledgment
description: Every Generative AI tool we used and the prompts we gave it.
---

This page lists every Generative AI tool we used, what we used it for and the exact prompts we gave it. The prompts are copied word for word, typos included.

## Tools

| Tool | Model | Used for |
| --- | --- | --- |
| Claude Code | `claude-opus-5-5` | Generating storyboards from ideas |

## Prompts

### 8 November 2026: Generate storyboards for the code trace 

- **Who:** Hayley
- **Tool:** Claude Code (`claude-opus-5-5`)
- **Used for:** Generating the storyboards for the code trace from the team's ideas.

**Prompt 1**

> Can you please help generate some storyboards for us. The team has some ideas for the code trace that we'd like you to storyboard. The code trace will sit next to the tree view in the playground and in lessons and it will be used to display algorithms that are running. Idea A is a debugger, So the code trace looks like a  debugger with line numbers, and variable/values at the bottom in a table format. There should also be a language selector above it which allows the user to select their preferred language. Idea B is a narrator first approach so there is a large banner at the top of the page that reads out what is currently being exectued with a key and its value as one badge/pill and the node and its value as another badge/pill. There is still a code panel that has the current line highlited, line numbers and the actual code being displayed. Idea C is having inline value popups, so on the curren line there is a popup like a speach bubble that reads the line in english and has a listen button.
Idea D is having the variables show on the tree itself so the current node has a label on it and the active key is in the top left of the tree view. There is then a code trace on the right side with the current line hilighted, All of the ideas have the code trace with line numbers and the current line highlied on the right side of the screen. Finally idea E is the trail idea which shows the learner the line executed before the current line with a fading mark. and the variable table shows the values that changed. You can do this in a single storyboard file under plans.

**Prompt 2**

> The team completed the review and we like A the best. We also liked E's marker and want to see what it would look like if we combined A and E having the exact design of A with the fading markers of E. Additionally we think it would be nice to have a call stack on the bottom right next to the varaibles table that show sthe current call stack and grows and shrinks as the code exectutes. You can do this in the same file as the other storyboards.

**Prompt 3**

> The team is not a fan of the trail idea. Can you please remove that from the design. Also can you update the call stack instead of blocks use a stem that has points and goes down like steps rather. You can do this in the same file as the other storyboards.

### 8 November 2026: Generate storyboards for the stepper 

- **Who:** Hayley
- **Tool:** Claude Code (`claude-opus-5-5`)
- **Used for:** Generating the storyboards for the step player from the team's ideas.

**Prompt 1**

> Can you help generate some storyboards for the step player that goes under the tree and code trace and is used to move through operations step by step. Idea A is a media bar that has back to the start, back, play, forward and to the end buttons with a 1x, 2x and 0.5x to control speed. Idea B is a scrubber so it has a play button, back and forward buttons with the same 1x, 2x and 0.5x controls but each step has a shape and colour associated with it in the scrubber so circle could be purple for insert, square could be green for update, rebalance could be a orange diamon and rotate could be a red triangle. Idea C is a debugger tool so it looks like vs code and has a restart, back, over, into, out and play buttons on the top of the page. Idea D is buttons one large button for bakc and one large one for next with play between them and then the progress bar beneath that. The last idea is E which is chapters so each step reads like a chaper like find the spot, add 5, check 10 etc. with docs at the bottom to show progress like you would see in a carousel. This idea also has next and prev buttons and the same 1x, 2x and 0.5x selction. Please do all these in a single file.


**Prompt 2**

> The team liked A, B and E. Can you help us combine these ideas. We want to use the scrubber but group the items by their operation like the idea E. Keep the media buttons but just have play, prev and next and keep the 1x, 2x and 0.5x buttons. Can you do this in the same file as the other storyboards.

**Prompt 3**

> We do not like the groupings so can we make it one large scrubber again. Also can we highlight the active point with a circle/ring. Can we also make the walk/traversal grey so that the actual operations stand out more. please do it in the same file as previously.

### 9 November 2026: Generate storyboards for lesson 1

**Who:** Hayley
**Tool:** Claude Code (`claude-opus-5-5`) 
**Used for.** Generating the storyboards for lesson 1, what is a binary tree, from the teams ideas.

**Prompt 1**

> Can you please help us generate some storyboards for lesson 1 which is the what is a binary tree lesson. This is the first lesson the learner does so we assume they know nothing about trees and it needs to teach them the terminology and the binary search tree rule. The team has five ideas. Idea A is vocabulary first where we use the same tree the whole time and teach one word at a time so node and edge, root, parent and child, leaves, binary, subtree, depth and height and then the learner reads the search tree rule at the end. Idea B is family tree first so we start with a family tree that the learner already knows and turn it into circles and lines and link each word back to the family. Idea C is build it yourself where the learner starts with an empty canvas and taps to add nodes and children and gets stopped if they try add a third child. Idea D is guess first, the learner is given a finished tree and has to guess which node is the root, the leaves, the parent etc. before we explain it. Idea E is drop keys in which uses the same insert box as the playground, the learner drops keys into an empty tree and each word is introduced as the tree grows. All of the ideas should end with the playground where the learner inserts their own keys and then a notes step where they write what they learnt in their own words. Please do all these in a single file.

**Prompt 2**

> The team completed the review and we like E the best. We also liked A but E already does what we liked about A since it introduces one word at a time on the same tree, so we are only taking E forward. Can you keep E as it is and add a storyboard for the playground step. The playground should start with a tree that only has 8 in it, an insert box and insert, random and reset buttons. When the learner inserts a key it should travel down the tree from the root and every comparison should be listed under the tree. You can do this in the same file as the other storyboards.

**Prompt 3**

> The team thinks the learner never actually reads the rule in this design, they just pick it up from watching the inserts. Can you move the rule to step 2 so the learner knows why each key goes left or right before they insert anything. After that they should press play and watch 8, 4 and 12 go in and then step through 2, 6, 10 and 14 with a line under the tree saying why each one turned. Please also remove the tap the wrong key step since we want that as a test question, remove the duplicate key step because the rule already says each key only appears once, and take out the 1 to 5 line and the side by side insert orders because those fit better in lesson 7. You can do this in the same file as the other storyboards.


### 10 November 2026: Generate storyboards for the playground

- **Who:** Hayley
- **Tool:** Claude Code (`claude-opus-5-5`)
- **Used for:** Generating the storyboards from the team's ideas.

**Prompt 1**

> The team has some ideas for how we'd like to display the playground to the learner. Can you please help us generate some storyboards for our ideas. Idea A is a command bar, there will be one bar above the tree and code trace blocks. The command bar should have in input where the learner can input numbers, an insert button, a delete button and a search button. Additionally, there should be a dropdown where the learner can select what they want to work with either a traversal type or avl with a run button next to it. Idea B is a tool panel that sits on the left side of the screen with 4 subsections: build, change, walk and balance. Under change the learner should be able to input a key and select an operation between insert, delete and seach. The walk tab should allow the user to select the type of traversal and have a button at the bottom to execute the walk. Idea C is the console, at the bottom of the page under the stepper there is a console like input where the learner can input commands such as insert 42, delete 20, search 40, inorder, levelorder, preset 3, random 9, balance off, rotate left and clear. This idea should also show the learner's input history and enable them to replay a past input if they wish. Idea D is a touch the tree idea where the tree has a + under each leaf node allowing the user to input a node where they wish. They can also tap on a node and it should open a menu with options such as search, delete or rotate. All of the storyboards should also include the following: a switch to toggle auto balance (this rule does not apply for the tool panle who offers auto balance options in the balance subsection and the console idea where balance is set from the command line), each should use the same tree, stepper and code trace components we've already created.

**Prompt 2**

> The team has completed its first review and we like option C, we like the console idea and how each command matches the code that runs and we like how it keeps the learner's history. The team thinks that it is an issue that there is no way for the learner to specify if they want to work on avl trees or traversals all the commands are just mixed together. Another issue is that we like the idea of learners being able to interact with the tree and not just type in the command line so if we can take the idea from D and enable a drag and drop feature where the user can add a node and drop it where they'd like. For how the learner selects between traversal and avl trees, you can place two buttons side by side on the top of the screen and they click that one they'd like. Then for the drag and drop feature an input section under the tree that has an input and next to that the draggable node and then under that an area where a node can be dropped to delete it. Please add this to the existing storyboard file you already generated.

**Prompt 3**

> The team feels that the screen is too cluttered now. We want to pivot to a setup/config page where the learner can first configure their playground as they wish and then they are taken to the actual playground screen. The config page should be a short form with three drop downs. The first drop down is "What do you want to play with?" and options for all the traversal types and then the avl trees. The second drop down should be "How do you want to play?" which allows the user to select watch it run or do it yourself which is view or drag or drop. Lastly there is "What tree do you want to start with?" which allows the user to select the type of starting tree so small tree with 3 keys, random tree with 7 keys or empty. then a start button at the bottom. The user should then be taken into the playground page with badges at the top showing their selections. A random button that allows the user to generate a random tree. You can do this storyboard in the same file as the other storyboards.

### 10 November 2026: Generate storyboards for the traversal lessons

**Who:** Hayley
**Tool:** Claude Code (`claude-opus-5-5`) 
**Used for.** Generating the storyboards for the traversal lessons from the teams ideas.

**Prompt 1**

> Can you please help generate some storyboards for the traversal lessons. The learner does these after lesson 1 so they know the basics of binary search trees and the terminology. The lesson needs to teach pre-order, in-order and post-order. Idea A is code first, the learner reads the rule, then the pseudocode and then traces the code running with the call stack next to it, and to get in-order and post-order they just move the visit line. Idea B is walk around the tree where an ant walks around the outside of the tree and passes every node three times, on the left, under it and on the right, and each order writes the node down on a different pass. Idea C is guess first so the learner taps the nodes in the order they think it goes, checks their guess and only then gets the rule. Idea D is start with a use where each order is introduced by what its used for so copying a tree for pre-order, sorting keys for in-order and deleting a tree for post-order. Idea E is examples that fade so the learner sees a fully worked example first and every time after that there is less help until they do it on their own. Each idea should use the same 7 node tree from lesson 1 and have a quick quiz, a playground and a notes step at the end. Please do all these in a single file.

**Prompt 2**

> The team reviewed the storyboards and we like A the best because the orders only differ by one line and the call stack is shown and explained. We also liked that D answers why would I do this so can you give D's uses their own steps in A. The team thinks three orders in one lesson is too much for one sitting so can you split it so each order is its own lesson and also add level-order as a fifth lesson. Each lesson should have the rule and code, a small trace, why calls wait, a big trace, the uses, the playground and a note. Please do this in the same file as the other storyboards.

**Prompt 3**

> We like that the orders are split now but there are two issues. Every step is read the code and watch the trace which only really works for learners who like code, so can you add learning style blocks so auditory, reading/writing and kinesthetic learners each get another way in. The second issue is the playground uses random orders so lesson 2 could ask for in-order before the learner has seen it. Can you make each lessons playground stick to its own order on one fixed tree with a goal to finish. Can you also give which calls wait on the call stack its own step with the code hidden so only the stack is moving. You only need to storyboard pre-order fully since the other lessons follow the same steps. Please do it in the same file as previously.

### 12 November 2026: Generate storyboards for the rotation lessons

**Who:** Hayley
**Tool:** Claude Code (`claude-opus-5-5`) 
**Used for.** Generating the storyboards for lessons 8 and 9, single and double rotations, from the teams ideas.

**Prompt 1**

> Can you please help generate some storyboards for the rotation lessons. Lesson 8 is single rotations which covers left-left and right-right and lesson 9 is double rotations which covers left-right and right-left. The learner comes from lesson 7 so they know height and balance factor but they dont know what to do when a node is +2 or -2. Idea A is before and after so a picture of the unbalanced tree, an arrow and a picture of the fixed tree, then the same with subtrees and then the mirror case. Idea B is lift the middle where the learner grabs the middle key and drags it up and the rest of the tree swings into place under it. Idea C is step player first so we insert 10 into 30, 20 and let the step player walk through every phase using the same shapes and colours on the scrubber. Idea D is name the case where the learner reads the balance factor of the unbalanced node and its taller child, looks it up in a table of the four cases and the case tells them the fix. Idea E is rotate it wrong so the learner gets the rotate buttons before the rule, picks a node and a direction and finds out for themselves why the pivot and the case matters. Please do all these in a single file.

**Prompt 2**

> The team reviewed the storyboards and we want to combine a few of them. Can you use D's case table as the main idea for both lessons and then use C's step player to show the fix happening after the learner has already named the case. We also want E as the opener for lesson 9 only where the learner tries one rotation on a zig-zag. Both lessons should end in the playground with auto balance off so the learner can tip a tree on purpose and fix it. You can do this in the same file as the other storyboards.

**Prompt 3**

> The team thinks the full case table on step 1 is too much since the learner hasnt seen a single rotation yet. Can you teach left-left on its own first and then right-right as its mirror and only show the case table at the end of lesson 8, then lesson 9 adds its two rows. The subtrees also came too soon so can you show the chain first and the subtrees after. We also want to bring back B's drag as a kinesthetic block on the subtree step. Please do it in the same file as previously.
