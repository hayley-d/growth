import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";

import type { ErrorResponse } from "@shared/schemas";
import { requestContext } from "@/application/context/request-context";
import type { Logger } from "@/application/logging/logger";
import { ForbiddenError, NotFoundError } from "@/domain/errors";
import { createLessonController } from "@/presentation/controllers/lesson-controller";
import { createErrorHandler } from "@/presentation/middleware/error-handler";
import { requestContextMiddleware } from "@/presentation/middleware/request-context-middleware";
import { createLessonRoutes } from "@/presentation/routes/lesson-routes";

const lessonId = "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80";
const noteResponse = { data: { lessonId, body: "hi", updatedAt: null } };

const createStubLogger = (): Logger => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

const createApplication = (signedIn: boolean) => {
  const saveLessonNote = vi.fn().mockResolvedValue(noteResponse);
  const startLesson = vi.fn().mockResolvedValue(undefined);
  const application = new Hono();
  application.use(requestContextMiddleware);
  application.use(async (_context, next) => {
    if (signedIn) requestContext.setUserId("user-1");
    await next();
  });
  application.route(
    "/api/lessons",
    createLessonRoutes(
      createLessonController({
        getLesson: vi.fn(),
        getLessonNote: vi.fn().mockResolvedValue(noteResponse),
        saveLessonNote,
        startLesson,
      }),
    ),
  );
  application.onError(createErrorHandler(createStubLogger()));
  return { application, saveLessonNote, startLesson };
};

const put = (application: Hono, body: unknown) =>
  application.request(`/api/lessons/${lessonId}/note`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

describe("lesson routes", () => {
  it.each([
    ["GET", `/api/lessons/${lessonId}`],
    ["GET", `/api/lessons/${lessonId}/note`],
    ["PUT", `/api/lessons/${lessonId}/note`],
    ["POST", `/api/lessons/${lessonId}/start`],
  ])("returns 401 for %s %s when signed out", async (method, path) => {
    const { application } = createApplication(false);
    const response = await application.request(path, { method });
    expect(response.status).toBe(401);
  });

  it("returns the note", async () => {
    const response = await createApplication(true).application.request(
      `/api/lessons/${lessonId}/note`,
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(noteResponse);
  });

  it("saves a note", async () => {
    const { application, saveLessonNote } = createApplication(true);
    const response = await put(application, { body: "hi" });
    expect(response.status).toBe(200);
    expect(saveLessonNote).toHaveBeenCalledWith({ id: lessonId, body: "hi" });
  });

  it("returns 400 for a body over 2000 characters", async () => {
    const { application, saveLessonNote } = createApplication(true);
    const response = await put(application, { body: "a".repeat(2001) });
    const body = (await response.json()) as ErrorResponse;
    expect(response.status).toBe(400);
    expect(body.message).toBe("Validation failed");
    expect(saveLessonNote).not.toHaveBeenCalled();
  });

  it("starts a lesson with an empty 204", async () => {
    const { application, startLesson } = createApplication(true);
    const response = await application.request(`/api/lessons/${lessonId}/start`, {
      method: "POST",
    });
    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
    expect(startLesson).toHaveBeenCalledWith({ id: lessonId });
  });

  it.each([
    [new ForbiddenError("Lesson is locked"), 403],
    [new NotFoundError("Lesson not found"), 404],
  ])("returns the error status when starting fails with %s", async (error, status) => {
    const { application, startLesson } = createApplication(true);
    startLesson.mockRejectedValue(error);
    const response = await application.request(`/api/lessons/${lessonId}/start`, {
      method: "POST",
    });
    expect(response.status).toBe(status);
  });

  it("returns 400 for an id that is not a uuid", async () => {
    const response = await createApplication(true).application.request("/api/lessons/nope/note");
    expect(response.status).toBe(400);
  });
});
