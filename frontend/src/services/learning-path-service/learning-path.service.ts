import { type LearningPathResponse, learningPathResponseSchema } from "@shared/schemas";
import { uris } from "@/services/learning-path-service/learning-path.urls";
import { networkService } from "@/services/network.service";
import { rejectAxios, rejectInvalidResponse } from "@/services/service-error";

export const getLearningPath = async (): Promise<LearningPathResponse> => {
  const { data } = await networkService
    .get(uris.learningPathUri)
    .catch((error) => rejectAxios(error, "Unable to load your learning path"));

  const parsedData = learningPathResponseSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();

  return parsedData.data;
};

export const learningPathService = {
  getLearningPath,
};
