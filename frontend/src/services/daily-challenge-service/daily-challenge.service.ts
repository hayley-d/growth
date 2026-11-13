import {
  type DailyChallengeStateResponse,
  dailyChallengeStateResponseSchema,
  type SubmitAnswerRequest,
} from "@shared/schemas";
import { dailyChallengeUris } from "@/services/daily-challenge-service/daily-challenge.urls";
import { networkService } from "@/services/network.service";
import { rejectAxios, rejectInvalidResponse } from "@/services/service-error";

const parseState = (data: unknown): Promise<DailyChallengeStateResponse> => {
  const parsedData = dailyChallengeStateResponseSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();
  return Promise.resolve(parsedData.data);
};

export const getDailyChallenge = async (): Promise<DailyChallengeStateResponse> => {
  const { data } = await networkService
    .get(dailyChallengeUris.challengeUri)
    .catch((error) => rejectAxios(error, "Unable to load today's challenge"));
  return parseState(data);
};

export const startDailyChallenge = async (): Promise<DailyChallengeStateResponse> => {
  const { data } = await networkService
    .post(dailyChallengeUris.startUri)
    .catch((error) => rejectAxios(error, "Unable to start today's challenge"));
  return parseState(data);
};

export const submitDailyChallengeAnswer = async (
  request: SubmitAnswerRequest,
): Promise<DailyChallengeStateResponse> => {
  const { data } = await networkService
    .post(dailyChallengeUris.answersUri, request)
    .catch((error) => rejectAxios(error, "Unable to send your answer"));
  return parseState(data);
};

export const dailyChallengeService = {
  getDailyChallenge,
  startDailyChallenge,
  submitDailyChallengeAnswer,
};
