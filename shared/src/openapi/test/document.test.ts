import { describe, expect, it } from "vitest";
import { z } from "zod";

import { openApiDocument } from "@shared/openapi";
import { requestSchemas, responseSchemas } from "@shared/openapi/src/schema-components";

type Operation = {
  operationId: string;
  security?: unknown[];
  parameters?: { name: string; in: string }[];
  responses: Record<string, unknown>;
};

const operations = Object.entries(openApiDocument.paths).flatMap(([path, methods]) =>
  Object.entries(methods as Record<string, Operation>).map(([method, operation]) => ({
    path,
    method,
    operation,
  })),
);

const collectReferences = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.flatMap(collectReferences);
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      key === "$ref" && typeof child === "string" ? [child] : collectReferences(child),
    );
  }
  return [];
};

const resolves = (reference: string) => {
  const [, ...segments] = reference.slice(1).split("/");
  let current: unknown = openApiDocument;
  for (const segment of segments) {
    current = (current as Record<string, unknown> | undefined)?.[segment];
  }
  return current !== undefined;
};

const withoutStrictness = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(withoutStrictness);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== "additionalProperties")
        .map(([key, child]) => [key, withoutStrictness(child)]),
    );
  }
  return value;
};

describe("openApiDocument", () => {
  it("is an OpenAPI 3.1 document", () => {
    expect(openApiDocument.openapi).toBe("3.1.0");
  });

  it("documents the attempt endpoints", () => {
    const documented = operations.map(({ method, path }) => `${method} ${path}`);
    expect(documented).toEqual(
      expect.arrayContaining([
        "post /api/lessons/{id}/attempts",
        "get /api/attempts/{id}",
        "post /api/attempts/{id}/hints",
        "post /api/attempts/{id}/answers",
      ]),
    );
  });

  it("resolves every reference", () => {
    const references = collectReferences(openApiDocument);
    expect(references.length).toBeGreaterThan(0);
    expect(references.filter((reference) => !resolves(reference))).toEqual([]);
  });

  it("holds no JSON Schema leftovers that break inside OpenAPI", () => {
    const text = JSON.stringify(openApiDocument);
    expect(text).not.toContain("$defs");
    expect(text).not.toContain("__schema");
    expect(text).not.toContain("$schema");
    expect(text).not.toContain('"$id"');
  });

  it("gives every operation a unique id and a success response", () => {
    const identifiers = operations.map(({ operation }) => operation.operationId);
    expect(new Set(identifiers).size).toBe(identifiers.length);
    for (const { path, operation } of operations) {
      const statuses = Object.keys(operation.responses);
      expect(
        statuses.some((status) => status.startsWith("2")),
        path,
      ).toBe(true);
    }
  });

  it("declares every path parameter", () => {
    for (const { path, operation } of operations) {
      const names = [...path.matchAll(/\{(\w+)\}/g)].map((match) => match[1]);
      const declared = (operation.parameters ?? [])
        .filter((parameter) => parameter.in === "path")
        .map((parameter) => parameter.name);
      expect(declared.sort(), path).toEqual(names.sort());
    }
  });

  it("answers a signed out request on every secured endpoint", () => {
    const secured = operations.filter(
      ({ path, operation }) => operation.security && !path.startsWith("/api/auth/"),
    );
    expect(secured.length).toBeGreaterThan(0);
    for (const { path, operation } of secured) {
      expect(operation.responses, path).toHaveProperty("401");
    }
  });

  it("describes request and response schemas the same as input and output", () => {
    const options = { unrepresentable: "any" } as const;
    for (const [name, schema] of Object.entries({ ...requestSchemas, ...responseSchemas })) {
      expect(withoutStrictness(z.toJSONSchema(schema, { ...options, io: "input" })), name).toEqual(
        withoutStrictness(z.toJSONSchema(schema, { ...options, io: "output" })),
      );
    }
  });
});
