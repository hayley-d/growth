import type { Page, PageRequest } from "@/domain/common/page";
import type { Repository } from "@/domain/common/repository";
import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import { withPrismaErrors } from "@/infrastructure/database/prisma-errors";

export type PrismaModel = {
  row: unknown;
  where: unknown;
  create: unknown;
  update: unknown;
  orderBy: unknown;
};

export type PrismaDelegate<Model extends PrismaModel> = {
  findUnique(arguments_: { where: Model["where"] }): Prisma.PrismaPromise<Model["row"] | null>;
  findMany(arguments_: {
    skip: number;
    take: number;
    orderBy: Model["orderBy"][];
  }): Prisma.PrismaPromise<Model["row"][]>;
  count(): Prisma.PrismaPromise<number>;
  create(arguments_: { data: Model["create"] }): Prisma.PrismaPromise<Model["row"]>;
  update(arguments_: {
    where: Model["where"];
    data: Model["update"];
  }): Prisma.PrismaPromise<Model["row"]>;
  upsert(arguments_: {
    where: Model["where"];
    create: Model["create"];
    update: Model["update"];
  }): Prisma.PrismaPromise<Model["row"]>;
  delete(arguments_: { where: Model["where"] }): Prisma.PrismaPromise<Model["row"]>;
};

export type PrismaRepositoryOptions<Model extends PrismaModel, Entity, NewEntity, Changes, Key> = {
  toEntity: (row: Model["row"]) => Entity;
  toWhere: (key: Key) => Model["where"];
  orderBy: Model["orderBy"][];
  toCreateData: (entity: NewEntity) => Model["create"];
  toUpdateData: (changes: Changes) => Model["update"];
};

export class PrismaRepository<Model extends PrismaModel, Entity, NewEntity, Changes, Key = string>
  implements Repository<Entity, NewEntity, Changes, Key>
{
  constructor(
    protected readonly client: PrismaClient,
    protected readonly delegate: PrismaDelegate<Model>,
    protected readonly options: PrismaRepositoryOptions<Model, Entity, NewEntity, Changes, Key>,
  ) {}

  findById(key: Key): Promise<Entity | null> {
    return this.findOne(this.options.toWhere(key));
  }

  list({ skip, take }: PageRequest): Promise<Page<Entity>> {
    return withPrismaErrors(async () => {
      const [rows, total] = await this.client.$transaction([
        this.delegate.findMany({ skip, take, orderBy: this.options.orderBy }),
        this.delegate.count(),
      ]);
      return { items: rows.map(this.options.toEntity), total };
    });
  }

  create(entity: NewEntity): Promise<Entity> {
    return withPrismaErrors(async () =>
      this.options.toEntity(
        await this.delegate.create({ data: this.options.toCreateData(entity) }),
      ),
    );
  }

  update(key: Key, changes: Changes): Promise<Entity> {
    return withPrismaErrors(async () =>
      this.options.toEntity(
        await this.delegate.update({
          where: this.options.toWhere(key),
          data: this.options.toUpdateData(changes),
        }),
      ),
    );
  }

  delete(key: Key): Promise<void> {
    return withPrismaErrors(async () => {
      await this.delegate.delete({ where: this.options.toWhere(key) });
    });
  }

  protected findOne(where: Model["where"]): Promise<Entity | null> {
    return withPrismaErrors(async () => {
      const row = await this.delegate.findUnique({ where });
      return row ? this.options.toEntity(row) : null;
    });
  }

  protected upsertOne(where: Model["where"], entity: NewEntity, changes: Changes): Promise<Entity> {
    return withPrismaErrors(async () =>
      this.options.toEntity(
        await this.delegate.upsert({
          where,
          create: this.options.toCreateData(entity),
          update: this.options.toUpdateData(changes),
        }),
      ),
    );
  }
}
