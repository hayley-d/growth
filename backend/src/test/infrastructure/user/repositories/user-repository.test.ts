import { describe, expect, it, vi } from "vitest";

import type { PrismaClient } from "@/generated/prisma/client";
import { PrismaUserRepository } from "@/infrastructure/user/repositories";

const row = {
  id: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
  firstName: "Ada",
  lastName: "Lovelace",
  displayName: "ada",
  email: "ada@example.com",
  passwordHash: "hash",
  learningStyleId: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
  codeLanguageId: "2c3d4e5f-6071-4829-8b3c-4d5e6f7a8b91",
  textToSpeech: false,
  colourTheme: "high_contrast" as const,
  showOnLeaderboard: true,
  createdAt: new Date("2026-10-26T00:00:00.000Z"),
};

const createClient = () => {
  const user = { findUnique: vi.fn(), create: vi.fn(), update: vi.fn() };
  return { user, client: { user } as unknown as PrismaClient };
};

describe("PrismaUserRepository", () => {
  it("maps the Prisma colour theme to the frontend id", async () => {
    const { user, client } = createClient();
    user.findUnique.mockResolvedValue(row);
    const found = await new PrismaUserRepository(client).findByEmail(row.email);
    expect(found?.colourTheme).toBe("high-contrast");
  });

  it("maps the frontend colour theme id back on create", async () => {
    const { user, client } = createClient();
    user.create.mockResolvedValue(row);
    const { id, createdAt, colourTheme, ...newUser } = row;
    await new PrismaUserRepository(client).create({ ...newUser, colourTheme: "high-contrast" });
    expect(user.create.mock.calls[0]?.[0].data.colourTheme).toBe("high_contrast");
  });

  it("maps the frontend colour theme id back on update", async () => {
    const { user, client } = createClient();
    user.update.mockResolvedValue({ ...row, colourTheme: "okabe_ito" });
    const updated = await new PrismaUserRepository(client).update(row.id, {
      colourTheme: "okabe-ito",
    });
    expect(user.update).toHaveBeenCalledWith({
      where: { id: row.id },
      data: { colourTheme: "okabe_ito" },
    });
    expect(updated.colourTheme).toBe("okabe-ito");
  });
});
