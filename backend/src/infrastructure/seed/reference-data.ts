import type { NewAlgorithm } from "@/domain/course-content/algorithm";
import type { NewCodeLanguage } from "@/domain/course-content/code-language";
import type { NewLearningStyle } from "@/domain/course-content/learning-style";
import type { NewLesson } from "@/domain/course-content/lesson";
import type { NewUnit } from "@/domain/course-content/unit";

export const learningStyles: NewLearningStyle[] = [
  {
    name: "Visual",
    description: "You learn best from diagrams, animations and watching the tree change.",
  },
  {
    name: "Auditory",
    description: "You learn best by listening, so lesson steps can be read aloud to you.",
  },
  {
    name: "Reading/writing",
    description: "You learn best from written explanations and putting ideas in your own words.",
  },
  {
    name: "Kinesthetic",
    description: "You learn best by doing: building trees and trying things in the playground.",
  },
];

export const codeLanguages: NewCodeLanguage[] = [
  { code: "java", name: "Java" },
  { code: "rust", name: "Rust" },
  { code: "pseudocode", name: "Pseudocode" },
];

export const algorithms: NewAlgorithm[] = [
  { code: "insert", name: "Insert" },
  { code: "delete", name: "Delete" },
  { code: "search", name: "Search" },
  { code: "rotate-left", name: "Rotate left" },
  { code: "rotate-right", name: "Rotate right" },
  { code: "rebalance", name: "Rebalance" },
  { code: "update-height", name: "Update height and balance" },
  { code: "preorder", name: "Pre-order traversal" },
  { code: "inorder", name: "In-order traversal" },
  { code: "postorder", name: "Post-order traversal" },
  { code: "levelorder", name: "Level-order traversal" },
];

export type SeedLesson = Omit<NewLesson, "unitId">;

export type SeedUnit = NewUnit & { lessons: SeedLesson[] };

export const units: SeedUnit[] = [
  {
    title: "Binary trees and traversals",
    position: 1,
    lessons: [
      {
        title: "What is a binary tree",
        summary: "Meet nodes, children and the shape of a binary tree.",
        kind: "lesson",
        position: 1,
      },
      {
        title: "Pre-order",
        summary: "Visit the node first, then its left and right subtrees.",
        kind: "lesson",
        position: 2,
      },
      {
        title: "In-order",
        summary: "Visit the left subtree, then the node, then the right subtree.",
        kind: "lesson",
        position: 3,
      },
      {
        title: "Post-order",
        summary: "Visit both subtrees first and the node last.",
        kind: "lesson",
        position: 4,
      },
      {
        title: "Level-order",
        summary: "Visit the tree one level at a time, from the top down.",
        kind: "lesson",
        position: 5,
      },
      {
        title: "Traversal checkpoint",
        summary: "A short quiz to check you can tell the four traversals apart.",
        kind: "checkpoint",
        position: 6,
      },
    ],
  },
  {
    title: "AVL trees",
    position: 2,
    lessons: [
      {
        title: "Height and balance factor",
        summary: "Work out how tall each node is and when a tree is out of balance.",
        kind: "lesson",
        position: 1,
      },
      {
        title: "Single rotations",
        summary: "Fix a left-left or right-right imbalance with one rotation.",
        kind: "lesson",
        position: 2,
      },
      {
        title: "Double rotations",
        summary: "Fix a left-right or right-left imbalance with two rotations.",
        kind: "lesson",
        position: 3,
      },
      {
        title: "Inserting into an AVL tree",
        summary: "Insert a key, then rebalance on the way back up.",
        kind: "lesson",
        position: 4,
      },
      {
        title: "Deleting from an AVL tree",
        summary: "Remove a key, then rebalance every node that went out of balance.",
        kind: "lesson",
        position: 5,
      },
      {
        title: "AVL final challenge",
        summary: "A final quiz that puts insertion, deletion and rotations together.",
        kind: "checkpoint",
        position: 6,
      },
    ],
  },
];
