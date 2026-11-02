import { type LessonNoteResponse, lessonNoteResponseSchema } from "@shared/schemas";
import { uris } from "@/services/lesson-service/lesson.urls";
import { networkService } from "@/services/network.service";
import { rejectAxios, rejectInvalidResponse } from "@/services/service-error";

export const getLessonNote = async (lessonId: string): Promise<LessonNoteResponse> => {
  const { data } = await networkService
    .get(uris.lessonNoteUri(lessonId))
    .catch((error) => rejectAxios(error, "Unable to load your note"));

  const parsedData = lessonNoteResponseSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();

  return parsedData.data;
};

export const saveLessonNote = async (
  lessonId: string,
  body: string,
): Promise<LessonNoteResponse> => {
  const { data } = await networkService
    .put(uris.lessonNoteUri(lessonId), { body })
    .catch((error) => rejectAxios(error, "Unable to save your note"));

  const parsedData = lessonNoteResponseSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();

  return parsedData.data;
};

export const lessonService = {
  getLessonNote,
  saveLessonNote,
};
