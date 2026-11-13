import { describe, expect, it } from "vitest";

import { makeFinishPractice } from "@/application/assessment/commands/finish-practice";
import { makeNextPracticeQuestion } from "@/application/assessment/commands/next-practice-question";
import { makeStartPractice } from "@/application/assessment/commands/start-practice";
import { makeGetPracticeTopics } from "@/application/assessment/queries/get-practice-topics";
import type { Question } from "@/domain/assessment/question";
import { ConflictError, NotFoundError } from "@/domain/errors";
import {
  asLearner,
  asUser,
  createRandom,
  createWorld,
  questions,
  type World,
} from "@/test/application/assessment/attempt-fakes";
import { createUseCases, wrongAnswerFor } from "@/test/application/assessment/attempt-helpers";

const generated = questions.find((row) => row.id === "q-generated") as Question;

const createPractice = (world: World = createWorld(), completedLessonIds: string[] = []) => {
  const dependencies = {
    ...world.dependencies,
    lessonProgressRepository: {
      listByUserId: async () =>
        completedLessonIds.map((lessonId) => ({
          userId: "user-1",
          lessonId,
          status: "completed" as const,
        })),
    },
    random: createRandom(),
  } as unknown as Parameters<typeof makeStartPractice>[0];
  return {
    world,
    useCases: createUseCases(world),
    getTopics: makeGetPracticeTopics(dependencies),
    start: makeStartPractice(dependencies),
    next: makeNextPracticeQuestion(dependencies),
    finish: makeFinishPractice(dependencies),
  };
};

type Practice = ReturnType<typeof createPractice>;

const answer = async (practice: Practice, attemptId: string, questionId: string, right = true) =>
  asLearner(() =>
    practice.useCases.submitAnswer({
      id: attemptId,
      questionId,
      answer: right
        ? practice.world.correctAnswerOf(questionId)
        : wrongAnswerFor(
            practice.world.attemptQuestions.find((row) => row.id === questionId)?.generatedQuestion
              ? "order_nodes"
              : "text",
          ),
    }),
  );

