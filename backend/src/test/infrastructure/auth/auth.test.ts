import { afterEach, describe, expect, it } from "vitest";

import { authHandler, getSession } from "@/infrastructure/auth/auth";
import { environment } from "@/infrastructure/config/environment";
import { prismaClient } from "@/infrastructure/database/prisma-client";

const testEmail = "auth-integration-test@example.com";

afterEach(async () => {
  await prismaClient.user.deleteMany({ where: { email: testEmail } });
});

describe("auth", () => {
  it("signs up, then reads the session back with the default role", async () => {
    const signUpResponse = await authHandler(
      new Request(`${environment.BETTER_AUTH_URL}/api/auth/sign-up/email`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: testEmail, password: "password123", name: "Test User" }),
      }),
    );
    expect(signUpResponse.status).toBe(200);
    const setCookie = signUpResponse.headers.get("set-cookie");
    expect(setCookie).toBeTruthy();
    const cookie = setCookie?.split(";")[0] ?? "";

    const session = await getSession(new Headers({ cookie }));
    expect(session).not.toBeNull();
    expect(session?.role).toBe("student");
  });
});
