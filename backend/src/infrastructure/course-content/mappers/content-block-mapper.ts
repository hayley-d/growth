import type {
  ContentBlock,
  ContentBlockChanges,
  NewContentBlock,
} from "@/domain/course-content/content-block";
import type { ContentBlock as ContentBlockRow } from "@/generated/prisma/client";
import { toJsonInput } from "@/infrastructure/database/json-input";

export const toContentBlock = (row: ContentBlockRow): ContentBlock => ({
  id: row.id,
  lessonId: row.lessonId,
  learningStyleId: row.learningStyleId,
  type: row.type,
  body: row.body,
  transcript: row.transcript,
  position: row.position,
});

export const toContentBlockCreateData = (contentBlock: NewContentBlock) => ({
  ...contentBlock,
  body: toJsonInput(contentBlock.body),
});

export const toContentBlockUpdateData = (changes: ContentBlockChanges) => ({
  ...changes,
  body: changes.body === undefined ? undefined : toJsonInput(changes.body),
});
