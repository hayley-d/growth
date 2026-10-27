import { describe, expect, it, vi } from "vitest";

import type { PrismaClient } from "@/generated/prisma/client";
import { PrismaUserRepository } from "@/infrastructure/user/repositories";

const row = {
  id: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
  name: "Ada Lovelace",
  email: "ada@example.com",
  emailVerified: true,
  image: null,
  role: "student",
  banned: false,
  banReason: null,
  banExpires: null,
  createdAt: new Date("2026-10-26T00:00:00.000Z"),
  updatedAt: new Date("2026-10-26T00:00:00.000Z"),
};

const createClient = () => {
  const user = { findUnique: vi.fn(), findMany: vi.fn(), count: vi.fn() };
  const client = {
    user,
    $transaction: vi.fn((queries: Promise<unknown>[]) => Promise.all(queries)),
  };
  return { user, client: client as unknown as PrismaClient };
};

describe("PrismaUserRepository", () => {
  it("finds a user by email", async () => {
    const { user, client } = createClient();
    user.findUnique.mockResolvedValue(row);

    const found = await new PrismaUserRepository(client).findByEmail(row.email);

    expect(user.findUnique).toHaveBeenCalledWith({ where: { email: row.email } });
    expect(found?.name).toBe("Ada Lovelace");
  });

  it("returns null when no user matches", async () => {
    const { user, client } = createClient();
    user.findUnique.mockResolvedValue(null);

    const found = await new PrismaUserRepository(client).findById(row.id);

    expect(found).toBeNull();
  });
});
