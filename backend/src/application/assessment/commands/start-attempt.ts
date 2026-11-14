import type { AttemptStateResponse, IdParam } from "@shared/schemas";
import type { AttemptStateDependencies } from "@/application/assessment/attempt-dependencies";
import { makeLoadAttemptState } from "@/application/assessment/attempt-state";
import { makeGenerateDraft } from "@/application/assessment/generate-draft";
import { pickQuestions, type Random } from "@/application/assessment/select-questions";
import type { CanTakeTest } from "@/application/learning-path/queries/can-take-test";
import { getSignedInUserId } from "@/application/lesson/lesson-access";
import type { AssessmentAttempt } from "@/domain/assessment/assessment-attempt";
import type { AssessmentAttemptRepository } from "@/domain/assessment/repositories/assessment-attempt-repository";
import type { QuestionRepository } from "@/domain/assessment/repositories/question-repository";
import { getTestPoolLessonIds } from "@/domain/assessment/test-pool";
import type { LessonRepository } from "@/domain/course-content/repositories/lesson-repository";
import { ConflictError, NotFoundError } from "@/domain/errors";
import type { UserMasteryRepository } from "@/domain/user/repositories/user-mastery-repository";

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

  const generateFor = makeGenerateDraft({ userMasteryRepository, logger, random });

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
