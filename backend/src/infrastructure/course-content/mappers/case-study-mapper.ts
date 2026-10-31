import type { CaseStudy, CaseStudyChanges, NewCaseStudy } from "@/domain/course-content/case-study";
import type { CaseStudy as CaseStudyRow } from "@/generated/prisma/client";
import { toJsonInput } from "@/infrastructure/database/json-input";

export const toCaseStudy = (row: CaseStudyRow): CaseStudy => ({
  id: row.id,
  lessonId: row.lessonId,
  title: row.title,
  scenario: row.scenario,
  body: row.body,
  task: row.task,
  position: row.position,
});

export const toCaseStudyCreateData = (caseStudy: NewCaseStudy) => ({
  ...caseStudy,
  task: toJsonInput(caseStudy.task),
});

export const toCaseStudyUpdateData = (changes: CaseStudyChanges) => ({
  ...changes,
  task: changes.task === undefined ? undefined : toJsonInput(changes.task),
});
