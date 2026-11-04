import { describe, expect, it } from "vitest";

import {
  difficulties,
  getExpectedScore,
  getMastery,
  getNextDifficulty,
  getNextRating,
  getPoints,
  getQuestionRating,
  getRatingStep,
  getScore,
} from "@/domain/assessment/elo-rating";

describe("getQuestionRating", () => {
  it("maps difficulty 1 to 5 onto 800 to 1200", () => {
    expect(difficulties.map(getQuestionRating)).toEqual([800, 900, 1000, 1100, 1200]);
  });
});

describe("getExpectedScore", () => {
  it("is a coin flip for an even match", () => {
    expect(getExpectedScore(1000, 1000)).toBe(0.5);
  });

  it("favours the stronger learner", () => {
    expect(getExpectedScore(1000, 800)).toBeCloseTo(0.7597, 4);
    expect(getExpectedScore(800, 1000)).toBeCloseTo(0.2403, 4);
  });
});

describe("getScore", () => {
  it("scores a correct answer by hints used", () => {
    expect(getScore(true, 0)).toBe(1);
    expect(getScore(true, 1)).toBe(0.75);
    expect(getScore(true, 2)).toBe(0.5);
    expect(getScore(true, 5)).toBe(0.5);
  });

  it("scores a wrong answer 0 whatever the hints", () => {
    expect(getScore(false, 0)).toBe(0);
    expect(getScore(false, 2)).toBe(0);
  });
});

describe("getRatingStep", () => {
  it("starts at 96 and settles at 32 after 20 answers", () => {
    expect(getRatingStep(0)).toBe(96);
    expect(getRatingStep(5)).toBe(64);
    expect(getRatingStep(10)).toBe(48);
    expect(getRatingStep(20)).toBe(32);
    expect(getRatingStep(200)).toBe(32);
  });
});

describe("getNextRating", () => {
  it("moves a new learner further than a settled one", () => {
    expect(getNextRating(1000, 3, 1, 0)).toBe(1048);
    expect(getNextRating(1000, 3, 0, 0)).toBe(952);
    expect(getNextRating(1000, 3, 1, 20)).toBe(1016);
  });

  it("moves by the step times the surprise", () => {
    expect(getNextRating(1000, 3, 0.75, 20)).toBe(1008);
    expect(getNextRating(1000, 3, 0.5, 20)).toBe(1000);
    expect(getNextRating(1000, 3, 0, 20)).toBe(984);
  });

  it("gains less for an easy question than it loses for missing it", () => {
    expect(getNextRating(1000, 1, 1, 20)).toBe(1008);
    expect(getNextRating(1000, 1, 0, 20)).toBe(976);
  });

  it("returns a whole number", () => {
    expect(Number.isInteger(getNextRating(1037, 4, 0.75, 3))).toBe(true);
  });
});

describe("getNextDifficulty", () => {
  it("picks the difficulty with an expected score closest to 70%", () => {
    expect(getNextDifficulty(1000)).toBe(1);
    expect(getNextDifficulty(1050)).toBe(2);
    expect(getNextDifficulty(1200)).toBe(3);
  });

  it("stays within 1 to 5", () => {
    expect(getNextDifficulty(0)).toBe(1);
    expect(getNextDifficulty(3000)).toBe(5);
  });
});

describe("getMastery", () => {
  it("runs in a straight line from 800 to 1350", () => {
    expect(getMastery(800)).toBe(0);
    expect(getMastery(1000)).toBe(0.3636);
    expect(getMastery(1075)).toBe(0.5);
    expect(getMastery(1350)).toBe(1);
  });

  it("stays between 0 and 1", () => {
    expect(getMastery(-2000)).toBe(0);
    expect(getMastery(5000)).toBe(1);
  });
});

describe("getPoints", () => {
  it("is worth more for harder questions and less with hints", () => {
    expect(getPoints(3, 1)).toBe(300);
    expect(getPoints(5, 1)).toBe(500);
    expect(getPoints(3, 0.75)).toBe(225);
    expect(getPoints(5, 0.5)).toBe(250);
  });

  it("gives nothing for a wrong answer", () => {
    expect(getPoints(5, 0)).toBe(0);
  });
});
