import { beforeEach, describe, expect, it, vi } from "vitest";

import { algorithmService } from "@/services/algorithm-service/algorithm.service";
import { networkService } from "@/services/network.service";
import { ServiceError } from "@/services/service-error";

vi.mock("@/services/network.service", () => ({
  networkService: {
    get: vi.fn(),
  },
}));

const mockedGet = vi.mocked(networkService.get);

const snippetResponse = {
  data: {
    algorithm: { code: "insert", name: "Insert" },
    language: { code: "java", name: "Java" },
    source: "Node insert(Node node, int key) {\n}",
    lines: { "insert.compare": 1 },
  },
};

describe("algorithmService.getAlgorithmSnippet", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it("returns the parsed snippet and asks for the language when given one", async () => {
    mockedGet.mockResolvedValue({ data: snippetResponse });

    await expect(algorithmService.getAlgorithmSnippet("insert", "java")).resolves.toEqual(
      snippetResponse,
    );
    expect(mockedGet).toHaveBeenCalledWith("/api/algorithms/insert/snippet", {
      params: { language: "java" },
    });
  });

  it("leaves the language out so the server uses the learner's", async () => {
    mockedGet.mockResolvedValue({ data: snippetResponse });

    await algorithmService.getAlgorithmSnippet("insert");

    expect(mockedGet).toHaveBeenCalledWith("/api/algorithms/insert/snippet", undefined);
  });

  it("rejects with a ServiceError when the request fails", async () => {
    mockedGet.mockRejectedValue({
      statusCode: 404,
      message: "Request failed with status code 404",
      serverError: { message: "No snippet for insert in rust" },
    });

    const error = await algorithmService
      .getAlgorithmSnippet("insert", "rust")
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ServiceError);
    expect(error).toMatchObject({ status: 404, message: "No snippet for insert in rust" });
  });

  it("rejects when the response has the wrong shape", async () => {
    mockedGet.mockResolvedValue({ data: { data: { source: 3 } } });

    await expect(algorithmService.getAlgorithmSnippet("insert")).rejects.toMatchObject({
      message: "Incorrect data format",
    });
  });
});
