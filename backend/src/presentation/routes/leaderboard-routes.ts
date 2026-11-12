import { Hono } from "hono";

import type { LeaderboardController } from "@/presentation/controllers/leaderboard-controller";
import { requireAuth } from "@/presentation/middleware/require-role";

export const createLeaderboardRoutes = (leaderboardController: LeaderboardController) =>
  new Hono().use(requireAuth).get("/", (context) => leaderboardController.get(context));
