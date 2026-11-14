import { beforeEach, expect, it, vi } from "vitest";
import { page } from "vitest/browser";

import { networkService } from "@/services/network.service";
import { renderApp } from "@/test/render-app";

vi.mock("@/services/network.service", () => ({
  networkService: {
    get: vi.fn(),
  },
}));

const mockedGet = vi.mocked(networkService.get);

const board = {
  data: {
    top: [
      { rank: 1, displayName: "Ada", timeSeconds: 90, isMe: false },
      { rank: 1, displayName: "Bea", timeSeconds: 90, isMe: true },
    ],
    me: { displayName: "Bea", rank: 1, timeSeconds: 90, hidden: false },
  },
};

beforeEach(async () => {
  await page.viewport(1280, 800);
  mockedGet.mockReset();
});

it("shows a loading state first", async () => {
  mockedGet.mockReturnValue(new Promise(() => undefined));
  const screen = await renderApp("/leaderboard");

  await expect.element(screen.getByText("Loading...")).toBeVisible();
});

it("shows the error and lets the learner try again", async () => {
  mockedGet.mockRejectedValueOnce({
    statusCode: 401,
    message: "Request failed",
    serverError: { message: "Unable to load the leaderboard" },
  });
  mockedGet.mockResolvedValue({ data: board });
  const screen = await renderApp("/leaderboard");

  await expect
    .element(screen.getByRole("alert"))
    .toHaveTextContent("Unable to load the leaderboard");
  await screen.getByRole("button", { name: "Try again" }).click();

  await expect.element(screen.getByRole("cell", { name: "Ada" })).toBeVisible();
});

it("shows an empty state when nobody has finished", async () => {
  mockedGet.mockResolvedValue({ data: { data: { top: [], me: null } } });
  const screen = await renderApp("/leaderboard");

  await expect
    .element(screen.getByRole("heading", { name: "Leaderboard", level: 1 }))
    .toBeVisible();
  await expect
    .element(screen.getByText("Today's daily challenge, ranked since midnight."))
    .toBeVisible();
  await expect.element(screen.getByText("Nobody has finished today's challenge yet")).toBeVisible();
  await expect
    .element(screen.getByRole("link", { name: "Take today's challenge" }))
    .toHaveAttribute("href", "/daily");
});

it("links to today's challenge when the learner has not finished", async () => {
  mockedGet.mockResolvedValue({
    data: {
      data: {
        top: [{ rank: 1, displayName: "Ada", timeSeconds: 90, isMe: false }],
        me: null,
      },
    },
  });
  const screen = await renderApp("/leaderboard");

  await expect
    .element(screen.getByRole("link", { name: "Take today's challenge to get on the board" }))
    .toHaveAttribute("href", "/daily");
  await expect.element(screen.getByRole("cell", { name: "Ada" })).toBeVisible();
});

it("shows the ranked list", async () => {
  mockedGet.mockResolvedValue({ data: board });
  const screen = await renderApp("/leaderboard");

  await expect
    .element(screen.getByRole("heading", { name: "Leaderboard", level: 1 }))
    .toBeVisible();
  await expect.element(screen.getByRole("cell", { name: "Ada" })).toBeVisible();
  await expect.element(screen.getByRole("cell", { name: /Bea/ }).getByText("You")).toBeVisible();
});
