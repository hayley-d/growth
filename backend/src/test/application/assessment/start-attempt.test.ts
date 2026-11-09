import { describe, expect, it } from "vitest";

import { ConflictError, NotFoundError, UnauthorizedError } from "@/domain/errors";
import {
  asLearner,
  createWorld,
  learnerId,
  questions,
} from "@/test/application/assessment/attempt-fakes";
import { createUseCases, startFor } from "@/test/application/assessment/attempt-helpers";

describe("makeStartAttempt", () => {
  it("starts a lesson test with every question the lesson owns", async () => {
    const useCases = createUseCases();
    const { response, created } = await asLearner(() => useCases.startAttempt({ id: "lesson-a" }));
    expect(created).toBe(true);
    expect(response.data.attempt).toMatchObject({
      lessonId: "lesson-a",
      kind: "lesson_test",
      status: "in_progress",
      total: 3,
      answeredCount: 0,
    });
    expect(response.data.question?.position).toBe(1);
    expect(response.data.result).toBeNull();
    expect(useCases.world.attempts[0]?.userId).toBe(learnerId);
  });

  it("draws a checkpoint from every lesson in its unit", async () => {
    const useCases = createUseCases();
    const state = await startFor(useCases, "checkpoint-1");
    expect(state.attempt.kind).toBe("checkpoint");
    expect(state.attempt.total).toBe(4);
    const served = useCases.world.attemptQuestions.map((row) => row.questionId).sort();
    expect(served).toEqual(["q-choice", "q-generated", "q-text", "q-tree"]);
  });

  it("draws the final challenge from every unit and caps it at five questions", async () => {
    const extra = { ...questions[3], id: "q-extra" } as (typeof questions)[number];
    const useCases = createUseCases(createWorld({ questions: [...questions, extra] }));
    const state = await startFor(useCases, "final-1");
    expect(state.attempt.kind).toBe("checkpoint");
    expect(state.attempt.total).toBe(5);
    const served = useCases.world.attemptQuestions.map((row) => row.questionId);
    expect(new Set(served).size).toBe(5);
  });

  it("uses all questions when the pool has fewer than five", async () => {
    const useCases = createUseCases();
    expect((await startFor(useCases, "lesson-b")).attempt.total).toBe(1);
  });

  it("resumes an unfinished attempt instead of making a new one", async () => {
    const useCases = createUseCases();
    const first = await startFor(useCases);
    const { response, created } = await asLearner(() => useCases.startAttempt({ id: "lesson-a" }));
    expect(created).toBe(false);
    expect(response.data.attempt.id).toBe(first.attempt.id);
    expect(useCases.world.attempts).toHaveLength(1);
    expect(useCases.world.attemptQuestions).toHaveLength(3);
  });

  it("generates questions at the learner's difficulty and keeps the seed and snapshot", async () => {
    const useCases = createUseCases(
      createWorld({
        mastery: [
          {
            userId: learnerId,
            lessonId: "lesson-a",
            rating: 1100,
            mastery: 0.5,
            currentDifficulty: 3,
            updatedAt: new Date(),
          },
        ],
      }),
    );
    await startFor(useCases);
    const generated = useCases.world.attemptQuestions.find(
      (row) => row.questionId === "q-generated",
    );
    expect(generated?.difficulty).toBe(3);
    expect(generated?.seed).toBeGreaterThanOrEqual(0);
    expect(generated?.seed).toBeLessThan(2 ** 31);
    expect(generated?.generatedQuestion).toMatchObject({ hints: expect.any(Array) });
  });

  it("starts generated questions at difficulty 1 when the learner has no mastery yet", async () => {
    const useCases = createUseCases();
    await startFor(useCases);
    const generated = useCases.world.attemptQuestions.find(
      (row) => row.questionId === "q-generated",
    );
    expect(generated?.difficulty).toBe(1);
  });

  it("keeps written questions at their stored difficulty", async () => {
    const useCases = createUseCases();
    await startFor(useCases);
    const written = useCases.world.attemptQuestions.find((row) => row.questionId === "q-choice");
    expect(written).toMatchObject({ difficulty: 2, seed: null, generatedQuestion: null });
  });

  it("never sends an answer with the question", async () => {
    const useCases = createUseCases();
    const state = await startFor(useCases);
    const text = JSON.stringify(state);
    for (const leak of ["isCorrect", "accepted", 'answer"', "explanation"]) {
      expect(text).not.toContain(leak);
    }
  });

  it("rejects a lesson with no questions with a 409", async () => {
    const useCases = createUseCases(createWorld({ questions: [] }));
    await expect(asLearner(() => useCases.startAttempt({ id: "lesson-a" }))).rejects.toBeInstanceOf(
      ConflictError,
    );
    expect(useCases.world.attempts).toHaveLength(0);
  });

  it("rejects an unknown lesson", async () => {
    const useCases = createUseCases();
    await expect(asLearner(() => useCases.startAttempt({ id: "nope" }))).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("saves nothing when the attempt and its questions cannot be saved together", async () => {
    const useCases = createUseCases();
    useCases.world.dependencies.assessmentAttemptRepository.createWithQuestions.mockRejectedValueOnce(
      new Error("database down"),
    );
    await expect(asLearner(() => useCases.startAttempt({ id: "lesson-a" }))).rejects.toThrow(
      "database down",
    );
    expect(useCases.world.attempts).toHaveLength(0);
    expect(useCases.world.attemptQuestions).toHaveLength(0);
  });

  it("hands back the attempt a parallel start created first", async () => {
    const useCases = createUseCases();
    const { createWithQuestions } = useCases.world.dependencies.assessmentAttemptRepository;
    createWithQuestions.mockImplementationOnce(async (entity, drafts) => {
      await createWithQuestions.getMockImplementation()?.(entity, drafts);
      throw new ConflictError("Already started");
    });
    const { response, created } = await asLearner(() => useCases.startAttempt({ id: "lesson-a" }));
    expect(created).toBe(false);
    expect(response.data.attempt.id).toBe(useCases.world.attempts[0]?.id);
    expect(useCases.world.attempts).toHaveLength(1);
  });

  it("passes on a conflict when there is no attempt to resume", async () => {
    const useCases = createUseCases();
    useCases.world.dependencies.assessmentAttemptRepository.createWithQuestions.mockRejectedValueOnce(
      new ConflictError("Clash"),
    );
    await expect(asLearner(() => useCases.startAttempt({ id: "lesson-a" }))).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it("rejects a signed out request", async () => {
    const useCases = createUseCases();
    await expect(useCases.startAttempt({ id: "lesson-a" })).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
  });
});
