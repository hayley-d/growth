import {
  type ErrorResponseName,
  type OperationSpec,
  operations,
  tags,
} from "@shared/openapi/src/operations";
import {
  buildSchemaComponents,
  type JsonObject,
  type SchemaName,
} from "@shared/openapi/src/schema-components";

const jsonContent = (name: SchemaName | "ErrorResponse") => ({
  "application/json": { schema: { $ref: `#/components/schemas/${name}` } },
});

const errorDescriptions: Record<ErrorResponseName, string> = {
  BadRequest: "The request is invalid. The body has `issues` when it failed validation.",
  Unauthorized: "Nobody is signed in.",
  Forbidden: "Signed in, but not allowed. For a lesson, it is locked.",
  NotFound: "It does not exist, or it belongs to someone else.",
  Conflict: "The request clashes with the current state.",
};

const errorResponses = Object.fromEntries(
  Object.entries(errorDescriptions).map(([name, description]) => [
    name,
    { description, content: jsonContent("ErrorResponse") },
  ]),
);

const toResponses = (responses: OperationSpec["responses"]): JsonObject =>
  Object.fromEntries(
    Object.entries(responses).map(([status, response]) => [
      status,
      typeof response === "string"
        ? { $ref: `#/components/responses/${response}` }
        : {
            description: response.description,
            ...(response.schema ? { content: jsonContent(response.schema) } : {}),
          },
    ]),
  );

const toOperation = (operation: OperationSpec): JsonObject => ({
  operationId: operation.operationId,
  tags: [operation.tag],
  summary: operation.summary,
  ...(operation.description ? { description: operation.description } : {}),
  ...(operation.secured ? { security: [{ sessionCookie: [] }] } : {}),
  ...(operation.parameters ? { parameters: operation.parameters } : {}),
  ...(operation.requestBody
    ? { requestBody: { required: true, content: jsonContent(operation.requestBody) } }
    : {}),
  responses: toResponses(operation.responses),
});

const buildPaths = (): Record<string, JsonObject> => {
  const paths: Record<string, JsonObject> = {};
  for (const operation of operations) {
    paths[operation.path] = {
      ...paths[operation.path],
      [operation.method]: toOperation(operation),
    };
  }
  return paths;
};

export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Growth API",
    version: "1.0.0",
    description:
      "The Growth backend. Every success body is wrapped in `data`, and every error has a `message` and a `requestId`. Signed-in endpoints read the session cookie that Better Auth sets.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local backend. The frontend proxies /api to it.",
    },
  ],
  tags,
  paths: buildPaths(),
  components: {
    securitySchemes: {
      sessionCookie: {
        type: "apiKey",
        in: "cookie",
        name: "better-auth.session_token",
        description: "Set by sign in and sign up.",
      },
    },
    schemas: buildSchemaComponents(),
    responses: errorResponses,
  },
};
