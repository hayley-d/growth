import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
  paginatedResponseSchema,
  paginationQuerySchema,
  toPaginatedResponse,
  toSkipTake,
} from "@shared/schemas/common";

describe("paginationQuerySchema", () => {
  it("fills in defaults", () => {
    expect(paginationQuerySchema.parse({})).toEqual({ page: 1, pageSize: 20 });
  });

  it("coerces strings from the query string", () => {
    expect(paginationQuerySchema.parse({ page: "2", pageSize: "50" })).toEqual({
      page: 2,
      pageSize: 50,
    });
  });

  it("rejects a page size over 100", () => {
    expect(paginationQuerySchema.safeParse({ pageSize: 101 }).success).toBe(false);
  });
});

describe("toSkipTake", () => {
  it("converts a page into skip and take", () => {
    expect(toSkipTake({ page: 3, pageSize: 20 })).toEqual({ skip: 40, take: 20 });
  });
});

describe("toPaginatedResponse", () => {
  it("builds a response that matches the schema", () => {
    const response = toPaginatedResponse(["a", "b"], 41, { page: 1, pageSize: 20 });
    expect(response.totalPages).toBe(3);
    expect(paginatedResponseSchema(z.string()).parse(response)).toEqual(response);
  });
});
