import type { LessonResponse, LessonStepBlock } from "@shared/schemas";

export const lessonFixtureId = "00000000-0000-4000-8000-000000000003";
export const visualStyleId = "00000000-0000-4000-8000-0000000000a1";
export const kinestheticStyleId = "00000000-0000-4000-8000-0000000000a2";

export const learningStylesResponse = {
  data: {
    learningStyles: [
      { id: visualStyleId, name: "Visual", description: "Pictures" },
      { id: kinestheticStyleId, name: "Kinesthetic", description: "Doing" },
    ],
  },
};

let blockNumber = 0;

const block = (
  content: Omit<LessonStepBlock, "id" | "transcript" | "learningStyleId">,
  transcript: string,
  learningStyleId: string | null = null,
): LessonStepBlock => {
  blockNumber += 1;
  return {
    ...content,
    id: `00000000-0000-4000-8000-${String(blockNumber).padStart(12, "0")}`,
    transcript,
    learningStyleId,
  } as LessonStepBlock;
};

export const buildLesson = (
  overrides: Partial<LessonResponse["data"]["lesson"]> = {},
): LessonResponse => ({
  data: {
    lesson: {
      id: lessonFixtureId,
      title: "Pre-order",
      summary: "Visit the node first.",
      kind: "lesson",
      position: 2,
      notePrompt: "How does pre-order pick the next node?",
      objectives: ["Trace a pre-order walk", "Copy a tree with pre-order"],
      ...overrides,
    },
    unit: { id: "00000000-0000-4000-8000-0000000000b1", title: "Binary trees", position: 1 },
    status: "current",
    previousLessonId: null,
    nextLessonId: null,
    steps: [
      {
        position: 1,
        coreBlock: block(
          {
            type: "text",
            body: {
              markdown: "## The rule\n\nVisit the **node**, then go left.",
              terms: { node: [8] },
            },
          },
          "Visit the node, then go left.",
        ),
        styleBlock: block(
          {
            type: "diagram",
            body: {
              startingKeys: [8, 4, 12],
              highlights: [{ key: 8, state: "active" }],
              labels: [{ text: ["8 is the root"], keys: [8], place: "right" }],
              caption: "The root comes first",
            },
          },
          "8 is lit because it comes first.",
          visualStyleId,
        ),
        otherBlocks: [
          block(
            {
              type: "playground",
              body: {
                startingKeys: [8, 4, 12],
                allowedOperations: ["traverse"],
                instructions: "Tap the nodes in pre-order.",
                goal: { kind: "traversal", order: "preorder", keys: [8, 4, 12] },
              },
            },
            "Tap 8, then 4, then 12.",
            kinestheticStyleId,
          ),
        ],
      },
      {
        position: 2,
        coreBlock: block(
          {
            type: "animation",
            body: {
              startingKeys: [8],
              steps: [
                { operation: "insert", key: 4 },
                { operation: "insert", key: 12 },
              ],
              autoplay: false,
            },
          },
          "Watch 4 and 12 go in.",
        ),
        styleBlock: null,
        otherBlocks: [],
      },
    ],
  },
});