describe("practice", () => {
  it("lists a topic as available only when an unlocked lesson has generated questions", async () => {
    const { getTopics } = createPractice();
    const { data } = await asLearner(() => getTopics());
    expect(data.find((entry) => entry.topic === "traversals")?.available).toBe(true);
    expect(data.find((entry) => entry.topic === "mixed")?.available).toBe(true);
    expect(data.find((entry) => entry.topic === "rotations")?.available).toBe(false);
  });

  it("refuses a topic with no questions", async () => {
    const { start } = createPractice();
    await expect(asLearner(() => start({ topic: "rotations" }))).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it("only serves questions from unlocked lessons", async () => {
    const world = createWorld({
      questions: [...questions, { ...generated, id: "q-locked", lessonId: "lesson-c" }],
    });
    const practice = createPractice(world);
    const { data } = await asLearner(() => practice.start({ topic: "traversals" }));
    for (let count = 0; count < 5; count += 1) {
      await asLearner(() => practice.next({ id: data.attempt.id }));
    }
    expect(world.attemptQuestions.map((row) => row.questionId)).toEqual(["q-generated"]);
    expect(data.attempt).toMatchObject({ kind: "practice", topic: "traversals", lessonId: null });
  });

  it("picks the generator key before the question", async () => {
    const extra = [1, 2, 3, 4].map((number) => ({
      ...generated,
      id: `q-height-${number}`,
      generatorKey: "height",
      generatorOptions: null,
    }));
    const world = createWorld({ questions: [...questions, ...extra] });
    const practice = createPractice(world);
    for (let count = 0; count < 40; count += 1) {
      await asLearner(() => practice.start({ topic: "mixed" }));
    }
    const traversals = world.attemptQuestions.filter(
      (row) => row.questionId === "q-generated",
    ).length;
    expect(traversals).toBeGreaterThan(10);
  });

  it("serves a new question after each answer and never finishes or completes a lesson", async () => {
    const practice = createPractice();
    const { data } = await asLearner(() => practice.start({ topic: "traversals" }));
    const first = data.question;

    const answered = await answer(practice, data.attempt.id, first?.id ?? "");
    expect(answered.data).toMatchObject({ isCorrect: true, question: null, result: null });
    expect(answered.data.attempt.status).toBe("in_progress");
    expect(practice.world.completeLesson).not.toHaveBeenCalled();

    const second = await asLearner(() => practice.next({ id: data.attempt.id }));
    expect(second.data.question?.position).toBe(2);
    expect(practice.world.attemptQuestions[0]?.seed).not.toBe(
      practice.world.attemptQuestions[1]?.seed,
    );
  });

  it("returns the unanswered question again", async () => {
    const practice = createPractice();
    const { data } = await asLearner(() => practice.start({ topic: "mixed" }));
    const again = await asLearner(() => practice.next({ id: data.attempt.id }));
    expect(again.data.question?.id).toBe(data.question?.id);
  });

  it("starts a fresh attempt every time and finishes the one before", async () => {
    const practice = createPractice();
    const first = await asLearner(() => practice.start({ topic: "traversals" }));
    const second = await asLearner(() => practice.start({ topic: "traversals" }));
    expect(second.data.attempt.id).not.toBe(first.data.attempt.id);
    expect(
      practice.world.attempts.find((attempt) => attempt.id === first.data.attempt.id)?.finishedAt,
    ).not.toBeNull();
    expect(
      practice.world.attempts.find((attempt) => attempt.id === second.data.attempt.id)?.finishedAt,
    ).toBeNull();
  });

  it("keeps the rating in the session and never writes mastery", async () => {
    const world = createWorld({
      mastery: [
        {
          userId: "user-1",
          lessonId: "lesson-a",
          rating: 1100,
          mastery: 0.5,
          currentDifficulty: 3,
          updatedAt: new Date(),
        },
      ],
    });
    const practice = createPractice(world);
    const { data } = await asLearner(() => practice.start({ topic: "traversals" }));
    expect(world.attemptQuestions[0]?.difficulty).toBe(3);

    const first = await answer(practice, data.attempt.id, data.question?.id ?? "");
    expect(first.data.rating.before).toBe(1100);
    expect(first.data.rating.after).toBeGreaterThan(1100);

    const next = await asLearner(() => practice.next({ id: data.attempt.id }));
    const second = await answer(practice, data.attempt.id, next.data.question?.id ?? "", false);
    expect(second.data.rating.before).toBe(first.data.rating.after);
    expect(world.masteryRows.get("user-1:lesson-a")?.rating).toBe(1100);
  });

  it("does not count practice answers towards a later test", async () => {
    const practice = createPractice();
    const { data } = await asLearner(() => practice.start({ topic: "traversals" }));
    await answer(practice, data.attempt.id, data.question?.id ?? "");
    const count = await practice.world.dependencies.attemptAnswerRepository.countByUserAndLesson(
      "user-1",
      "lesson-a",
    );
    expect(count).toBe(0);
  });

  it("summarises answers, correct count and the rating change per lesson", async () => {
    const practice = createPractice();
    const { data } = await asLearner(() => practice.start({ topic: "traversals" }));
    const attemptId = data.attempt.id;
    await answer(practice, attemptId, data.question?.id ?? "");
    const second = (await asLearner(() => practice.next({ id: attemptId }))).data.question;
    await answer(practice, attemptId, second?.id ?? "", false);
    await asLearner(() => practice.next({ id: attemptId }));

    const summary = await asLearner(() => practice.finish({ id: attemptId }));
    expect(summary.data).toMatchObject({ answered: 2, correct: 1 });
    expect(summary.data.lessons).toHaveLength(1);
    const [lesson] = summary.data.lessons;
    expect(lesson).toMatchObject({ lessonId: "lesson-a", title: "Title of lesson-a" });
    expect(lesson).not.toHaveProperty("masteryBefore");
    expect(summary.data.ratingChange).toBe(
      (lesson?.ratingAfter ?? 0) - (lesson?.ratingBefore ?? 0),
    );

    const again = await asLearner(() => practice.finish({ id: attemptId }));
    expect(again.data).toEqual(summary.data);
    await expect(asLearner(() => practice.next({ id: attemptId }))).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it("hides another learner's attempt and test attempts", async () => {
    const practice = createPractice();
    const { data } = await asLearner(() => practice.start({ topic: "traversals" }));
    await expect(
      asUser("user-2", () => practice.next({ id: data.attempt.id })),
    ).rejects.toBeInstanceOf(NotFoundError);
    const test = await asLearner(() => practice.useCases.startAttempt({ id: "lesson-a" }));
    await expect(
      asLearner(() => practice.finish({ id: test.response.data.attempt.id })),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
