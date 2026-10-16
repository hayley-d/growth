import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import type { ErrorIssue, ErrorResponse } from "@shared/schemas/error";
import { requestContext } from "@/application/context/request-context";
import type { Logger } from "@/application/logging/logger";
import { DomainError, type DomainErrorKind } from "@/domain/errors";

const statusByKind: Record<DomainErrorKind, number> = {
  "bad-request": 400,
  unauthorized: 401,
  forbidden: 403,
  "not-found": 404,
  conflict: 409,
};

const toIssues = (error: ZodError): ErrorIssue[] =>
  error.issues.map((issue) => ({
    path: issue.path.map((segment) => (typeof segment === "symbol" ? String(segment) : segment)),
    message: issue.message,
    code: issue.code,
  }));

const isMalformedJson = (error: unknown) =>
  error instanceof SyntaxError &&
  (error as SyntaxError & { type?: string }).type === "entity.parse.failed";

const isBodyTooLarge = (error: unknown) =>
  error instanceof Error && (error as Error & { type?: string }).type === "entity.too.large";

export const createErrorHandler =
  (logger: Logger): ErrorRequestHandler =>
  (error, _request, response, _next) => {
    const requestId = requestContext.getRequestId();
    const send = (status: number, body: Omit<ErrorResponse, "requestId">) => {
      response.status(status).json({ ...body, requestId });
    };

    if (error instanceof ZodError) {
      send(400, { message: "Validation failed", issues: toIssues(error) });
      return;
    }
    if (error instanceof DomainError) {
      send(statusByKind[error.kind], { message: error.message });
      return;
    }
    if (isMalformedJson(error)) {
      send(400, { message: "Malformed JSON body" });
      return;
    }
    if (isBodyTooLarge(error)) {
      send(413, { message: "Request body too large" });
      return;
    }

    logger.error("Unhandled error", { error });
    send(500, { message: "Internal server error" });
  };
