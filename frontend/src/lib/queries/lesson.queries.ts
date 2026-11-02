import { useQuery } from "@tanstack/react-query";

import { lessonService } from "@/services/lesson-service";

export const lessonQueryKeys = {
  all: ["lesson"] as const,
  note: (lessonId: string) => [...lessonQueryKeys.all, lessonId, "note"] as const,
};

export const useLessonNoteQuery = (lessonId: string) =>
  useQuery({
    queryKey: lessonQueryKeys.note(lessonId),
    queryFn: () => lessonService.getLessonNote(lessonId),
  });
