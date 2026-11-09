---
title: Shared
description: The HTTP contract and the AVL tree rules that the frontend and backend share.
---

```
shared/src/
  schemas/
    index.ts              re-exports everything in src/
    src/                  zod schemas for every request and response, one file per feature
    test/                 one <file>.test.ts for each file in src/
  avl/
    index.ts              re-exports everything in src/
    src/
      algorithm-steps.ts  the algorithm codes and every step key each one can emit
      step-messages.ts    the sentence for each step key, built from that step's variables
      step-recorder.ts    Step, CallFrame, StepRecorder and withinCall: snapshots of the tree and the call stack as an operation runs
      avl-tree.ts         insert, remove, rotations, rebalance, layout, and their trace* versions
      tree-traversal.ts   TreeTraversal and traceTraversal: walk a tree one node at a time
      tree-searcher.ts    TreeSearcher and traceSearch: find a key and the path to it
      tree-encoding.ts    encodeTree and decodeTree: a tree as a string
      goal-check.ts       checkGoal: did the learner's tree meet a playground goal
    test/                 one <file>.test.ts for each file in src/
  openapi/
    index.ts              re-exports openApiDocument
    src/                  the endpoint list, the schema components and the document builder
    test/                 checks on the document
  engine/
    index.ts              re-exports everything in src/
    src/
      step.ts             Step: one snapshot of a manual rotation
      bst.ts              insertBst and removeBst, with no rebalancing
      balance.ts          heightOf, balanceOf, findUnbalanced and isAvl
      rotate.ts           rotate: one left or right rotation, or a reason
      generators/         generate: seeded assessment questions, one file per generator key
    test/                 one <file>.test.ts for each file in src/
```

`schemas/` is the contract between the frontend and the backend. `avl/` holds the tree rules, so both sides use one copy. `avl/` imports nothing else, so it runs in the browser and in the backend `domain` layer. `domain` still imports only `@shared/avl`. The backend calls `engine/` from `application`.

## Engine

`insertBst` and `removeBst` follow the same search-tree rules as `insertKey` and `removeKey`, including the in-order successor when a deleted node has two children. They update height and they do not rebalance. They return the tree, not a list of steps.

`findUnbalanced` returns the nodes, in order, whose balance factor is outside -1 to 1. Balance factor is the left height minus the right height.

`isAvl` is true for an empty tree. Otherwise every node must store the right height, have a balance factor from -1 to 1, and sit strictly inside the bounds of its ancestors.

`rotate(tree, key, kind)` turns the node with that key once to the left or the right. It returns `{ ok: true, tree, steps }` or `{ ok: false, reason }`. A reason looks like `Node 30 has no left child`. A success has two steps, `rotate.select` and then `rotate.rotate-left` or `rotate.rotate-right`. Each step is `{ stepKey, tree, nodeStates, message, variables }`.

Import it with `@shared/engine`. It is not exported from the shared barrel.

### Generated questions

`generate(key, { seed, difficulty, order? })` returns a `GeneratedQuestion`: the tree, the prompt, the answer, an explanation and three hints from vague to specific. The same key, seed and difficulty always give the same question, so the backend can run it again later to get the answer.

```ts
const question = generate("insert-result", { seed: 42, difficulty: 3 });
```

The seed must be a non-negative safe integer and the difficulty a whole number from 1 to 5. Anything else throws a `RangeError`.

The keys are `traversal-order`, `insert-result`, `delete-result`, `predict-rotation`, `balance-factor`, `height` and `is-avl`. `order` only matters for `traversal-order`.

Difficulty sets the tree size and the case:

| Difficulty | Nodes | Insert and predict-rotation | Delete |
| --- | --- | --- | --- |
| 1 | 3-4 | no rotation | no rotation, node has at most one child |
| 2 | 5-6 | single rotation | single rotation |
| 3 | 7-9 | single rotation, or a double rotation at the root | the same |
| 4 | 10-12 | double rotation | node with two children, no rotation after |
| 5 | 12-15 | double rotation | node with two children, rotation after |

