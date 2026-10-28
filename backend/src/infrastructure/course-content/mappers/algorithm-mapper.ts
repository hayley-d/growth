import type { Algorithm } from "@/domain/course-content/algorithm";
import type { Algorithm as AlgorithmRow } from "@/generated/prisma/client";

export const toAlgorithm = (row: AlgorithmRow): Algorithm => ({
  id: row.id,
  code: row.code,
  name: row.name,
});
