import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";

import type { ErrorResponse } from "@shared/schemas/error";
import type { GetAlgorithmSnippet } from "@/application/course-content/queries/get-algorithm-snippet";
import type { Logger } from "@/application/logging/logger";
import { NotFoundError } from "@/domain/errors";
import { createAlgorithmController } from "@/presentation/controllers/algorithm-controller";
import { createErrorHandler } from "@/presentation/middleware/error-handler";
import { requestContextMiddleware } from "@/presentation/middleware/request-context-middleware";
import { createAlgorithmRoutes } from "@/presentation/routes/algorithm-routes";

const createStubLogger = (): Logger => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

const snippetResponse = {
  data: {
    algorithm: { code: "insert", name: "Insert" },
    language: { code: "java", name: "Java" },
    source: "void insert() {}",
    lines: { "insert.compare": 1 },
  },
};

const createApplication = (getAlgorithmSnippet: GetAlgorithmSnippet) => {
  const application = new Hono();
  application.use(requestContextMiddleware);
  application.route(
    "/api/algorithms",
    createAlgorithmRoutes(
      createAlgorithmController({
        listAlgorithms: async () => ({
          data: { algorithms: [{ code: "insert", name: "Insert" }] },
        }),
        getAlgorithmSnippet,
      }),
    ),
  );
  application.onError(createErrorHandler(createStubLogger()));
  return application;
};

describe("algorithm routes", () => {
  it("lists the algorithms", async () => {
    const response = await createApplication(vi.fn()).request("/api/algorithms");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      data: { algorithms: [{ code: "insert", name: "Insert" }] },
    });
  });

  it("passes the code and language to the use case and returns the snippet", async () => {
    const getAlgorithmSnippet = vi.fn().mockResolvedValue(snippetResponse);
    const response = await createApplication(getAlgorithmSnippet).request(
      "/api/algorithms/insert/snippet?language=java",
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(snippetResponse);
    expect(getAlgorithmSnippet).toHaveBeenCalledWith({ code: "insert", language: "java" });
  });

  it("leaves the language out when it isn't in the query", async () => {
    const getAlgorithmSnippet = vi.fn().mockResolvedValue(snippetResponse);
    await createApplication(getAlgorithmSnippet).request("/api/algorithms/insert/snippet");
    expect(getAlgorithmSnippet).toHaveBeenCalledWith({ code: "insert" });
  });

  it("returns a 404 with the shared error body for a missing snippet", async () => {
    const response = await createApplication(
      vi.fn().mockRejectedValue(new NotFoundError("There's no Rust version of Insert yet")),
    ).request("/api/algorithms/insert/snippet?language=rust");
    const body = (await response.json()) as ErrorResponse;
    expect(response.status).toBe(404);
    expect(body.message).toBe("There's no Rust version of Insert yet");
    expect(body.requestId).toBe(response.headers.get("x-request-id"));
  });

  it("rejects a language that isn't a lower case code with a 400", async () => {
    const getAlgorithmSnippet = vi.fn();
    const response = await createApplication(getAlgorithmSnippet).request(
      "/api/algorithms/insert/snippet?language=Java",
    );
    expect(response.status).toBe(400);
    expect(getAlgorithmSnippet).not.toHaveBeenCalled();
  });

  it("rejects an empty language with a 400", async () => {
    const response = await createApplication(vi.fn()).request(
      "/api/algorithms/insert/snippet?language=",
    );
    expect(response.status).toBe(400);
  });
});