- The generator builds a seeded random tree, then looks for a key that gives the wanted case. It tries the node counts in the window one after another. If nothing fits after 200 tries it throws, so a case that can't exist fails the tests and never turns into an easier question. A delete that rotates can't happen at 6 nodes, so difficulty 2 deletes use 5.
- A question only counts a case with one rotation, so `predict-rotation` always has one answer.
- When a delete replaces a node with its in-order successor, the rotation can happen at the spot of the deleted node, where the key is now the successor's. `predict-rotation` skips those cases, because the pivot would be a leaf in the picture the learner sees. `delete-result` keeps them and says "the node that took 45's place (it now holds 70)".
- `balance-factor` asks about any node at difficulty 1, a node with children at 2 and 3, and from 4 shows the tree just after a plain search tree insert, before rebalancing. The prompt says so, and at difficulty 5 half the questions ask about the unbalanced node, so the answer is 2 or -2.
- Hints never give a yes or no. The `is-avl` hints are the same for every tree, and the last `traversal-order` hint shows fewer than half the keys, and at least one.
- Heights follow the engine: a leaf has height 1 and an empty tree has height 0. The `height` and `balance-factor` prompts say so.
- Answers are in one fixed form: trees are `encodeTree` strings, and text lists are keys joined by `,` with no spaces. Cleaning up what a learner types is the grader's job, not the generator's.

## Traversal

```ts
const traversal = new TreeTraversal(root, "inorder");
traversal.next();
traversal.reachedEnd();
traversal.reset();
```

The order is `"preorder"`, `"inorder"`, `"postorder"` or `"levelorder"`. Level-order visits the tree one level at a time, top to bottom and left to right, using a queue. `next()` returns the next node, and `null` once `reachedEnd()` is true. `reset()` starts again from the first node.

You can also spread it or use `for...of`. Both give the nodes that are left, so after two `next()` calls you get the rest, not the whole tree.

## Steps

The playground plays every operation one step at a time, like a debugger. Each `trace*` function runs the same code as the plain function, but also returns the steps it took:

```ts
const { result, steps } = traceInsert(root, 40);
```

| Function | Plain version |
| --- | --- |
| `traceInsert(root, key)` | `insertKey` |
| `traceRemove(root, key)` | `removeKey` |
| `traceSearch(root, key)` | `TreeSearcher` |
| `traceRotateLeft(root, key)`, `traceRotateRight(root, key)` | `rotateLeft`, `rotateRight`, but on the node with that key anywhere in the tree |
| `traceTraversal(root, order)` | `TreeTraversal`, returning the keys in order |

Each step is a snapshot:

```ts
{
  stepKey: "insert.go-right",
  tree: root,
  nodeStates: { 20: "active", 10: "visited" },
  callStack: [{ algorithm: "insert", node: 20 }],
  message: "40 is bigger than 20, so go right.",
  variables: { key: 40, node: 20 },
}
```

- `tree` is always the whole tree as it is at that moment, not just the subtree being worked on. Heights above the change stay old until the `update-height` steps on the way back up, just like in the real algorithm.
- `nodeStates` gives a node one of `active`, `visited`, `deleting`, `unbalanced` or `new`. It only names keys that are in that step's tree, and steps share one frozen object until a state changes.
- `message` is shown on screen and read out by text-to-speech. It comes from `step-messages.ts`, which has one function per step key. Each function takes that step's variables, so the engine only passes variables and the wording lives in one file.
- `stepKey` names the point in the algorithm. The code trace uses it to find the line to highlight.
- `callStack` lists the calls that are open, outermost first. Each frame is the algorithm and the key of the node it was called on, or `null` for an empty child, so `insert(20) › insert(30) › rebalance(30)`. The code trace shows it so a jump into another function makes sense. Steps share one frozen array until a call opens or closes.

How long each state lasts:

| State | From | Until |
| --- | --- | --- |
| `active` | the step that works on the node | the focus moves on, then it's `visited` |
| `new` | the step that creates the node | the next step, then it's `visited` |
| `unbalanced` | the step that names the rotation case | the rotation starts on that node |
| `deleting` | the step that removes or replaces the node | the node is gone |

States are keyed by node key. For a few steps of a delete with two children, the copied successor and the old successor leaf have the same key, so they show the same state. That ends when the leaf is removed.

Insert and delete also run `update-height`, `rebalance` and the rotations as they unwind, so their steps include those keys too. Before each of those calls there is a step of its own, `insert.update-height` and then `insert.rebalance` (or the `delete.` ones), so the code trace stops on the line that makes the call instead of jumping into the other function. In a double rotation, `rebalance.finish-left-right` or `rebalance.finish-right-left` comes back to `rebalance` between the two turns.

To open a frame, wrap the work in `withinCall(recorder, algorithm, node, () => ...)`. It works with no recorder too, so the plain functions don't change.

### Step keys

`algorithm-steps.ts` lists the 11 algorithms (`algorithmCodes`) and every step key each one can emit (`stepKeysByAlgorithm`). The rules:

- Every key starts with its algorithm's code: `rebalance.case-left-right` belongs to `rebalance`. TypeScript rejects a key with the wrong prefix.
- The engine can only emit keys from this list, because `StepRecorder.emit` takes a `StepKey`.
- Every key needs a message in `step-messages.ts`. TypeScript fails until it has one.
- A test runs the engine on many random trees and checks that every listed key gets emitted, so the list never holds a dead key.

