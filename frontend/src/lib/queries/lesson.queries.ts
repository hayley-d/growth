import { useQuery } from "@tanstack/react-query";

import { lessonService } from "@/services/lesson-service";
import { ServiceError } from "@/services/service-error";
import { retryUnlessUnauthorized } from "@/services/utils";

export const lessonQueryKeys = {
  all: ["lesson"] as const,
  detail: (lessonId: string) => [...lessonQueryKeys.all, lessonId] as const,
  note: (lessonId: string) => [...lessonQueryKeys.all, lessonId, "note"] as const,
};

export const useLessonNoteQuery = (lessonId: string, enabled = true) =>
  useQuery({
    queryKey: lessonQueryKeys.note(lessonId),
    queryFn: () => lessonService.getLessonNote(lessonId),
    enabled,
  });

export const useLessonQuery = (lessonId: string) =>
  useQuery({
    queryKey: lessonQueryKeys.detail(lessonId),
    queryFn: () => lessonService.getLesson(lessonId),
    retry: (failureCount, error) =>
      !(error instanceof ServiceError && error.status === 404) &&
      retryUnlessUnauthorized(failureCount, error),
  });
