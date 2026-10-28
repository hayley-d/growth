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

  it("reads the conflicting field from the unique index name", () => {
    const error = createKnownError("P2002", {
      driverAdapterError: {
        cause: { constraint: { index: "learningStyle_name_key" }, table: "learningStyle" },
      },
    });
    expect(() => translatePrismaError(error)).toThrow(
      new ConflictError("A record already exists with name", { fields: ["name"] }),
    );
  });

  it("falls back to a general conflict when the index name can't be read", () => {
    const error = createKnownError("P2002", {
      driverAdapterError: { cause: { constraint: { index: "custom_index" }, table: "user" } },
    });
    expect(() => translatePrismaError(error)).toThrow("A record with these values already exists");
  });

  it("turns a missing record into not found", () => {
    expect(() => translatePrismaError(createKnownError("P2025"))).toThrow(NotFoundError);
  });

  it("turns a missing related record into bad request", () => {
    const error = createKnownError("P2003", {
      driverAdapterError: {
        cause: {
          originalMessage:
            'insert or update on table "userProfile" violates foreign key constraint "userProfile_learningStyleId_fkey"',
        },
      },
    });
    expect(() => translatePrismaError(error)).toThrow(
      new BadRequestError("A related record does not exist"),
    );
  });

  it("turns deleting a record that is still in use into a conflict", () => {
    const error = createKnownError("P2003", {
      driverAdapterError: {
        cause: {
          originalMessage:
            'update or delete on table "learningStyle" violates foreign key constraint "userProfile_learningStyleId_fkey" on table "userProfile"',
        },
      },
    });
    expect(() => translatePrismaError(error)).toThrow(
      new ConflictError("This record is still used by another record"),
    );
  });

  it("turns a missing required value into bad request", () => {
    expect(() => translatePrismaError(createKnownError("P2011"))).toThrow(
      new BadRequestError("A required value is missing"),
    );
  });

  it("turns a check constraint failure into bad request naming the constraint", () => {
    const error = createKnownError("P2039", {
      driverAdapterError: {
        cause: {
          originalCode: "23514",
          originalMessage:
            'new row for relation "user" violates check constraint "user_display_name_check"',
        },
      },
    });
    expect(() => translatePrismaError(error)).toThrow(
      new BadRequestError("A value is outside its allowed range", {
        constraint: "user_display_name_check",
      }),
    );
  });

  it("rethrows other database errors", () => {
    const error = createKnownError("P2039", {
      driverAdapterError: { cause: { originalCode: "53100", originalMessage: "disk full" } },
    });
    expect(() => translatePrismaError(error)).toThrow(error);
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
