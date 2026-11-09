import {
  type ListCodeLanguagesResponse,
  type ListLearningStylesResponse,
  listCodeLanguagesResponseSchema,
  listLearningStylesResponseSchema,
} from "@shared/schemas";
import { uris } from "@/services/course-content-service/course-content.urls";
import { networkService } from "@/services/network.service";
import { rejectAxios, rejectInvalidResponse } from "@/services/service-error";

export const listLearningStyles = async (): Promise<ListLearningStylesResponse> => {
  const { data } = await networkService
    .get(uris.learningStylesUri)
    .catch((error) => rejectAxios(error, "Unable to load the learning styles"));

  const parsedData = listLearningStylesResponseSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();

  return parsedData.data;
};

export const listCodeLanguages = async (): Promise<ListCodeLanguagesResponse> => {
  const { data } = await networkService
    .get(uris.codeLanguagesUri)
    .catch((error) => rejectAxios(error, "Unable to load the code languages"));

  const parsedData = listCodeLanguagesResponseSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();

  return parsedData.data;
};

export const courseContentService = {
  listLearningStyles,
  listCodeLanguages,
};
