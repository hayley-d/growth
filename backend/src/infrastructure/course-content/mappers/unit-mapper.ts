import type { Unit } from "@/domain/course-content/unit";
import type { Unit as UnitRow } from "@/generated/prisma/client";

export const toUnit = (row: UnitRow): Unit => ({
  id: row.id,
  title: row.title,
  position: row.position,
});
