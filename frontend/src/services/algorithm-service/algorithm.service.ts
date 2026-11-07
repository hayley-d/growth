import type { AlgorithmCode } from "@shared/avl";
import { type AlgorithmSnippetResponse, algorithmSnippetResponseSchema } from "@shared/schemas";
import { uris } from "@/services/algorithm-service/algorithm.urls";
import { networkService } from "@/services/network.service";
import { rejectAxios, rejectInvalidResponse } from "@/services/service-error";

export const getAlgorithmSnippet = async (
  code: AlgorithmCode,
  language?: string,
): Promise<AlgorithmSnippetResponse> => {
  const { data } = await networkService
    .get(uris.algorithmSnippetUri(code), language ? { params: { language } } : undefined)
    .catch((error) => rejectAxios(error, "Unable to load the code"));

  const parsedData = algorithmSnippetResponseSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();

  return parsedData.data;
};

export const algorithmService = {
  getAlgorithmSnippet,
};
