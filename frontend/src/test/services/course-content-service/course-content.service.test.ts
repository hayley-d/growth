import { beforeEach, describe, expect, it, vi } from "vitest";

import { courseContentService } from "@/services/course-content-service";
import { networkService } from "@/services/network.service";

vi.mock("@/services/network.service", () => ({
  networkService: {
    get: vi.fn(),
  },
}));

const mockedGet = vi.mocked(networkService.get);

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

beforeEach(() => {
  mockedGet.mockReset();
});

describe("courseContentService", () => {
  it("lists the learning styles", async () => {
    mockedGet.mockResolvedValue({ data: learningStyles });

    await expect(courseContentService.listLearningStyles()).resolves.toEqual(learningStyles);
    expect(mockedGet).toHaveBeenCalledWith("/api/learning-styles");
  });

  it("lists the code languages", async () => {
    mockedGet.mockResolvedValue({ data: codeLanguages });

    await expect(courseContentService.listCodeLanguages()).resolves.toEqual(codeLanguages);
    expect(mockedGet).toHaveBeenCalledWith("/api/code-languages");
  });

  it("rejects a list in the wrong shape", async () => {
    mockedGet.mockResolvedValue({ data: { data: { learningStyles: [{ id: 1 }] } } });

    await expect(courseContentService.listLearningStyles()).rejects.toMatchObject({
      message: "Incorrect data format",
    });
  });
});
