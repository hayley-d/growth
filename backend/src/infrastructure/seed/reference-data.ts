import type { NewAlgorithm } from "@/domain/course-content/algorithm";
import type { NewCodeLanguage } from "@/domain/course-content/code-language";
import type { NewLearningStyle } from "@/domain/course-content/learning-style";

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
