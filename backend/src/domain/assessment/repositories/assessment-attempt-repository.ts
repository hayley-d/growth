import type {
  AssessmentAttempt,
  AssessmentAttemptChanges,
  NewAssessmentAttempt,
} from "@/domain/assessment/assessment-attempt";
import type { AttemptQuestionDraft } from "@/domain/assessment/attempt-question";
import type { Repository } from "@/domain/common/repository";

export type AssessmentAttemptRepository = Repository<
  AssessmentAttempt,
  NewAssessmentAttempt,
  AssessmentAttemptChanges
> & {
  hasPassedForLesson(userId: string, lessonId: string): Promise<boolean>;
  createWithQuestions(
    attempt: NewAssessmentAttempt,
    questions: AttemptQuestionDraft[],
  ): Promise<AssessmentAttempt>;
  findUnfinishedByLesson(userId: string, lessonId: string): Promise<AssessmentAttempt | null>;
};
