import { makeFinishPractice } from "@/application/assessment/commands/finish-practice";
import { makeGetDailyChallenge } from "@/application/assessment/commands/get-daily-challenge";
import { makeGetTodaysChallenge } from "@/application/assessment/commands/get-todays-challenge";
import { makeNextPracticeQuestion } from "@/application/assessment/commands/next-practice-question";
import { makeRequestHint } from "@/application/assessment/commands/request-hint";
import { makeStartAttempt } from "@/application/assessment/commands/start-attempt";
import { makeStartDailyChallenge } from "@/application/assessment/commands/start-daily-challenge";
import { makeStartPractice } from "@/application/assessment/commands/start-practice";
import { makeSubmitAnswer } from "@/application/assessment/commands/submit-answer";
import { makeSubmitDailyChallengeAnswer } from "@/application/assessment/commands/submit-daily-challenge-answer";
import { makeGetAttempt } from "@/application/assessment/queries/get-attempt";
import { makeGetPracticeTopics } from "@/application/assessment/queries/get-practice-topics";
import { makeGetAlgorithmSnippet } from "@/application/course-content/queries/get-algorithm-snippet";
import { makeListAlgorithms } from "@/application/course-content/queries/list-algorithms";
import { makeListCodeLanguages } from "@/application/course-content/queries/list-code-languages";
import { makeListLearningStyles } from "@/application/course-content/queries/list-learning-styles";
import { makeGetLeaderboard } from "@/application/leaderboard/queries/get-leaderboard";
import { makeCompleteLesson } from "@/application/learning-path/commands/complete-lesson";
import { makeCanTakeTest } from "@/application/learning-path/queries/can-take-test";
import { makeGetLearningPath } from "@/application/learning-path/queries/get-learning-path";
import { makeSaveLessonNote } from "@/application/lesson/commands/save-lesson-note";
import { makeStartLesson } from "@/application/lesson/commands/start-lesson";
import { makeGetLesson } from "@/application/lesson/queries/get-lesson";
import { makeGetLessonNote } from "@/application/lesson/queries/get-lesson-note";
import { makeGetQuiz } from "@/application/onboarding/queries/get-quiz";
import { makeScoreQuiz } from "@/application/onboarding/queries/score-quiz";
import { makeCompleteOnboarding } from "@/application/user/commands/complete-onboarding";
import { makeUpdateProfile } from "@/application/user/commands/update-profile";
import { makeGetMe } from "@/application/user/queries/get-me";
import {
  PrismaAnswerOptionRepository,
  PrismaAssessmentAttemptRepository,
  PrismaAttemptAnswerRepository,
  PrismaAttemptQuestionRepository,
  PrismaDailyChallengeRepository,
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
import { PrismaLeaderboardRepository } from "@/infrastructure/leaderboard/repositories";
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
import { createDailyChallengeController } from "@/presentation/controllers/daily-challenge-controller";
import { createLeaderboardController } from "@/presentation/controllers/leaderboard-controller";
import { createLearningPathController } from "@/presentation/controllers/learning-path-controller";
import { createLessonController } from "@/presentation/controllers/lesson-controller";
import { createOnboardingController } from "@/presentation/controllers/onboarding-controller";
import { createPracticeController } from "@/presentation/controllers/practice-controller";
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
const userMasteryRepository = new PrismaUserMasteryRepository(prismaClient);
const completeLesson = makeCompleteLesson(lessonAccess);
const attemptDependencies = {
  assessmentAttemptRepository: new PrismaAssessmentAttemptRepository(prismaClient),
  attemptQuestionRepository: new PrismaAttemptQuestionRepository(prismaClient),
  attemptAnswerRepository: new PrismaAttemptAnswerRepository(prismaClient),
  questionRepository: new PrismaQuestionRepository(prismaClient),
  answerOptionRepository: new PrismaAnswerOptionRepository(prismaClient),
  hintRepository: new PrismaHintRepository(prismaClient),
  userMasteryRepository,
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

const practiceDependencies = { ...attemptDependencies, ...lessonAccess };
const practiceController = createPracticeController({
  getPracticeTopics: makeGetPracticeTopics(practiceDependencies),
  startPractice: makeStartPractice(practiceDependencies),
  nextPracticeQuestion: makeNextPracticeQuestion(practiceDependencies),
  finishPractice: makeFinishPractice(practiceDependencies),
});

const clock = { now: () => new Date() };
const dailyChallengeDependencies = {
  ...attemptDependencies,
  clock,
  getTodaysChallenge: makeGetTodaysChallenge({
    clock,
    dailyChallengeRepository: new PrismaDailyChallengeRepository(prismaClient),
    questionRepository: attemptDependencies.questionRepository,
  }),
};
const dailyChallengeController = createDailyChallengeController({
  getDailyChallenge: makeGetDailyChallenge(dailyChallengeDependencies),
  startDailyChallenge: makeStartDailyChallenge(dailyChallengeDependencies),
  submitDailyChallengeAnswer: makeSubmitDailyChallengeAnswer(dailyChallengeDependencies),
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

const onboardingController = createOnboardingController({
  getQuiz: makeGetQuiz(),
  scoreQuiz: makeScoreQuiz({ learningStyleRepository }),
  completeOnboarding: makeCompleteOnboarding({ userRepository, userProfileRepository }),
});

const learningPathController = createLearningPathController({
  getLearningPath: makeGetLearningPath({ ...lessonAccess, unitRepository, userMasteryRepository }),
});

const leaderboardController = createLeaderboardController({
  getLeaderboard: makeGetLeaderboard({
    leaderboardRepository: new PrismaLeaderboardRepository(prismaClient),
    clock,
  }),
});

const application = createApplication({
  logger,
  authHandler,
  getSession,
  algorithmController,
  lessonController,
  attemptController,
  practiceController,
  dailyChallengeController,
  userController,
  courseContentController,
  learningPathController,
  leaderboardController,
  onboardingController,
});

const server = Bun.serve({ port: environment.PORT, fetch: application.fetch });
logger.info(`Server listening on http://localhost:${environment.PORT}`);

registerGracefulShutdown({
  server,
  logger,
  cleanups: [() => prismaClient.$disconnect()],
});
