import { useMutation, useQueryClient } from "@tanstack/react-query";

import { learningPathQueryKeys } from "@/lib/queries/learning-path.queries";
import { lessonQueryKeys } from "@/lib/queries/lesson.queries";
import { lessonService } from "@/services/lesson-service";

type SaveLessonNoteVariables = {
  lessonId: string;
  body: string;
};

export const useSaveLessonNoteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, body }: SaveLessonNoteVariables) =>
      lessonService.saveLessonNote(lessonId, body),
    onSuccess: (response, { lessonId }) =>
      queryClient.setQueryData(lessonQueryKeys.note(lessonId), response),
  });
};

export const useStartLessonMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lessonId: string) => lessonService.startLesson(lessonId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: learningPathQueryKeys.all });
    },
  });
};
