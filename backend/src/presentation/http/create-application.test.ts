import request from "supertest";
import { describe, expect, it, vi } from "vitest";

import type { Logger } from "@/application/logging/logger";
import { createApplication } from "@/presentation/http/create-application";

const createStubLogger = (): Logger => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

describe("createApplication", () => {
  it("responds to the health check", async () => {
    const response = await request(createApplication({ logger: createStubLogger() })).get(
      "/api/health",
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("returns a json 404 for unknown routes", async () => {
    const response = await request(createApplication({ logger: createStubLogger() })).get(
      "/api/missing",
    );
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Route not found: GET /api/missing");
    expect(response.body.requestId).toBe(response.headers["x-request-id"]);
  });

  it("generates a request id and sends it back", async () => {
    const response = await request(createApplication({ logger: createStubLogger() })).get(
      "/api/health",
    );
    expect(response.headers["x-request-id"]).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("sets security headers", async () => {
    const response = await request(createApplication({ logger: createStubLogger() })).get(
      "/api/health",
    );
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
  });

  it("rejects request bodies over 100kb", async () => {
    const response = await request(createApplication({ logger: createStubLogger() }))
      .post("/api/health")
      .send({ data: "a".repeat(110_000) });
    expect(response.status).toBe(413);
  });

  it("logs requests except the health check", async () => {
    const logger = createStubLogger();
    const application = createApplication({ logger });
    await request(application).get("/api/health");
    await request(application).get("/api/missing");
    expect(logger.info).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledWith(
      "GET /api/missing 404",
      expect.objectContaining({ status: 404, method: "GET" }),
    );
  });
});
