import { getSignedInUserId } from "@/application/lesson/lesson-access";
import type { AssessmentAttempt } from "@/domain/assessment/assessment-attempt";
import type { AttemptAnswer } from "@/domain/assessment/attempt-answer";
import type { AttemptQuestion } from "@/domain/assessment/attempt-question";
import type { AssessmentAttemptRepository } from "@/domain/assessment/repositories/assessment-attempt-repository";
import type { AttemptAnswerRepository } from "@/domain/assessment/repositories/attempt-answer-repository";
import type { AttemptQuestionRepository } from "@/domain/assessment/repositories/attempt-question-repository";
import { ConflictError, NotFoundError } from "@/domain/errors";

type AttemptAccessDependencies = {
  assessmentAttemptRepository: Pick<AssessmentAttemptRepository, "findById">;
  attemptQuestionRepository: Pick<AttemptQuestionRepository, "listByAttemptId">;
  attemptAnswerRepository: Pick<AttemptAnswerRepository, "listByAttemptId">;
};

export const makeResolveOwnedAttempt =
  ({
    assessmentAttemptRepository,
  }: Pick<AttemptAccessDependencies, "assessmentAttemptRepository">) =>
  async (attemptId: string): Promise<AssessmentAttempt> => {
    const userId = getSignedInUserId();
    const attempt = await assessmentAttemptRepository.findById(attemptId);
    if (!attempt || attempt.userId !== userId || attempt.kind === "daily_challenge") {
      throw new NotFoundError("Attempt not found", { attemptId });
    }
    return attempt;
  };

export type CurrentQuestion = {
  attempt: AssessmentAttempt;
  attemptQuestion: AttemptQuestion;
  answers: AttemptAnswer[];
};

export const makeResolveCurrentQuestion = (dependencies: AttemptAccessDependencies) => {
  const resolveOwnedAttempt = makeResolveOwnedAttempt(dependencies);
  const { attemptQuestionRepository, attemptAnswerRepository } = dependencies;

  return async (attemptId: string, questionId: string): Promise<CurrentQuestion> => {
    const attempt = await resolveOwnedAttempt(attemptId);
    if (attempt.finishedAt) throw new ConflictError("Attempt is already finished", { attemptId });

    const [attemptQuestions, answers] = await Promise.all([
      attemptQuestionRepository.listByAttemptId(attemptId),
      attemptAnswerRepository.listByAttemptId(attemptId),
    ]);
    const attemptQuestion = attemptQuestions.find((candidate) => candidate.id === questionId);
    if (!attemptQuestion) throw new NotFoundError("Question not found", { questionId });

    const answeredIds = new Set(answers.map((answer) => answer.attemptQuestionId));
    if (answeredIds.has(attemptQuestion.id)) {
      throw new ConflictError("Question is already answered", { questionId });
    }
    const current = attemptQuestions.find((candidate) => !answeredIds.has(candidate.id));
    if (current?.id !== attemptQuestion.id) {
      throw new ConflictError("This is not the current question", { questionId });
    }
    return { attempt, attemptQuestion, answers };
  };
};

export type ResolveCurrentQuestion = ReturnType<typeof makeResolveCurrentQuestion>;
