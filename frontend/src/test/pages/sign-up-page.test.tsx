import { expect, it, vi } from "vitest";

import { authClient } from "@/lib/auth-client";
import { mockSession, mockUser, renderApp } from "@/test/render-app";

it("shows an error when sign up fails", async () => {
  vi.mocked(authClient.signUp.email).mockResolvedValue({
    data: null,
    error: { message: "Email already in use" },
  });

  const screen = await renderApp("/sign-up", { session: null });

  await screen.getByLabelText("Email").fill("test@example.com");
  await screen.getByLabelText("Password").fill("password123");
  await screen.getByRole("button", { name: "Sign up" }).click();

  await expect.element(screen.getByText("Email already in use")).toBeVisible();
});

it("goes to the dashboard after a successful sign up", async () => {
  vi.mocked(authClient.signUp.email).mockImplementation(async () => {
    vi.mocked(authClient.getSession).mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    });
    return { data: { token: "test-token" }, error: null };
  });

  const screen = await renderApp("/sign-up", { session: null });

  await screen.getByLabelText("Email").fill("test@example.com");
  await screen.getByLabelText("Password").fill("password123");
  await screen.getByRole("button", { name: "Sign up" }).click();

  await expect.element(screen.getByRole("heading", { name: "Dashboard", level: 1 })).toBeVisible();
});
