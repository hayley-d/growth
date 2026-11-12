import { readFile } from "node:fs/promises";
import { describe, expect, it, vi } from "vitest";

import { openApiDocument } from "@shared/openapi";
import { createAlgorithmController } from "@/presentation/controllers/algorithm-controller";
import { createAttemptController } from "@/presentation/controllers/attempt-controller";
import { createCourseContentController } from "@/presentation/controllers/course-content-controller";
import { createLearningPathController } from "@/presentation/controllers/learning-path-controller";
import { createLessonController } from "@/presentation/controllers/lesson-controller";
import { createOnboardingController } from "@/presentation/controllers/onboarding-controller";
import { createPracticeController } from "@/presentation/controllers/practice-controller";
import { createUserController } from "@/presentation/controllers/user-controller";
import { createApplication } from "@/presentation/http/create-application";

const application = createApplication({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  authHandler: async () => new Response(null, { status: 404 }),
  getSession: async () => null,
  algorithmController: createAlgorithmController({
    listAlgorithms: vi.fn(),
    getAlgorithmSnippet: vi.fn(),
  }),
  lessonController: createLessonController({
    getLesson: vi.fn(),
    getLessonNote: vi.fn(),
    saveLessonNote: vi.fn(),
    startLesson: vi.fn(),
  }),
  attemptController: createAttemptController({
    startAttempt: vi.fn(),
    getAttempt: vi.fn(),
    requestHint: vi.fn(),
    submitAnswer: vi.fn(),
  }),
  practiceController: createPracticeController({
    getPracticeTopics: vi.fn(),
    startPractice: vi.fn(),
    nextPracticeQuestion: vi.fn(),
    finishPractice: vi.fn(),
  }),
  userController: createUserController({ getMe: vi.fn(), updateProfile: vi.fn() }),
  courseContentController: createCourseContentController({
    listLearningStyles: vi.fn(),
    listCodeLanguages: vi.fn(),
  }),
  learningPathController: createLearningPathController({ getLearningPath: vi.fn() }),
  onboardingController: createOnboardingController({
    getQuiz: vi.fn(),
    scoreQuiz: vi.fn(),
    completeOnboarding: vi.fn(),
  }),
});

const toOpenApiPath = (path: string) => path.replace(/:(\w+)/g, "{$1}");

const documented = new Set(
  Object.entries(openApiDocument.paths).flatMap(([path, methods]) =>
    Object.keys(methods).map((method) => `${method} ${path}`),
  ),
);

const registered = application.routes
  .filter(({ method, path }) => method !== "ALL" && !path.startsWith("/api/auth/"))
  .map(({ method, path }) => `${method.toLowerCase()} ${toOpenApiPath(path)}`);

describe("OpenAPI document", () => {
  it("documents every route the application serves", () => {
    expect(registered).toEqual(
      expect.arrayContaining([
        "post /api/lessons/{id}/attempts",
        "get /api/me",
        "patch /api/me/profile",
        "get /api/learning-path",
        "get /api/health",
      ]),
    );
    expect(registered.filter((route) => !documented.has(route))).toEqual([]);
  });

  it("documents nothing the application does not serve", () => {
    const served = new Set(registered);
    const unserved = [...documented].filter(
      (route) => !route.includes("/api/auth/") && !served.has(route),
    );
    expect(unserved).toEqual([]);
  });

  it("matches the committed docs/public/openapi.json, run `bun run openapi` to update it", async () => {
    const committed = await readFile(
      new URL("../../../../docs/public/openapi.json", import.meta.url),
      "utf8",
    );
    expect(committed).toBe(`${JSON.stringify(openApiDocument, null, 2)}\n`);
  });
});
