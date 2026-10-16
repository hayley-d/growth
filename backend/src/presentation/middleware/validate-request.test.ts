import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { paginationQuerySchema } from "@shared/schemas/common";
import { validateRequest } from "@/presentation/middleware/validate-request";

describe("validateRequest", () => {
  it("passes the parsed query to the handler", async () => {
    const application = express();
    application.get("/", validateRequest({ query: paginationQuerySchema }), (request, response) => {
      response.json(request.query);
    });

    const response = await request(application).get("/?page=3");
    expect(response.body).toEqual({ page: 3, pageSize: 20 });
  });
});
