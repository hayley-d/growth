import type { Page, PageRequest } from "@/domain/common/page";
import type { UserRepository } from "@/domain/user/repositories/user-repository";
import type { User } from "@/domain/user/user";
import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import { withPrismaErrors } from "@/infrastructure/database/prisma-errors";
import { toUser } from "@/infrastructure/user/mappers/user-mapper";

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly client: PrismaClient) {}

  findById(id: string): Promise<User | null> {
    return this.findOne({ id });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }

  list({ skip, take }: PageRequest): Promise<Page<User>> {
    return withPrismaErrors(async () => {
      const [rows, total] = await this.client.$transaction([
        this.client.user.findMany({ skip, take, orderBy: { id: "asc" } }),
        this.client.user.count(),
      ]);
      return { items: rows.map(toUser), total };
    });
  }

  private findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return withPrismaErrors(async () => {
      const row = await this.client.user.findUnique({ where });
      return row ? toUser(row) : null;
    });
  }
}
