import { describe, expect, it } from "vitest";

import {
  getQuizResponseSchema,
  scoreQuizRequestSchema,
  toGetQuizResponse,
  toScoreQuizResponse,
} from "@shared/schemas";

const question = {
  id: "flat-pack-desk",
  prompt: "How do you put it together?",
  options: [
    { id: "a", text: "Pictures" },
    { id: "b", text: "Listen" },
    { id: "c", text: "Read" },
    { id: "d", text: "Try" },
  ],
};

describe("toGetQuizResponse", () => {
  it("wraps the questions in data", () => {
    expect(toGetQuizResponse([question])).toEqual({ data: { questions: [question] } });
  });

  it("drops anything that would give away the style", () => {
    const withStyles = {
      ...question,
      options: question.options.map((option) => ({ ...option, style: "visual" })),
    };
    expect(toGetQuizResponse([withStyles]).data.questions[0]?.options[0]).toEqual({
      id: "a",
      text: "Pictures",
    });
  });

  it("rejects a question without four options", () => {
    expect(
      getQuizResponseSchema.safeParse({
        data: { questions: [{ ...question, options: question.options.slice(1) }] },
      }).success,
    ).toBe(false);
  });
});

describe("scoreQuizRequestSchema", () => {
  it("accepts a list of answers", () => {
    const answers = [{ questionId: "flat-pack-desk", optionId: "a" }];
    expect(scoreQuizRequestSchema.parse({ answers })).toEqual({ answers });
  });

  it.each([{}, { answers: [] }, { answers: [{ questionId: "", optionId: "a" }] }])(
    "rejects %j",
    (body) => {
      expect(scoreQuizRequestSchema.safeParse(body).success).toBe(false);
    },
  );
});

describe("toScoreQuizResponse", () => {
  it("returns the learning style without extra fields", () => {
    const learningStyle = {
      id: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
      name: "Visual",
      description: "Diagrams.",
    };
    expect(toScoreQuizResponse({ ...learningStyle, createdAt: "now" } as never)).toEqual({
      data: { learningStyle },
    });
  });
});
