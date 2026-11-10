import { makeRequestHint } from "@/application/assessment/commands/request-hint";
import { makeStartAttempt } from "@/application/assessment/commands/start-attempt";
import { makeSubmitAnswer } from "@/application/assessment/commands/submit-answer";
import { makeGetAttempt } from "@/application/assessment/queries/get-attempt";
import { makeGetAlgorithmSnippet } from "@/application/course-content/queries/get-algorithm-snippet";
import { makeListAlgorithms } from "@/application/course-content/queries/list-algorithms";
import { makeListCodeLanguages } from "@/application/course-content/queries/list-code-languages";
import { makeListLearningStyles } from "@/application/course-content/queries/list-learning-styles";
import { makeCompleteLesson } from "@/application/learning-path/commands/complete-lesson";
import { makeCanTakeTest } from "@/application/learning-path/queries/can-take-test";
import { makeGetLearningPath } from "@/application/learning-path/queries/get-learning-path";
import { makeSaveLessonNote } from "@/application/lesson/commands/save-lesson-note";
import { makeStartLesson } from "@/application/lesson/commands/start-lesson";
import { makeGetLesson } from "@/application/lesson/queries/get-lesson";
import { makeGetLessonNote } from "@/application/lesson/queries/get-lesson-note";
import { makeUpdateProfile } from "@/application/user/commands/update-profile";
import { makeGetMe } from "@/application/user/queries/get-me";
import {
  PrismaAnswerOptionRepository,
  PrismaAssessmentAttemptRepository,
  PrismaAttemptAnswerRepository,
  PrismaAttemptQuestionRepository,
  PrismaHintRepository,
  PrismaQuestionRepository,
} from "@/infrastructure/assessment/repositories";
import { authHandler, getSession } from "@/infrastructure/auth/auth";
import { environment } from "@/infrastructure/config/environment";
import {
  PrismaAlgorithmRepository,
  PrismaCodeLanguageRepository,
  PrismaCodeLineRepository,
  PrismaCodeSnippetRepository,
  PrismaContentBlockRepository,
  PrismaLearningStyleRepository,
  PrismaLessonRepository,
  PrismaUnitRepository,
} from "@/infrastructure/course-content/repositories";
import { prismaClient } from "@/infrastructure/database/prisma-client";
import { registerGracefulShutdown } from "@/infrastructure/lifecycle/register-graceful-shutdown";
import { registerProcessErrorHandlers } from "@/infrastructure/lifecycle/register-process-error-handlers";
import { createPinoLogger } from "@/infrastructure/logging/pino-logger";
import {
  PrismaLessonNoteRepository,
  PrismaLessonProgressRepository,
  PrismaUserMasteryRepository,
  PrismaUserProfileRepository,
  PrismaUserRepository,
} from "@/infrastructure/user/repositories";
import { createAlgorithmController } from "@/presentation/controllers/algorithm-controller";
import { createAttemptController } from "@/presentation/controllers/attempt-controller";
import { createCourseContentController } from "@/presentation/controllers/course-content-controller";
import { createLearningPathController } from "@/presentation/controllers/learning-path-controller";
import { createLessonController } from "@/presentation/controllers/lesson-controller";
import { createUserController } from "@/presentation/controllers/user-controller";
import { createApplication } from "@/presentation/http/create-application";

const logger = createPinoLogger(environment.LOG_LEVEL);
registerProcessErrorHandlers(logger);

const algorithmRepository = new PrismaAlgorithmRepository(prismaClient);
const codeLanguageRepository = new PrismaCodeLanguageRepository(prismaClient);
const learningStyleRepository = new PrismaLearningStyleRepository(prismaClient);
const userProfileRepository = new PrismaUserProfileRepository(prismaClient);
const unitRepository = new PrismaUnitRepository(prismaClient);

const algorithmController = createAlgorithmController({
  listAlgorithms: makeListAlgorithms({ algorithmRepository }),
  getAlgorithmSnippet: makeGetAlgorithmSnippet({
    algorithmRepository,
    codeLanguageRepository,
    codeSnippetRepository: new PrismaCodeSnippetRepository(prismaClient),
    codeLineRepository: new PrismaCodeLineRepository(prismaClient),
    userProfileRepository,
  }),
});

const lessonAccess = {
  lessonRepository: new PrismaLessonRepository(prismaClient),
  lessonProgressRepository: new PrismaLessonProgressRepository(prismaClient),
};
const lessonNoteRepository = new PrismaLessonNoteRepository(prismaClient);

const lessonController = createLessonController({
  getLesson: makeGetLesson({
    ...lessonAccess,
    unitRepository,
    contentBlockRepository: new PrismaContentBlockRepository(prismaClient),
    userProfileRepository,
    logger,
  }),
  getLessonNote: makeGetLessonNote({ ...lessonAccess, lessonNoteRepository }),
  saveLessonNote: makeSaveLessonNote({ ...lessonAccess, lessonNoteRepository }),
  startLesson: makeStartLesson(lessonAccess),
});

const userRepository = new PrismaUserRepository(prismaClient);
const completeLesson = makeCompleteLesson(lessonAccess);
const attemptDependencies = {
  assessmentAttemptRepository: new PrismaAssessmentAttemptRepository(prismaClient),
  attemptQuestionRepository: new PrismaAttemptQuestionRepository(prismaClient),
  attemptAnswerRepository: new PrismaAttemptAnswerRepository(prismaClient),
  questionRepository: new PrismaQuestionRepository(prismaClient),
  answerOptionRepository: new PrismaAnswerOptionRepository(prismaClient),
  hintRepository: new PrismaHintRepository(prismaClient),
  userMasteryRepository: new PrismaUserMasteryRepository(prismaClient),
  lessonRepository: lessonAccess.lessonRepository,
  completeLesson,
  logger,
};

const attemptController = createAttemptController({
  startAttempt: makeStartAttempt({
    ...attemptDependencies,
    canTakeTest: makeCanTakeTest(lessonAccess),
  }),
  getAttempt: makeGetAttempt(attemptDependencies),
  requestHint: makeRequestHint(attemptDependencies),
  submitAnswer: makeSubmitAnswer(attemptDependencies),
});

const userController = createUserController({
  getMe: makeGetMe({ userRepository, userProfileRepository }),
  updateProfile: makeUpdateProfile({
    userRepository,
    userProfileRepository,
    learningStyleRepository,
    codeLanguageRepository,
  }),
});

const courseContentController = createCourseContentController({
  listLearningStyles: makeListLearningStyles({ learningStyleRepository }),
  listCodeLanguages: makeListCodeLanguages({ codeLanguageRepository }),
});

const learningPathController = createLearningPathController({
  getLearningPath: makeGetLearningPath({ ...lessonAccess, unitRepository }),
});

const application = createApplication({
  logger,
  authHandler,
  getSession,
  algorithmController,
  lessonController,
  attemptController,
  userController,
  courseContentController,
  learningPathController,
});

const server = Bun.serve({ port: environment.PORT, fetch: application.fetch });
logger.info(`Server listening on http://localhost:${environment.PORT}`);

registerGracefulShutdown({
  server,
  logger,
  cleanups: [() => prismaClient.$disconnect()],
});
