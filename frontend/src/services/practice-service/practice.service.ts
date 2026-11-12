import {
  type AttemptStateResponse,
  attemptStateResponseSchema,
  type PracticeSummaryResponse,
  type PracticeTopic,
  type PracticeTopicsResponse,
  practiceSummaryResponseSchema,
  practiceTopicsResponseSchema,
} from "@shared/schemas";
import { networkService } from "@/services/network.service";
import { practiceUris } from "@/services/practice-service/practice.urls";
import { rejectAxios, rejectInvalidResponse } from "@/services/service-error";

export const getPracticeTopics = async (): Promise<PracticeTopicsResponse> => {
  const { data } = await networkService
    .get(practiceUris.topicsUri)
    .catch((error) => rejectAxios(error, "Unable to load the practice topics"));

  const parsedData = practiceTopicsResponseSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();

  return parsedData.data;
};

export const startPractice = async (topic: PracticeTopic): Promise<AttemptStateResponse> => {
  const { data } = await networkService
    .post(practiceUris.attemptsUri, { topic })
    .catch((error) => rejectAxios(error, "Unable to start practice"));

  const parsedData = attemptStateResponseSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();

  return parsedData.data;
};

export const nextPracticeQuestion = async (attemptId: string): Promise<AttemptStateResponse> => {
  const { data } = await networkService
    .post(practiceUris.questionsUri(attemptId))
    .catch((error) => rejectAxios(error, "Unable to get the next question"));

  const parsedData = attemptStateResponseSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();

  return parsedData.data;
};

export const finishPractice = async (attemptId: string): Promise<PracticeSummaryResponse> => {
  const { data } = await networkService
    .post(practiceUris.finishUri(attemptId))
    .catch((error) => rejectAxios(error, "Unable to finish practice"));

  const parsedData = practiceSummaryResponseSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();

  return parsedData.data;
};

export const practiceService = {
  getPracticeTopics,
  startPractice,
  nextPracticeQuestion,
  finishPractice,
};
