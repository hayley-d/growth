import type { Context } from "hono";

import type { IdParam, SaveLessonNoteRequest } from "@shared/schemas";
import type { SaveLessonNote } from "@/application/lesson/commands/save-lesson-note";
import type { GetLesson } from "@/application/lesson/queries/get-lesson";
import type { GetLessonNote } from "@/application/lesson/queries/get-lesson-note";

type LessonControllerDependencies = {
  getLesson: GetLesson;
  getLessonNote: GetLessonNote;
  saveLessonNote: SaveLessonNote;
};

type ParamContext = Context<object, string, { out: { param: IdParam } }>;
type SaveNoteContext = Context<
  object,
  string,
  { out: { param: IdParam; json: SaveLessonNoteRequest } }
>;

export const createLessonController = ({
  getLesson,
  getLessonNote,
  saveLessonNote,
}: LessonControllerDependencies) => ({
  get: async (context: ParamContext) => context.json(await getLesson(context.req.valid("param"))),
  getNote: async (context: ParamContext) =>
    context.json(await getLessonNote(context.req.valid("param"))),
  saveNote: async (context: SaveNoteContext) =>
    context.json(
      await saveLessonNote({ ...context.req.valid("param"), ...context.req.valid("json") }),
    ),
});

export type LessonController = ReturnType<typeof createLessonController>;
