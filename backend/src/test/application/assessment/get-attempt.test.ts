import { describe, expect, it } from "vitest";

import { NotFoundError } from "@/domain/errors";
import { asLearner, asUser } from "@/test/application/assessment/attempt-fakes";
import { answerAll, createUseCases, startFor } from "@/test/application/assessment/attempt-helpers";

describe("makeGetAttempt", () => {
  it("returns the current question of an attempt in progress", async () => {
    const useCases = createUseCases();
    const started = await startFor(useCases);
    const { data } = await asLearner(() => useCases.getAttempt({ id: started.attempt.id }));
    expect(data.attempt.status).toBe("in_progress");
    expect(data.question?.id).toBe(started.question?.id);
    expect(data.result).toBeNull();
  });

  it("returns the result of a finished attempt without completing the lesson again", async () => {
    const useCases = createUseCases();
    const started = await startFor(useCases);
    await answerAll(useCases, started.attempt.id);
    useCases.world.completeLesson.mockClear();
    const { data } = await asLearner(() => useCases.getAttempt({ id: started.attempt.id }));
    expect(data.question).toBeNull();
    expect(data.result).toMatchObject({ passed: true, score: 100 });
    expect(useCases.world.completeLesson).not.toHaveBeenCalled();
  });

  it("finishes an attempt whose last answer was saved but never finished", async () => {
    const useCases = createUseCases();
    const started = await startFor(useCases, "lesson-b");
    await asLearner(() =>
      useCases.world.dependencies.attemptAnswerRepository.recordAnswer({
        answer: {
          assessmentAttemptId: started.attempt.id,
          questionId: "q-tree",
          attemptQuestionId:
            useCases.world.attemptQuestions.find((row) => row.questionId === "q-tree")?.id ?? "",
          response: { type: "build_tree", tree: "2,1,#,#,3,#,#" },
          isCorrect: true,
          difficulty: 2,
          hintsUsed: 0,
          ratingBefore: 1000,
          ratingAfter: 1010,
        },
        mastery: {
          userId: "user-1",
          lessonId: "lesson-b",
          rating: 1010,
          mastery: 0.3,
          currentDifficulty: 2,
        },
      }),
    );
    const { data } = await asLearner(() => useCases.getAttempt({ id: started.attempt.id }));
    expect(data.attempt.status).toBe("finished");
    expect(data.result?.passed).toBe(true);
    expect(useCases.world.completeLesson).toHaveBeenCalledOnce();
  });

  it("returns 404 for another learner's attempt", async () => {
    const useCases = createUseCases();
    const started = await startFor(useCases);
    await expect(
      asUser("user-2", () => useCases.getAttempt({ id: started.attempt.id })),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("returns 404 for an attempt that does not exist", async () => {
    await expect(
      asLearner(() => createUseCases().getAttempt({ id: "nope" })),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("returns 404 for a daily challenge attempt", async () => {
    const useCases = createUseCases();
    const attempt = await useCases.world.dependencies.assessmentAttemptRepository.create({
      userId: "user-1",
      kind: "daily_challenge",
    });
    await expect(asLearner(() => useCases.getAttempt({ id: attempt.id }))).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
