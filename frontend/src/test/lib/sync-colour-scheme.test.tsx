import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { authQueryKeys } from "@/lib/queries/auth.queries";
import { queryClient } from "@/lib/query-client";
import { syncColourScheme } from "@/lib/sync-colour-scheme";
import { networkService } from "@/services/network.service";
import { useColourSchemeStore } from "@/stores/colour-scheme-store";

vi.mock("@/services/network.service", () => ({
  networkService: {
    get: vi.fn(),
  },
}));

const mockedGet = vi.mocked(networkService.get);

const session = (userId: string) => ({
  user: { id: userId, name: "Ada", email: "ada@example.com", role: "student" },
  session: { id: "session-1", expiresAt: new Date(Date.now() + 60_000) },
});

const meWith = (colourTheme: string) => ({
  data: {
    data: {
      user: { email: "ada@example.com", emailVerified: true, displayName: "Ada" },
      profile: {
        codeLanguageId: null,
        colourTheme,
        learningStyleId: null,
        onboardingComplete: true,
        showOnLeaderboard: true,
        textToSpeech: false,
      },
    },
  },
});

let stopSync: () => void;

beforeEach(() => {
  queryClient.clear();
  mockedGet.mockReset();
  useColourSchemeStore.setState({ colourScheme: "default" });
  stopSync = syncColourScheme();
});

afterEach(() => {
  stopSync();
  queryClient.clear();
  useColourSchemeStore.setState({ colourScheme: "default" });
  delete document.documentElement.dataset.colourScheme;
});

it("applies the profile's colour scheme over the local one on sign in", async () => {
  useColourSchemeStore.setState({ colourScheme: "okabe-ito" });
  mockedGet.mockResolvedValue(meWith("high-contrast"));

  queryClient.setQueryData(authQueryKeys.session, session("user-1"));

  await vi.waitFor(() =>
    expect(document.documentElement.dataset.colourScheme).toBe("high-contrast"),
  );
  expect(useColourSchemeStore.getState().colourScheme).toBe("high-contrast");
  expect(mockedGet).toHaveBeenCalledWith("/api/me");
});

it("keeps the local colour scheme when signed out or the profile can't load", async () => {
  useColourSchemeStore.setState({ colourScheme: "okabe-ito" });
  mockedGet.mockRejectedValue({ statusCode: 500 });

  queryClient.setQueryData(authQueryKeys.session, null);
  queryClient.setQueryData(authQueryKeys.session, session("user-1"));

  await vi.waitFor(() => expect(mockedGet).toHaveBeenCalled());
  expect(useColourSchemeStore.getState().colourScheme).toBe("okabe-ito");
});

it("loads the profile again only when a different learner signs in", async () => {
  mockedGet.mockResolvedValue(meWith("high-contrast"));

  queryClient.setQueryData(authQueryKeys.session, session("user-1"));
  await vi.waitFor(() => expect(mockedGet).toHaveBeenCalledTimes(1));
  useColourSchemeStore.setState({ colourScheme: "default" });
  queryClient.setQueryData(authQueryKeys.session, session("user-1"));
  expect(mockedGet).toHaveBeenCalledTimes(1);
  expect(useColourSchemeStore.getState().colourScheme).toBe("default");

  queryClient.setQueryData(authQueryKeys.session, session("user-2"));
  await vi.waitFor(() => expect(mockedGet).toHaveBeenCalledTimes(2));
});
