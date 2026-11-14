import type { DailyChallengeState, LearnerAnswer } from "@shared/schemas";
import { toAttemptQuestion } from "@/application/assessment/attempt-mapper";
import { getAnswerPoints } from "@/application/assessment/attempt-state";
import type { GetTodaysChallenge } from "@/application/assessment/commands/get-todays-challenge";
import { makeLoadQuestionView } from "@/application/assessment/question-view";
import type { Logger } from "@/application/logging/logger";
import type { AssessmentAttempt } from "@/domain/assessment/assessment-attempt";
import type { AttemptAnswer } from "@/domain/assessment/attempt-answer";
import { getAttemptScore, isPassed } from "@/domain/assessment/attempt-score";
import type { DailyChallenge } from "@/domain/assessment/daily-challenge";
import { toNextChallengeAt } from "@/domain/assessment/daily-challenge-rotation";
import type { AnswerOptionRepository } from "@/domain/assessment/repositories/answer-option-repository";
import type { AssessmentAttemptRepository } from "@/domain/assessment/repositories/assessment-attempt-repository";
import type { AttemptAnswerRepository } from "@/domain/assessment/repositories/attempt-answer-repository";
import type { AttemptQuestionRepository } from "@/domain/assessment/repositories/attempt-question-repository";
import type { HintRepository } from "@/domain/assessment/repositories/hint-repository";
import type { QuestionRepository } from "@/domain/assessment/repositories/question-repository";
import { toTimeTakenSeconds } from "@/domain/assessment/time-taken";
import type { Clock } from "@/domain/common/clock";
import { NotFoundError } from "@/domain/errors";
import type { UserMasteryRepository } from "@/domain/user/repositories/user-mastery-repository";

export type DailyChallengeDependencies = {
  clock: Clock;
  getTodaysChallenge: GetTodaysChallenge;
  assessmentAttemptRepository: Pick<
    AssessmentAttemptRepository,
    "findByUserAndDailyChallenge" | "createWithQuestions" | "update"
  >;
  attemptQuestionRepository: Pick<AttemptQuestionRepository, "listByAttemptId">;
  attemptAnswerRepository: Pick<AttemptAnswerRepository, "listByAttemptId" | "recordAnswer">;
  questionRepository: Pick<QuestionRepository, "findById">;
  answerOptionRepository: Pick<AnswerOptionRepository, "listByQuestionId">;
  hintRepository: Pick<HintRepository, "listByQuestionId">;
  userMasteryRepository: Pick<UserMasteryRepository, "findById">;
  logger: Logger;
};

export const makeLoadDailyChallengeQuestion = (dependencies: DailyChallengeDependencies) => {
  const { attemptQuestionRepository, questionRepository } = dependencies;
  const loadView = makeLoadQuestionView(dependencies);

  return async (attempt: AssessmentAttempt) => {
    const [attemptQuestion] = await attemptQuestionRepository.listByAttemptId(attempt.id);
    if (!attemptQuestion) throw new NotFoundError("Attempt not found", { attemptId: attempt.id });
    const question = await questionRepository.findById(attemptQuestion.questionId);
    if (!question) {
      throw new NotFoundError("Question not found", { questionId: attemptQuestion.questionId });
    }
    return { attemptQuestion, question, view: await loadView(attemptQuestion, question) };
  };
};

export const makeFinishDailyChallenge =
  ({ clock, assessmentAttemptRepository }: DailyChallengeDependencies) =>
  (attempt: AssessmentAttempt, answer: AttemptAnswer): Promise<AssessmentAttempt> => {
    const score = getAttemptScore(answer.isCorrect ? 1 : 0, 1);
    return assessmentAttemptRepository.update(attempt.id, {
      score,
      passed: isPassed(score),
      points: getAnswerPoints(answer),
      finishedAt: clock.now(),
    });
  };

export const makeLoadDailyChallengeState = (dependencies: DailyChallengeDependencies) => {
  const { attemptAnswerRepository } = dependencies;
  const loadQuestion = makeLoadDailyChallengeQuestion(dependencies);
  const finish = makeFinishDailyChallenge(dependencies);

  return async (
    challenge: DailyChallenge,
    attempt: AssessmentAttempt | null,
  ): Promise<DailyChallengeState> => {
    const base = {
      date: challenge.date.toISOString().slice(0, 10),
      nextChallengeAt: toNextChallengeAt(challenge.date).toISOString(),
    };
    if (!attempt) {
      return {
        ...base,
        status: "not_started",
        startedAt: null,
        finishedAt: null,
        question: null,
        result: null,
      };
    }

    const [{ attemptQuestion, view }, [answer]] = await Promise.all([
      loadQuestion(attempt),
      attemptAnswerRepository.listByAttemptId(attempt.id),
    ]);
    if (!answer) {
      return {
        ...base,
        status: "in_progress",
        startedAt: attempt.startedAt.toISOString(),
        finishedAt: null,
        question: {
          ...toAttemptQuestion(attemptQuestion, view),
          hints: [],
          hintsTotal: 0,
          hintsRemaining: 0,
        },
        result: null,
      };
    }

    const finished = attempt.finishedAt ? attempt : await finish(attempt, answer);
    const finishedAt = finished.finishedAt ?? new Date(finished.startedAt);
    return {
      ...base,
      status: "finished",
      startedAt: finished.startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      question: null,
      result: {
        prompt: view.prompt,
        tree: view.tree,
        response: answer.response as LearnerAnswer,
        isCorrect: answer.isCorrect,
        correctAnswer: view.accepted[0] as LearnerAnswer,
        explanation: view.explanation,
        replay: view.replay,
        points: finished.points,
        timeTakenSeconds: toTimeTakenSeconds(finished.startedAt, finishedAt),
      },
    };
  };
};
