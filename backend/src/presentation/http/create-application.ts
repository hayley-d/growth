import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { HTTPException } from "hono/http-exception";
import { secureHeaders } from "hono/secure-headers";

import type { AuthHandler, GetSession } from "@/application/auth/session";
import type { Logger } from "@/application/logging/logger";
import type { AlgorithmController } from "@/presentation/controllers/algorithm-controller";
import type { AttemptController } from "@/presentation/controllers/attempt-controller";
import type { CourseContentController } from "@/presentation/controllers/course-content-controller";
import type { LearningPathController } from "@/presentation/controllers/learning-path-controller";
import type { LessonController } from "@/presentation/controllers/lesson-controller";
import type { OnboardingController } from "@/presentation/controllers/onboarding-controller";
import type { PracticeController } from "@/presentation/controllers/practice-controller";
import type { UserController } from "@/presentation/controllers/user-controller";
import { createAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { createErrorHandler } from "@/presentation/middleware/error-handler";
import { notFoundHandler } from "@/presentation/middleware/not-found-handler";
import { requestContextMiddleware } from "@/presentation/middleware/request-context-middleware";
import { createRequestLogger } from "@/presentation/middleware/request-logger";
import { createAlgorithmRoutes } from "@/presentation/routes/algorithm-routes";
import { createAttemptRoutes } from "@/presentation/routes/attempt-routes";
import { createAuthRoutes } from "@/presentation/routes/auth-routes";
import { createCourseContentRoutes } from "@/presentation/routes/course-content-routes";
import { healthRoutes } from "@/presentation/routes/health-routes";
import { createLearningPathRoutes } from "@/presentation/routes/learning-path-routes";
import { createLessonRoutes } from "@/presentation/routes/lesson-routes";
import { createOnboardingRoutes } from "@/presentation/routes/onboarding-routes";
import { createPracticeRoutes } from "@/presentation/routes/practice-routes";
import { createUserRoutes } from "@/presentation/routes/user-routes";

type ApplicationDependencies = {
  logger: Logger;
  authHandler: AuthHandler;
  getSession: GetSession;
  algorithmController: AlgorithmController;
  lessonController: LessonController;
  attemptController: AttemptController;
  practiceController: PracticeController;
  userController: UserController;
  courseContentController: CourseContentController;
  learningPathController: LearningPathController;
  onboardingController: OnboardingController;
};

export const createApplication = ({
  logger,
  authHandler,
  getSession,
  algorithmController,
  lessonController,
  attemptController,
  practiceController,
  userController,
  courseContentController,
  learningPathController,
  onboardingController,
}: ApplicationDependencies) => {
  const application = new Hono();
  application.use(secureHeaders());
  application.use(requestContextMiddleware);
  application.use(createAuthMiddleware(getSession));
  application.use(createRequestLogger(logger));
  application.use(
    bodyLimit({
      maxSize: 100 * 1024,
      onError: () => {
        throw new HTTPException(413, { message: "Request body too large" });
      },
    }),
  );
  application.route("/api/auth", createAuthRoutes(authHandler));
  application.route("/api/health", healthRoutes);
  application.route("/api/algorithms", createAlgorithmRoutes(algorithmController));
  application.route("/api/lessons", createLessonRoutes(lessonController));
  application.route("/api", createAttemptRoutes(attemptController));
  application.route("/api", createPracticeRoutes(practiceController));
  application.route("/api/learning-path", createLearningPathRoutes(learningPathController));
  application.route("/api/me", createUserRoutes(userController));
  application.route("/api/onboarding", createOnboardingRoutes(onboardingController));
  application.route("/api", createCourseContentRoutes(courseContentController));
  application.notFound(notFoundHandler);
  application.onError(createErrorHandler(logger));
  return application;
};
