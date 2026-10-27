import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";

import { requestContext } from "@/application/context/request-context";
import type { Logger } from "@/application/logging/logger";
import { createErrorHandler } from "@/presentation/middleware/error-handler";
import { requestContextMiddleware } from "@/presentation/middleware/request-context-middleware";
import { requireAuth, requireRole } from "@/presentation/middleware/require-role";

const createStubLogger = (): Logger => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

const createApplication = (setupContext?: () => void) => {
  const application = new Hono();
  application.use(requestContextMiddleware);
  application.use(async (_context, next) => {
    setupContext?.();
    await next();
  });
  application.get("/protected", requireAuth, (context) => context.json({ ok: true }));
  application.get("/admin-only", requireRole("admin"), (context) => context.json({ ok: true }));
  application.onError(createErrorHandler(createStubLogger()));
  return application;
};

describe("requireAuth", () => {
  it("returns 401 when there is no authenticated user", async () => {
    const response = await createApplication().request("/protected");
    expect(response.status).toBe(401);
  });

  it("returns 200 when the user is authenticated", async () => {
    const response = await createApplication(() => requestContext.setUserId("user-1")).request(
      "/protected",
    );
    expect(response.status).toBe(200);
  });
});

describe("requireRole", () => {
  it("returns 401 when there is no authenticated user", async () => {
    const response = await createApplication().request("/admin-only");
    expect(response.status).toBe(401);
  });

  it("returns 403 when the user has the wrong role", async () => {
    const response = await createApplication(() => {
      requestContext.setUserId("user-1");
      requestContext.setRole("student");
    }).request("/admin-only");
    expect(response.status).toBe(403);
  });

  it("returns 200 when the user has the right role", async () => {
    const response = await createApplication(() => {
      requestContext.setUserId("user-1");
      requestContext.setRole("admin");
    }).request("/admin-only");
    expect(response.status).toBe(200);
  });

  it("returns 200 when the user has multiple comma-separated roles including the right one", async () => {
    const response = await createApplication(() => {
      requestContext.setUserId("user-1");
      requestContext.setRole("student,admin");
    }).request("/admin-only");
    expect(response.status).toBe(200);
  });
});
