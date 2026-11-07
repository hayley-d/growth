import { Hono } from "hono";
import { describe, expect, it } from "vitest";

import { createCourseContentController } from "@/presentation/controllers/course-content-controller";
import { createCourseContentRoutes } from "@/presentation/routes/course-content-routes";

const learningStyles = {
  data: {
    learningStyles: [
      { id: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80", name: "Visual", description: "Pictures" },
    ],
  },
};
const codeLanguages = {
  data: {
    codeLanguages: [{ id: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01", code: "java", name: "Java" }],
  },
};

const application = new Hono().route(
  "/api",
  createCourseContentRoutes(
    createCourseContentController({
      listLearningStyles: async () => learningStyles,
      listCodeLanguages: async () => codeLanguages,
    }),
  ),
);

describe("course content routes", () => {
  it.each([
    ["/api/learning-styles", learningStyles],
    ["/api/code-languages", codeLanguages],
  ])("returns %s without signing in", async (path, expected) => {
    const response = await application.request(path);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(expected);
  });
});
