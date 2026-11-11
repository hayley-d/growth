import { describe, expect, it, vi } from "vitest";

import { makeGetLesson } from "@/application/lesson/queries/get-lesson";
import type { Logger } from "@/application/logging/logger";
import type { ContentBlock } from "@/domain/course-content/content-block";
import { ForbiddenError, InvalidContentError, NotFoundError } from "@/domain/errors";
import { asLearner, createAccessDependencies } from "@/test/application/lesson/lesson-fakes";

const unit = { id: "unit-1", title: "Unit one", position: 1 };
const styleId = "visual-id";
const otherStyleId = "reading-id";

const textBody = (markdown: string) => ({ markdown });

const block = (overrides: Partial<ContentBlock>): ContentBlock => ({
  id: "block",
  lessonId: "lesson-1",
  learningStyleId: null,
  type: "text",
  body: textBody("hello"),
  transcript: "transcript",
  position: 1,
  ...overrides,
});

const createLogger = (): Logger => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

const createGetLesson = ({
  blocks = [] as ContentBlock[],
  learningStyleId = null as string | null,
  progress = {} as Record<string, "completed" | "started" | "locked">,
  logger = createLogger(),
} = {}) =>
  makeGetLesson({
    ...createAccessDependencies({ progress }),
    unitRepository: { findById: async () => unit },
    contentBlockRepository: { listByLessonId: async () => blocks },
    userProfileRepository: {
      findById: async (userId) => ({
        userId,
        textToSpeech: false,
        colourTheme: "default",
        showOnLeaderboard: true,
        onboardingComplete: true,
        learningStyleId,
        codeLanguageId: null,
      }),
    },
    logger,
  });

describe("makeGetLesson", () => {
  it("returns the lesson, its unit, neighbours and status", async () => {
    const response = await asLearner(() => createGetLesson()({ id: "lesson-1" }));
    expect(response.data).toMatchObject({
      lesson: {
        id: "lesson-1",
        notePrompt: "Explain it in your own words",
        objectives: ["Insert a key into a binary tree"],
      },
      unit,
      status: "current",
      previousLessonId: null,
      nextLessonId: "lesson-2",
      steps: [],
    });
  });

  it("marks a lesson completed from its own progress", async () => {
    const response = await asLearner(() =>
      createGetLesson({ progress: { "lesson-1": "completed" } })({ id: "lesson-1" }),
    );
    expect(response.data.status).toBe("completed");
  });

  it("rejects a locked lesson", async () => {
    await expect(asLearner(() => createGetLesson()({ id: "lesson-2" }))).rejects.toBeInstanceOf(
      ForbiddenError,
    );
  });

  it("treats a retired lesson as not found", async () => {
    await expect(asLearner(() => createGetLesson()({ id: "retired-1" }))).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("orders steps and splits core, style and other blocks", async () => {
    const blocks = [
      block({ id: "b-other", position: 1, learningStyleId: otherStyleId }),
      block({ id: "b-second", position: 2 }),
      block({ id: "b-core", position: 1 }),
      block({ id: "b-style", position: 1, learningStyleId: styleId }),
    ];
    const response = await asLearner(() =>
      createGetLesson({ blocks, learningStyleId: styleId })({ id: "lesson-1" }),
    );
    const [first, second] = response.data.steps;
    expect(response.data.steps.map((step) => step.position)).toEqual([1, 2]);
    expect(first?.coreBlock.id).toBe("b-core");
    expect(first?.coreBlock.learningStyleId).toBeNull();
    expect(first?.styleBlock).toMatchObject({ id: "b-style", learningStyleId: styleId });
    expect(first?.otherBlocks.map((other) => other.learningStyleId)).toEqual([otherStyleId]);
    expect(second?.styleBlock).toBeNull();
    expect(second?.otherBlocks).toEqual([]);
  });

  it("puts every styled block in other blocks when the learner has no style", async () => {
    const blocks = [
      block({ id: "b-core", position: 1 }),
      block({ id: "b-style", position: 1, learningStyleId: styleId }),
    ];
    const response = await asLearner(() => createGetLesson({ blocks })({ id: "lesson-1" }));
    const [step] = response.data.steps;
    expect(step?.styleBlock).toBeNull();
    expect(step?.otherBlocks.map((other) => other.id)).toEqual(["b-style"]);
  });

  it("logs and throws for a block body that does not match its type", async () => {
    const logger = createLogger();
    const blocks = [block({ id: "bad", body: { markdown: "" } })];
    await expect(
      asLearner(() => createGetLesson({ blocks, logger })({ id: "lesson-1" })),
    ).rejects.toBeInstanceOf(InvalidContentError);
    expect(logger.error).toHaveBeenCalledWith(
      "Lesson content block is invalid",
      expect.objectContaining({ lessonId: "lesson-1", blockId: "bad" }),
    );
  });

  it("logs and throws for a step with no core block", async () => {
    const logger = createLogger();
    const blocks = [block({ id: "styled", learningStyleId: styleId })];
    await expect(
      asLearner(() => createGetLesson({ blocks, logger })({ id: "lesson-1" })),
    ).rejects.toBeInstanceOf(InvalidContentError);
    expect(logger.error).toHaveBeenCalled();
  });
});
