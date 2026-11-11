import { config } from "@/config";

const { hostUrl } = config;

export const uris = {
  onboardingUri: `${hostUrl}/onboarding`,
  quizUri: `${hostUrl}/onboarding/quiz`,
};
