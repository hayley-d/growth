import type { Context } from "hono";

import type { IdParam, SaveLessonNoteRequest } from "@shared/schemas";
import type { SaveLessonNote } from "@/application/lesson/commands/save-lesson-note";
import type { StartLesson } from "@/application/lesson/commands/start-lesson";
import type { GetLesson } from "@/application/lesson/queries/get-lesson";
import type { GetLessonNote } from "@/application/lesson/queries/get-lesson-note";

type LessonControllerDependencies = {
  getLesson: GetLesson;
  getLessonNote: GetLessonNote;
  saveLessonNote: SaveLessonNote;
  startLesson: StartLesson;
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
  startLesson,
}: LessonControllerDependencies) => ({
  get: async (context: ParamContext) => context.json(await getLesson(context.req.valid("param"))),
  getNote: async (context: ParamContext) =>
    context.json(await getLessonNote(context.req.valid("param"))),
  saveNote: async (context: SaveNoteContext) =>
    context.json(
      await saveLessonNote({ ...context.req.valid("param"), ...context.req.valid("json") }),
    ),
  start: async (context: ParamContext) => {
    await startLesson(context.req.valid("param"));
    return context.body(null, 204);
  },
});

export type LessonController = ReturnType<typeof createLessonController>;
