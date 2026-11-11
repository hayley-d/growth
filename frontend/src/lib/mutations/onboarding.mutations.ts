import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userQueryKeys } from "@/lib/queries/user.queries";
import { onboardingService } from "@/services/onboarding-service";

export const useScoreQuizMutation = () =>
  useMutation({
    mutationKey: ["onboarding", "score-quiz"],
    mutationFn: onboardingService.scoreQuiz,
  });

export const useCompleteOnboardingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["onboarding", "complete"],
    mutationFn: onboardingService.completeOnboarding,
    onSuccess: (response) => {
      queryClient.setQueryData(userQueryKeys.me, response);
      return queryClient.invalidateQueries({ queryKey: userQueryKeys.me });
    },
  });
};
