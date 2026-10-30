---
title: Shared
description: The HTTP contract and the AVL tree rules that the frontend and backend share.
---

```
shared/src/
  schemas/              zod schemas for every request and response
  avl/
    index.ts              re-exports everything in src/
    src/
      algorithm-steps.ts  the algorithm codes and every step key each one can emit
      step-messages.ts    the sentence for each step key, built from that step's variables
      step-recorder.ts    Step and StepRecorder: snapshots of the tree as an operation runs
      avl-tree.ts         insert, remove, rotations, rebalance, layout, and their trace* versions
      tree-traversal.ts   TreeTraversal and traceTraversal: walk a tree one node at a time
      tree-searcher.ts    TreeSearcher and traceSearch: find a key and the path to it
      tree-encoding.ts    encodeTree and decodeTree: a tree as a string
      goal-check.ts       checkGoal: did the learner's tree meet a playground goal
    test/                 one <file>.test.ts for each file in src/
```

`schemas/` is the contract between the frontend and the backend. `avl/` holds the tree rules, so both sides use one copy. `avl/` imports nothing else, so it runs in the browser and in the backend `domain` layer.

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
  message: "40 is bigger than 20, so go right.",
  variables: { key: 40, node: 20 },
}
```

- `tree` is always the whole tree as it is at that moment, not just the subtree being worked on. Heights above the change stay old until the `update-height` steps on the way back up, just like in the real algorithm.
- `nodeStates` gives a node one of `active`, `visited`, `deleting`, `unbalanced` or `new`. It only names keys that are in that step's tree, and steps share one frozen object until a state changes.
- `message` is shown on screen and read out by text-to-speech. It comes from `step-messages.ts`, which has one function per step key. Each function takes that step's variables, so the engine only passes variables and the wording lives in one file.
- `stepKey` names the point in the algorithm. The code trace uses it to find the line to highlight.

How long each state lasts:

| State | From | Until |
| --- | --- | --- |
| `active` | the step that works on the node | the focus moves on, then it's `visited` |
| `new` | the step that creates the node | the next step, then it's `visited` |
| `unbalanced` | the step that names the rotation case | the rotation starts on that node |
| `deleting` | the step that removes or replaces the node | the node is gone |

States are keyed by node key. For a few steps of a delete with two children, the copied successor and the old successor leaf have the same key, so they show the same state. That ends when the leaf is removed.

Insert and delete also run `update-height`, `rebalance` and the rotations as they unwind, so their steps include those keys too.

### Step keys

`algorithm-steps.ts` lists the 11 algorithms (`algorithmCodes`) and every step key each one can emit (`stepKeysByAlgorithm`). The rules:

- Every key starts with its algorithm's code: `rebalance.case-left-right` belongs to `rebalance`. TypeScript rejects a key with the wrong prefix.
- The engine can only emit keys from this list, because `StepRecorder.emit` takes a `StepKey`.
- Every key needs a message in `step-messages.ts`. TypeScript fails until it has one.
- A test runs the engine on many random trees and checks that every listed key gets emitted, so the list never holds a dead key.

The backend seeds one `algorithm` row per code, and every code snippet needs a line for every key of its algorithm. To add a step, add the key to the list, write its message, emit it, and add its line to every snippet for that algorithm. The seed fails until you do.

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

`TreeGoal` is a plain type, not a zod schema, because `avl/` imports nothing. `playgroundGoalSchema` in `@shared/schemas/content-block` is marked `satisfies z.ZodType<TreeGoal>` so the two can't drift apart. The frontend calls `checkGoal` for instant feedback while a learner works, and the backend calls it again to verify before awarding points.

## Size limit

A tree can have at most 1000 nodes (`maxTreeNodes`). `decodeTree` throws a `TreeEncodingError` for anything bigger, before it starts reading.

A learner's tree can be lopsided, so it can be as deep as it has nodes. Decoding and traversal are recursive, and a tree around 100,000 levels deep runs out of stack. The limit keeps us far below that. Lesson and quiz trees are much smaller, and the frontend can use `maxTreeNodes` to stop a learner adding more.
