import { config } from "@/config";

const { hostUrl } = config;

export const uris = {
  lessonUri: (lessonId: string) => `${hostUrl}/lessons/${lessonId}`,
  lessonNoteUri: (lessonId: string) => `${hostUrl}/lessons/${lessonId}/note`,
  lessonStartUri: (lessonId: string) => `${hostUrl}/lessons/${lessonId}/start`,
};
