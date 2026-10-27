import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "src/infrastructure",
  migrations: {
    path: "prisma/migrations",
    seed: "bun prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
