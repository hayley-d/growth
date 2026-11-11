import { describe, expect, it } from "vitest";

import { learningStyleKeys } from "@/domain/learning-style/learning-style-key";
import { quizQuestions } from "@/domain/learning-style/quiz-questions";

describe("quizQuestions", () => {
  it("has 8 questions with unique ids", () => {
    expect(quizQuestions).toHaveLength(8);
    expect(new Set(quizQuestions.map((question) => question.id)).size).toBe(8);
  });

  it.each(quizQuestions)("$id has one option per style with unique ids", (question) => {
    expect(question.options.map((option) => option.style).sort()).toEqual(
      [...learningStyleKeys].sort(),
    );
    expect(new Set(question.options.map((option) => option.id)).size).toBe(4);
  });

  it("never puts a style in the same place on every question", () => {
    const firstStyles = new Set(quizQuestions.map((question) => question.options[0]?.style));
    expect(firstStyles.size).toBe(4);
  });
});
