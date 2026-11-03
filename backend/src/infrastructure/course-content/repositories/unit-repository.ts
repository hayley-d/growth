import type { UnitRepository } from "@/domain/course-content/repositories/unit-repository";
import type { NewUnit, Unit, UnitChanges } from "@/domain/course-content/unit";
import type { Prisma, PrismaClient, Unit as UnitRow } from "@/generated/prisma/client";
import { toUnit } from "@/infrastructure/course-content/mappers/unit-mapper";
import { PrismaRepository } from "@/infrastructure/database/prisma-repository";

type UnitModel = {
  row: UnitRow;
  where: Prisma.UnitWhereUniqueInput;
  create: Prisma.UnitUncheckedCreateInput;
  update: Prisma.UnitUncheckedUpdateInput;
  orderBy: Prisma.UnitOrderByWithRelationInput;
};

export class PrismaUnitRepository
  extends PrismaRepository<UnitModel, Unit, NewUnit, UnitChanges>
  implements UnitRepository
{
  constructor(client: PrismaClient) {
    super(client, client.unit, {
      toEntity: toUnit,
      toWhere: (id) => ({ id }),
      orderBy: [{ position: "asc" }],
      toCreateData: (unit) => unit,
      toUpdateData: (changes) => changes,
    });
  }

  findByPosition(position: number) {
    return this.findOne({ position });
  }
}