The backend seeds one `algorithm` row per code, and every code snippet needs a line for every key of its algorithm. To add a step, add the key to the list, write its message, emit it, and add its line to every snippet for that algorithm. The seed fails until you do.

### Every line that runs is a step

The code trace works like a debugger, so the arrow never skips a line that runs. The engine records a step for:

- every `if` and `while`, whether it comes out true or false. The message gives the answer, like "Is 5 smaller than 30? Yes."
- every line that calls another function, before the call starts
- every line that does something or returns

So each algorithm has one shape of code, and every snippet follows it. This is insert in pseudocode, with the step on each line:

```
function insert(node, key)
  if node is empty                         insert.check-empty
    return new Node(key)                   insert.create-node
  if key < node.key                        insert.compare
    node.left = insert(node.left, key)     insert.go-left
  else if key > node.key                   insert.check-bigger
    node.right = insert(node.right, key)   insert.go-right
  else
    return node                            insert.duplicate
  updateHeight(node)                       insert.update-height
  return rebalance(node)                   insert.rebalance
```

Lines that only hold syntax, like `else`, `}` or `function`, have no step. When you write a snippet in another language, keep the same lines in the same order. If a language needs two things on one line, give that line both keys (`// @step rotate-right.check-pivot rotate-right.pick-pivot`), and the arrow stays there for both steps. If you add a check to an algorithm, add a step for it too, or the arrow will skip it.

Rebalance asks which side is heavy with one step, `rebalance.check-side`. Write that as one `if balance > 1 … else …` in every snippet, not as two `if` lines, because the engine records one step for it whichever side is heavy.

## Search

```ts
const searcher = new TreeSearcher(root);
searcher.solve(15);
searcher.getSearchPath(15);
searcher.getSearchMoves(15);
```

- `solve` returns the node with that key, or `null`.
- `getSearchPath` returns every node visited, in order.
- `getSearchMoves` returns the moves taken, like `["left", "right"]`. A key at the root gives `[]`.

When the key isn't in the tree, the path ends at the last node checked. The moves leave out the last direction, the one that found an empty child. In a tree with 20 at the root, 30 to its right and 25 left of 30, searching for 27 gives moves `["right", "left"]` and stops at 25. It doesn't add the final `"right"`.

To show "would go right, but there's nothing there" in an animation, compare the key with the last node in the path. If that comes up often, add it to `TreeSearcher` then.

## Encoding

A tree becomes a string of its keys in pre-order, with `#` for each empty child:

```
20,10,#,#,30,#,#     20 with children 10 and 30
#                    an empty tree
```

The `#` markers matter. Without them, 5 with 10 as its left child and 5 with 10 as its right child would both be `5,10`. A learner's wrong tree could then match the right answer.

`decodeTree` only accepts keys written exactly as `encodeTree` writes them. No spaces, and no other spellings like `1.0` or `0x10`. That gives every tree exactly one string, so a quiz answer is checked by comparing the learner's string with `encodeTree` of the right answer.

`decodeTree` doesn't check BST or AVL order, so a wrong answer still decodes. Bad input throws a `TreeEncodingError`. In the backend, catch it in the use case and throw a `BadRequestError`, or it turns into a 500.

## Goal check

A playground or case study task gives the learner a goal, and `checkGoal(root, goal)` says whether their tree meets it:

```ts
checkGoal(root, { kind: "containsKeys", keys: [25] });
checkGoal(root, { kind: "traversal", order: "inorder", keys: [5, 10, 15, 20, 30] });
checkGoal(root, { kind: "validAvl" });
```

- `containsKeys` passes when every listed key is somewhere in the tree.
- `traversal` passes when walking the tree in the given order gives exactly those keys, in that order.
- `validAvl` passes when the tree is in BST order, every node's stored `height` matches what its children actually give, and every balance factor is `-1`, `0` or `1`.

`TreeGoal` is a plain type, not a zod schema, because `avl/` imports nothing. `playgroundGoalSchema` in `@shared/schemas` is marked `satisfies z.ZodType<TreeGoal>` so the two can't drift apart. The frontend calls `checkGoal` for instant feedback while a learner works, and the backend calls it again to verify before awarding points.

## Size limit

A tree can have at most 1000 nodes (`maxTreeNodes`). `decodeTree` throws a `TreeEncodingError` for anything bigger, before it starts reading.

A learner's tree can be lopsided, so it can be as deep as it has nodes. Decoding and traversal are recursive, and a tree around 100,000 levels deep runs out of stack. The limit keeps us far below that. Lesson and quiz trees are much smaller, and the frontend can use `maxTreeNodes` to stop a learner adding more.
