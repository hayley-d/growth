import { describe, expect, it } from "vitest";

import { algorithmCodes } from "@shared/avl";
import { algorithms, codeLanguages, learningStyles } from "@/infrastructure/seed/reference-data";

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
});
