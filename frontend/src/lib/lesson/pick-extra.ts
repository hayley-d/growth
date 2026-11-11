import type { LessonStep, LessonStepBlock } from "@shared/schemas";

export type PickedExtra = {
  block: LessonStepBlock | null;
  matchesStyle: boolean;
  others: LessonStepBlock[];
};

const fallbackStyle = "visual";

export const pickExtra = (
  step: Pick<LessonStep, "styleBlock" | "otherBlocks">,
  styleNames: Readonly<Record<string, string>>,
): PickedExtra => {
  if (step.styleBlock) {
    return { block: step.styleBlock, matchesStyle: true, others: [...step.otherBlocks] };
  }
  const fallback =
    step.otherBlocks.find(
      (block) =>
        block.learningStyleId !== null &&
        styleNames[block.learningStyleId]?.toLowerCase() === fallbackStyle,
    ) ?? step.otherBlocks[0];
  if (!fallback) return { block: null, matchesStyle: false, others: [] };
  return {
    block: fallback,
    matchesStyle: false,
    others: step.otherBlocks.filter((block) => block !== fallback),
  };
};
