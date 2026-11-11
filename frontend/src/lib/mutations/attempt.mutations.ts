import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { LearnerAnswer } from "@shared/schemas";
import { learningPathQueryKeys } from "@/lib/queries/learning-path.queries";
import { attemptService } from "@/services/attempt-service";

type RequestHintVariables = {
  attemptId: string;
  questionId: string;
};

type SubmitAnswerVariables = RequestHintVariables & {
  answer: LearnerAnswer;
};

export const useStartAttemptMutation = () =>
  useMutation({
    mutationFn: (lessonId: string) => attemptService.startAttempt(lessonId),
  });

export const useRequestHintMutation = () =>
  useMutation({
    mutationFn: ({ attemptId, questionId }: RequestHintVariables) =>
      attemptService.requestHint(attemptId, questionId),
  });

export const useSubmitAnswerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ attemptId, questionId, answer }: SubmitAnswerVariables) =>
      attemptService.submitAnswer(attemptId, questionId, answer),
    onSuccess: (response) => {
      if (response.data.result) {
        void queryClient.invalidateQueries({ queryKey: learningPathQueryKeys.all });
      }
    },
  });
};
