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

**Who:** Hayley
**Tool:** Claude Code (`claude-opus-5-5`) 
**Used for.** Generating the storyboards for the code trace from the teams ideas.

**Prompt 1**

> Can you please help generate some storyboards for us. The team has some ideas for the code trace that we'd like you to storyboard. The code trace will sit next to the tree view in the playground and in lessons and it will be used to display algorithms that are running. Idea A is a debugger, So the code trace looks like a  debugger with line numbers, and variable/values at the bottom in a table format. There should also be a language selector above it which allows the user to select their preferred language. Idea B is a narrator first approach so there is a large banner at the top of the page that reads out what is currently being exectued with a key and its value as one badge/pill and the node and its value as another badge/pill. There is still a code panel that has the current line highlited, line numbers and the actual code being displayed. Idea C is having inline value popups, so on the curren line there is a popup like a speach bubble that reads the line in english and has a listen button.
Idea D is having the variables show on the tree itself so the current node has a label on it and the active key is in the top left of the tree view. There is then a code trace on the right side with the current line hilighted, All of the ideas have the code trace with line numbers and the current line highlied on the right side of the screen. Finally idea E is the trail idea which shows the learner the line executed before the current line with a fading mark. and the variable table shows the values that changed. You can do this in a single storyboard file under plans.

**Prompt 2**

> The team completed the review and we like A the best. We also liked E's marker and want to see what it would look like if we combined A and E having the exact design of A with the fading markers of E. Additionally we think it would be nice to have a call stack on the bottom right next to the varaibles table that show sthe current call stack and grows and shrinks as the code exectutes. You can do this in the same file as the other storyboards.

**Prompt 3**

> The team is not a fan of the trail idea. Can you please remove that from the design. Also can you update the call stack instead of blocks use a stem that has points and goes down like steps rather. You can do this in the same file as the other storyboards.

### 8 November 2026: Generate storyboards for the stepper 

**Who:** Hayley
**Tool:** Claude Code (`claude-opus-5-5`) 
**Used for.** Generating the storyboards for the code trace from the teams ideas.

**Prompt 1**

> Can you help generate some storyboards for the step player that goes under the tree and code trace and is used to move through operations step by step. Idea A is a media bar that has back to the start, back, play, forward and to the end buttons with a 1x, 2x and 0.5x to control speed. Idea B is a scrubber so it has a play button, back and forward buttons with the same 1x, 2x and 0.5x controls but each step has a shape and colour associated with it in the scrubber so circle could be purple for insert, square could be green for update, rebalance could be a orange diamon and rotate could be a red triangle. Idea C is a debugger tool so it looks like vs code and has a restart, back, over, into, out and play buttons on the top of the page. Idea D is buttons one large button for bakc and one large one for next with play between them and then the progress bar beneath that. The last idea is E which is chapters so each step reads like a chaper like find the spot, add 5, check 10 etc. with docs at the bottom to show progress like you would see in a carousel. This idea also has next and prev buttons and the same 1x, 2x and 0.5x selction. Please do all these in a single file.


**Prompt 2**

> The team liked A, B and E. Can you help us combine these ideas. We want to use the scrubber but group the items by their operation like the idea E. Keep the media buttons but just have play, prev and next and keep the 1x, 2x and 0.5x buttons. Can you do this in the same file as the other storyboards.

**Prompt 3**

> We do not like the groupings so can we make it one large scrubber again. Also can we highlight the active point with a circle/ring. Can we also make the walk/traversal grey so that the actual operations stand out more. please do it in the same file as previously.


### 10 November 2026: Generate storyboards for the playground

**Who:** Hayley
**Tool:** Claude Code (`claude-opus-5-5`) 
**Used for.** Generating the storyboards from the teams ideas.

**Prompt 1**

> The team has some ideas for how we'd like to display the playground to the learner. Can you please help us generate some storyboards for our ideas. Idea A is a command bar, there will be one bar above the tree and code trace blocks. The command bar should have in input where the learner can input numbers, an insert button, a delete button and a search button. Additionally, there should be a dropdown where the learner can select what they want to work with either a traversal type or avl with a run button next to it. Idea B is a tool panel that sits on the left side of the screen with 4 subsections: build, change, walk and balance. Under change the learner should be able to input a key and select an operation between insert, delete and seach. The walk tab should allow the user to select the type of traversal and have a button at the bottom to execute the walk. Idea C is the console, at the bottom of the page under the stepper there is a console like input where the learner can input commands such as insert 42, delete 20, search 40, inorder, levelorder, preset 3, random 9, balance off, rotate left and clear. This idea should also show the learner's input history and enable them to replay a past input if they wish. Idea D is a touch the tree idea where the tree has a + under each leaf node allowing the user to input a node where they wish. They can also tap on a node and it should open a menu with options such as search, delete or rotate. All of the storyboards should also include the following: a switch to toggle auto balance (this rule does not apply for the tool panle who offers auto balance options in the balance subsection and the console idea where balance is set from the command line), each should use the same tree, stepper and code trace components we've already created.

**Prompt 2**

> The team has completed its first review and we like option C, we like the console idea and how each command matches the code that runs and we like how it keeps the learner's history. The team thinks that it is an issue that there is no way for the learner to specify if they want to work on avl trees or traversals all the commands are just mixed together. Another issue is that we like the idea of learners being able to interact with the tree and not just type in the command line so if we can take the idea from D and enable a drag and drop feature where the user can add a node and drop it where they'd like. For how the learner selects between traversal and avl trees, you can place two buttons side by side on the top of the screen and they click that one they'd like. Then for the drag and drop feature an input section under the tree that has an input and next to that the draggable node and then under that an area where a node can be dropped to delete it. Please add this to the existing storyboard file you already generated.

**Prompt 3**

> The team feels that the screen is too cluttered now. We want to pivot to a setup/config page where the learner can first configure their playground as they wish and then they are taken to the actual playground screen. The config page should be a short form with three drop downs. The first drop down is "What do you want to play with?" and options for all the traversal types and then the avl trees. The second drop down should be "How do you want to play?" which allows the user to select watch it run or do it yourself which is view or drag or drop. Lastly there is "What tree do you want to start with?" which allows the user to select the type of starting tree so small tree with 3 keys, random tree with 7 keys or empty. then a start button at the bottom. The user should then be taken into the playground page with badges at the top showing their selections. A random button that allows the user to generate a random tree. You can do this storyboard in the same file as the other storyboards.
