import { describe, expect, it, vi } from "vitest";

import { makeGetDailyChallenge } from "@/application/assessment/commands/get-daily-challenge";
import { makeStartDailyChallenge } from "@/application/assessment/commands/start-daily-challenge";
import { makeSubmitDailyChallengeAnswer } from "@/application/assessment/commands/submit-daily-challenge-answer";
import type { DailyChallenge } from "@/domain/assessment/daily-challenge";
import { ConflictError, NotFoundError } from "@/domain/errors";
import {
  asLearner,
  asUser,
  createWorld,
  learnerId,
  type World,
} from "@/test/application/assessment/attempt-fakes";
import { wrongAnswerFor } from "@/test/application/assessment/attempt-helpers";

const challenge: DailyChallenge = {
  id: "challenge-1",
  date: new Date("2026-11-14T00:00:00.000Z"),
  questionId: "q-generated",
  seed: 424242,
};

const startedAt = new Date("2026-11-14T06:00:00.000Z");
const answeredAt = new Date("2026-11-14T06:01:05.000Z");

const createDaily = (world: World = createWorld()) => {
  let now = startedAt;
  const dependencies = {
    ...world.dependencies,
    clock: { now: () => now },
    getTodaysChallenge: vi.fn(async () => challenge),
  };
  return {
    world,
    setNow: (instant: Date) => {
      now = instant;
    },
    getDaily: makeGetDailyChallenge(dependencies),
    start: makeStartDailyChallenge(dependencies),
    answer: makeSubmitDailyChallengeAnswer(dependencies),
  };
};

