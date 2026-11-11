import {
  type CompleteOnboardingRequest,
  type GetQuizResponse,
  getQuizResponseSchema,
  type MeResponse,
  meResponseSchema,
  type QuizAnswer,
  type ScoreQuizResponse,
  scoreQuizResponseSchema,
} from "@shared/schemas";
import { networkService } from "@/services/network.service";
import { uris } from "@/services/onboarding-service/onboarding.urls";
import { rejectAxios, rejectInvalidResponse } from "@/services/service-error";

export const getQuiz = async (): Promise<GetQuizResponse> => {
  const { data } = await networkService
    .get(uris.quizUri)
    .catch((error) => rejectAxios(error, "Unable to load the quiz"));

  const parsedData = getQuizResponseSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();

  return parsedData.data;
};

export const scoreQuiz = async (answers: QuizAnswer[]): Promise<ScoreQuizResponse> => {
  const { data } = await networkService
    .post(uris.quizUri, { answers })
    .catch((error) => rejectAxios(error, "Unable to work out your learning style"));

  const parsedData = scoreQuizResponseSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();

  return parsedData.data;
};

export const completeOnboarding = async (
  answers: CompleteOnboardingRequest,
): Promise<MeResponse> => {
  const { data } = await networkService
    .post(uris.onboardingUri, answers)
    .catch((error) => rejectAxios(error, "Unable to save your answers"));

  const parsedData = meResponseSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();

  return parsedData.data;
};

export const onboardingService = {
  getQuiz,
  scoreQuiz,
  completeOnboarding,
};
