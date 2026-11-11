import {
  type LessonNoteResponse,
  type LessonResponse,
  lessonNoteResponseSchema,
  lessonResponseSchema,
} from "@shared/schemas";
import { uris } from "@/services/lesson-service/lesson.urls";
import { networkService } from "@/services/network.service";
import { rejectAxios, rejectInvalidResponse } from "@/services/service-error";

export const getLesson = async (lessonId: string): Promise<LessonResponse> => {
  const { data } = await networkService
    .get(uris.lessonUri(lessonId))
    .catch((error) => rejectAxios(error, "Unable to load the lesson"));

  const parsedData = lessonResponseSchema.safeParse(data);
  if (!parsedData.success) return rejectInvalidResponse();

  return parsedData.data;
};

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

export const startLesson = async (lessonId: string): Promise<void> => {
  await networkService
    .post(uris.lessonStartUri(lessonId))
    .catch((error) => rejectAxios(error, "Unable to start the lesson"));
};

export const lessonService = {
  getLesson,
  getLessonNote,
  saveLessonNote,
  startLesson,
};
