import type { Algorithm, AlgorithmChanges, NewAlgorithm } from "@/domain/course-content/algorithm";
import type { AlgorithmRepository } from "@/domain/course-content/repositories/algorithm-repository";
import type { Algorithm as AlgorithmRow, Prisma, PrismaClient } from "@/generated/prisma/client";
import { toAlgorithm } from "@/infrastructure/course-content/mappers/algorithm-mapper";
import { PrismaRepository } from "@/infrastructure/database/prisma-repository";

type AlgorithmModel = {
  row: AlgorithmRow;
  where: Prisma.AlgorithmWhereUniqueInput;
  create: Prisma.AlgorithmUncheckedCreateInput;
  update: Prisma.AlgorithmUncheckedUpdateInput;
  orderBy: Prisma.AlgorithmOrderByWithRelationInput;
};

export class PrismaAlgorithmRepository
  extends PrismaRepository<AlgorithmModel, Algorithm, NewAlgorithm, AlgorithmChanges>
  implements AlgorithmRepository
{
  constructor(client: PrismaClient) {
    super(client, client.algorithm, {
      toEntity: toAlgorithm,
      toWhere: (id) => ({ id }),
      orderBy: [{ code: "asc" }],
      toCreateData: (algorithm) => algorithm,
      toUpdateData: (changes) => changes,
    });
  }

  findByCode(code: string) {
    return this.findOne({ code });
  }
}
