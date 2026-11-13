import { config } from "@/config";

const { hostUrl } = config;

export const dailyChallengeUris = {
  challengeUri: `${hostUrl}/daily-challenge`,
  startUri: `${hostUrl}/daily-challenge/start`,
  answersUri: `${hostUrl}/daily-challenge/answers`,
};
