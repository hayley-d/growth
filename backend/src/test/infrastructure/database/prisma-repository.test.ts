import { describe, expect, it, vi } from "vitest";

import { NotFoundError } from "@/domain/errors";
import { Prisma, type PrismaClient } from "@/generated/prisma/client";
import { PrismaRepository } from "@/infrastructure/database/prisma-repository";

type ThingRow = { id: string; label: string };
type Thing = { id: string; name: string };
type NewThing = { name: string };
type ThingChanges = Partial<NewThing>;
type ThingModel = {
  row: ThingRow;
  where: { id?: string; label?: string };
  create: { label: string };
  update: { label?: string };
  orderBy: { id?: "asc" | "desc" };
};

class ThingRepository extends PrismaRepository<ThingModel, Thing, NewThing, ThingChanges> {
  findByLabel(label: string) {
    return this.findOne({ label });
  }

  upsertByLabel(thing: NewThing) {
    return this.upsertOne({ label: thing.name }, thing, thing);
  }
}

const row: ThingRow = { id: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01", label: "root" };

const createRepository = () => {
  const delegate = {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    upsert: vi.fn(),
    delete: vi.fn(),
  };
  const client = {
    $transaction: vi.fn((operations: Promise<unknown>[]) => Promise.all(operations)),
  } as unknown as PrismaClient;
  const repository = new ThingRepository(client, delegate, {
    toEntity: (thing) => ({ id: thing.id, name: thing.label }),
    toWhere: (id) => ({ id }),
    orderBy: [{ id: "asc" }],
    toCreateData: (thing) => ({ label: thing.name }),
    toUpdateData: (changes) => ({ label: changes.name }),
  });
  return { delegate, repository };
};

describe("PrismaRepository", () => {
  it("finds by id and maps the row", async () => {
    const { delegate, repository } = createRepository();
    delegate.findUnique.mockResolvedValue(row);
    await expect(repository.findById(row.id)).resolves.toEqual({ id: row.id, name: "root" });
    expect(delegate.findUnique).toHaveBeenCalledWith({ where: { id: row.id } });
  });

  it("returns null when nothing is found", async () => {
    const { delegate, repository } = createRepository();
    delegate.findUnique.mockResolvedValue(null);
    await expect(repository.findById(row.id)).resolves.toBeNull();
  });

  it("lets a subclass find by another unique column", async () => {
    const { delegate, repository } = createRepository();
    delegate.findUnique.mockResolvedValue(row);
    await repository.findByLabel("root");
    expect(delegate.findUnique).toHaveBeenCalledWith({ where: { label: "root" } });
  });

  it("lists a page in order with the total", async () => {
    const { delegate, repository } = createRepository();
    delegate.findMany.mockResolvedValue([row]);
    delegate.count.mockResolvedValue(7);
    await expect(repository.list({ skip: 5, take: 5 })).resolves.toEqual({
      items: [{ id: row.id, name: "root" }],
      total: 7,
    });
    expect(delegate.findMany).toHaveBeenCalledWith({ skip: 5, take: 5, orderBy: [{ id: "asc" }] });
  });

  it("converts the entity before creating", async () => {
    const { delegate, repository } = createRepository();
    delegate.create.mockResolvedValue(row);
    await repository.create({ name: "root" });
    expect(delegate.create).toHaveBeenCalledWith({ data: { label: "root" } });
  });

  it("updates by key with converted changes", async () => {
    const { delegate, repository } = createRepository();
    delegate.update.mockResolvedValue(row);
    await repository.update(row.id, { name: "root" });
    expect(delegate.update).toHaveBeenCalledWith({
      where: { id: row.id },
      data: { label: "root" },
    });
  });

  it("upserts on a unique column with converted data", async () => {
    const { delegate, repository } = createRepository();
    delegate.upsert.mockResolvedValue(row);
    await expect(repository.upsertByLabel({ name: "root" })).resolves.toEqual({
      id: row.id,
      name: "root",
    });
    expect(delegate.upsert).toHaveBeenCalledWith({
      where: { label: "root" },
      create: { label: "root" },
      update: { label: "root" },
    });
  });

  it("deletes by key", async () => {
    const { delegate, repository } = createRepository();
    delegate.delete.mockResolvedValue(row);
    await expect(repository.delete(row.id)).resolves.toBeUndefined();
    expect(delegate.delete).toHaveBeenCalledWith({ where: { id: row.id } });
  });

  it("turns prisma errors into domain errors", async () => {
    const { delegate, repository } = createRepository();
    delegate.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("missing", { code: "P2025", clientVersion: "test" }),
    );
    await expect(repository.update(row.id, { name: "root" })).rejects.toBeInstanceOf(NotFoundError);
  });
});
