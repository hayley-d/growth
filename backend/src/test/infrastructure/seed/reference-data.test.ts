import { describe, expect, it } from "vitest";

import { codeLanguages, learningStyles } from "@/infrastructure/seed/reference-data";

describe("reference data", () => {
  it("has the four VARK learning styles in order, each with a description", () => {
    const names = learningStyles.map((learningStyle) => learningStyle.name);

    expect(names).toEqual(["Visual", "Auditory", "Reading/writing", "Kinesthetic"]);
    expect(learningStyles.every((learningStyle) => learningStyle.description.length > 0)).toBe(
      true,
    );
  });

  it("has seven code languages with unique lower case codes", () => {
    const codes = codeLanguages.map((codeLanguage) => codeLanguage.code);

    expect(codes).toHaveLength(7);
    expect(new Set(codes).size).toBe(7);
    expect(codes.every((code) => code === code.toLowerCase())).toBe(true);
  });
});
