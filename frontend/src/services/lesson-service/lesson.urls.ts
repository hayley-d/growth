import { config } from "@/config";

const { hostUrl } = config;

export const uris = {
  lessonNoteUri: (lessonId: string) => `${hostUrl}/lessons/${lessonId}/note`,
  lessonStartUri: (lessonId: string) => `${hostUrl}/lessons/${lessonId}/start`,
};
