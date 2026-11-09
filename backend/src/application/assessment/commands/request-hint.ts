import type { IdParam, RequestHintRequest, RequestHintResponse } from "@shared/schemas";
import { makeResolveCurrentQuestion } from "@/application/assessment/attempt-access";
import type { AttemptStateDependencies } from "@/application/assessment/attempt-dependencies";
import { makeLoadQuestionView } from "@/application/assessment/question-view";
import type { AssessmentAttemptRepository } from "@/domain/assessment/repositories/assessment-attempt-repository";
import type { AttemptAnswerRepository } from "@/domain/assessment/repositories/attempt-answer-repository";
import type { AttemptQuestionRepository } from "@/domain/assessment/repositories/attempt-question-repository";
import type { QuestionRepository } from "@/domain/assessment/repositories/question-repository";
import { ConflictError, NotFoundError } from "@/domain/errors";

type RequestHintDependencies = Pick<
  AttemptStateDependencies,
  "answerOptionRepository" | "hintRepository" | "logger"
> & {
  assessmentAttemptRepository: Pick<AssessmentAttemptRepository, "findById">;
  attemptQuestionRepository: Pick<AttemptQuestionRepository, "listByAttemptId" | "takeHint">;
  attemptAnswerRepository: Pick<AttemptAnswerRepository, "listByAttemptId">;
  questionRepository: Pick<QuestionRepository, "listByIds">;
};

export const makeRequestHint = (dependencies: RequestHintDependencies) => {
  const resolveCurrentQuestion = makeResolveCurrentQuestion(dependencies);
  const loadView = makeLoadQuestionView(dependencies);
  const { attemptQuestionRepository, questionRepository } = dependencies;

  return async ({ id, questionId }: IdParam & RequestHintRequest): Promise<RequestHintResponse> => {
    const { attemptQuestion } = await resolveCurrentQuestion(id, questionId);
    const [question] = await questionRepository.listByIds([attemptQuestion.questionId]);
    if (!question) throw new NotFoundError("Question not found", { questionId });

    const { hints } = await loadView(attemptQuestion, question);
    const hint = hints[attemptQuestion.hintsUsed];
    if (hint === undefined) throw new ConflictError("No hints left", { questionId });

    const taken = await attemptQuestionRepository.takeHint(
      attemptQuestion.id,
      attemptQuestion.hintsUsed,
    );
    if (!taken) throw new ConflictError("Hint was already taken, try again", { questionId });

    return {
      data: {
        questionId: attemptQuestion.id,
        hint,
        hintNumber: attemptQuestion.hintsUsed + 1,
        hintsRemaining: hints.length - attemptQuestion.hintsUsed - 1,
      },
    };
  };
};

export type RequestHint = ReturnType<typeof makeRequestHint>;
