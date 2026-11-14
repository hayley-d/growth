import { describe, expect, it } from "vitest";

import { getNextRating, getPoints } from "@/domain/assessment/elo-rating";
import { BadRequestError, ConflictError, NotFoundError } from "@/domain/errors";
import {
  asLearner,
  asUser,
  createWorld,
  learnerId,
} from "@/test/application/assessment/attempt-fakes";
import {
  answerAll,
  createUseCases,
  startFor,
  wrongAnswerFor,
} from "@/test/application/assessment/attempt-helpers";

const submitCurrent = async (
  useCases: ReturnType<typeof createUseCases>,
  correct: boolean,
  hintsToTake = 0,
) => {
  const state = await startFor(useCases);
  const question = state.question as NonNullable<typeof state.question>;
  for (let hint = 0; hint < hintsToTake; hint += 1) {
    await asLearner(() => useCases.requestHint({ id: state.attempt.id, questionId: question.id }));
  }
  const answer = correct
    ? useCases.world.correctAnswerOf(question.id)
    : wrongAnswerFor(question.type);
  const response = await asLearner(() =>
    useCases.submitAnswer({ id: state.attempt.id, questionId: question.id, answer }),
  );
  return { state, question, response };
};

describe("makeSubmitAnswer", () => {
  it("grades a right answer, reveals the answer and serves the next question", async () => {
    const useCases = createUseCases();
    const { question, response } = await submitCurrent(useCases, true);
    expect(response.data.isCorrect).toBe(true);
    expect(response.data.correctAnswer).toEqual(useCases.world.correctAnswerOf(question.id));
    expect(response.data.explanation).not.toBeUndefined();
    expect(response.data.attempt.answeredCount).toBe(1);
    expect(response.data.question?.position).toBe(2);
    expect(response.data.result).toBeNull();
  });

  it("grades a wrong answer and still reveals the right one", async () => {
    const useCases = createUseCases();
    const { question, response } = await submitCurrent(useCases, false);
    expect(response.data.isCorrect).toBe(false);
    expect(response.data.points).toBe(0);
    expect(response.data.correctAnswer).toEqual(useCases.world.correctAnswerOf(question.id));
  });

  it("moves the rating of the question's own lesson and saves the mastery", async () => {
    const useCases = createUseCases();
    const { question, response } = await submitCurrent(useCases, true);
    const row = useCases.world.attemptQuestions.find((candidate) => candidate.id === question.id);
    const expected = getNextRating(1000, row?.difficulty ?? 1, 1, 0);
    expect(response.data.rating).toEqual({ before: 1000, after: expected });
    expect(expected).toBeGreaterThan(1000);
    expect(useCases.world.masteryRows.get(`${learnerId}:lesson-a`)).toMatchObject({
      rating: expected,
      currentDifficulty: expect.any(Number),
    });
  });

  it("lowers the rating on a wrong answer", async () => {
    const { response } = await submitCurrent(createUseCases(), false);
    expect(response.data.rating.after).toBeLessThan(response.data.rating.before);
  });

  it("scores less when hints were used", async () => {
    const useCases = createUseCases();
    const { question, response } = await submitCurrent(useCases, true, 1);
    const row = useCases.world.attemptQuestions.find((candidate) => candidate.id === question.id);
    expect(response.data.hintsUsed).toBe(1);
    expect(response.data.points).toBe(getPoints(row?.difficulty ?? 1, 0.75));
  });

  it("stores the seed and snapshot of a generated question with the answer", async () => {
    const useCases = createUseCases();
    const state = await startFor(useCases);
    await answerAll(useCases, state.attempt.id);
    const saved = useCases.world.attemptAnswers.find((row) => row.questionId === "q-generated");
    expect(saved?.generatedQuestion).not.toBeNull();
    expect(saved?.seed).not.toBeNull();
    expect(saved?.answerOptionId).toBeNull();
  });

  it("links a written multiple choice answer to its option", async () => {
    const useCases = createUseCases();
    const state = await startFor(useCases);
    await answerAll(useCases, state.attempt.id);
    const saved = useCases.world.attemptAnswers.find((row) => row.questionId === "q-choice");
    expect(saved?.answerOptionId).toBe("option-right");
  });

  it("accepts any accepted text answer ignoring case and spaces", async () => {
    const useCases = createUseCases();
    const state = await startFor(useCases);
    await answerAll(useCases, state.attempt.id);
    expect(
      useCases.world.attemptAnswers.find((row) => row.questionId === "q-text")?.isCorrect,
    ).toBe(true);
  });

  it("returns 409 when the same question is answered twice", async () => {
    const useCases = createUseCases();
    const { state, question } = await submitCurrent(useCases, true);
    await expect(
      asLearner(() =>
        useCases.submitAnswer({
          id: state.attempt.id,
          questionId: question.id,
          answer: useCases.world.correctAnswerOf(question.id),
        }),
      ),
    ).rejects.toBeInstanceOf(ConflictError);
    expect(useCases.world.attemptAnswers).toHaveLength(1);
  });

  it("returns 409 for a question that is not the current one", async () => {
    const useCases = createUseCases();
    const state = await startFor(useCases);
    const later = useCases.world.attemptQuestions.find((row) => row.position === 2);
    await expect(
      asLearner(() =>
        useCases.submitAnswer({
          id: state.attempt.id,
          questionId: later?.id ?? "",
          answer: useCases.world.correctAnswerOf(later?.id ?? ""),
        }),
      ),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("returns 404 for a question that is not part of the attempt", async () => {
    const useCases = createUseCases();
    const state = await startFor(useCases);
    await expect(
      asLearner(() =>
        useCases.submitAnswer({
          id: state.attempt.id,
          questionId: "nope",
          answer: { type: "text", text: "x" },
        }),
      ),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("returns 400 when the answer type does not fit the question", async () => {
    const useCases = createUseCases();
    const state = await startFor(useCases, "lesson-b");
    await expect(
      asLearner(() =>
        useCases.submitAnswer({
          id: state.attempt.id,
          questionId: state.question?.id ?? "",
          answer: { type: "text", text: "x" },
        }),
      ),
    ).rejects.toBeInstanceOf(BadRequestError);
    expect(useCases.world.attemptAnswers).toHaveLength(0);
  });

  it("returns 404 for another learner's attempt", async () => {
    const useCases = createUseCases();
    const state = await startFor(useCases);
    await expect(
      asUser("user-2", () =>
        useCases.submitAnswer({
          id: state.attempt.id,
          questionId: state.question?.id ?? "",
          answer: { type: "text", text: "x" },
        }),
      ),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("finishes after the last answer, completes the lesson and lists nothing to review", async () => {
    const useCases = createUseCases();
    const state = await startFor(useCases);
    const last = await answerAll(useCases, state.attempt.id);
    expect(last?.data.question).toBeNull();
    expect(last?.data.attempt).toMatchObject({ status: "finished", answeredCount: 3 });
    expect(last?.data.result).toMatchObject({ score: 100, passed: true, reviewLessons: [] });
    expect(last?.data.result?.answers).toHaveLength(3);
    expect(last?.data.result?.points).toBeGreaterThan(0);
    expect(useCases.world.completeLesson).toHaveBeenCalledWith({
      userId: learnerId,
      lessonId: "lesson-a",
    });
    expect(useCases.world.attempts[0]).toMatchObject({ passed: true, score: 100 });
    expect(useCases.world.attempts[0]?.finishedAt).not.toBeNull();
  });

  it("fails the attempt, skips completion and lists the lessons to review", async () => {
    const useCases = createUseCases();
    const state = await startFor(useCases, "checkpoint-1");
    const last = await answerAll(useCases, state.attempt.id, () => false);
    expect(last?.data.result).toMatchObject({ score: 0, passed: false, points: 0 });
    expect(last?.data.result?.ratingChange).toBeLessThan(0);
    const result = last?.data.result;
    expect(result?.masteryBefore).toBeGreaterThan(result?.masteryAfter ?? 100);
    expect(last?.data.result?.reviewLessons).toHaveLength(2);
    expect(last?.data.result?.reviewLessons).toEqual(
      expect.arrayContaining([
        { id: "lesson-a", title: "Title of lesson-a" },
        { id: "lesson-b", title: "Title of lesson-b" },
      ]),
    );
    expect(useCases.world.completeLesson).not.toHaveBeenCalled();
  });

  it("passes at exactly 80 percent", async () => {
    const useCases = createUseCases(createWorld({ questions: undefined }));
    const state = await startFor(useCases, "final-1");
    const last = await answerAll(useCases, state.attempt.id, (position) => position !== 1);
    expect(last?.data.result).toMatchObject({ score: 80, passed: true });
    expect(useCases.world.completeLesson).toHaveBeenCalledWith({
      userId: learnerId,
      lessonId: "final-1",
    });
  });

  it("fails at 60 percent", async () => {
    const useCases = createUseCases();
    const state = await startFor(useCases, "final-1");
    const last = await answerAll(useCases, state.attempt.id, (position) => position > 2);
    expect(last?.data.result).toMatchObject({ score: 60, passed: false });
  });

  it("returns 409 for an answer after the attempt is finished", async () => {
    const useCases = createUseCases();
    const state = await startFor(useCases, "lesson-b");
    await answerAll(useCases, state.attempt.id);
    await expect(
      asLearner(() =>
        useCases.submitAnswer({
          id: state.attempt.id,
          questionId: useCases.world.attemptQuestions[0]?.id ?? "",
          answer: { type: "build_tree", tree: "2,1,#,#,3,#,#" },
        }),
      ),
    ).rejects.toBeInstanceOf(ConflictError);
  });
});
