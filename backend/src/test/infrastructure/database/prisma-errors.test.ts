import { describe, expect, it } from "vitest";

import { BadRequestError, ConflictError, NotFoundError } from "@/domain/errors";
import { Prisma } from "@/generated/prisma/client";
import { translatePrismaError, withPrismaErrors } from "@/infrastructure/database/prisma-errors";

const createKnownError = (code: string, meta?: Record<string, unknown>) =>
  new Prisma.PrismaClientKnownRequestError("prisma failed", { code, meta, clientVersion: "test" });

describe("translatePrismaError", () => {
  it("turns a unique constraint failure into a conflict naming the fields", () => {
    expect(() => translatePrismaError(createKnownError("P2002", { target: ["email"] }))).toThrow(
      new ConflictError("A record already exists with email", { fields: ["email"] }),
    );
  });

  it("reads conflict fields from the driver adapter error", () => {
    const error = createKnownError("P2002", {
      driverAdapterError: { cause: { constraint: { fields: ["username"] } } },
    });
    expect(() => translatePrismaError(error)).toThrow("A record already exists with username");
  });

  it("turns a missing record into not found", () => {
    expect(() => translatePrismaError(createKnownError("P2025"))).toThrow(NotFoundError);
  });

  it("turns a foreign key failure into bad request", () => {
    expect(() => translatePrismaError(createKnownError("P2003"))).toThrow(BadRequestError);
  });

  it("rethrows anything else untouched", () => {
    const error = new Error("other");
    expect(() => translatePrismaError(error)).toThrow(error);
  });
});

describe("withPrismaErrors", () => {
  it("translates rejected actions", async () => {
    await expect(
      withPrismaErrors(() => Promise.reject(createKnownError("P2025"))),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("returns the result of successful actions", async () => {
    await expect(withPrismaErrors(() => Promise.resolve(42))).resolves.toBe(42);
  });
});
