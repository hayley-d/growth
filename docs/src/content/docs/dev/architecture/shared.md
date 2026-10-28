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
      avl-tree.ts         insert, remove, rotations, rebalance, layout
      tree-traversal.ts   TreeTraversal: walk a tree one node at a time
      tree-searcher.ts    TreeSearcher: find a key and the path to it
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

The order is `"preorder"`, `"inorder"` or `"postorder"`. `next()` returns the next node, and `null` once `reachedEnd()` is true. `reset()` starts again from the first node.

You can also spread it or use `for...of`. Both give the nodes that are left, so after two `next()` calls you get the rest, not the whole tree.

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
