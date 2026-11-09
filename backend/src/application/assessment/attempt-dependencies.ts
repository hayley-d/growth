import type { CompleteLesson } from "@/application/learning-path/commands/complete-lesson";
import type { Logger } from "@/application/logging/logger";
import type { AnswerOptionRepository } from "@/domain/assessment/repositories/answer-option-repository";
import type { AssessmentAttemptRepository } from "@/domain/assessment/repositories/assessment-attempt-repository";
import type { AttemptAnswerRepository } from "@/domain/assessment/repositories/attempt-answer-repository";
import type { AttemptQuestionRepository } from "@/domain/assessment/repositories/attempt-question-repository";
import type { HintRepository } from "@/domain/assessment/repositories/hint-repository";
import type { QuestionRepository } from "@/domain/assessment/repositories/question-repository";
import type { LessonRepository } from "@/domain/course-content/repositories/lesson-repository";

export type AttemptStateDependencies = {
  assessmentAttemptRepository: Pick<AssessmentAttemptRepository, "update">;
  attemptQuestionRepository: Pick<AttemptQuestionRepository, "listByAttemptId">;
  attemptAnswerRepository: Pick<AttemptAnswerRepository, "listByAttemptId">;
  questionRepository: Pick<QuestionRepository, "listByIds">;
  answerOptionRepository: Pick<AnswerOptionRepository, "listByQuestionId">;
  hintRepository: Pick<HintRepository, "listByQuestionId">;
  lessonRepository: Pick<LessonRepository, "findById">;
  completeLesson: CompleteLesson;
  logger: Logger;
};
