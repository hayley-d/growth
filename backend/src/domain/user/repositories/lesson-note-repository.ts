import type { Repository } from "@/domain/common/repository";
import type {
  LessonNote,
  LessonNoteChanges,
  LessonNoteKey,
  NewLessonNote,
} from "@/domain/user/lesson-note";

export type LessonNoteRepository = Repository<
  LessonNote,
  NewLessonNote,
  LessonNoteChanges,
  LessonNoteKey
>;
