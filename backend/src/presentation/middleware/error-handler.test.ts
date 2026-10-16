import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

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

const createStubLogger = (): Logger => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

const createThrowingApplication = (error: unknown, logger = createStubLogger()) => {
  const application = express();
  application.use(requestContextMiddleware);
  application.use(express.json());
  application.post("/", () => {
    throw error;
  });
  application.use(createErrorHandler(logger));
  return application;
};

describe("createErrorHandler", () => {
  it.each([
    [new BadRequestError("Bad"), 400],
    [new UnauthorizedError("Who are you"), 401],
    [new ForbiddenError("Not yours"), 403],
    [new NotFoundError("Missing"), 404],
    [new ConflictError("Taken"), 409],
  ])("maps %s to %i", async (error, status) => {
    const response = await request(createThrowingApplication(error)).post("/");
    expect(response.status).toBe(status);
    expect(response.body.message).toBe(error.message);
    expect(response.body.requestId).toBeTypeOf("string");
  });

  it("maps a zod error to 400 with issues", async () => {
    const result = z.object({ name: z.string() }).safeParse({});
    const response = await request(createThrowingApplication(result.error)).post("/");
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.issues).toEqual([
      expect.objectContaining({ path: ["name"], code: "invalid_type" }),
    ]);
  });

  it("maps malformed json to 400", async () => {
    const response = await request(createThrowingApplication(new Error("unused")))
      .post("/")
      .set("content-type", "application/json")
      .send("{ not json");
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Malformed JSON body");
  });

  it("logs unknown errors and hides them behind a 500", async () => {
    const logger = createStubLogger();
    const error = new Error("database exploded");
    const response = await request(createThrowingApplication(error, logger)).post("/");
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error");
    expect(logger.error).toHaveBeenCalledWith("Unhandled error", { error });
  });
});
