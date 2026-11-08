import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";

import { requestContext } from "@/application/context/request-context";
import type { Logger } from "@/application/logging/logger";
import { createLearningPathController } from "@/presentation/controllers/learning-path-controller";
import { createErrorHandler } from "@/presentation/middleware/error-handler";
import { requestContextMiddleware } from "@/presentation/middleware/request-context-middleware";
import { createLearningPathRoutes } from "@/presentation/routes/learning-path-routes";

const learningPathResponse = { data: { units: [], progress: 0, currentLessonId: null } };

const createStubLogger = (): Logger => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

const createApplication = (signedIn: boolean) => {
  const getLearningPath = vi.fn().mockResolvedValue(learningPathResponse);
  const application = new Hono();
  application.use(requestContextMiddleware);
  application.use(async (_context, next) => {
    if (signedIn) requestContext.setUserId("user-1");
    await next();
  });
  application.route(
    "/api/learning-path",
    createLearningPathRoutes(createLearningPathController({ getLearningPath })),
  );
  application.onError(createErrorHandler(createStubLogger()));
  return { application, getLearningPath };
};

describe("learning path routes", () => {
  it("returns 401 when signed out", async () => {
    const { application, getLearningPath } = createApplication(false);
    const response = await application.request("/api/learning-path");
    expect(response.status).toBe(401);
    expect(getLearningPath).not.toHaveBeenCalled();
  });

  it("returns the learning path when signed in", async () => {
    const { application } = createApplication(true);
    const response = await application.request("/api/learning-path");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(learningPathResponse);
  });
});
