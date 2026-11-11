import { beforeEach, describe, expect, it, vi } from "vitest";

import { lessonService } from "@/services/lesson-service/lesson.service";
import { networkService } from "@/services/network.service";
import { ServiceError } from "@/services/service-error";
import { buildLesson, lessonFixtureId } from "@/test/lesson-fixture";

vi.mock("@/services/network.service", () => ({
  networkService: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedGet = vi.mocked(networkService.get);
const mockedPut = vi.mocked(networkService.put);
const mockedPost = vi.mocked(networkService.post);

const lessonId = "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80";
const noteResponse = { data: { lessonId, body: "hello", updatedAt: "2026-11-02T10:00:00.000Z" } };
const serverFailure = {
  statusCode: 403,
  message: "Request failed with status code 403",
  serverError: { message: "Lesson is locked" },
};

describe("lessonService.getLessonNote", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it("returns the parsed note", async () => {
    mockedGet.mockResolvedValue({ data: noteResponse });

    await expect(lessonService.getLessonNote(lessonId)).resolves.toEqual(noteResponse);
    expect(mockedGet).toHaveBeenCalledWith(`/api/lessons/${lessonId}/note`);
  });

  it("rejects with a ServiceError when the request fails", async () => {
    mockedGet.mockRejectedValue(serverFailure);

    const error = await lessonService.getLessonNote(lessonId).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ServiceError);
    expect(error).toMatchObject({ status: 403, message: "Lesson is locked" });
  });

  it("rejects when the response has the wrong shape", async () => {
    mockedGet.mockResolvedValue({ data: { data: { lessonId } } });

    await expect(lessonService.getLessonNote(lessonId)).rejects.toMatchObject({
      message: "Incorrect data format",
    });
  });
});

describe("lessonService.saveLessonNote", () => {
  beforeEach(() => {
    mockedPut.mockReset();
  });

  it("sends the body and returns the parsed note", async () => {
    mockedPut.mockResolvedValue({ data: noteResponse });

    await expect(lessonService.saveLessonNote(lessonId, "hello")).resolves.toEqual(noteResponse);
    expect(mockedPut).toHaveBeenCalledWith(`/api/lessons/${lessonId}/note`, { body: "hello" });
  });

  it("rejects with a ServiceError when the request fails", async () => {
    mockedPut.mockRejectedValue(serverFailure);

    const error = await lessonService
      .saveLessonNote(lessonId, "hello")
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ServiceError);
    expect(error).toMatchObject({ status: 403, message: "Lesson is locked" });
  });

  it("rejects when the response has the wrong shape", async () => {
    mockedPut.mockResolvedValue({ data: { nope: true } });

    await expect(lessonService.saveLessonNote(lessonId, "hello")).rejects.toMatchObject({
      message: "Incorrect data format",
    });
  });
});

describe("lessonService.startLesson", () => {
  beforeEach(() => {
    mockedPost.mockReset();
  });

  it("posts to the start endpoint and returns nothing", async () => {
    mockedPost.mockResolvedValue({ data: "" });

    await expect(lessonService.startLesson(lessonId)).resolves.toBeUndefined();
    expect(mockedPost).toHaveBeenCalledWith(`/api/lessons/${lessonId}/start`);
  });

  it("rejects with a ServiceError when the lesson is locked", async () => {
    mockedPost.mockRejectedValue(serverFailure);

    const error = await lessonService.startLesson(lessonId).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ServiceError);
    expect(error).toMatchObject({ status: 403, message: "Lesson is locked" });
  });
});

describe("lessonService.getLesson", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it("returns the parsed lesson", async () => {
    const lesson = buildLesson();
    mockedGet.mockResolvedValue({ data: lesson });

    await expect(lessonService.getLesson(lessonFixtureId)).resolves.toEqual(lesson);
    expect(mockedGet).toHaveBeenCalledWith(`/api/lessons/${lessonFixtureId}`);
  });

  it("rejects with the status when the lesson is locked", async () => {
    mockedGet.mockRejectedValue(serverFailure);

    const error = await lessonService.getLesson(lessonFixtureId).catch((caught: unknown) => caught);

    expect(error).toMatchObject({ status: 403, message: "Lesson is locked" });
  });

  it("rejects when the response has the wrong shape", async () => {
    mockedGet.mockResolvedValue({ data: { data: { lesson: {} } } });

    await expect(lessonService.getLesson(lessonFixtureId)).rejects.toMatchObject({
      message: "Incorrect data format",
    });
  });
});
