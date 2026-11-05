import { describe, expect, it } from "vitest";

import { algorithmCodes } from "@shared/avl";
import {
  algorithms,
  codeLanguages,
  learningStyles,
  units,
} from "@/infrastructure/seed/reference-data";

describe("reference data", () => {
  it("has the four VARK learning styles in order, each with a description", () => {
    const names = learningStyles.map((learningStyle) => learningStyle.name);

    expect(names).toEqual(["Visual", "Auditory", "Reading/writing", "Kinesthetic"]);
    expect(learningStyles.every((learningStyle) => learningStyle.description.length > 0)).toBe(
      true,
    );
  });

  it("has Java, Rust and Pseudocode as the code languages", () => {
    expect(codeLanguages.map((codeLanguage) => codeLanguage.code)).toEqual([
      "java",
      "rust",
      "pseudocode",
    ]);
  });

  it("has one algorithm for each algorithm the engine can step through, in the same order", () => {
    expect(algorithms.map((algorithm) => algorithm.code)).toEqual([...algorithmCodes]);
    expect(algorithms.every((algorithm) => algorithm.name.length > 0)).toBe(true);
  });

  it("has two units with six lessons each, numbered from 1", () => {
    expect(units.map((unit) => unit.position)).toEqual([1, 2]);
    for (const unit of units) {
      expect(unit.lessons.map((lesson) => lesson.position)).toEqual([1, 2, 3, 4, 5, 6]);
      expect(unit.lessons.every((lesson) => lesson.summary.length > 0)).toBe(true);
    }
  });

  it("makes only the two quizzes checkpoints", () => {
    const checkpoints = units
      .flatMap((unit) => unit.lessons)
      .filter((lesson) => lesson.kind === "checkpoint")
      .map((lesson) => lesson.title);

    expect(checkpoints).toEqual(["Traversal checkpoint", "AVL final challenge"]);
  });
});
