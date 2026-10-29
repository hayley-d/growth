import type { Logger } from "@/application/logging/logger";
import { auth } from "@/infrastructure/auth/auth";

const adminEmail = "admin@growth.local";
const adminPassword = "growth123";

const localHostnames = new Set(["localhost", "127.0.0.1", "[::1]"]);

export async function seedAdmin({
  databaseUrl,
  enabled,
  logger,
}: {
  databaseUrl: string;
  enabled: boolean;
  logger: Logger;
}) {
  if (!enabled) {
    logger.info("Skipped dev admin: SEED_DEV_ADMIN is off");
    return;
  }

  if (!localHostnames.has(new URL(databaseUrl).hostname)) {
    logger.info("Skipped dev admin: not a local database");
    return;
  }

  const authContext = await auth.$context;
  const existing = await authContext.internalAdapter.findUserByEmail(adminEmail);

  if (existing) {
    await authContext.internalAdapter.updateUser(existing.user.id, { role: "admin" });
    await authContext.internalAdapter.updatePassword(
      existing.user.id,
      await authContext.password.hash(adminPassword),
    );
  } else {
    await auth.api.createUser({
      body: { email: adminEmail, password: adminPassword, name: "Dev Admin", role: "admin" },
    });
  }

  logger.info("Seeded dev admin", { email: adminEmail });
}
