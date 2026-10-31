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
  { code: "cpp", name: "C++" },
  { code: "c", name: "C" },
  { code: "rust", name: "Rust" },
  { code: "python", name: "Python" },
  { code: "javascript", name: "JavaScript" },
  { code: "pseudocode", name: "Pseudocode" },
];
