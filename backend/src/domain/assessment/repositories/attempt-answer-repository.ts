import type {
  AttemptAnswer,
  AttemptAnswerChanges,
  NewAttemptAnswer,
} from "@/domain/assessment/attempt-answer";
import type { Repository } from "@/domain/common/repository";

export type RecordAnswerInput = {
  answer: NewAttemptAnswer;
  mastery: {
    userId: string;
    lessonId: string;
    rating: number;
    mastery: number;
    currentDifficulty: number;
  };
};

export type AttemptAnswerRepository = Repository<
  AttemptAnswer,
  NewAttemptAnswer,
  AttemptAnswerChanges
> & {
  listByAttemptId(assessmentAttemptId: string): Promise<AttemptAnswer[]>;
  countByUserAndLesson(userId: string, lessonId: string): Promise<number>;
  recordAnswer(input: RecordAnswerInput): Promise<AttemptAnswer>;
};
