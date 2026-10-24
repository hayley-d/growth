import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import type { ErrorResponse } from "@shared/schemas/error";
import type { Logger } from "@/application/logging/logger";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/domain/errors";
import { createErrorHandler } from "@/presentation/middleware/error-handler";
import { requestContextMiddleware } from "@/presentation/middleware/request-context-middleware";
import { validate } from "@/presentation/middleware/validate-request";

const createStubLogger = (): Logger => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

const createThrowingApplication = (error: unknown, logger = createStubLogger()) => {
  const application = new Hono();
  application.use(requestContextMiddleware);
  application.post("/", validate("json", z.unknown()), () => {
    throw error;
  });
  application.onError(createErrorHandler(logger));
  return application;
};

const post = (application: Hono, body = "{}") =>
  application.request("/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });

describe("createErrorHandler", () => {
  it.each([
    [new BadRequestError("Bad"), 400],
    [new UnauthorizedError("Who are you"), 401],
    [new ForbiddenError("Not yours"), 403],
    [new NotFoundError("Missing"), 404],
    [new ConflictError("Taken"), 409],
  ])("maps %s to %i", async (error, status) => {
    const response = await post(createThrowingApplication(error));
    const body = (await response.json()) as ErrorResponse;
    expect(response.status).toBe(status);
    expect(body.message).toBe(error.message);
    expect(body.requestId).toBeTypeOf("string");
  });

  it("maps a zod error to 400 with issues", async () => {
    const result = z.object({ name: z.string() }).safeParse({});
    const response = await post(createThrowingApplication(result.error));
    const body = (await response.json()) as ErrorResponse;
    expect(response.status).toBe(400);
    expect(body.message).toBe("Validation failed");
    expect(body.issues).toEqual([
      expect.objectContaining({ path: ["name"], code: "invalid_type" }),
    ]);
  });

  it("maps malformed json to 400", async () => {
    const response = await post(createThrowingApplication(new Error("unused")), "{ not json");
    expect(response.status).toBe(400);
    expect(((await response.json()) as ErrorResponse).message).toBe(
      "Malformed JSON in request body",
    );
  });

  it("logs unknown errors and hides them behind a 500", async () => {
    const logger = createStubLogger();
    const error = new Error("database exploded");
    const response = await post(createThrowingApplication(error, logger));
    expect(response.status).toBe(500);
    expect(((await response.json()) as ErrorResponse).message).toBe("Internal server error");
    expect(logger.error).toHaveBeenCalledWith("Unhandled error", { error });
  });
});
