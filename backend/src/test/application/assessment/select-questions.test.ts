import { describe, expect, it } from "vitest";

import { maximumSeed, pickQuestions, pickSeed } from "@/application/assessment/select-questions";
import { createRandom } from "@/test/application/assessment/attempt-fakes";

describe("pickQuestions", () => {
  const pool = Array.from({ length: 12 }, (_, index) => index);

  it("takes five without repeats", () => {
    const picked = pickQuestions(pool, createRandom());
    expect(picked).toHaveLength(5);
    expect(new Set(picked).size).toBe(5);
  });

  it("takes everything when the pool is smaller than five", () => {
    expect([...pickQuestions([1, 2, 3], createRandom())].sort()).toEqual([1, 2, 3]);
  });

  it("does not change the pool", () => {
    const copy = [...pool];
    pickQuestions(pool, createRandom());
    expect(pool).toEqual(copy);
  });

  it("gives different orders for different random sources", () => {
    expect(pickQuestions(pool, createRandom(1))).not.toEqual(pickQuestions(pool, createRandom(2)));
  });
});

describe("pickSeed", () => {
  it("stays inside a 32 bit signed integer", () => {
    expect(pickSeed(() => 0)).toBe(0);
    expect(pickSeed(() => 0.999999999)).toBeLessThan(maximumSeed + 1);
    expect(pickSeed(() => 0.999999999)).toBeLessThanOrEqual(2 ** 31 - 1);
  });
});
