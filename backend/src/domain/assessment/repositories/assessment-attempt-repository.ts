import type {
  AssessmentAttempt,
  AssessmentAttemptChanges,
  NewAssessmentAttempt,
} from "@/domain/assessment/assessment-attempt";
import type { Repository } from "@/domain/common/repository";

export type AssessmentAttemptRepository = Repository<
  AssessmentAttempt,
  NewAssessmentAttempt,
  AssessmentAttemptChanges
>;
