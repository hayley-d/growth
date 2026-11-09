import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";

import type { ErrorResponse } from "@shared/schemas";
import { requestContext } from "@/application/context/request-context";
import type { Logger } from "@/application/logging/logger";
import { BadRequestError } from "@/domain/errors";
import { createUserController } from "@/presentation/controllers/user-controller";
import { createErrorHandler } from "@/presentation/middleware/error-handler";
import { requestContextMiddleware } from "@/presentation/middleware/request-context-middleware";
import { createUserRoutes } from "@/presentation/routes/user-routes";

const meResponse = {
  data: {
    user: { email: "ada@example.com", emailVerified: false, displayName: "Ada" },
    profile: {
      codeLanguageId: null,
      colourTheme: "default",
      learningStyleId: null,
      onboardingComplete: true,
      showOnLeaderboard: true,
      textToSpeech: true,
    },
  },
};

const createStubLogger = (): Logger => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

const createApplication = (
  signedIn: boolean,
  updateProfile = vi.fn().mockResolvedValue(meResponse),
  getMe = vi.fn().mockResolvedValue(meResponse),
) => {
  const application = new Hono();
  application.use(requestContextMiddleware);
  application.use(async (_context, next) => {
    if (signedIn) requestContext.setUserId("user-1");
    await next();
  });
  application.route("/api/me", createUserRoutes(createUserController({ getMe, updateProfile })));
  application.onError(createErrorHandler(createStubLogger()));
  return { application, updateProfile };
};

const patch = (application: Hono, body: unknown) =>
  application.request("/api/me/profile", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

describe("user routes", () => {
  it("returns the me body when signed in", async () => {
    const { application } = createApplication(true);
    const response = await application.request("/api/me");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(meResponse);
  });

  it("returns 401 for the me body when signed out", async () => {
    const getMe = vi.fn().mockResolvedValue(meResponse);
    const { application } = createApplication(false, undefined, getMe);
    const response = await application.request("/api/me");
    expect(response.status).toBe(401);
    expect(getMe).not.toHaveBeenCalled();
  });

  it("returns 401 when signed out", async () => {
    const { application, updateProfile } = createApplication(false);
    const response = await patch(application, { textToSpeech: true });
    expect(response.status).toBe(401);
    expect(updateProfile).not.toHaveBeenCalled();
  });

  it("passes only the fields sent and returns the me body", async () => {
    const { application, updateProfile } = createApplication(true);
    const response = await patch(application, { textToSpeech: true });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(meResponse);
    expect(updateProfile).toHaveBeenCalledWith({ textToSpeech: true });
  });

  it("returns 400 with issues for a bad colour scheme", async () => {
    const { application, updateProfile } = createApplication(true);
    const response = await patch(application, { colourTheme: "neon" });
    const body = (await response.json()) as ErrorResponse;
    expect(response.status).toBe(400);
    expect(body.issues?.[0]?.path).toEqual(["colourTheme"]);
    expect(updateProfile).not.toHaveBeenCalled();
  });

  it("returns 400 for a learning style id that isn't a uuid", async () => {
    const { application } = createApplication(true);
    const response = await patch(application, { learningStyleId: "visual" });
    expect(response.status).toBe(400);
  });

  it("returns 400 for a learning style or code language that doesn't exist", async () => {
    const { application } = createApplication(
      true,
      vi.fn().mockRejectedValue(new BadRequestError("Code language not found")),
    );
    const response = await patch(application, {
      codeLanguageId: "00000000-0000-4000-8000-000000000000",
    });
    const body = (await response.json()) as ErrorResponse;
    expect(response.status).toBe(400);
    expect(body.message).toBe("Code language not found");
  });
});
