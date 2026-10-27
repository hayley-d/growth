import { describe, expect, it } from "vitest";

import { hasRole } from "@/domain/auth/user-role";

describe("hasRole", () => {
  it("matches a single role", () => {
    expect(hasRole("admin", "admin")).toBe(true);
    expect(hasRole("student", "admin")).toBe(false);
  });

  it("matches a role inside a comma-separated list", () => {
    expect(hasRole("admin,student", "admin")).toBe(true);
    expect(hasRole("student,admin", "admin")).toBe(true);
  });

  it("trims whitespace around each role", () => {
    expect(hasRole("admin, student", "student")).toBe(true);
  });

  it("returns false for null or undefined", () => {
    expect(hasRole(null, "admin")).toBe(false);
    expect(hasRole(undefined, "admin")).toBe(false);
  });

  it("returns false for an empty string", () => {
    expect(hasRole("", "admin")).toBe(false);
  });
});
