import { config } from "@/config";

const { hostUrl } = config;

export const uris = {
  lessonAttemptsUri: (lessonId: string) => `${hostUrl}/lessons/${lessonId}/attempts`,
  attemptHintsUri: (attemptId: string) => `${hostUrl}/attempts/${attemptId}/hints`,
  attemptAnswersUri: (attemptId: string) => `${hostUrl}/attempts/${attemptId}/answers`,
};
