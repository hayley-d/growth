import { config } from "@/config";

const { hostUrl } = config;

export const practiceUris = {
  topicsUri: `${hostUrl}/practice/topics`,
  attemptsUri: `${hostUrl}/practice/attempts`,
  questionsUri: (attemptId: string) => `${hostUrl}/practice/attempts/${attemptId}/questions`,
  finishUri: (attemptId: string) => `${hostUrl}/practice/attempts/${attemptId}/finish`,
};
