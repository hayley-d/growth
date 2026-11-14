import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";

import { requestContext } from "@/application/context/request-context";
import type { Logger } from "@/application/logging/logger";
import { createDailyChallengeController } from "@/presentation/controllers/daily-challenge-controller";
import { createErrorHandler } from "@/presentation/middleware/error-handler";
import { requestContextMiddleware } from "@/presentation/middleware/request-context-middleware";
import { createDailyChallengeRoutes } from "@/presentation/routes/daily-challenge-routes";

const questionId = "2b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80";

const stubLogger = (): Logger => ({ debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() });

const stateResponse = { data: { status: "not_started" } };

const createApplication = (signedIn: boolean) => {
  const getDailyChallenge = vi.fn().mockResolvedValue(stateResponse);
  const startDailyChallenge = vi.fn().mockResolvedValue({ created: true, response: stateResponse });
  const submitDailyChallengeAnswer = vi.fn().mockResolvedValue(stateResponse);
  const application = new Hono();
  application.use(requestContextMiddleware);
  application.use(async (_context, next) => {
    if (signedIn) requestContext.setUserId("user-1");
    await next();
  });
  application.route(
    "/api/daily-challenge",
    createDailyChallengeRoutes(
      createDailyChallengeController({
        getDailyChallenge,
        startDailyChallenge,
        submitDailyChallengeAnswer,
      }),
    ),
  );
  application.onError(createErrorHandler(stubLogger()));
  return { application, getDailyChallenge, startDailyChallenge, submitDailyChallengeAnswer };
};

const post = (application: Hono, path: string, body?: unknown) =>
  application.request(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

describe("daily challenge routes", () => {
  it.each([
    ["GET", "/api/daily-challenge"],
    ["POST", "/api/daily-challenge/start"],
    ["POST", "/api/daily-challenge/answers"],
  ])("returns 401 for %s %s when signed out", async (method, path) => {
    const { application } = createApplication(false);
    const response = await application.request(path, { method });
    expect(response.status).toBe(401);
  });

  it("returns today's challenge", async () => {
    const { application } = createApplication(true);
    const response = await application.request("/api/daily-challenge");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(stateResponse);
  });

  it("returns 201 when the challenge starts and 200 when it was already started", async () => {
    const { application, startDailyChallenge } = createApplication(true);
    expect((await post(application, "/api/daily-challenge/start")).status).toBe(201);

    startDailyChallenge.mockResolvedValueOnce({ created: false, response: stateResponse });
    expect((await post(application, "/api/daily-challenge/start")).status).toBe(200);
  });

  it("passes the answer to the use case", async () => {
    const { application, submitDailyChallengeAnswer } = createApplication(true);
    const answer = { type: "text", text: "3" };
    const response = await post(application, "/api/daily-challenge/answers", {
      questionId,
      answer,
    });
    expect(response.status).toBe(200);
    expect(submitDailyChallengeAnswer).toHaveBeenCalledWith({ questionId, answer });
  });

  it("rejects an answer body without a question id", async () => {
    const { application, submitDailyChallengeAnswer } = createApplication(true);
    const response = await post(application, "/api/daily-challenge/answers", {
      answer: { type: "text", text: "3" },
    });
    expect(response.status).toBe(400);
    expect(submitDailyChallengeAnswer).not.toHaveBeenCalled();
  });
});
