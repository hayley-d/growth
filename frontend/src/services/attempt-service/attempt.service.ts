import {
  type AttemptStateResponse,
  attemptStateResponseSchema,
  type LearnerAnswer,
  type RequestHintResponse,
  requestHintResponseSchema,
  type SubmitAnswerResponse,
  submitAnswerResponseSchema,
} from "@shared/schemas";
import { uris } from "@/services/attempt-service/attempt.urls";
import { networkService } from "@/services/network.service";
import { rejectAxios, rejectInvalidResponse } from "@/services/service-error";

export const startAttempt = async (lessonId: string): Promise<AttemptStateResponse> => {
  const { data } = await networkService
    .post(uris.lessonAttemptsUri(lessonId))
    .catch((error) => rejectAxios(error, "Unable to start the test"));

  const parsedData = attemptStateResponseSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();

  return parsedData.data;
};

export const requestHint = async (
  attemptId: string,
  questionId: string,
): Promise<RequestHintResponse> => {
  const { data } = await networkService
    .post(uris.attemptHintsUri(attemptId), { questionId })
    .catch((error) => rejectAxios(error, "Unable to get a hint"));

  const parsedData = requestHintResponseSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();

  return parsedData.data;
};

export const submitAnswer = async (
  attemptId: string,
  questionId: string,
  answer: LearnerAnswer,
): Promise<SubmitAnswerResponse> => {
  const { data } = await networkService
    .post(uris.attemptAnswersUri(attemptId), { questionId, answer })
    .catch((error) => rejectAxios(error, "Unable to submit your answer"));

  const parsedData = submitAnswerResponseSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();

  return parsedData.data;
};

export const attemptService = {
  startAttempt,
  requestHint,
  submitAnswer,
};
