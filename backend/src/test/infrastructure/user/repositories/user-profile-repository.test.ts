import { describe, expect, it, vi } from "vitest";

import type { PrismaClient } from "@/generated/prisma/client";
import { PrismaUserProfileRepository } from "@/infrastructure/user/repositories";

const row = {
  userId: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
  learningStyleId: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
  codeLanguageId: "2c3d4e5f-6071-4829-8b3c-4d5e6f7a8b91",
  textToSpeech: false,
  colourTheme: "high_contrast" as const,
  showOnLeaderboard: true,
  onboardingComplete: false,
};

const createClient = () => {
  const userProfile = { findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() };
  return { userProfile, client: { userProfile } as unknown as PrismaClient };
};

describe("PrismaUserProfileRepository", () => {
  it("maps the Prisma colour theme to the frontend id", async () => {
    const { userProfile, client } = createClient();
    userProfile.findUnique.mockResolvedValue(row);

    const found = await new PrismaUserProfileRepository(client).findById(row.userId);

    expect(userProfile.findUnique).toHaveBeenCalledWith({ where: { userId: row.userId } });
    expect(found?.colourTheme).toBe("high-contrast");
  });

  it("maps the frontend colour theme id back on create", async () => {
    const { userProfile, client } = createClient();
    userProfile.create.mockResolvedValue(row);

    await new PrismaUserProfileRepository(client).create({ ...row, colourTheme: "high-contrast" });

    expect(userProfile.create).toHaveBeenCalledWith({
      data: { ...row, colourTheme: "high_contrast" },
    });
  });

  it("maps the frontend colour theme id back on update", async () => {
    const { userProfile, client } = createClient();
    userProfile.update.mockResolvedValue({ ...row, colourTheme: "okabe_ito" });

    const updated = await new PrismaUserProfileRepository(client).update(row.userId, {
      colourTheme: "okabe-ito",
    });

    expect(userProfile.update).toHaveBeenCalledWith({
      where: { userId: row.userId },
      data: { colourTheme: "okabe_ito" },
    });
    expect(updated.colourTheme).toBe("okabe-ito");
  });

  it("creates a profile with no learning style or code language chosen yet", async () => {
    const { userProfile, client } = createClient();
    userProfile.create.mockResolvedValue({
      ...row,
      learningStyleId: null,
      codeLanguageId: null,
    });

    const created = await new PrismaUserProfileRepository(client).create({ userId: row.userId });

    expect(userProfile.create).toHaveBeenCalledWith({
      data: { userId: row.userId, colourTheme: undefined },
    });
    expect(created.learningStyleId).toBeNull();
    expect(created.codeLanguageId).toBeNull();
  });

  it("deletes a profile", async () => {
    const { userProfile, client } = createClient();
    userProfile.delete.mockResolvedValue(row);

    await new PrismaUserProfileRepository(client).delete(row.userId);

    expect(userProfile.delete).toHaveBeenCalledWith({ where: { userId: row.userId } });
  });
});
