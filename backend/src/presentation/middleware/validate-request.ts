import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

type RequestSchemas = {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
};

export const validateRequest =
  (schemas: RequestSchemas) => (request: Request, _response: Response, next: NextFunction) => {
    if (schemas.body) request.body = schemas.body.parse(request.body);
    if (schemas.params) request.params = schemas.params.parse(request.params) as Request["params"];
    if (schemas.query) {
      Object.defineProperty(request, "query", {
        value: schemas.query.parse(request.query),
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }
    next();
  };
