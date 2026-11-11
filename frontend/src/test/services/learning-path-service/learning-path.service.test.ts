import { beforeEach, describe, expect, it, vi } from "vitest";

import { learningPathService } from "@/services/learning-path-service/learning-path.service";
import { networkService } from "@/services/network.service";
import { ServiceError } from "@/services/service-error";
import { buildLearningPath } from "@/test/learning-path-fixture";

vi.mock("@/services/network.service", () => ({
  networkService: {
    get: vi.fn(),
  },
}));

const mockedGet = vi.mocked(networkService.get);

describe("learningPathService.getLearningPath", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it("returns the parsed learning path", async () => {
    const response = buildLearningPath(2);
    mockedGet.mockResolvedValue({ data: response });

    await expect(learningPathService.getLearningPath()).resolves.toEqual(response);
    expect(mockedGet).toHaveBeenCalledWith("/api/learning-path");
  });

  it("rejects with a ServiceError when the request fails", async () => {
    mockedGet.mockRejectedValue({
      statusCode: 401,
      message: "Request failed with status code 401",
      serverError: { message: "Not signed in" },
    });

    const error = await learningPathService.getLearningPath().catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ServiceError);
    expect(error).toMatchObject({ status: 401, message: "Not signed in" });
  });

  it("rejects when the response has the wrong shape", async () => {
    mockedGet.mockResolvedValue({ data: { data: { units: "nope" } } });

    await expect(learningPathService.getLearningPath()).rejects.toMatchObject({
      message: "Incorrect data format",
    });
  });
});
