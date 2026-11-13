import type { PracticeTopic } from "@shared/schemas";
import type { AttemptStateDependencies } from "@/application/assessment/attempt-dependencies";
import { makeLoadAttemptState } from "@/application/assessment/attempt-state";
import { makeGenerateDraft } from "@/application/assessment/generate-draft";
import { makeGetPracticeRating } from "@/application/assessment/practice-rating";
import { practiceTopicKeys } from "@/application/assessment/practice-topics";
import { pickQuestions, type Random } from "@/application/assessment/select-questions";
import { getSignedInUserId } from "@/application/lesson/lesson-access";
import type { AssessmentAttempt } from "@/domain/assessment/assessment-attempt";
import type { Question } from "@/domain/assessment/question";
import type { AssessmentAttemptRepository } from "@/domain/assessment/repositories/assessment-attempt-repository";
import type { AttemptQuestionRepository } from "@/domain/assessment/repositories/attempt-question-repository";
import type { QuestionRepository } from "@/domain/assessment/repositories/question-repository";
import type { LessonRepository } from "@/domain/course-content/repositories/lesson-repository";
import { ConflictError, NotFoundError } from "@/domain/errors";
import { getLessonStatuses } from "@/domain/learning-path/lesson-status";
import type { LessonProgressRepository } from "@/domain/user/repositories/lesson-progress-repository";
import type { UserMasteryRepository } from "@/domain/user/repositories/user-mastery-repository";

export type PracticeDependencies = AttemptStateDependencies & {
  assessmentAttemptRepository: Pick<
    AssessmentAttemptRepository,
    "findById" | "create" | "update" | "findUnfinishedPractice"
  >;
  attemptQuestionRepository: Pick<AttemptQuestionRepository, "listByAttemptId" | "create">;
  questionRepository: Pick<QuestionRepository, "listByIds" | "listActiveByLessonIds">;
  lessonRepository: Pick<LessonRepository, "findById" | "listAll">;
  lessonProgressRepository: Pick<LessonProgressRepository, "listByUserId">;
  userMasteryRepository: Pick<UserMasteryRepository, "findById">;
  random?: Random;
};

export const makePracticePool = ({
  lessonRepository,
  lessonProgressRepository,
  questionRepository,
}: Pick<
  PracticeDependencies,
  "lessonRepository" | "lessonProgressRepository" | "questionRepository"
>) => {
  return async (userId: string, topic: PracticeTopic): Promise<Question[]> => {
    const [lessons, progress] = await Promise.all([
      lessonRepository.listAll(),
      lessonProgressRepository.listByUserId(userId),
    ]);
    const completedLessonIds = new Set(
      progress.filter((row) => row.status === "completed").map((row) => row.lessonId),
    );
    const openLessonIds = getLessonStatuses(lessons, completedLessonIds)
      .filter(({ status }) => status !== "locked")
      .map(({ lesson }) => lesson.id);
    const keys: readonly (string | null)[] = practiceTopicKeys[topic];
    const questions = await questionRepository.listActiveByLessonIds(openLessonIds);
    return questions.filter((question) => keys.includes(question.generatorKey));
  };
};

export const makeResolveOwnedPractice =
  ({ assessmentAttemptRepository }: Pick<PracticeDependencies, "assessmentAttemptRepository">) =>
  async (attemptId: string): Promise<AssessmentAttempt> => {
    const userId = getSignedInUserId();
    const attempt = await assessmentAttemptRepository.findById(attemptId);
    if (!attempt || attempt.userId !== userId || attempt.kind !== "practice") {
      throw new NotFoundError("Attempt not found", { attemptId });
    }
    return attempt;
  };

export const makeEnsurePracticeQuestion = (dependencies: PracticeDependencies) => {
  const {
    attemptQuestionRepository,
    logger,
    userMasteryRepository,
    random = Math.random,
  } = dependencies;
  const loadAttemptState = makeLoadAttemptState(dependencies);
  const generateFor = makeGenerateDraft({ userMasteryRepository, logger, random });
  const listPool = makePracticePool(dependencies);
  const getPracticeRating = makeGetPracticeRating(dependencies);

  return async (attempt: AssessmentAttempt) => {
    const state = await loadAttemptState(attempt);
    if (state.question) return state;

    const topic = attempt.practiceTopic;
    if (!topic) throw new NotFoundError("Attempt not found", { attemptId: attempt.id });
    const pool = await listPool(attempt.userId, topic);
    const [key] = pickQuestions(
      [...new Set(pool.map((candidate) => candidate.generatorKey))],
      random,
      1,
    );
    const withKey = pool.filter((candidate) => candidate.generatorKey === key);
    const [lessonId] = pickQuestions(
      [...new Set(withKey.map((candidate) => candidate.lessonId))],
      random,
      1,
    );
    const [question] = pickQuestions(
      withKey.filter((candidate) => candidate.lessonId === lessonId),
      random,
      1,
    );
    if (!question) throw new ConflictError("No questions for this topic yet", { topic });

    const { difficulty: sessionDifficulty } = await getPracticeRating(
      attempt.id,
      attempt.userId,
      question.lessonId,
    );
    const { seed, difficulty, generated } = await generateFor(
      attempt.userId,
      question,
      sessionDifficulty,
    );
    const served = await attemptQuestionRepository.listByAttemptId(attempt.id);
    try {
      await attemptQuestionRepository.create({
        assessmentAttemptId: attempt.id,
        questionId: question.id,
        position: served.length + 1,
        seed,
        difficulty,
        generatedQuestion: generated,
      });
    } catch (error) {
      if (!(error instanceof ConflictError)) throw error;
    }
    return loadAttemptState(attempt);
  };
};
