import type { DailyChallengeStateResponse, SubmitAnswerRequest } from "@shared/schemas";
import {
  type DailyChallengeDependencies,
  makeFinishDailyChallenge,
  makeLoadDailyChallengeQuestion,
  makeLoadDailyChallengeState,
} from "@/application/assessment/daily-challenge-state";
import { gradeAnswer } from "@/application/assessment/grade-answer";
import { getSignedInUserId } from "@/application/lesson/lesson-access";
import { startingRating } from "@/domain/assessment/elo-rating";
import { BadRequestError, ConflictError, NotFoundError } from "@/domain/errors";

export const makeSubmitDailyChallengeAnswer = (dependencies: DailyChallengeDependencies) => {
  const {
    getTodaysChallenge,
    assessmentAttemptRepository,
    attemptAnswerRepository,
    userMasteryRepository,
  } = dependencies;
  const loadQuestion = makeLoadDailyChallengeQuestion(dependencies);
  const finish = makeFinishDailyChallenge(dependencies);
  const loadState = makeLoadDailyChallengeState(dependencies);

  return async ({
    questionId,
    answer,
  }: SubmitAnswerRequest): Promise<DailyChallengeStateResponse> => {
    const userId = getSignedInUserId();
    const challenge = await getTodaysChallenge();
    const attempt = await assessmentAttemptRepository.findByUserAndDailyChallenge(
      userId,
      challenge.id,
    );
    if (!attempt) throw new ConflictError("Start today's challenge first");
    if (attempt.finishedAt) throw new ConflictError("Today's challenge is already answered");

    const [{ attemptQuestion, question, view }, answers] = await Promise.all([
      loadQuestion(attempt),
      attemptAnswerRepository.listByAttemptId(attempt.id),
    ]);
    if (attemptQuestion.id !== questionId) {
      throw new NotFoundError("Question not found", { questionId });
    }
    if (answers.length > 0) throw new ConflictError("Today's challenge is already answered");
    if (answer.type !== view.type) {
      throw new BadRequestError("Answer type does not match the question", {
        expected: view.type,
      });
    }

    const mastery = await userMasteryRepository.findById({ userId, lessonId: question.lessonId });
    const rating = mastery?.rating ?? startingRating;
    const saved = await attemptAnswerRepository.recordAnswer({
      answer: {
        assessmentAttemptId: attempt.id,
        questionId: question.id,
        attemptQuestionId: attemptQuestion.id,
        seed: attemptQuestion.seed,
        generatedQuestion: attemptQuestion.generatedQuestion,
        response: answer,
        isCorrect: gradeAnswer(answer, view.accepted),
        difficulty: attemptQuestion.difficulty,
        ratingBefore: rating,
        ratingAfter: rating,
      },
      mastery: null,
    });

    return { data: await loadState(challenge, await finish(attempt, saved)) };
  };
};

export type SubmitDailyChallengeAnswer = ReturnType<typeof makeSubmitDailyChallengeAnswer>;
