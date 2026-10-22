import { Hono } from "hono";
import { describe, expect, it } from "vitest";

import { paginationQuerySchema } from "@shared/schemas/common";
import { validate } from "@/presentation/middleware/validate-request";

describe("validate", () => {
  it("passes the parsed query to the handler", async () => {
    const application = new Hono().get("/", validate("query", paginationQuerySchema), (context) =>
      context.json(context.req.valid("query")),
    );

    const response = await application.request("/?page=3");
    expect(await response.json()).toEqual({ page: 3, pageSize: 20 });
  });

  it("throws the zod error for invalid input", async () => {
    const application = new Hono()
      .get("/", validate("query", paginationQuerySchema), (context) => context.json({}))
      .onError((error, context) => context.json({ name: error.name }, 400));

    const response = await application.request("/?page=0");
    expect(await response.json()).toEqual({ name: "ZodError" });
  });
});
