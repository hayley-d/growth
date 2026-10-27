import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";

import type { GetSession } from "@/application/auth/session";
import { requestContext } from "@/application/context/request-context";
import { createAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { requestContextMiddleware } from "@/presentation/middleware/request-context-middleware";

const createApplication = (getSession: GetSession) => {
  const application = new Hono();
  application.use(requestContextMiddleware);
  application.use(createAuthMiddleware(getSession));
  application.get("/", (context) =>
    context.json({ userId: requestContext.getUserId(), role: requestContext.getRole() }),
  );
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
});
