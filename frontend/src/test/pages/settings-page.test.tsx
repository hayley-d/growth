import { afterEach, beforeEach, expect, it } from "vitest";

import { syncColourScheme } from "@/lib/sync-colour-scheme";
import { useColourSchemeStore } from "@/stores/colour-scheme-store";
import { renderApp } from "@/test/render-app";

let stopSync: () => void;

beforeEach(() => {
  useColourSchemeStore.setState({ colourScheme: "default" });
  stopSync = syncColourScheme();
});

afterEach(() => {
  stopSync();
  useColourSchemeStore.setState({ colourScheme: "default" });
  delete document.documentElement.dataset.colourScheme;
});

it("changes the colour scheme for the whole app", async () => {
  const screen = await renderApp("/settings");

  await expect.element(screen.getByRole("heading", { name: "Settings", level: 1 })).toBeVisible();
  await expect.element(screen.getByRole("radio", { name: /Default/ })).toBeChecked();

  await screen.getByText("High contrast").click();

  await expect.element(screen.getByRole("radio", { name: /High contrast/ })).toBeChecked();
  expect(document.documentElement.dataset.colourScheme).toBe("high-contrast");
});
