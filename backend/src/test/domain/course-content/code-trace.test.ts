import { describe, expect, it } from "vitest";

import { stepKeysByAlgorithm } from "@shared/avl";
import { findCodeLineGaps } from "@/domain/course-content/code-trace";

const linesFor = (stepKeys: readonly string[]) => stepKeys.map((stepKey) => ({ stepKey }));

describe("findCodeLineGaps", () => {
  it("finds no gaps when every step key has a line", () => {
    expect(findCodeLineGaps("search", linesFor(stepKeysByAlgorithm.search))).toEqual({
      missing: [],
      unknown: [],
    });
  });

  it("lists the step keys with no line", () => {
    const lines = linesFor(
      stepKeysByAlgorithm.search.filter((stepKey) => stepKey !== "search.found"),
    );
    expect(findCodeLineGaps("search", lines).missing).toEqual(["search.found"]);
  });

  it("lists lines whose step key the engine never emits for that algorithm", () => {
    const lines = linesFor([...stepKeysByAlgorithm.search, "search.give-up", "insert.compare"]);
    expect(findCodeLineGaps("search", lines).unknown).toEqual(["search.give-up", "insert.compare"]);
  });

  it("treats every line as unknown for an algorithm the engine doesn't have", () => {
    expect(findCodeLineGaps("bubble-sort", linesFor(["bubble-sort.swap"]))).toEqual({
      missing: [],
      unknown: ["bubble-sort.swap"],
    });
  });
});
