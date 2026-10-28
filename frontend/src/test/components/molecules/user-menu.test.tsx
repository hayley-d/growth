import { expect, it, vi } from "vitest";

import { authClient } from "@/lib/auth-client";
import { renderApp } from "@/test/render-app";

it("keeps the menu open and shows the error when sign out fails", async () => {
  const screen = await renderApp("/");
  vi.mocked(authClient.signOut).mockResolvedValue({
    data: null,
    error: { message: "Unable to reach the server", status: 503 },
  });

  await screen.getByRole("button", { name: "Open user menu" }).click();
  await screen.getByRole("menuitem", { name: "Sign out" }).click();

  await expect.element(screen.getByText("Unable to reach the server")).toBeVisible();
  await expect.element(screen.getByRole("menu")).toHaveAttribute("data-state", "open");
});
