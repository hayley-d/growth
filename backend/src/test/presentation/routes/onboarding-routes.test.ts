import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";

import type { ErrorResponse, GetQuizResponse } from "@shared/schemas";
import { requestContext } from "@/application/context/request-context";
import type { Logger } from "@/application/logging/logger";
import { makeGetQuiz } from "@/application/onboarding/queries/get-quiz";
import { BadRequestError } from "@/domain/errors";
import { createOnboardingController } from "@/presentation/controllers/onboarding-controller";
import { createErrorHandler } from "@/presentation/middleware/error-handler";
import { requestContextMiddleware } from "@/presentation/middleware/request-context-middleware";
import { createOnboardingRoutes } from "@/presentation/routes/onboarding-routes";

const scoreResponse = {
  data: {
    learningStyle: {
      id: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
      name: "Visual",
      description: "Diagrams.",
    },
  },
};

const createStubLogger = (): Logger => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

const meResponse = {
  data: {
    user: { email: "ada@example.com", emailVerified: false, displayName: "Ada" },
    profile: {
      codeLanguageId: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
      colourTheme: "default",
      learningStyleId: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
      onboardingComplete: true,
      showOnLeaderboard: false,
      textToSpeech: true,
    },
  },
};

const onboardingAnswers = {
  learningStyleId: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
  codeLanguageId: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
  showOnLeaderboard: false,
  textToSpeech: true,
};

const createApplication = (
  signedIn: boolean,
  scoreQuiz = vi.fn().mockResolvedValue(scoreResponse),
  completeOnboarding = vi.fn().mockResolvedValue(meResponse),
) => {
  const application = new Hono();
  application.use(requestContextMiddleware);
  application.use(async (_context, next) => {
    if (signedIn) requestContext.setUserId("user-1");
    await next();
  });
  application.route(
    "/api/onboarding",
    createOnboardingRoutes(
      createOnboardingController({ getQuiz: makeGetQuiz(), scoreQuiz, completeOnboarding }),
    ),
  );
  application.onError(createErrorHandler(createStubLogger()));
  return { application, scoreQuiz, completeOnboarding };
};

const post = (application: Hono, body: unknown, path = "/api/onboarding/quiz") =>
  application.request(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

const answers = [{ questionId: "flat-pack-desk", optionId: "a" }];

describe("onboarding routes", () => {
  it("returns 8 questions without their styles", async () => {
    const { application } = createApplication(true);
    const response = await application.request("/api/onboarding/quiz");
    expect(response.status).toBe(200);
    const body = (await response.json()) as GetQuizResponse;
    expect(body.data.questions).toHaveLength(8);
    expect(JSON.stringify(body)).not.toContain("style");
  });

  it("returns 401 for the questions when signed out", async () => {
    const { application } = createApplication(false);
    expect((await application.request("/api/onboarding/quiz")).status).toBe(401);
  });

  it("returns the learning style for the answers", async () => {
    const { application, scoreQuiz } = createApplication(true);
    const response = await post(application, { answers });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(scoreResponse);
    expect(scoreQuiz).toHaveBeenCalledWith({ answers });
  });

  it("returns 401 for the answers when signed out", async () => {
    const { application, scoreQuiz } = createApplication(false);
    expect((await post(application, { answers })).status).toBe(401);
    expect(scoreQuiz).not.toHaveBeenCalled();
  });

  it("returns 400 for a body that isn't a list of answers", async () => {
    const { application, scoreQuiz } = createApplication(true);
    expect((await post(application, { answers: "visual" })).status).toBe(400);
    expect(scoreQuiz).not.toHaveBeenCalled();
  });

  it("returns 400 when the use case rejects the answers", async () => {
    const { application } = createApplication(
      true,
      vi.fn().mockRejectedValue(new BadRequestError("Answer every question once")),
    );
    const response = await post(application, { answers });
    expect(response.status).toBe(400);
    expect(((await response.json()) as ErrorResponse).message).toBe("Answer every question once");
  });

  it("completes onboarding and returns the me body", async () => {
    const { application, completeOnboarding } = createApplication(true);
    const response = await post(application, onboardingAnswers, "/api/onboarding");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(meResponse);
    expect(completeOnboarding).toHaveBeenCalledWith(onboardingAnswers);
  });

  it("returns 401 for completing onboarding when signed out", async () => {
    const { application, completeOnboarding } = createApplication(false);
    expect((await post(application, onboardingAnswers, "/api/onboarding")).status).toBe(401);
    expect(completeOnboarding).not.toHaveBeenCalled();
  });

  it.each(Object.keys(onboardingAnswers))("returns 400 without %s", async (field) => {
    const { application, completeOnboarding } = createApplication(true);
    const { [field as keyof typeof onboardingAnswers]: _left, ...rest } = onboardingAnswers;
    expect((await post(application, rest, "/api/onboarding")).status).toBe(400);
    expect(completeOnboarding).not.toHaveBeenCalled();
  });

  it("returns 400 when a learning style or code language doesn't exist", async () => {
    const { application } = createApplication(
      true,
      undefined,
      vi.fn().mockRejectedValue(new BadRequestError("A related record does not exist")),
    );
    expect((await post(application, onboardingAnswers, "/api/onboarding")).status).toBe(400);
  });
});
