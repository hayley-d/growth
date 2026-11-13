import { describe, expect, it, vi } from "vitest";

import { makeGetTodaysChallenge } from "@/application/assessment/commands/get-todays-challenge";
import type { DailyChallenge, NewDailyChallenge } from "@/domain/assessment/daily-challenge";
import { toChallengeSeed } from "@/domain/assessment/daily-challenge-rotation";
import { ConflictError } from "@/domain/errors";

const beforeMidnight = new Date("2026-11-13T21:59:59.000Z");
const atMidnight = new Date("2026-11-13T22:00:00.000Z");
const thirteenth = new Date("2026-11-13T00:00:00.000Z");
const fourteenth = new Date("2026-11-14T00:00:00.000Z");

const generatorQuestions = [{ id: "question-c" }, { id: "question-a" }, { id: "question-b" }];

const createWorld = (instant: Date, questions: { id: string }[] = generatorQuestions) => {
  const rows = new Map<number, DailyChallenge>();
  const dailyChallengeRepository = {
    findByDate: vi.fn(async (date: Date) => rows.get(date.getTime()) ?? null),
    create: vi.fn(async (dailyChallenge: NewDailyChallenge) => {
      if (rows.has(dailyChallenge.date.getTime())) {
        throw new ConflictError("A record already exists with date", { fields: ["date"] });
      }
      const row = { id: `challenge-${rows.size + 1}`, ...dailyChallenge };
      rows.set(dailyChallenge.date.getTime(), row);
      return row;
    }),
  };
  const questionRepository = { listActiveGenerated: vi.fn(async () => questions) };
  const getTodaysChallenge = makeGetTodaysChallenge({
    clock: { now: () => instant },
    dailyChallengeRepository,
    questionRepository: questionRepository as never,
  });
  return { rows, dailyChallengeRepository, questionRepository, getTodaysChallenge };
};

describe("makeGetTodaysChallenge", () => {
  it("creates today's row with the question and seed for the day", async () => {
    const { getTodaysChallenge } = createWorld(atMidnight);

    const challenge = await getTodaysChallenge();

    expect(challenge).toEqual({
      id: "challenge-1",
      date: fourteenth,
      questionId: "question-c",
      seed: toChallengeSeed(20771),
    });
  });

  it("returns the existing row without listing questions", async () => {
    const world = createWorld(atMidnight);
    const first = await world.getTodaysChallenge();

    const second = await world.getTodaysChallenge();

    expect(second).toEqual(first);
    expect(world.dailyChallengeRepository.create).toHaveBeenCalledTimes(1);
    expect(world.questionRepository.listActiveGenerated).toHaveBeenCalledTimes(1);
  });

  it("uses the Johannesburg date either side of 22:00 UTC", async () => {
    const before = await createWorld(beforeMidnight).getTodaysChallenge();
    const after = await createWorld(atMidnight).getTodaysChallenge();

    expect(before.date).toEqual(thirteenth);
    expect(after.date).toEqual(fourteenth);
    expect(before.questionId).toBe("question-b");
    expect(after.questionId).toBe("question-c");
    expect(before.seed).not.toBe(after.seed);
  });

  it("throws a ConflictError when there are no generator questions", async () => {
    const { getTodaysChallenge, dailyChallengeRepository } = createWorld(atMidnight, []);

    await expect(getTodaysChallenge()).rejects.toBeInstanceOf(ConflictError);
    expect(dailyChallengeRepository.create).not.toHaveBeenCalled();
  });

  it("reads back the row that won when another request created it first", async () => {
    const world = createWorld(atMidnight);
    const winner = {
      id: "challenge-winner",
      date: fourteenth,
      questionId: "question-c",
      seed: toChallengeSeed(20771),
    };
    world.dailyChallengeRepository.findByDate.mockResolvedValueOnce(null);
    world.rows.set(fourteenth.getTime(), winner);

    const challenge = await world.getTodaysChallenge();

    expect(world.dailyChallengeRepository.create).toHaveBeenCalledTimes(1);
    expect(world.dailyChallengeRepository.findByDate).toHaveBeenCalledTimes(2);
    expect(challenge).toBe(winner);
  });

  it("throws the conflict again if the winning row can't be read", async () => {
    const world = createWorld(atMidnight);
    const conflict = new ConflictError("A record already exists with date");
    world.dailyChallengeRepository.create.mockRejectedValueOnce(conflict);

    await expect(world.getTodaysChallenge()).rejects.toBe(conflict);
  });

  it("does not swallow errors other than a conflict", async () => {
    const world = createWorld(atMidnight);
    const failure = new Error("Database is down");
    world.dailyChallengeRepository.create.mockRejectedValueOnce(failure);

    await expect(world.getTodaysChallenge()).rejects.toBe(failure);
    expect(world.dailyChallengeRepository.findByDate).toHaveBeenCalledTimes(1);
  });
});
