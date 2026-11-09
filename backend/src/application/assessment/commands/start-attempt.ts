import { generate } from "@shared/engine";
import {
  type AttemptStateResponse,
  type GeneratedQuestion,
  generatorKeySchema,
  generatorOptionsSchema,
  type IdParam,
} from "@shared/schemas";
import type { AttemptStateDependencies } from "@/application/assessment/attempt-dependencies";
import { makeLoadAttemptState } from "@/application/assessment/attempt-state";
import { pickQuestions, pickSeed, type Random } from "@/application/assessment/select-questions";
import type { CanTakeTest } from "@/application/learning-path/queries/can-take-test";
import { getSignedInUserId } from "@/application/lesson/lesson-access";
import type { AssessmentAttempt } from "@/domain/assessment/assessment-attempt";
import type { Question } from "@/domain/assessment/question";
import type { AssessmentAttemptRepository } from "@/domain/assessment/repositories/assessment-attempt-repository";
import type { QuestionRepository } from "@/domain/assessment/repositories/question-repository";
import { getTestPoolLessonIds } from "@/domain/assessment/test-pool";
import type { LessonRepository } from "@/domain/course-content/repositories/lesson-repository";
import { ConflictError, InvalidContentError, NotFoundError } from "@/domain/errors";
import type { UserMasteryRepository } from "@/domain/user/repositories/user-mastery-repository";

const startingDifficulty = 1;

type StartAttemptDependencies = AttemptStateDependencies & {
  assessmentAttemptRepository: Pick<
    AssessmentAttemptRepository,
    "createWithQuestions" | "update" | "findUnfinishedByLesson"
  >;
  questionRepository: Pick<QuestionRepository, "listByIds" | "listActiveByLessonIds">;
  lessonRepository: Pick<LessonRepository, "findById" | "listAll">;
  userMasteryRepository: Pick<UserMasteryRepository, "findById">;
  canTakeTest: CanTakeTest;
  random?: Random;
};

export type StartAttemptResult = {
  created: boolean;
  response: AttemptStateResponse;
};

export const makeStartAttempt = (dependencies: StartAttemptDependencies) => {
  const {
    assessmentAttemptRepository,
    questionRepository,
    lessonRepository,
    userMasteryRepository,
    canTakeTest,
    logger,
    random = Math.random,
  } = dependencies;
  const loadAttemptState = makeLoadAttemptState(dependencies);

  const generateFor = async (
    userId: string,
    question: Question,
  ): Promise<{ seed: number; difficulty: number; generated: GeneratedQuestion }> => {
    const key = generatorKeySchema.safeParse(question.generatorKey);
    const options = generatorOptionsSchema.safeParse(question.generatorOptions ?? {});
    if (!key.success || !options.success) {
      logger.error("Stored generator settings are invalid", { questionId: question.id });
      throw new InvalidContentError("Question content is invalid", { questionId: question.id });
    }
    const mastery = await userMasteryRepository.findById({ userId, lessonId: question.lessonId });
    const difficulty = mastery?.currentDifficulty ?? startingDifficulty;
    const seed = pickSeed(random);
    const generated = generate(key.data, {
      ...options.data,
      seed,
      difficulty: difficulty as 1 | 2 | 3 | 4 | 5,
    });
    return { seed, difficulty, generated };
  };

  return async ({ id: lessonId }: IdParam): Promise<StartAttemptResult> => {
    const userId = getSignedInUserId();
    const lesson = await lessonRepository.findById(lessonId);
    if (!lesson || !(await canTakeTest(userId, lessonId))) {
      throw new NotFoundError("Lesson not found", { lessonId });
    }

    const existing = await assessmentAttemptRepository.findUnfinishedByLesson(userId, lessonId);
    if (existing) {
      return { created: false, response: { data: await loadAttemptState(existing) } };
    }

    const lessons = await lessonRepository.listAll();
    const pool = await questionRepository.listActiveByLessonIds(
      getTestPoolLessonIds(lessons, lesson),
    );
    if (pool.length === 0) {
      throw new ConflictError("This lesson has no questions yet", { lessonId });
    }

    const drafts = await Promise.all(
      pickQuestions(pool, random).map(async (question, index) => {
        const base = { questionId: question.id, position: index + 1 };
        if (question.generatorKey === null) return { ...base, difficulty: question.difficulty };
        const { seed, difficulty, generated } = await generateFor(userId, question);
        return { ...base, seed, difficulty, generatedQuestion: generated };
      }),
    );

    let attempt: AssessmentAttempt;
    try {
      attempt = await assessmentAttemptRepository.createWithQuestions(
        { userId, lessonId, kind: lesson.kind === "lesson" ? "lesson_test" : "checkpoint" },
        drafts,
      );
    } catch (error) {
      const parallel =
        error instanceof ConflictError
          ? await assessmentAttemptRepository.findUnfinishedByLesson(userId, lessonId)
          : null;
      if (!parallel) throw error;
      return { created: false, response: { data: await loadAttemptState(parallel) } };
    }

    return { created: true, response: { data: await loadAttemptState(attempt) } };
  };
};

export type StartAttempt = ReturnType<typeof makeStartAttempt>;
