import { auth } from "@/infrastructure/auth/auth";
import { environment } from "@/infrastructure/config/environment";
import { createPinoLogger } from "@/infrastructure/logging/pino-logger";

const logger = createPinoLogger(environment.LOG_LEVEL);

const adminEmail = "admin@growth.local";
const adminPassword = "growth123";

const localHostnames = new Set(["localhost", "127.0.0.1"]);
const isLocalDatabase = localHostnames.has(new URL(environment.DATABASE_URL).hostname);

if (!isLocalDatabase) {
  throw new Error("Refusing to seed a dev admin account against a non-localhost DATABASE_URL");
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
