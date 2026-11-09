import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";

import type { ErrorResponse } from "@shared/schemas";
import { requestContext } from "@/application/context/request-context";
import type { Logger } from "@/application/logging/logger";
import { ConflictError, NotFoundError } from "@/domain/errors";
import { createAttemptController } from "@/presentation/controllers/attempt-controller";
import { createErrorHandler } from "@/presentation/middleware/error-handler";
import { requestContextMiddleware } from "@/presentation/middleware/request-context-middleware";
import { createAttemptRoutes } from "@/presentation/routes/attempt-routes";

const id = "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80";
const questionId = "2b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80";

const stubLogger = (): Logger => ({ debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() });

const stateResponse = { data: { attempt: {}, question: null, result: null } };

const createApplication = (signedIn: boolean) => {
  const startAttempt = vi.fn().mockResolvedValue({ created: true, response: stateResponse });
  const getAttempt = vi.fn().mockResolvedValue(stateResponse);
  const requestHint = vi.fn().mockResolvedValue({ data: { hint: "h" } });
  const submitAnswer = vi.fn().mockResolvedValue({ data: { isCorrect: true } });
  const application = new Hono();
  application.use(requestContextMiddleware);
  application.use(async (_context, next) => {
    if (signedIn) requestContext.setUserId("user-1");
    await next();
  });
  application.route(
    "/api",
    createAttemptRoutes(
      createAttemptController({ startAttempt, getAttempt, requestHint, submitAnswer }),
    ),
  );
  application.onError(createErrorHandler(stubLogger()));
  return { application, startAttempt, getAttempt, requestHint, submitAnswer };
};

const post = (application: Hono, path: string, body?: unknown) =>
  application.request(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

describe("attempt routes", () => {
  it.each([
    ["POST", `/api/lessons/${id}/attempts`],
    ["GET", `/api/attempts/${id}`],
    ["POST", `/api/attempts/${id}/hints`],
    ["POST", `/api/attempts/${id}/answers`],
  ])("returns 401 for %s %s when signed out", async (method, path) => {
    const { application } = createApplication(false);
    const response = await application.request(path, { method });
    expect(response.status).toBe(401);
  });

  it("returns 201 when an attempt is created and 200 when it is resumed", async () => {
    const { application, startAttempt } = createApplication(true);
    const created = await post(application, `/api/lessons/${id}/attempts`);
    expect(created.status).toBe(201);
    expect(startAttempt).toHaveBeenCalledWith({ id });

    startAttempt.mockResolvedValueOnce({ created: false, response: stateResponse });
    expect((await post(application, `/api/lessons/${id}/attempts`)).status).toBe(200);
  });

  it("rejects a lesson id that is not a uuid", async () => {
    const { application, startAttempt } = createApplication(true);
    expect((await post(application, "/api/lessons/nope/attempts")).status).toBe(400);
    expect(startAttempt).not.toHaveBeenCalled();
  });

  it("returns an attempt", async () => {
    const { application, getAttempt } = createApplication(true);
    const response = await application.request(`/api/attempts/${id}`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(stateResponse);
    expect(getAttempt).toHaveBeenCalledWith({ id });
  });

  it("passes the question id to the hint use case", async () => {
    const { application, requestHint } = createApplication(true);
    const response = await post(application, `/api/attempts/${id}/hints`, { questionId });
    expect(response.status).toBe(200);
    expect(requestHint).toHaveBeenCalledWith({ id, questionId });
  });

  it("rejects a hint request without a question id", async () => {
    const { application, requestHint } = createApplication(true);
    expect((await post(application, `/api/attempts/${id}/hints`, {})).status).toBe(400);
    expect(requestHint).not.toHaveBeenCalled();
  });

  it("passes the question id and answer to the answer use case", async () => {
    const { application, submitAnswer } = createApplication(true);
    const answer = { type: "text", text: "pre-order" };
    const response = await post(application, `/api/attempts/${id}/answers`, { questionId, answer });
    expect(response.status).toBe(200);
    expect(submitAnswer).toHaveBeenCalledWith({ id, questionId, answer });
  });

  it("rejects an answer of an unknown type", async () => {
    const { application, submitAnswer } = createApplication(true);
    const response = await post(application, `/api/attempts/${id}/answers`, {
      questionId,
      answer: { type: "nope" },
    });
    expect(response.status).toBe(400);
    expect(submitAnswer).not.toHaveBeenCalled();
  });

  it("turns a conflict into a 409 and a missing attempt into a 404", async () => {
    const { application, submitAnswer, getAttempt } = createApplication(true);
    submitAnswer.mockRejectedValueOnce(new ConflictError("Question is already answered"));
    const conflict = await post(application, `/api/attempts/${id}/answers`, {
      questionId,
      answer: { type: "text", text: "x" },
    });
    expect(conflict.status).toBe(409);
    expect(((await conflict.json()) as ErrorResponse).message).toBe("Question is already answered");

    getAttempt.mockRejectedValueOnce(new NotFoundError("Attempt not found"));
    expect((await application.request(`/api/attempts/${id}`)).status).toBe(404);
  });
});
