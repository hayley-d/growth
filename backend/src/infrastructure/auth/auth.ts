import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins/admin";

import type { AuthHandler, GetSession } from "@/application/auth/session";
import { environment } from "@/infrastructure/config/environment";
import { prismaClient } from "@/infrastructure/database/prisma-client";
import { createPinoLogger } from "@/infrastructure/logging/pino-logger";
import { PrismaUserProfileRepository } from "@/infrastructure/user/repositories";

const logger = createPinoLogger(environment.LOG_LEVEL);
const userProfileRepository = new PrismaUserProfileRepository(prismaClient);

export const auth = betterAuth({
  secret: environment.BETTER_AUTH_SECRET,
  baseURL: environment.BETTER_AUTH_URL,
  database: prismaAdapter(prismaClient, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await userProfileRepository.create({ userId: user.id });
          } catch (error) {
            logger.error("Creating the user profile failed", { userId: user.id, error });
          }
        },
      },
    },
  },
  plugins: [admin({ defaultRole: "student" })],
});

export const authHandler: AuthHandler = (request) => auth.handler(request);

export const getSession: GetSession = async (headers) => {
  const session = await auth.api.getSession({ headers });
  if (!session) return null;

  return {
    userId: session.user.id,
    role: session.user.role ?? null,
  };
};
