import { beforeEach, describe, expect, it, vi } from "vitest";

import { authClient } from "@/lib/auth-client";
import { authService } from "@/services/auth-service";
import { ServiceError } from "@/services/service-error";

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    getSession: vi.fn(),
    signIn: { email: vi.fn() },
    signUp: { email: vi.fn() },
    signOut: vi.fn(),
  },
}));

describe("getSession", () => {
  beforeEach(() => {
    vi.mocked(authClient.getSession).mockReset();
  });

  it("returns null when there is no session", async () => {
    vi.mocked(authClient.getSession).mockResolvedValue({ data: null, error: null });

    await expect(authService.getSession()).resolves.toBeNull();
  });

  it("rejects with a ServiceError when the request fails", async () => {
    vi.mocked(authClient.getSession).mockResolvedValue({
      data: null,
      error: { message: "Internal server error", status: 500 },
    });

    const error = await authService.getSession().catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ServiceError);
    expect(error).toMatchObject({ message: "Internal server error", status: 500 });
  });
});

describe("signInWithEmail", () => {
  beforeEach(() => {
    vi.mocked(authClient.signIn.email).mockReset();
  });

  it("throws the server message when sign in fails", async () => {
    vi.mocked(authClient.signIn.email).mockResolvedValue({
      data: null,
      error: { message: "Invalid credentials", status: 401 },
    });

    const error = await authService
      .signInWithEmail({ email: "test@example.com", password: "wrong" })
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ServiceError);
    expect(error).toMatchObject({ message: "Invalid credentials", status: 401 });
  });

  it("returns the data when sign in succeeds", async () => {
    vi.mocked(authClient.signIn.email).mockResolvedValue({ data: { token: "abc" }, error: null });

    await expect(
      authService.signInWithEmail({ email: "test@example.com", password: "correct" }),
    ).resolves.toEqual({ token: "abc" });
  });
});

describe("signUpWithEmail", () => {
  beforeEach(() => {
    vi.mocked(authClient.signUp.email).mockReset();
  });

  it("falls back to the email's local part when no name is given", async () => {
    vi.mocked(authClient.signUp.email).mockResolvedValue({ data: { user: {} }, error: null });

    await authService.signUpWithEmail({ email: "ada@example.com", password: "password123" });

    expect(authClient.signUp.email).toHaveBeenCalledWith({
      email: "ada@example.com",
      password: "password123",
      name: "ada",
    });
  });

  it("falls back to the email's local part when the name is only whitespace", async () => {
    vi.mocked(authClient.signUp.email).mockResolvedValue({ data: { user: {} }, error: null });

    await authService.signUpWithEmail({
      email: "ada@example.com",
      password: "password123",
      name: "   ",
    });

    expect(authClient.signUp.email).toHaveBeenCalledWith({
      email: "ada@example.com",
      password: "password123",
      name: "ada",
    });
  });

  it("trims surrounding whitespace from a given name", async () => {
    vi.mocked(authClient.signUp.email).mockResolvedValue({ data: { user: {} }, error: null });

    await authService.signUpWithEmail({
      email: "ada@example.com",
      password: "password123",
      name: "  Ada  ",
    });

    expect(authClient.signUp.email).toHaveBeenCalledWith({
      email: "ada@example.com",
      password: "password123",
      name: "Ada",
    });
  });

  it("uses the given name when provided", async () => {
    vi.mocked(authClient.signUp.email).mockResolvedValue({ data: { user: {} }, error: null });

    await authService.signUpWithEmail({
      email: "ada@example.com",
      password: "password123",
      name: "Ada",
    });

    expect(authClient.signUp.email).toHaveBeenCalledWith({
      email: "ada@example.com",
      password: "password123",
      name: "Ada",
    });
  });

  it("throws the server message when sign up fails", async () => {
    vi.mocked(authClient.signUp.email).mockResolvedValue({
      data: null,
      error: { message: "Email already in use", status: 409 },
    });

    const error = await authService
      .signUpWithEmail({ email: "ada@example.com", password: "password123" })
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ServiceError);
    expect(error).toMatchObject({ message: "Email already in use", status: 409 });
  });
});

describe("signOutUser", () => {
  it("throws the server message when sign out fails", async () => {
    vi.mocked(authClient.signOut).mockResolvedValue({
      error: { message: "Session expired", status: 401 },
    });

    await expect(authService.signOutUser()).rejects.toBeInstanceOf(ServiceError);
  });

  it("resolves when sign out succeeds", async () => {
    vi.mocked(authClient.signOut).mockResolvedValue({ error: null });

    await expect(authService.signOutUser()).resolves.toBeUndefined();
  });
});
