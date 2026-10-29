import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Logger } from "@/application/logging/logger";
import { auth } from "@/infrastructure/auth/auth";
import { seedAdmin } from "@/infrastructure/seed/seed-admin";

const internalAdapter = vi.hoisted(() => ({
  findUserByEmail: vi.fn(),
  updateUser: vi.fn(),
  updatePassword: vi.fn(),
}));

vi.mock("@/infrastructure/auth/auth", () => ({
  auth: {
    $context: Promise.resolve({
      internalAdapter,
      password: { hash: vi.fn().mockResolvedValue("hashed") },
    }),
    api: { createUser: vi.fn() },
  },
}));

const createStubLogger = (): Logger => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

const localDatabaseUrl = "postgresql://user:secret@localhost:5433/growth";

describe("seedAdmin", () => {
  beforeEach(() => {
    vi.mocked(auth.api.createUser).mockClear();
    internalAdapter.findUserByEmail.mockReset().mockResolvedValue(null);
    internalAdapter.updateUser.mockClear();
    internalAdapter.updatePassword.mockClear();
  });

  it("skips the admin when SEED_DEV_ADMIN is off, even on a local database", async () => {
    const logger = createStubLogger();

    await seedAdmin({ databaseUrl: localDatabaseUrl, enabled: false, logger });

    expect(logger.info).toHaveBeenCalledWith("Skipped dev admin: SEED_DEV_ADMIN is off");
    expect(internalAdapter.findUserByEmail).not.toHaveBeenCalled();
    expect(auth.api.createUser).not.toHaveBeenCalled();
  });

  it("skips the admin on a database that isn't local", async () => {
    const logger = createStubLogger();

    await seedAdmin({
      databaseUrl: "postgresql://user:secret@db.example.com:5432/growth",
      enabled: true,
      logger,
    });

    expect(logger.info).toHaveBeenCalledWith("Skipped dev admin: not a local database");
    expect(auth.api.createUser).not.toHaveBeenCalled();
  });

  it.each([
    localDatabaseUrl,
    "postgresql://user:secret@127.0.0.1:5433/growth",
    "postgresql://user:secret@[::1]:5433/growth",
  ])("creates the admin on %s", async (databaseUrl) => {
    const logger = createStubLogger();

    await seedAdmin({ databaseUrl, enabled: true, logger });

    expect(auth.api.createUser).toHaveBeenCalledOnce();
    expect(logger.info).toHaveBeenCalledWith("Seeded dev admin", { email: "admin@growth.local" });
  });

  it("resets the role and password of an admin that already exists", async () => {
    const logger = createStubLogger();
    internalAdapter.findUserByEmail.mockResolvedValue({ user: { id: "admin-id" } });

    await seedAdmin({ databaseUrl: localDatabaseUrl, enabled: true, logger });

    expect(internalAdapter.updateUser).toHaveBeenCalledWith("admin-id", { role: "admin" });
    expect(internalAdapter.updatePassword).toHaveBeenCalledWith("admin-id", "hashed");
    expect(auth.api.createUser).not.toHaveBeenCalled();
  });
});
