import { expect, it, vi } from "vitest";

import { authClient } from "@/lib/auth-client";
import { mockSession, mockUser, renderApp } from "@/test/render-app";

it("shows an error when sign in fails", async () => {
  vi.mocked(authClient.signIn.email).mockResolvedValue({
    data: null,
    error: { message: "Invalid credentials" },
  });

  const screen = await renderApp("/login", { session: null });

  await screen.getByLabelText("Email").fill("test@example.com");
  await screen.getByLabelText("Password").fill("wrong-password");
  await screen.getByRole("button", { name: "Log in" }).click();

  await expect.element(screen.getByText("Invalid credentials")).toBeVisible();
});

it("goes to the dashboard after a successful log in", async () => {
  vi.mocked(authClient.signIn.email).mockImplementation(async () => {
    vi.mocked(authClient.getSession).mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    });
    return { data: { token: "test-token" }, error: null };
  });

  const screen = await renderApp("/login", { session: null });

  await screen.getByLabelText("Email").fill("test@example.com");
  await screen.getByLabelText("Password").fill("password123");
  await screen.getByRole("button", { name: "Log in" }).click();

  await expect.element(screen.getByRole("heading", { name: "Dashboard", level: 1 })).toBeVisible();
});
