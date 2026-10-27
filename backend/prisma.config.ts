import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "src/infrastructure",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
