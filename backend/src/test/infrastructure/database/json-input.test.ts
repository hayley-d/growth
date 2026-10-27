import { describe, expect, it } from "vitest";

import { Prisma } from "@/generated/prisma/client";
import { toJsonInput, toNullableJsonInput } from "@/infrastructure/database/json-input";

describe("toJsonInput", () => {
  it("passes a value through", () => {
    const value = { keys: [3, 1, 2] };
    expect(toJsonInput(value)).toBe(value);
  });

  it("stores null as a json null", () => {
    expect(toJsonInput(null)).toBe(Prisma.JsonNull);
  });
});

describe("toNullableJsonInput", () => {
  it("passes a value through", () => {
    expect(toNullableJsonInput([1, 2])).toEqual([1, 2]);
  });

  it("stores null as a database null", () => {
    expect(toNullableJsonInput(null)).toBe(Prisma.DbNull);
  });
});
