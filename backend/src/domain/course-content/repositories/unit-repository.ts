import type { Repository } from "@/domain/common/repository";
import type { NewUnit, Unit, UnitChanges } from "@/domain/course-content/unit";

export type UnitRepository = Repository<Unit, NewUnit, UnitChanges> & {
  findByPosition(position: number): Promise<Unit | null>;
};
