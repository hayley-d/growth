import { useQueries } from "@tanstack/react-query";

import type { AlgorithmCode } from "@shared/avl";
import { algorithmService } from "@/services/algorithm-service";
import { ServiceError } from "@/services/service-error";
import { retryUnlessUnauthorized } from "@/services/utils";

export const algorithmQueryKeys = {
  all: ["algorithm"] as const,
  snippet: (code: AlgorithmCode, language: string | undefined) =>
    [...algorithmQueryKeys.all, code, "snippet", language ?? "learner"] as const,
};

const retryUnlessMissing = (failureCount: number, error: Error) =>
  !(error instanceof ServiceError && error.status === 404) &&
  retryUnlessUnauthorized(failureCount, error);

export const useAlgorithmSnippetQueries = (codes: readonly AlgorithmCode[], language?: string) =>
  useQueries({
    queries: codes.map((code) => ({
      queryKey: algorithmQueryKeys.snippet(code, language),
      queryFn: () => algorithmService.getAlgorithmSnippet(code, language),
      retry: retryUnlessMissing,
    })),
  });