describe("daily challenge", () => {
  it("is not started until the learner presses Start, and getting it writes nothing", async () => {
    const { world, getDaily } = createDaily();

    const { data } = await asLearner(() => getDaily());

    expect(data).toMatchObject({
      date: "2026-11-14",
      nextChallengeAt: "2026-11-14T22:00:00.000Z",
      status: "not_started",
      startedAt: null,
      question: null,
      result: null,
    });
    expect(world.attempts).toHaveLength(0);
  });

  it("starts the clock with the challenge's seed at the question's own difficulty", async () => {
    const { world, start } = createDaily();

    const { created, response } = await asLearner(() => start());

    expect(created).toBe(true);
    expect(response.data.status).toBe("in_progress");
    expect(response.data.startedAt).toBe(startedAt.toISOString());
    expect(response.data.question).toMatchObject({
      difficulty: 3,
      hints: [],
      hintsTotal: 0,
      hintsRemaining: 0,
    });
    expect(response.data.question).not.toHaveProperty("answer");
    expect(world.attempts[0]).toMatchObject({
      userId: learnerId,
      kind: "daily_challenge",
      dailyChallengeId: challenge.id,
    });
    expect(world.attemptQuestions[0]).toMatchObject({ seed: challenge.seed, difficulty: 3 });
  });

  it("gives every learner the same question", async () => {
    const { start } = createDaily();

    const first = await asUser("learner-a", () => start());
    const second = await asUser("learner-b", () => start());

    expect(second.response.data.question?.prompt).toBe(first.response.data.question?.prompt);
    expect(second.response.data.question?.tree).toBe(first.response.data.question?.tree);
  });

  it("returns the same attempt when Start is pressed again, without restarting the clock", async () => {
    const { world, start, setNow } = createDaily();
    await asLearner(() => start());
    setNow(answeredAt);

    const { created, response } = await asLearner(() => start());

    expect(created).toBe(false);
    expect(response.data.startedAt).toBe(startedAt.toISOString());
    expect(world.attempts).toHaveLength(1);
  });

  it("reads back the attempt that won when two starts race", async () => {
    const { world, start } = createDaily();
    await asLearner(() => start());
    const winner = world.attempts[0];
    const findByUserAndDailyChallenge = vi
      .spyOn(world.dependencies.assessmentAttemptRepository, "findByUserAndDailyChallenge")
      .mockResolvedValueOnce(null);
    world.dependencies.assessmentAttemptRepository.createWithQuestions.mockRejectedValueOnce(
      new ConflictError("A record already exists with userId, dailyChallengeId"),
    );

    const { created, response } = await asLearner(() => start());

    expect(created).toBe(false);
    expect(findByUserAndDailyChallenge).toHaveBeenCalledTimes(2);
    expect(response.data.startedAt).toBe(winner?.startedAt.toISOString());
  });

  it("grades a right answer, stops the clock and keeps the rating as it was", async () => {
    const { world, start, answer, setNow } = createDaily();
    const { response } = await asLearner(() => start());
    const questionId = response.data.question?.id as string;
    setNow(answeredAt);

    const { data } = await asLearner(() =>
      answer({ questionId, answer: world.correctAnswerOf(questionId) }),
    );

    expect(data.status).toBe("finished");
    expect(data.finishedAt).toBe(answeredAt.toISOString());
    expect(data.result).toMatchObject({
      isCorrect: true,
      correctAnswer: world.correctAnswerOf(questionId),
      timeTakenSeconds: 65,
    });
    expect(data.result?.points).toBeGreaterThan(0);
    expect(data.result?.explanation).not.toBe("");
    expect(world.attempts[0]).toMatchObject({ score: 100, passed: true });
    expect(world.attemptAnswers[0]).toMatchObject({ ratingBefore: 1000, ratingAfter: 1000 });
    expect(world.dependencies.attemptAnswerRepository.recordAnswer).toHaveBeenCalledWith(
      expect.objectContaining({ mastery: null }),
    );
    expect(world.masteryRows.size).toBe(0);
  });

  it("grades a wrong answer with no points and shows the correct one", async () => {
    const { world, start, answer } = createDaily();
    const { response } = await asLearner(() => start());
    const questionId = response.data.question?.id as string;
    const correct = world.correctAnswerOf(questionId);

    const { data } = await asLearner(() =>
      answer({ questionId, answer: wrongAnswerFor(correct.type) }),
    );

    expect(data.result).toMatchObject({ isCorrect: false, points: 0, correctAnswer: correct });
    expect(world.attempts[0]).toMatchObject({ score: 0, passed: false });
  });

  it("returns the result on the next get", async () => {
    const { world, start, answer, getDaily } = createDaily();
    const { response } = await asLearner(() => start());
    const questionId = response.data.question?.id as string;
    await asLearner(() => answer({ questionId, answer: world.correctAnswerOf(questionId) }));

    const { data } = await asLearner(() => getDaily());

    expect(data.status).toBe("finished");
    expect(data.question).toBeNull();
    expect(data.result?.isCorrect).toBe(true);
  });

  it("refuses an answer before the learner starts", async () => {
    const { answer } = createDaily();

    await expect(
      asLearner(() =>
        answer({
          questionId: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
          answer: { type: "text", text: "1" },
        }),
      ),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("refuses a second answer on the same day", async () => {
    const { world, start, answer } = createDaily();
    const { response } = await asLearner(() => start());
    const questionId = response.data.question?.id as string;
    const correct = world.correctAnswerOf(questionId);
    await asLearner(() => answer({ questionId, answer: correct }));

    await expect(asLearner(() => answer({ questionId, answer: correct }))).rejects.toBeInstanceOf(
      ConflictError,
    );
    expect(world.attemptAnswers).toHaveLength(1);
  });

  it("returns 404 for a question that isn't today's", async () => {
    const { start, answer } = createDaily();
    await asLearner(() => start());

    await expect(
      asLearner(() =>
        answer({
          questionId: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
          answer: { type: "text", text: "1" },
        }),
      ),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("finishes an answered attempt that a crash left open", async () => {
    const { world, start, answer, getDaily, setNow } = createDaily();
    const { response } = await asLearner(() => start());
    const questionId = response.data.question?.id as string;
    vi.spyOn(world.dependencies.assessmentAttemptRepository, "update").mockRejectedValueOnce(
      new Error("Database is down"),
    );
    await expect(
      asLearner(() => answer({ questionId, answer: world.correctAnswerOf(questionId) })),
    ).rejects.toThrow("Database is down");
    setNow(answeredAt);

    const { data } = await asLearner(() => getDaily());

    expect(data.status).toBe("finished");
    expect(world.attempts[0]?.finishedAt).toEqual(answeredAt);
  });
});
