import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { MeResponse } from "@shared/schemas";
import { authClient } from "@/lib/auth-client";
import { syncColourScheme } from "@/lib/sync-colour-scheme";
import { networkService } from "@/services/network.service";
import { useColourSchemeStore } from "@/stores/colour-scheme-store";
import { renderApp } from "@/test/render-app";

vi.mock("@/services/network.service", () => ({
  networkService: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

const visualId = "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80";
const auditoryId = "2b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80";
const javaId = "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01";
const rustId = "9d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01";

const profile: MeResponse["data"]["profile"] = {
  codeLanguageId: javaId,
  colourTheme: "default",
  learningStyleId: visualId,
  onboardingComplete: true,
  showOnLeaderboard: true,
  textToSpeech: false,
};

const meFor = (changes: Partial<typeof profile> = {}) => ({
  data: {
    user: { email: "test@example.com", emailVerified: true, displayName: "Test User" },
    profile: { ...profile, ...changes },
  },
});

const responses: Record<string, unknown> = {
  "/api/learning-styles": {
    data: {
      learningStyles: [
        { id: visualId, name: "Visual", description: "Pictures" },
        { id: auditoryId, name: "Auditory", description: "Sound" },
      ],
    },
  },
  "/api/code-languages": {
    data: {
      codeLanguages: [
        { id: javaId, code: "java", name: "Java" },
        { id: rustId, code: "rust", name: "Rust" },
      ],
    },
  },
};

const mockedGet = vi.mocked(networkService.get);
const mockedPatch = vi.mocked(networkService.patch);

const serveMe = (me: ReturnType<typeof meFor>) => {
  mockedGet.mockImplementation(async (url) => ({
    data: url === "/api/me" ? me : responses[url as string],
  }));
};

const saveSucceeds = () => {
  mockedPatch.mockImplementation(async (_url, changes) => ({
    data: meFor(changes as Partial<typeof profile>),
  }));
};

const saveFails = () => {
  mockedPatch.mockRejectedValue({
    statusCode: 500,
    serverError: { message: "Unable to save your settings" },
  });
};

let stopSync: () => void;

beforeEach(() => {
  mockedGet.mockReset();
  mockedPatch.mockReset();
  vi.mocked(authClient.updateUser).mockReset();
  serveMe(meFor());
  saveSucceeds();
  useColourSchemeStore.setState({ colourScheme: "default" });
  stopSync = syncColourScheme();
});

afterEach(() => {
  stopSync();
  useColourSchemeStore.setState({ colourScheme: "default" });
  delete document.documentElement.dataset.colourScheme;
});

describe("signed out", () => {
  it("changes the colour scheme on this device only and hides the profile settings", async () => {
    const screen = await renderApp("/settings", { session: null });

    await expect.element(screen.getByRole("heading", { name: "Settings", level: 1 })).toBeVisible();
    await expect.element(screen.getByRole("radio", { name: /Default/ })).toBeChecked();

    await screen.getByText("High contrast").click();

    await expect.element(screen.getByRole("radio", { name: /High contrast/ })).toBeChecked();
    expect(document.documentElement.dataset.colourScheme).toBe("high-contrast");
    await expect.element(screen.getByRole("link", { name: "Log in" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Display name" }).elements()).toHaveLength(0);
    expect(mockedGet).not.toHaveBeenCalledWith("/api/me");
    expect(mockedPatch).not.toHaveBeenCalled();
  });
});

describe("signed in", () => {
  it("shows the saved profile", async () => {
    const screen = await renderApp("/settings");

    await expect
      .element(screen.getByRole("textbox", { name: "Display name" }))
      .toHaveValue("Test User");
    await expect
      .element(screen.getByRole("combobox", { name: "Learning style" }))
      .toHaveValue(visualId);
    await expect
      .element(screen.getByRole("combobox", { name: "Code language" }))
      .toHaveValue(javaId);
    await expect
      .element(screen.getByRole("checkbox", { name: /Read lessons aloud/ }))
      .not.toBeChecked();
    await expect
      .element(screen.getByRole("checkbox", { name: /Show me on the leaderboard/ }))
      .toBeChecked();
    await expect
      .element(screen.getByRole("link", { name: /Retake the quiz/ }))
      .toHaveAttribute("href", "/onboarding?retake=true");
  });

  it("saves the colour scheme to the profile as well as this device", async () => {
    const screen = await renderApp("/settings");

    await screen.getByText("Colour-blind friendly").click();

    await expect.element(screen.getByText("Saved")).toBeVisible();
    expect(mockedPatch).toHaveBeenCalledWith("/api/me/profile", { colourTheme: "okabe-ito" });
    expect(document.documentElement.dataset.colourScheme).toBe("okabe-ito");
  });

  it("keeps the colour scheme on this device when the profile save fails", async () => {
    saveFails();
    const screen = await renderApp("/settings");

    await screen.getByText("High contrast").click();

    await expect
      .element(screen.getByText(/Unable to save your settings. It's still saved on this device./))
      .toBeVisible();
    await expect.element(screen.getByRole("radio", { name: /High contrast/ })).toBeChecked();
  });

  it.each([
    ["Learning style", auditoryId, { learningStyleId: auditoryId }],
    ["Code language", rustId, { codeLanguageId: rustId }],
  ])("saves the %s", async (label, value, changes) => {
    const screen = await renderApp("/settings");

    await screen.getByRole("combobox", { name: label }).selectOptions(value);

    await expect.element(screen.getByText("Saved")).toBeVisible();
    await expect.element(screen.getByRole("combobox", { name: label })).toHaveValue(value);
    expect(mockedPatch).toHaveBeenCalledWith("/api/me/profile", changes);
  });

  it.each([
    ["Read lessons aloud", { textToSpeech: true }],
    ["Show me on the leaderboard", { showOnLeaderboard: false }],
  ])("saves the %s toggle", async (label, changes) => {
    const screen = await renderApp("/settings");

    await screen.getByRole("checkbox", { name: new RegExp(label) }).click();

    await expect.element(screen.getByText("Saved")).toBeVisible();
    expect(mockedPatch).toHaveBeenCalledWith("/api/me/profile", changes);
  });

  it("shows an inline error and the saved value when a save fails", async () => {
    saveFails();
    const screen = await renderApp("/settings");

    await screen.getByRole("checkbox", { name: /Read lessons aloud/ }).click();

    await expect.element(screen.getByText("Unable to save your settings")).toBeVisible();
    await expect
      .element(screen.getByRole("checkbox", { name: /Read lessons aloud/ }))
      .not.toBeChecked();
    expect(screen.getByText("Saved").elements()).toHaveLength(0);
  });

  it("asks for a learning style and code language when none is chosen yet", async () => {
    serveMe(meFor({ learningStyleId: null, codeLanguageId: null }));
    const screen = await renderApp("/settings");

    await expect.element(screen.getByRole("combobox", { name: "Learning style" })).toHaveValue("");
    await expect.element(screen.getByRole("combobox", { name: "Code language" })).toHaveValue("");
    expect(screen.getByRole("option", { name: "Not chosen yet" }).elements()).toHaveLength(2);

    await screen.getByRole("combobox", { name: "Learning style" }).selectOptions(visualId);

    expect(mockedPatch).toHaveBeenCalledWith("/api/me/profile", { learningStyleId: visualId });
  });

  it("saves a new display name", async () => {
    vi.mocked(authClient.updateUser).mockResolvedValue({ data: { status: true }, error: null });
    const screen = await renderApp("/settings");

    await screen.getByRole("textbox", { name: "Display name" }).fill("  Ada Lovelace ");
    await screen.getByRole("button", { name: "Save name" }).click();

    await expect.element(screen.getByText("Saved")).toBeVisible();
    expect(authClient.updateUser).toHaveBeenCalledWith({ name: "Ada Lovelace" });
  });

  it("does not save a display name that fails validation", async () => {
    const screen = await renderApp("/settings");

    await screen.getByRole("textbox", { name: "Display name" }).fill("   ");
    await screen.getByRole("button", { name: "Save name" }).click();

    await expect.element(screen.getByText("Display name is required")).toBeVisible();
    expect(authClient.updateUser).not.toHaveBeenCalled();
  });

  it("shows an inline error when the display name save fails", async () => {
    vi.mocked(authClient.updateUser).mockResolvedValue({
      data: null,
      error: { message: "Name is too long", status: 400, statusText: "Bad Request" },
    });
    const screen = await renderApp("/settings");

    await screen.getByRole("textbox", { name: "Display name" }).fill("Ada");
    await screen.getByRole("button", { name: "Save name" }).click();

    await expect.element(screen.getByText("Name is too long")).toBeVisible();
  });

  it("offers to try again when the profile options can't be loaded", async () => {
    mockedGet.mockImplementation(async (url) => {
      if (url === "/api/me") return { data: meFor() };
      throw { statusCode: 500 };
    });
    const screen = await renderApp("/settings");

    await expect
      .element(screen.getByText(/Your profile settings couldn't be loaded/), { timeout: 10_000 })
      .toBeVisible();
    await expect.element(screen.getByRole("button", { name: "Try again" })).toBeVisible();
    await expect.element(screen.getByRole("radio", { name: /Default/ })).toBeChecked();
  });
});
