import type { Hint } from "@/domain/assessment/hint";
import type { Hint as HintRow } from "@/generated/prisma/client";

export const toHint = (row: HintRow): Hint => ({
  id: row.id,
  questionId: row.questionId,
  text: row.text,
  position: row.position,
});
