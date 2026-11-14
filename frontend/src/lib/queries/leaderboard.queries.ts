import { useQuery } from "@tanstack/react-query";

import { leaderboardService } from "@/services/leaderboard-service";

export const leaderboardQueryKeys = {
  all: ["leaderboard"] as const,
};

export const useLeaderboardQuery = () =>
  useQuery({
    queryKey: leaderboardQueryKeys.all,
    queryFn: () => leaderboardService.getLeaderboard(),
  });
