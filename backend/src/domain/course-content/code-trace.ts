import { isAlgorithmCode, stepKeysByAlgorithm } from "@shared/avl";
import type { CodeLine } from "@/domain/course-content/code-line";

export type CodeLineGaps = {
  missing: string[];
  unknown: string[];
};

export const findCodeLineGaps = (
  algorithmCode: string,
  codeLines: Pick<CodeLine, "stepKey">[],
): CodeLineGaps => {
  const expected: readonly string[] = isAlgorithmCode(algorithmCode)
    ? stepKeysByAlgorithm[algorithmCode]
    : [];
  const covered = new Set(codeLines.map((codeLine) => codeLine.stepKey));
  return {
    missing: expected.filter((stepKey) => !covered.has(stepKey)),
    unknown: [...covered].filter((stepKey) => !expected.includes(stepKey)),
  };
};
