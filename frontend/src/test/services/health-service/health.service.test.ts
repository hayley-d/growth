import { beforeEach, describe, expect, it, vi } from "vitest";

import { healthService } from "@/services/health-service/health.service";
import { networkService } from "@/services/network.service";
import { ServiceError } from "@/services/service-error";

vi.mock("@/services/network.service", () => ({
  networkService: {
    get: vi.fn(),
  },
}));

const mockedGet = vi.mocked(networkService.get);

describe("healthService.getHealth", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it("returns the parsed health status", async () => {
    mockedGet.mockResolvedValue({ data: { status: "ok" } });

    await expect(healthService.getHealth()).resolves.toEqual({ status: "ok" });
    expect(mockedGet).toHaveBeenCalledWith("/api/health");
  });

  it("rejects with a ServiceError when the request fails", async () => {
    mockedGet.mockRejectedValue({
      statusCode: 503,
      message: "Request failed with status code 503",
      serverError: { message: "Database unavailable" },
    });

    const error = await healthService.getHealth().catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ServiceError);
    expect(error).toMatchObject({ status: 503, message: "Database unavailable" });
  });

  it("rejects when the response has the wrong shape", async () => {
    mockedGet.mockResolvedValue({ data: { status: "broken" } });

    await expect(healthService.getHealth()).rejects.toMatchObject({
      message: "Incorrect data format",
    });
  });
});
