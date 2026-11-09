import { beforeEach, describe, expect, it, vi } from "vitest";

import { networkService } from "@/services/network.service";
import { ServiceError } from "@/services/service-error";
import { userService } from "@/services/user-service";

vi.mock("@/services/network.service", () => ({
  networkService: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

const mockedGet = vi.mocked(networkService.get);
const mockedPatch = vi.mocked(networkService.patch);

const meResponse = {
  data: {
    user: { email: "ada@example.com", emailVerified: false, displayName: "Ada" },
    profile: {
      codeLanguageId: null,
      colourTheme: "default",
      learningStyleId: null,
      onboardingComplete: false,
      showOnLeaderboard: true,
      textToSpeech: false,
    },
  },
};

beforeEach(() => {
  mockedGet.mockReset();
  mockedPatch.mockReset();
});

describe("userService.getMe", () => {
  it("returns the parsed profile", async () => {
    mockedGet.mockResolvedValue({ data: meResponse });

    await expect(userService.getMe()).resolves.toEqual(meResponse);
    expect(mockedGet).toHaveBeenCalledWith("/api/me");
  });

  it("rejects when the response has the wrong shape", async () => {
    mockedGet.mockResolvedValue({ data: { data: {} } });

    await expect(userService.getMe()).rejects.toMatchObject({ message: "Incorrect data format" });
  });
});

describe("userService.updateProfile", () => {
  it("sends only the changed fields and returns the parsed profile", async () => {
    mockedPatch.mockResolvedValue({ data: meResponse });

    await expect(userService.updateProfile({ textToSpeech: true })).resolves.toEqual(meResponse);
    expect(mockedPatch).toHaveBeenCalledWith("/api/me/profile", { textToSpeech: true });
  });

  it("rejects with a ServiceError carrying the server message", async () => {
    mockedPatch.mockRejectedValue({
      statusCode: 400,
      serverError: { message: "Learning style not found" },
    });

    const error = await userService
      .updateProfile({ learningStyleId: "00000000-0000-4000-8000-000000000000" })
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ServiceError);
    expect(error).toMatchObject({ status: 400, message: "Learning style not found" });
  });
});
