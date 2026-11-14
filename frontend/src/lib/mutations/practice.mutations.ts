import { useMutation } from "@tanstack/react-query";

import type { PracticeTopic } from "@shared/schemas";
import { practiceService } from "@/services/practice-service";

export const useStartPracticeMutation = () =>
  useMutation({
    mutationFn: (topic: PracticeTopic) => practiceService.startPractice(topic),
  });

export const useNextPracticeQuestionMutation = () =>
  useMutation({
    mutationFn: (attemptId: string) => practiceService.nextPracticeQuestion(attemptId),
  });

export const useFinishPracticeMutation = () =>
  useMutation({
    mutationFn: (attemptId: string) => practiceService.finishPractice(attemptId),
  });
