import { describe, expect, it, vi } from "vitest";

import type { ErrorResponse } from "@shared/schemas/error";
import type { Logger } from "@/application/logging/logger";
import { NotFoundError } from "@/domain/errors";
import { createAlgorithmController } from "@/presentation/controllers/algorithm-controller";
import { createApplication } from "@/presentation/http/create-application";

const createStubLogger = (): Logger => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

const createTestApp = (logger: Logger) =>
  createApplication({
    logger,
    authHandler: async () => new Response(null, { status: 404 }),
    getSession: async () => null,
    algorithmController: createAlgorithmController({
      listAlgorithms: async () => ({ data: { algorithms: [] } }),
      getAlgorithmSnippet: async () => {
        throw new NotFoundError("Algorithm not found");
      },
    }),
  });

describe("createApplication", () => {
  it("responds to the health check", async () => {
    const response = await createTestApp(createStubLogger()).request("/api/health");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
  });

  it("returns a json 404 for unknown routes", async () => {
    const response = await createTestApp(createStubLogger()).request("/api/missing");
    const body = (await response.json()) as ErrorResponse;
    expect(response.status).toBe(404);
    expect(body.message).toBe("Route not found: GET /api/missing");
    expect(body.requestId).toBe(response.headers.get("x-request-id"));
  });

  it("mounts the algorithm routes", async () => {
    const response = await createTestApp(createStubLogger()).request("/api/algorithms");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ data: { algorithms: [] } });
  });

  it("generates a request id and sends it back", async () => {
    const response = await createTestApp(createStubLogger()).request("/api/health");
    expect(response.headers.get("x-request-id")).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("sets security headers", async () => {
    const response = await createTestApp(createStubLogger()).request("/api/health");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
  });

  it("rejects request bodies over 100kb", async () => {
    const response = await createTestApp(createStubLogger()).request("/api/health", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ data: "a".repeat(110_000) }),
    });
    expect(response.status).toBe(413);
    expect(((await response.json()) as ErrorResponse).message).toBe("Request body too large");
  });

  it("logs requests except the health check", async () => {
    const logger = createStubLogger();
    const application = createTestApp(logger);
    await application.request("/api/health");
    await application.request("/api/missing");
    expect(logger.info).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledWith(
      "GET /api/missing 404",
      expect.objectContaining({ status: 404, method: "GET" }),
    );
  });
});
