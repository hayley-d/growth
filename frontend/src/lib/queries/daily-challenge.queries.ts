import { useQuery } from "@tanstack/react-query";

import { dailyChallengeService } from "@/services/daily-challenge-service";

export const dailyChallengeQueryKeys = {
  all: ["daily-challenge"] as const,
};

export const useDailyChallengeQuery = () =>
  useQuery({
    queryKey: dailyChallengeQueryKeys.all,
    queryFn: () => dailyChallengeService.getDailyChallenge(),
  });
