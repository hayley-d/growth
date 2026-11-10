import { z } from "zod";

import { type AvlNode, randomTree, type TraversalOrder } from "@shared/avl";

export const playgroundTopics = ["avl", "traversal"] as const;
export const playgroundTraversals = ["preorder", "inorder", "postorder", "levelorder"] as const;
export const playgroundExploreModes = ["watch", "interact"] as const;
export const playgroundStarts = ["small", "large", "empty"] as const;

export type PlaygroundTopic = (typeof playgroundTopics)[number];
export type PlaygroundExplore = (typeof playgroundExploreModes)[number];
export type PlaygroundStart = (typeof playgroundStarts)[number];

export const playgroundSearchSchema = z.object({
  topic: z.enum(playgroundTopics).optional().catch(undefined),
  traversal: z.enum(playgroundTraversals).optional().catch(undefined),
  explore: z.enum(playgroundExploreModes).optional().catch(undefined),
  start: z.enum(playgroundStarts).optional().catch(undefined),
  seed: z.coerce.number().int().min(1).max(2147483647).optional().catch(undefined),
});

export type PlaygroundSearch = z.infer<typeof playgroundSearchSchema>;

export type PlaygroundSetup = {
  topic: PlaygroundTopic;
  traversal: TraversalOrder;
  explore: PlaygroundExplore;
  start: PlaygroundStart;
  seed: number;
};

export const maxPlaygroundKeys = 50;

export const startSizes: Record<Exclude<PlaygroundStart, "empty">, number> = {
  small: 5,
  large: 12,
};

export const topicNames: Record<PlaygroundTopic, string> = {
  avl: "Tree building",
  traversal: "Traversals",
};

export const traversalNames: Record<TraversalOrder, string> = {
  preorder: "Pre-order",
  inorder: "In-order",
  postorder: "Post-order",
  levelorder: "Level-order",
};

export const traversalRules: Record<TraversalOrder, string> = {
  preorder: "Node, then left, then right.",
  inorder: "Left, node, right. The keys come out in order.",
  postorder: "Left, right, then the node.",
  levelorder: "Row by row, from the top down.",
};

export const exploreNames: Record<PlaygroundExplore, string> = {
  watch: "Watch it run",
  interact: "Interact with the tree",
};

export const startNames: Record<PlaygroundStart, string> = {
  small: "A small random tree",
  large: "A large random tree",
  empty: "An empty tree",
};

export const newSeed = () => 1 + Math.floor(Math.random() * 2147483646);

export const toSetup = (search: PlaygroundSearch): PlaygroundSetup | null => {
  const { topic, traversal, explore, start } = search;
  if (!topic || !explore || !start) return null;
  if (topic === "traversal" && !traversal) return null;
  return {
    topic,
    traversal: traversal ?? "inorder",
    explore,
    start,
    seed: search.seed ?? 1,
  };
};

export const toSearch = (setup: PlaygroundSetup): PlaygroundSearch => ({
  topic: setup.topic,
  traversal: setup.topic === "traversal" ? setup.traversal : undefined,
  explore: setup.explore,
  start: setup.start,
  seed: setup.seed,
});

export const startSize = (start: PlaygroundStart): number =>
  start === "large" ? startSizes.large : startSizes.small;

export const startTree = (setup: Pick<PlaygroundSetup, "start" | "seed">): AvlNode | null =>
  setup.start === "empty" ? null : randomTree({ size: startSize(setup.start), seed: setup.seed });
