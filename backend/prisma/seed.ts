import { APIError } from "better-auth";

import { auth } from "@/infrastructure/auth/auth";
import { environment } from "@/infrastructure/config/environment";
import { prismaClient } from "@/infrastructure/database/prisma-client";
import { createPinoLogger } from "@/infrastructure/logging/pino-logger";

const logger = createPinoLogger(environment.LOG_LEVEL);

const adminEmail = "admin@growth.local";
const adminPassword = "growth123";

const localHostnames = new Set(["localhost", "127.0.0.1"]);
const isLocalDatabase = localHostnames.has(new URL(environment.DATABASE_URL).hostname);

if (!isLocalDatabase) {
  throw new Error("Refusing to seed a dev admin account against a non-localhost DATABASE_URL");
}

try {
  await auth.api.signUpEmail({
    body: { email: adminEmail, password: adminPassword, name: "Dev Admin" },
  });
} catch (error) {
  const isAlreadyExists =
    error instanceof APIError && error.body?.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL";
  if (!isAlreadyExists) throw error;
}

await prismaClient.user.update({
  where: { email: adminEmail },
  data: { role: "admin" },
});

logger.info("Seeded dev admin", { email: adminEmail });
