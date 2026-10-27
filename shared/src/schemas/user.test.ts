import { describe, expect, it } from "vitest";

import {
  createUserRequestSchema,
  updateUserRequestSchema,
  userResponseSchema,
} from "@shared/schemas/user";

const newUser = {
  firstName: "Ada",
  lastName: "Lovelace",
  displayName: "ada",
  email: "ada@example.com",
  password: "correct horse",
  learningStyleId: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
  codeLanguageId: "2c3d4e5f-6071-4829-8b3c-4d5e6f7a8b91",
};

describe("createUserRequestSchema", () => {
  it("fills in the default settings", () => {
    expect(createUserRequestSchema.parse(newUser)).toMatchObject({
      textToSpeech: false,
      colourTheme: "default",
      showOnLeaderboard: true,
    });
  });

  it("trims and lowercases the email", () => {
    expect(createUserRequestSchema.parse({ ...newUser, email: " Ada@Example.COM " }).email).toBe(
      "ada@example.com",
    );
  });

  it("rejects an email that isn't one", () => {
    expect(createUserRequestSchema.safeParse({ ...newUser, email: "not an email" }).success).toBe(
      false,
    );
  });

  it("rejects a short password", () => {
    expect(createUserRequestSchema.safeParse({ ...newUser, password: "short" }).success).toBe(
      false,
    );
  });
});

describe("updateUserRequestSchema", () => {
  it("leaves out fields that weren't sent", () => {
    expect(updateUserRequestSchema.parse({ displayName: "lovelace" })).toEqual({
      displayName: "lovelace",
    });
  });
});

describe("userResponseSchema", () => {
  it("strips the password hash", () => {
    const { password, ...user } = newUser;
    const response = userResponseSchema.parse({
      ...user,
      id: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
      passwordHash: "hash",
      textToSpeech: false,
      colourTheme: "okabe-ito",
      showOnLeaderboard: true,
      createdAt: "2026-10-26T00:00:00.000Z",
    });
    expect(response).not.toHaveProperty("passwordHash");
  });
});
