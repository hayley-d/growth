import { useQuery } from "@tanstack/react-query";

import { learningPathService } from "@/services/learning-path-service";

export const learningPathQueryKeys = {
  all: ["learning-path"] as const,
};

export const useLearningPathQuery = () =>
  useQuery({
    queryKey: learningPathQueryKeys.all,
    queryFn: () => learningPathService.getLearningPath(),
  });
