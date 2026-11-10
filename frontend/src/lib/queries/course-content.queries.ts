import { useQuery } from "@tanstack/react-query";

import { courseContentService } from "@/services/course-content-service";

export const courseContentQueryKeys = {
  learningStyles: ["course-content", "learning-styles"] as const,
  codeLanguages: ["course-content", "code-languages"] as const,
};

export const useLearningStylesQuery = () =>
  useQuery({
    queryKey: courseContentQueryKeys.learningStyles,
    queryFn: courseContentService.listLearningStyles,
  });

export const useCodeLanguagesQuery = () =>
  useQuery({
    queryKey: courseContentQueryKeys.codeLanguages,
    queryFn: courseContentService.listCodeLanguages,
  });
