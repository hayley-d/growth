import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { DailyChallengeStateResponse, SubmitAnswerRequest } from "@shared/schemas";
import { dailyChallengeQueryKeys } from "@/lib/queries/daily-challenge.queries";
import { leaderboardQueryKeys } from "@/lib/queries/leaderboard.queries";
import { dailyChallengeService } from "@/services/daily-challenge-service";

const useSetDailyChallenge = () => {
  const queryClient = useQueryClient();
  return (response: DailyChallengeStateResponse) =>
    queryClient.setQueryData(dailyChallengeQueryKeys.all, response);
};

export const useStartDailyChallengeMutation = () => {
  const setDailyChallenge = useSetDailyChallenge();
  return useMutation({
    mutationFn: () => dailyChallengeService.startDailyChallenge(),
    onSuccess: setDailyChallenge,
  });
};

export const useSubmitDailyChallengeAnswerMutation = () => {
  const queryClient = useQueryClient();
  const setDailyChallenge = useSetDailyChallenge();
  return useMutation({
    mutationFn: (request: SubmitAnswerRequest) =>
      dailyChallengeService.submitDailyChallengeAnswer(request),
    onSuccess: (response) => {
      setDailyChallenge(response);
      void queryClient.invalidateQueries({ queryKey: leaderboardQueryKeys.all });
    },
  });
};
