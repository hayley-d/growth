import { useQuery } from "@tanstack/react-query";

import { practiceService } from "@/services/practice-service";

export const practiceQueryKeys = {
  all: ["practice"] as const,
  topics: () => [...practiceQueryKeys.all, "topics"] as const,
};

export const usePracticeTopicsQuery = () =>
  useQuery({
    queryKey: practiceQueryKeys.topics(),
    queryFn: () => practiceService.getPracticeTopics(),
  });
