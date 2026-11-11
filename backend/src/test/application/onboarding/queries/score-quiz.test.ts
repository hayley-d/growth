import { describe, expect, it, vi } from "vitest";

import { makeScoreQuiz } from "@/application/onboarding/queries/score-quiz";
import { BadRequestError, InvalidContentError } from "@/domain/errors";
import type { LearningStyleKey } from "@/domain/learning-style/learning-style-key";
import { learningStyleNames } from "@/domain/learning-style/learning-style-key";
import { quizQuestions } from "@/domain/learning-style/quiz-questions";

const styles = Object.values(learningStyleNames).map((name, index) => ({
  id: `00000000-0000-4000-8000-00000000000${index}`,
  name,
  description: `${name} learners`,
}));

const createScoreQuiz = (seeded = styles) => {
  const findByName = vi.fn(
    async (name: string) => seeded.find((style) => style.name === name) ?? null,
  );
  return { scoreQuiz: makeScoreQuiz({ learningStyleRepository: { findByName } }), findByName };
};

const answersFor = (picks: LearningStyleKey[]) =>
  quizQuestions.map((question, index) => ({
    questionId: question.id,
    optionId: question.options.find((option) => option.style === picks[index])?.id ?? "",
  }));

describe("makeScoreQuiz", () => {
  it("returns the learning style with the most picks", async () => {
    const { scoreQuiz } = createScoreQuiz();
    const response = await scoreQuiz({
      answers: answersFor([
        "auditory",
        "auditory",
        "auditory",
        "visual",
        "kinesthetic",
        "reading-writing",
        "auditory",
        "visual",
      ]),
    });
    expect(response.data.learningStyle).toEqual(styles[1]);
  });

  it("settles a tie with the fixed order and gives the same style every time", async () => {
    const { scoreQuiz } = createScoreQuiz();
    const answers = answersFor([
      "kinesthetic",
      "visual",
      "kinesthetic",
      "visual",
      "kinesthetic",
      "visual",
      "auditory",
      "reading-writing",
    ]);
    const first = await scoreQuiz({ answers });
    const second = await scoreQuiz({ answers: [...answers].reverse() });
    expect(first.data.learningStyle.name).toBe("Visual");
    expect(second).toEqual(first);
  });

  it.each([
    ["a missing answer", answersFor(Array(8).fill("visual")).slice(1)],
    [
      "the same question twice",
      [...answersFor(Array(8).fill("visual")).slice(0, 7), answersFor(Array(8).fill("visual"))[1]],
    ],
    [
      "an unknown question",
      [...answersFor(Array(8).fill("visual")).slice(1), { questionId: "nope", optionId: "a" }],
    ],
    [
      "an unknown option",
      [
        { questionId: "flat-pack-desk", optionId: "z" },
        ...answersFor(Array(8).fill("visual")).slice(1),
      ],
    ],
  ])("rejects %s with a 400", async (_label, answers) => {
    const { scoreQuiz, findByName } = createScoreQuiz();
    await expect(scoreQuiz({ answers: answers as never })).rejects.toBeInstanceOf(BadRequestError);
    expect(findByName).not.toHaveBeenCalled();
  });

  it("fails loudly when the learning styles are not seeded", async () => {
    const { scoreQuiz } = createScoreQuiz([]);
    await expect(
      scoreQuiz({ answers: answersFor(Array(8).fill("visual")) }),
    ).rejects.toBeInstanceOf(InvalidContentError);
  });
});
