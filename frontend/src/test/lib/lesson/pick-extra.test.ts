import { expect, it } from "vitest";

import type { LessonStepBlock } from "@shared/schemas";
import { pickExtra } from "@/lib/lesson/pick-extra";

const block = (id: string, learningStyleId: string | null): LessonStepBlock => ({
  id,
  learningStyleId,
  transcript: id,
  type: "text",
  body: { markdown: id },
});

const styleNames = { "visual-id": "Visual", "hearing-id": "Auditory", "hands-id": "Kinesthetic" };
const visual = block("visual", "visual-id");
const auditory = block("auditory", "hearing-id");
const kinesthetic = block("kinesthetic", "hands-id");

it("picks the learner's own style block when there is one", () => {
  expect(pickExtra({ styleBlock: auditory, otherBlocks: [visual] }, styleNames)).toEqual({
    block: auditory,
    matchesStyle: true,
    others: [visual],
  });
});

it("falls back to the visual block when none matches the learner", () => {
  expect(
    pickExtra({ styleBlock: null, otherBlocks: [kinesthetic, visual, auditory] }, styleNames),
  ).toEqual({ block: visual, matchesStyle: false, others: [kinesthetic, auditory] });
});

it("falls back to the first block when there's no visual one", () => {
  expect(pickExtra({ styleBlock: null, otherBlocks: [kinesthetic, auditory] }, styleNames)).toEqual(
    { block: kinesthetic, matchesStyle: false, others: [auditory] },
  );
});

it("picks nothing when the step has no extra blocks", () => {
  expect(pickExtra({ styleBlock: null, otherBlocks: [] }, styleNames)).toEqual({
    block: null,
    matchesStyle: false,
    others: [],
  });
});
