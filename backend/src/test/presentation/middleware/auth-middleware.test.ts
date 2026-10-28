import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";

import type { GetSession } from "@/application/auth/session";
import { requestContext } from "@/application/context/request-context";
import type { Logger } from "@/application/logging/logger";
import { createAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { createErrorHandler } from "@/presentation/middleware/error-handler";
import { requestContextMiddleware } from "@/presentation/middleware/request-context-middleware";

const createLogger = (): Logger => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

const createApplication = (getSession: GetSession, logger: Logger = createLogger()) => {
  const application = new Hono();
  application.use(requestContextMiddleware);
  application.use(createAuthMiddleware(getSession));
  application.get("/", (context) =>
    context.json({ userId: requestContext.getUserId(), role: requestContext.getRole() }),
  );
  application.onError(createErrorHandler(logger));
  return application;
};

describe("createAuthMiddleware", () => {
  it("sets the user id and role when a session is found", async () => {
    const getSession = vi.fn().mockResolvedValue({ userId: "user-1", role: "student" });
    const response = await createApplication(getSession).request("/");
    expect(await response.json()).toEqual({ userId: "user-1", role: "student" });
  });

  it("leaves the context empty when there is no session", async () => {
    const getSession = vi.fn().mockResolvedValue(null);
    const response = await createApplication(getSession).request("/");
    expect(await response.json()).toEqual({});
  });

  it("returns a 500 instead of carrying on signed out when the lookup fails", async () => {
    const getSession = vi.fn().mockRejectedValue(new Error("Database unavailable"));
    const logger = createLogger();

    const response = await createApplication(getSession, logger).request("/");

    expect(response.status).toBe(500);
    expect(await response.json()).toMatchObject({ message: "Internal server error" });
    expect(logger.error).toHaveBeenCalled();
  });
});
