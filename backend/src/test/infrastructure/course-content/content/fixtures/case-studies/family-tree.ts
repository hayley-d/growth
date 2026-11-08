import type { CaseStudyContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  key: "family-tree",
  lesson: "binary-tree",
  position: 1,
  title: "A family tree",
  scenario: "You are drawing a family tree.",
  body: "Each person has at most two children in this tree.",
  task: {
    startingKeys: [20],
    allowedOperations: ["insert"],
    instructions: "Add 10 and 30.",
    goal: { kind: "containsKeys", keys: [10, 20, 30] },
  },
} satisfies CaseStudyContent;
