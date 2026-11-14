import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { page } from "vitest/browser";

import type { MeResponse } from "@shared/schemas";
import { applyColourScheme } from "@/lib/colour-schemes";
import { userQueryKeys } from "@/lib/queries";
import { queryClient } from "@/lib/query-client";
import { networkService } from "@/services/network.service";
import { useColourSchemeStore } from "@/stores/colour-scheme-store";
import { onboardedMe, renderApp } from "@/test/render-app";

vi.mock("@/services/network.service", () => ({
  networkService: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

const visualId = "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80";
const auditoryId = "2b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80";
const javaId = "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01";
const rustId = "9d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01";

const newMe: MeResponse = {
  data: {
    ...onboardedMe.data,
    profile: { ...onboardedMe.data.profile, onboardingComplete: false },
  },
};

const responses: Record<string, unknown> = {
  "/api/onboarding/quiz": {
    data: {
      questions: [1, 2].map((number) => ({
        id: `question-${number}`,
        prompt: `Question prompt ${number}`,
        options: ["a", "b", "c", "d"].map((id) => ({ id, text: `Option ${id} for ${number}` })),
      })),
    },
  },
  "/api/learning-styles": {
    data: {
      learningStyles: [
        { id: visualId, name: "Visual", description: "Diagrams and animations." },
        { id: auditoryId, name: "Auditory", description: "Listening." },
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

const scored = {
  data: {
    learningStyle: { id: visualId, name: "Visual", description: "Diagrams and animations." },
  },
};

const mockedGet = vi.mocked(networkService.get);
const mockedPost = vi.mocked(networkService.post);
const mockedPatch = vi.mocked(networkService.patch);

const completedMe = (body: unknown): MeResponse => ({
  data: {
    ...onboardedMe.data,
    profile: { ...onboardedMe.data.profile, ...(body as object), onboardingComplete: true },
  },
});

let stopApplying: () => void;

beforeEach(() => {
  useColourSchemeStore.setState({ colourScheme: "default" });
  stopApplying = useColourSchemeStore.subscribe((state) => applyColourScheme(state.colourScheme));
  mockedGet.mockReset();
  mockedPost.mockReset();
  mockedPatch.mockReset();
  let savedMe: MeResponse | undefined;
  mockedGet.mockImplementation(async (url) => ({
    data:
      url === "/api/me"
        ? (savedMe ?? queryClient.getQueryData(userQueryKeys.me))
        : responses[url as string],
  }));
  mockedPost.mockImplementation(async (url, body) => {
    if (url === "/api/onboarding/quiz") return { data: scored };
    savedMe = completedMe(body);
    return { data: savedMe };
  });
  mockedPatch.mockImplementation(async (_url, body) => {
    const current = savedMe ?? (queryClient.getQueryData(userQueryKeys.me) as MeResponse);
    savedMe = {
      data: { ...current.data, profile: { ...current.data.profile, ...(body as object) } },
    };
    return { data: savedMe };
  });
});

afterEach(() => {
  queryClient.setQueryDefaults(userQueryKeys.me, {});
  stopApplying();
  useColourSchemeStore.setState({ colourScheme: "default" });
  delete document.documentElement.dataset.colourScheme;
});

const heading = (name: string) => page.getByRole("heading", { name, level: 1 });

const skipColours = async () => {
  await expect.element(heading("Pick your colours")).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
};

const answerQuiz = async () => {
  await page.getByRole("button", { name: "Option a for 1" }).click();
  await page.getByRole("button", { name: "Option b for 2" }).click();
  await expect.element(page.getByRole("heading", { name: "Visual", level: 2 })).toBeVisible();
};

const answerEverything = async () => {
  await skipColours();
  await answerQuiz();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Rust" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "No, keep me off it" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Yes, show audio buttons" }).click();
};

describe("a learner who hasn't onboarded", () => {
  it.each(["/", "/learn", "/settings", "/playground"])(
    "is sent from %s to onboarding before anything else",
    async (path) => {
      await renderApp(path, { me: newMe });

      await expect.element(heading("Pick your colours")).toBeVisible();
      await expect.element(page.getByText("Step 1 of 5")).toBeVisible();
      await expect.element(page.getByText(/Let's set up your account/)).toBeVisible();
      await expect.element(page.getByRole("button", { name: "Back" })).not.toBeInTheDocument();
    },
  );

  it("shows no way into the app until onboarding is done, only signing out", async () => {
    await renderApp("/onboarding", { me: newMe });

    await expect.element(heading("Pick your colours")).toBeVisible();
    expect(page.getByRole("navigation", { name: "Main" }).query()).toBeNull();
    expect(page.getByRole("link", { name: "Dashboard" }).query()).toBeNull();
    await page.getByRole("button", { name: "Open user menu" }).click();
    await expect.element(page.getByRole("menuitem", { name: "Sign out" })).toBeVisible();
    expect(page.getByRole("menuitem", { name: "Settings" }).query()).toBeNull();
  });

  it("is sent from a retake link to the full onboarding", async () => {
    await renderApp("/onboarding?retake=true", { me: newMe });

    await expect.element(page.getByText("Step 1 of 5")).toBeVisible();
  });

  it("goes through every step, saves once and lands on the dashboard", async () => {
    await renderApp("/onboarding", { me: newMe });

    await answerEverything();
    expect(mockedPost).toHaveBeenCalledWith("/api/onboarding/quiz", {
      answers: [
        { questionId: "question-1", optionId: "a" },
        { questionId: "question-2", optionId: "b" },
      ],
    });
    expect(mockedPost).not.toHaveBeenCalledWith("/api/onboarding", expect.anything());
    await page.getByRole("button", { name: "Finish" }).click();

    await expect.element(heading("Dashboard")).toBeVisible();
    expect(mockedPost).toHaveBeenCalledWith("/api/onboarding", {
      learningStyleId: visualId,
      codeLanguageId: rustId,
      showOnLeaderboard: false,
      textToSpeech: true,
    });
    expect(mockedPatch).not.toHaveBeenCalled();
  });

  it("applies a picked colour scheme straight away and saves it to the profile", async () => {
    await renderApp("/onboarding", { me: newMe });

    await page.getByText("High contrast").click();

    await expect.element(page.getByRole("radio", { name: /High contrast/ })).toBeChecked();
    await expect.element(page.getByText(/Stronger text, borders and focus rings/)).toBeVisible();
    expect(document.documentElement.dataset.colourScheme).toBe("high-contrast");
    expect(mockedPatch).toHaveBeenCalledWith("/api/me/profile", { colourTheme: "high-contrast" });
    await expect.element(page.getByText("Saved")).toBeVisible();
    await page.getByRole("button", { name: "Next" }).click();
    await expect.element(heading("Find your learning style")).toBeVisible();
    await expect.element(page.getByText("Step 2 of 5")).toBeVisible();
  });

  it("shows sample tree nodes in every state, hidden from screen readers", async () => {
    await renderApp("/onboarding", { me: newMe });

    await expect.element(heading("Pick your colours")).toBeVisible();
    const tree = document.querySelector("main [aria-hidden='true'].relative");
    expect(tree?.querySelectorAll("svg circle").length).toBeGreaterThanOrEqual(5);
    expect(tree?.querySelectorAll("button").length).toBe(0);
    await expect
      .element(page.getByText("Teal, pink and lime, the standard Growth colours."))
      .toBeVisible();
  });

  it("can skip the colour step and keep the default scheme without saving", async () => {
    await renderApp("/onboarding", { me: newMe });

    await page.getByRole("button", { name: "Skip, keep the default" }).click();

    await expect.element(heading("Find your learning style")).toBeVisible();
    expect(useColourSchemeStore.getState().colourScheme).toBe("default");
    expect(mockedPatch).not.toHaveBeenCalled();
  });

  it("goes back to the default scheme when skipping after picking another", async () => {
    await renderApp("/onboarding", { me: newMe });

    await page.getByText("Colour-blind friendly").click();
    await expect.element(page.getByText("Saved")).toBeVisible();
    await page.getByRole("button", { name: "Skip, keep the default" }).click();

    await expect.element(heading("Find your learning style")).toBeVisible();
    expect(document.documentElement.dataset.colourScheme).toBe("default");
    expect(mockedPatch).toHaveBeenLastCalledWith("/api/me/profile", { colourTheme: "default" });
  });

  it("keeps the picked scheme on this device when the profile save fails", async () => {
    await renderApp("/onboarding", { me: newMe });
    mockedPatch.mockRejectedValueOnce({ statusCode: 500, serverError: { message: "Down" } });

    await page.getByText("High contrast").click();

    await expect.element(page.getByText(/still saved on this device/)).toBeVisible();
    expect(document.documentElement.dataset.colourScheme).toBe("high-contrast");
    await page.getByRole("button", { name: "Next" }).click();
    await expect.element(heading("Find your learning style")).toBeVisible();
  });

  it("saves a different style when the learner picks one on the result", async () => {
    await renderApp("/onboarding", { me: newMe });

    await skipColours();
    await answerQuiz();
    await page.getByRole("button", { name: "Auditory" }).click();
    await expect.element(page.getByText("The quiz suggested Visual.")).toBeVisible();
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: "Java" }).click();
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: "Yes, show me" }).click();
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: "No, hide them" }).click();
    await page.getByRole("button", { name: "Finish" }).click();

    await expect.element(heading("Dashboard")).toBeVisible();
    expect(mockedPost).toHaveBeenCalledWith(
      "/api/onboarding",
      expect.objectContaining({ learningStyleId: auditoryId }),
    );
  });

  it("keeps earlier answers when going back", async () => {
    await renderApp("/onboarding", { me: newMe });

    await answerEverything();
    await expect.element(page.getByText("Step 5 of 5")).toBeVisible();
    await page.getByRole("button", { name: "Back" }).click();
    await expect
      .element(page.getByRole("button", { name: "No, keep me off it" }))
      .toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Back" }).click();
    await expect
      .element(page.getByRole("button", { name: "Rust" }))
      .toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Back" }).click();
    await expect.element(page.getByRole("heading", { name: "Visual", level: 2 })).toBeVisible();
    await page.getByRole("button", { name: "Back" }).click();
    await expect
      .element(page.getByRole("button", { name: "Option b for 2" }))
      .toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Back" }).click();
    await expect.element(page.getByText("Question 1 of 2")).toBeVisible();
    await page.getByRole("button", { name: "Back" }).click();
    await expect.element(heading("Pick your colours")).toBeVisible();
    await expect.element(page.getByRole("radio", { name: /Default/ })).toBeChecked();
  });

  it("starts again after leaving halfway and saves nothing", async () => {
    const first = await renderApp("/onboarding", { me: newMe });

    await skipColours();
    await page.getByRole("button", { name: "Option c for 1" }).click();
    await expect.element(page.getByText("Question 2 of 2")).toBeVisible();
    await first.unmount();
    await renderApp("/onboarding", { me: newMe });

    await skipColours();
    await expect.element(page.getByText("Question 1 of 2")).toBeVisible();
    await expect
      .element(page.getByRole("button", { name: "Option c for 1" }))
      .toHaveAttribute("aria-pressed", "false");
    expect(mockedPost).not.toHaveBeenCalled();
    expect(mockedPatch).not.toHaveBeenCalled();
  });

  it("shows an inline error and keeps the answers when the final save fails", async () => {
    await renderApp("/onboarding", { me: newMe });
    await answerEverything();
    mockedPost.mockRejectedValueOnce({
      statusCode: 500,
      serverError: { message: "Unable to save your answers" },
    });

    await page.getByRole("button", { name: "Finish" }).click();

    await expect.element(page.getByText(/Your answers are still here/)).toBeVisible();
    await expect
      .element(page.getByRole("button", { name: "Yes, show audio buttons" }))
      .toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Finish" }).click();
    await expect.element(heading("Dashboard")).toBeVisible();
  });

  it("shows an inline error when the quiz can't be scored, and tries again", async () => {
    await renderApp("/onboarding", { me: newMe });
    mockedPost.mockRejectedValueOnce({
      statusCode: 500,
      serverError: { message: "Unable to work out your learning style" },
    });

    await skipColours();
    await page.getByRole("button", { name: "Option a for 1" }).click();
    await page.getByRole("button", { name: "Option b for 2" }).click();
    await expect.element(page.getByText("Unable to work out your learning style")).toBeVisible();
    await page.getByRole("button", { name: "Try again" }).click();

    await expect.element(page.getByRole("heading", { name: "Visual", level: 2 })).toBeVisible();
  });
});

describe("a learner who has onboarded", () => {
  it("is sent from onboarding to the dashboard", async () => {
    await renderApp("/onboarding");

    await expect.element(heading("Dashboard")).toBeVisible();
  });

  it("can cancel a retake and go back to settings", async () => {
    await renderApp("/onboarding?retake=true");

    await page.getByRole("link", { name: "Cancel" }).click();

    await expect.element(heading("Settings")).toBeVisible();
    expect(mockedPatch).not.toHaveBeenCalled();
  });

  it("reaches signed-in pages without being sent to onboarding", async () => {
    await renderApp("/learn");

    await expect.element(heading("Learn")).toBeVisible();
  });

  it("can retake the quiz and save only the learning style", async () => {
    await renderApp("/onboarding?retake=true");

    await expect.element(page.getByText("Retake the quiz")).toBeVisible();
    await expect.element(heading("Find your learning style")).toBeVisible();
    await expect.element(page.getByText(/Let's set up your account/)).not.toBeInTheDocument();
    await answerQuiz();
    await page.getByRole("button", { name: "Save" }).click();

    await expect.element(heading("Settings")).toBeVisible();
    expect(mockedPatch).toHaveBeenCalledWith("/api/me/profile", { learningStyleId: visualId });
    expect(mockedPost).not.toHaveBeenCalledWith("/api/onboarding", expect.anything());
  });
});

it("shows the error page, not onboarding, when the profile can't be loaded", async () => {
  queryClient.setQueryDefaults(userQueryKeys.me, { retry: false });
  mockedGet.mockImplementation(async (url) => {
    if (url === "/api/me") throw { statusCode: 503, serverError: { message: "Down" } };
    return { data: responses[url as string] };
  });

  await renderApp("/learn", { me: null });

  await expect.element(heading("Something went wrong")).toBeVisible();
  expect(page.getByText("Step 1 of 5").query()).toBeNull();
});

it("sends a signed out visitor from onboarding to the login page", async () => {
  await renderApp("/onboarding", { session: null, me: null });

  await expect.element(heading("Log in")).toBeVisible();
});

it("lets a signed out visitor use the playground without asking about onboarding", async () => {
  await renderApp("/playground", { session: null, me: null });

  await expect.element(page.getByText("Step 1 of 5")).not.toBeInTheDocument();
  expect(mockedGet).not.toHaveBeenCalledWith("/api/me");
});
