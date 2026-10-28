import { describe, expect, it } from "vitest";

import { sessionResponseSchema, signUpRequestSchema } from "@shared/schemas/auth";

describe("signUpRequestSchema", () => {
  const signUp = { email: "ada@example.com", password: "password123", name: "Ada" };

  it("trims the display name", () => {
    expect(signUpRequestSchema.parse({ ...signUp, name: "  Ada  " }).name).toBe("Ada");
  });

  it("rejects a missing display name", () => {
    const { name, ...withoutName } = signUp;
    expect(signUpRequestSchema.safeParse(withoutName).success).toBe(false);
  });

  it("rejects a display name that is only spaces", () => {
    expect(signUpRequestSchema.safeParse({ ...signUp, name: "   " }).success).toBe(false);
  });
});

const session = {
  user: { id: "user-1", name: "Ada", email: "ada@example.com", role: "student" },
  session: { id: "session-1", expiresAt: "2026-10-28T12:00:00.000Z" },
};

describe("sessionResponseSchema", () => {
  it("accepts no session", () => {
    expect(sessionResponseSchema.parse(null)).toBeNull();
  });

  it("turns the expiry into a date", () => {
    expect(sessionResponseSchema.parse(session)?.session.expiresAt).toEqual(
      new Date("2026-10-28T12:00:00.000Z"),
    );
  });

  it("drops fields the app doesn't use", () => {
    const parsed = sessionResponseSchema.parse({
      ...session,
      user: { ...session.user, banned: false },
      session: { ...session.session, token: "secret" },
    });

    expect(parsed?.user).not.toHaveProperty("banned");
    expect(parsed?.session).not.toHaveProperty("token");
  });

  it("rejects a session with no user", () => {
    expect(sessionResponseSchema.safeParse({ session: session.session }).success).toBe(false);
  });
});
