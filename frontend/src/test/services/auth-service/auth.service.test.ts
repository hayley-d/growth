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

  it("returns the parsed session", async () => {
    vi.mocked(authClient.getSession).mockResolvedValue({
      data: {
        user: { id: "user-1", name: "Ada", email: "ada@example.com", role: "student" },
        session: { id: "session-1", token: "secret", expiresAt: "2026-10-28T12:00:00.000Z" },
      },
      error: null,
    });

    const session = await authService.getSession();

    expect(session?.session).toEqual({
      id: "session-1",
      expiresAt: new Date("2026-10-28T12:00:00.000Z"),
    });
  });

  it("rejects a session in the wrong shape", async () => {
    vi.mocked(authClient.getSession).mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });

    await expect(authService.getSession()).rejects.toThrow("Incorrect data format");
  });

  it("falls back to a default message when the server sends an empty one", async () => {
    vi.mocked(authClient.getSession).mockResolvedValue({
      data: null,
      error: { message: "", status: 500 },
    });

    await expect(authService.getSession()).rejects.toThrow("Unable to fetch session");
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

  it("resolves with nothing when sign in succeeds", async () => {
    vi.mocked(authClient.signIn.email).mockResolvedValue({ data: { token: "abc" }, error: null });

    await expect(
      authService.signInWithEmail({ email: "test@example.com", password: "correct" }),
    ).resolves.toBeUndefined();
  });
});

describe("signUpWithEmail", () => {
  beforeEach(() => {
    vi.mocked(authClient.signUp.email).mockReset();
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
      .signUpWithEmail({ email: "ada@example.com", password: "password123", name: "Ada" })
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
