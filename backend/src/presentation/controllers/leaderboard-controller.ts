import type { Context } from "hono";

import type { GetLeaderboard } from "@/application/leaderboard/queries/get-leaderboard";

type LeaderboardControllerDependencies = {
  getLeaderboard: GetLeaderboard;
};

export const createLeaderboardController = ({
  getLeaderboard,
}: LeaderboardControllerDependencies) => ({
  get: async (context: Context) => context.json(await getLeaderboard()),
});

export type LeaderboardController = ReturnType<typeof createLeaderboardController>;
