import { beforeEach, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";

import { networkService } from "@/services/network.service";
import {
  buildLesson,
  kinestheticStyleId,
  learningStylesResponse,
  lessonFixtureId,
  visualStyleId,
} from "@/test/lesson-fixture";
import { renderApp } from "@/test/render-app";

vi.mock("@/services/network.service", () => ({
  networkService: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedGet = vi.mocked(networkService.get);
const mockedPut = vi.mocked(networkService.put);
const mockedPost = vi.mocked(networkService.post);

const lessonUrl = `/api/lessons/${lessonFixtureId}`;
const noteUrl = `${lessonUrl}/note`;
const lessonPath = `/lessons/${lessonFixtureId}`;

const serve = (lesson = buildLesson()) => {
  const responses: Record<string, unknown> = {
    [lessonUrl]: lesson,
    [noteUrl]: { data: { lessonId: lessonFixtureId, body: "Root first.", updatedAt: null } },
    "/api/learning-styles": learningStylesResponse,
  };
  mockedGet.mockImplementation(async (url: string) => {
    if (url in responses) return { data: responses[url] };
    throw { statusCode: 404, message: "Not found", serverError: { message: "Not found" } };
  });
};

beforeEach(async () => {
  await page.viewport(1280, 900);
  mockedGet.mockReset();
  mockedPut.mockReset();
  mockedPost.mockReset();
});

it("shows the header, the progress and the first step with its objectives", async () => {
  serve();
  const screen = await renderApp(lessonPath);

  await expect.element(screen.getByRole("heading", { name: "Pre-order", level: 1 })).toBeVisible();
  await expect.element(screen.getByText("Binary trees")).toBeVisible();
  await expect
    .element(screen.getByRole("progressbar", { name: "Lesson progress" }))
    .toHaveAttribute("aria-valuetext", "Step 1 of 3");
  await expect.element(screen.getByText("What you'll learn")).toBeVisible();
  await expect.element(screen.getByText("Trace a pre-order walk").first()).toBeVisible();
  await expect.element(screen.getByRole("heading", { name: "The rule" })).toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Back" })).toBeDisabled();
});

it("shows the learner's own style block and hides the others until asked", async () => {
  serve();
  const screen = await renderApp(lessonPath);

  await expect.element(screen.getByText("Picked for you")).toBeVisible();
  await expect.element(screen.getByText("For visual learners")).toBeVisible();
  await expect.element(screen.getByText("8 is the root")).toBeInTheDocument();
  await expect.element(screen.getByRole("button", { name: "node" })).toBeVisible();
  const toggle = screen.getByRole("button", { name: "Other ways to learn this (1)" });
  await expect.element(toggle).toHaveAttribute("aria-expanded", "false");
  expect(screen.container.textContent).not.toContain("Tap the nodes in pre-order.");

  (toggle.element() as HTMLElement).focus();
  await userEvent.keyboard("{Enter}");

  await expect.element(toggle).toHaveAttribute("aria-expanded", "true");
  await expect.element(screen.getByText("For kinesthetic learners")).toBeVisible();
  await expect.element(screen.getByText("Tap the nodes in pre-order.")).toBeVisible();
});

it("links words only to trees in the core and picked blocks", async () => {
  const lesson = buildLesson();
  const [first] = lesson.data.steps;
  if (first?.styleBlock) {
    first.otherBlocks = [
      ...first.otherBlocks,
      { ...first.styleBlock, learningStyleId: kinestheticStyleId },
    ];
    first.styleBlock = null;
  }
  serve(lesson);
  const screen = await renderApp(lessonPath);

  await screen.getByRole("button", { name: "Other ways to learn this (1)" }).click();
  await expect.element(screen.getByText("8 is the root")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "node" }).query()).toBeNull();
});

it("shows the visual block when none matches the learner's style", async () => {
  const lesson = buildLesson();
  const [first] = lesson.data.steps;
  if (first) {
    first.otherBlocks = [...first.otherBlocks, ...(first.styleBlock ? [first.styleBlock] : [])];
    first.styleBlock = null;
  }
  serve(lesson);
  const screen = await renderApp(lessonPath);

  await expect.element(screen.getByRole("heading", { name: "The rule" })).toBeVisible();
  expect(screen.container.textContent).not.toContain("Picked for you");
  await expect.element(screen.getByText("Another way to see it")).toBeVisible();
  await expect.element(screen.getByText("For visual learners")).toBeVisible();
  await expect.element(screen.getByRole("button", { name: "node" })).toBeVisible();
  await expect
    .element(screen.getByRole("button", { name: "Other ways to learn this (1)" }))
    .toBeVisible();
  expect(visualStyleId).toBeTruthy();
});

it("moves with Continue, Back and the arrow keys, and keeps the step in the address", async () => {
  serve();
  const screen = await renderApp(lessonPath);
  const progress = screen.getByRole("progressbar", { name: "Lesson progress" });

  await screen.getByRole("button", { name: "Continue" }).click();
  await expect.element(progress).toHaveAttribute("aria-valuetext", "Step 2 of 3");
  await expect.element(screen.getByRole("group", { name: "Step player" })).toBeVisible();

  await userEvent.keyboard("{ArrowLeft}");
  await expect.element(progress).toHaveAttribute("aria-valuetext", "Step 1 of 3");

  await userEvent.keyboard("{ArrowRight}");
  await expect.element(progress).toHaveAttribute("aria-valuetext", "Step 2 of 3");

  await screen.getByRole("button", { name: "Back" }).click();
  await expect.element(progress).toHaveAttribute("aria-valuetext", "Step 1 of 3");
});

it("opens on the step in the address", async () => {
  serve();
  const screen = await renderApp(`${lessonPath}?step=2`);

  await expect
    .element(screen.getByRole("progressbar", { name: "Lesson progress" }))
    .toHaveAttribute("aria-valuetext", "Step 2 of 3");
});

it("ends on the note step and saves what the learner types", async () => {
  serve();
  mockedPut.mockImplementation(async (_url: string, body: unknown) => ({
    data: {
      data: {
        lessonId: lessonFixtureId,
        body: (body as { body: string }).body,
        updatedAt: "2026-11-11T10:00:00.000Z",
      },
    },
  }));
  const screen = await renderApp(`${lessonPath}?step=3`);

  await expect
    .element(screen.getByRole("heading", { name: "Explain it in your own words" }))
    .toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Finish the lesson" })).toBeVisible();
  const textarea = screen.getByLabelText("How does pre-order pick the next node?");
  await expect.element(textarea).toHaveValue("Root first.");

  await textarea.fill("Root first, then left, then right.");
  await textarea.element().dispatchEvent(new FocusEvent("blur"));
  (textarea.element() as HTMLTextAreaElement).blur();

  await expect.element(screen.getByText("Saved")).toBeVisible();
  expect(mockedPut).toHaveBeenCalledWith(noteUrl, { body: "Root first, then left, then right." });
});

it("shows the end screen after the last step", async () => {
  serve();
  const screen = await renderApp(`${lessonPath}?step=3`);

  await screen.getByRole("button", { name: "Finish the lesson" }).click();

  await expect
    .element(screen.getByRole("heading", { name: "You finished Pre-order" }))
    .toBeVisible();
  await expect
    .element(screen.getByRole("progressbar", { name: "Lesson progress" }))
    .toHaveAttribute("aria-valuetext", "Lesson finished");
  await expect.element(screen.getByRole("link", { name: "Take the test" })).toBeVisible();
  await expect.element(screen.getByRole("link", { name: "Back to the map" })).toBeVisible();
  expect(screen.container.textContent).not.toContain("Continue");
});

it("skips the note step when the lesson has no prompt", async () => {
  serve(buildLesson({ notePrompt: null }));
  const screen = await renderApp(`${lessonPath}?step=2`);

  await expect
    .element(screen.getByRole("progressbar", { name: "Lesson progress" }))
    .toHaveAttribute("aria-valuetext", "Step 2 of 2");
  await expect.element(screen.getByRole("button", { name: "Finish the lesson" })).toBeVisible();
});

it("shows a loading state first", async () => {
  mockedGet.mockReturnValue(new Promise(() => undefined));
  const screen = await renderApp(lessonPath);

  await expect.element(screen.getByText("Loading...")).toBeVisible();
});

it("explains a locked lesson and offers the test", async () => {
  mockedGet.mockRejectedValue({
    statusCode: 403,
    message: "Request failed",
    serverError: { message: "Lesson is locked" },
  });
  const screen = await renderApp(lessonPath);

  await expect
    .element(screen.getByRole("heading", { name: "This lesson is locked", level: 1 }))
    .toBeVisible();
  await expect
    .element(screen.getByRole("link", { name: "Take the test to skip ahead" }))
    .toBeVisible();
});

it("shows the error and lets the learner try again", async () => {
  mockedGet.mockRejectedValueOnce({
    statusCode: 401,
    message: "Request failed",
    serverError: { message: "Unable to load the lesson" },
  });
  const screen = await renderApp(lessonPath);

  await expect.element(screen.getByRole("alert")).toHaveTextContent("Unable to load the lesson");
  serve();
  await screen.getByRole("button", { name: "Try again" }).click();

  await expect.element(screen.getByRole("heading", { name: "Pre-order", level: 1 })).toBeVisible();
});

it("hides Listen where the browser can't speak", async () => {
  serve();
  const screen = await renderApp(lessonPath);
  await expect.element(screen.getByRole("heading", { name: "The rule" })).toBeVisible();

  const supported = "speechSynthesis" in window;
  const listen = screen.getByRole("button", { name: "Listen" });
  if (supported) await expect.element(listen.first()).toBeVisible();
  else expect(listen.elements()).toHaveLength(0);
});

it("goes straight to the test from the last step of a checkpoint", async () => {
  serve(buildLesson({ kind: "checkpoint", notePrompt: null }));
  mockedPost.mockResolvedValue({
    data: {
      data: {
        attempt: {
          id: "20000000-0000-4000-8000-000000000001",
          lessonId: lessonFixtureId,
          kind: "lesson_test",
          topic: null,
          status: "in_progress",
          total: 5,
          answeredCount: 0,
          startedAt: "2026-11-11T10:00:00.000Z",
          finishedAt: null,
        },
        question: {
          id: "30000000-0000-4000-8000-000000000001",
          position: 1,
          type: "text",
          prompt: "Name the rotation.",
          tree: null,
          difficulty: 1,
          hints: [],
          hintsTotal: 3,
          hintsRemaining: 3,
        },
        result: null,
      },
    },
  });
  const screen = await renderApp(`${lessonPath}?step=2`);

  await expect.element(screen.getByRole("button", { name: "Take the test" })).toBeVisible();
  expect(screen.container.textContent).not.toContain("Finish the lesson");

  await screen.getByRole("button", { name: "Take the test" }).click();

  await vi.waitFor(() => expect(screen.router.state.location.pathname).toBe(`${lessonPath}/test`));
  await expect.element(screen.getByRole("heading", { name: "Test", level: 1 })).toBeVisible();
  await expect.element(screen.getByText("Question 1 of 5")).toBeVisible();
  await expect
    .element(screen.getByRole("button", { name: "Take the test" }))
    .not.toBeInTheDocument();
  expect(screen.container.textContent).not.toContain("You finished");
  expect(mockedPost).toHaveBeenCalledWith(`/api/lessons/${lessonFixtureId}/attempts`);
});
