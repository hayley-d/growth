import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ZodError } from "zod";

import type { ErrorIssue, ErrorResponse } from "@shared/schemas/error";
import { requestContext } from "@/application/context/request-context";
import type { Logger } from "@/application/logging/logger";
import { DomainError, type DomainErrorKind } from "@/domain/errors";

const statusByKind: Record<DomainErrorKind, ContentfulStatusCode> = {
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

export const createErrorHandler =
  (logger: Logger): ErrorHandler =>
  (error, context) => {
    const requestId = requestContext.getRequestId();
    const send = (status: ContentfulStatusCode, body: Omit<ErrorResponse, "requestId">) =>
      context.json({ ...body, requestId }, status);

    if (error instanceof ZodError) {
      return send(400, { message: "Validation failed", issues: toIssues(error) });
    }
    if (error instanceof DomainError) {
      return send(statusByKind[error.kind], { message: error.message });
    }
    if (error instanceof HTTPException) {
      return send(error.status as ContentfulStatusCode, { message: error.message });
    }

    logger.error("Unhandled error", { error });
    return send(500, { message: "Internal server error" });
  };
