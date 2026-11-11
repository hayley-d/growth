import { describe, expect, it } from "vitest";

import { scoreQuiz } from "@/domain/learning-style/score-quiz";

describe("scoreQuiz", () => {
  it("picks the style with the most picks", () => {
    expect(
      scoreQuiz([
        "kinesthetic",
        "kinesthetic",
        "kinesthetic",
        "visual",
        "visual",
        "auditory",
        "reading-writing",
        "kinesthetic",
      ]),
    ).toBe("kinesthetic");
  });

  it.each([
    [["kinesthetic", "visual", "kinesthetic", "visual"], "visual"],
    [["kinesthetic", "auditory", "auditory", "kinesthetic"], "auditory"],
    [["kinesthetic", "reading-writing", "reading-writing", "kinesthetic"], "reading-writing"],
    [["reading-writing", "visual", "auditory", "kinesthetic"], "visual"],
  ] as const)(
    "settles a tie by visual, auditory, reading/writing, kinesthetic: %j",
    (picks, style) => {
      expect(scoreQuiz([...picks])).toBe(style);
    },
  );

  it("gives the same style for the same picks in any order", () => {
    const picks = ["auditory", "kinesthetic", "auditory", "kinesthetic", "visual"] as const;
    const reversed = [...picks].reverse();
    expect(scoreQuiz([...picks])).toBe("auditory");
    expect(scoreQuiz(reversed)).toBe("auditory");
  });
});
