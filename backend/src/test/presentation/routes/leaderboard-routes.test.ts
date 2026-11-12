import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";

import { requestContext } from "@/application/context/request-context";
import type { Logger } from "@/application/logging/logger";
import { createLeaderboardController } from "@/presentation/controllers/leaderboard-controller";
import { createErrorHandler } from "@/presentation/middleware/error-handler";
import { requestContextMiddleware } from "@/presentation/middleware/request-context-middleware";
import { createLeaderboardRoutes } from "@/presentation/routes/leaderboard-routes";

const leaderboardResponse = { data: { top: [], me: null } };

const createStubLogger = (): Logger => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

const createApplication = (signedIn: boolean) => {
  const getLeaderboard = vi.fn().mockResolvedValue(leaderboardResponse);
  const application = new Hono();
  application.use(requestContextMiddleware);
  application.use(async (_context, next) => {
    if (signedIn) requestContext.setUserId("user-1");
    await next();
  });
  application.route(
    "/api/leaderboard",
    createLeaderboardRoutes(createLeaderboardController({ getLeaderboard })),
  );
  application.onError(createErrorHandler(createStubLogger()));
  return { application, getLeaderboard };
};

describe("leaderboard routes", () => {
  it("returns 401 when signed out", async () => {
    const { application, getLeaderboard } = createApplication(false);
    const response = await application.request("/api/leaderboard");
    expect(response.status).toBe(401);
    expect(getLeaderboard).not.toHaveBeenCalled();
  });

  it("returns the leaderboard when signed in", async () => {
    const { application } = createApplication(true);
    const response = await application.request("/api/leaderboard");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(leaderboardResponse);
  });
});
