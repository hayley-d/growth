import { useQuery } from "@tanstack/react-query";

import { onboardingService } from "@/services/onboarding-service";

export const onboardingQueryKeys = {
  quiz: ["onboarding", "quiz"] as const,
};

export const useQuizQuery = () =>
  useQuery({
    queryKey: onboardingQueryKeys.quiz,
    queryFn: onboardingService.getQuiz,
    staleTime: Number.POSITIVE_INFINITY,
  });
