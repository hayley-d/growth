import { z } from "zod";

import {
  algorithmParamsSchema,
  algorithmSnippetQuerySchema,
  algorithmSnippetResponseSchema,
  attemptQuestionSchema,
  attemptResultSchema,
  attemptSchema,
  attemptStateResponseSchema,
  errorResponseSchema,
  expressionNodeSchema,
  healthSchema,
  idParamSchema,
  learnerAnswerSchema,
  learningPathResponseSchema,
  lessonNoteResponseSchema,
  lessonResponseSchema,
  listAlgorithmsResponseSchema,
  listCodeLanguagesResponseSchema,
  listLearningStylesResponseSchema,
  meResponseSchema,
  requestHintRequestSchema,
  requestHintResponseSchema,
  saveLessonNoteRequestSchema,
  sessionResponseSchema,
  signInRequestSchema,
  signUpRequestSchema,
  submitAnswerRequestSchema,
  submitAnswerResponseSchema,
  updateUserProfileRequestSchema,
} from "@shared/schemas";

export type JsonObject = Record<string, unknown>;

export const requestSchemas = {
  SignInRequest: signInRequestSchema,
  SignUpRequest: signUpRequestSchema,
  UpdateUserProfileRequest: updateUserProfileRequestSchema,
  SaveLessonNoteRequest: saveLessonNoteRequestSchema,
  RequestHintRequest: requestHintRequestSchema,
  SubmitAnswerRequest: submitAnswerRequestSchema,
};

export const responseSchemas = {
  ErrorResponse: errorResponseSchema,
  Health: healthSchema,
  Session: sessionResponseSchema,
  ListAlgorithmsResponse: listAlgorithmsResponseSchema,
  AlgorithmSnippetResponse: algorithmSnippetResponseSchema,
  ListLearningStylesResponse: listLearningStylesResponseSchema,
  ListCodeLanguagesResponse: listCodeLanguagesResponseSchema,
  MeResponse: meResponseSchema,
  LearningPathResponse: learningPathResponseSchema,
  LessonResponse: lessonResponseSchema,
  LessonNoteResponse: lessonNoteResponseSchema,
  Attempt: attemptSchema,
  AttemptQuestion: attemptQuestionSchema,
  AttemptResult: attemptResultSchema,
  AttemptStateResponse: attemptStateResponseSchema,
  RequestHintResponse: requestHintResponseSchema,
  SubmitAnswerResponse: submitAnswerResponseSchema,
};

const sharedSchemas = {
  LearnerAnswer: learnerAnswerSchema,
  ExpressionNode: expressionNodeSchema,
};

export type SchemaName = keyof typeof requestSchemas | keyof typeof responseSchemas;

const toJsonSchemaOptions = { unrepresentable: "any" } as const;

const withoutDialect = (schema: unknown): JsonObject => {
  const { $schema: _dialect, $id: _identifier, ...rest } = schema as JsonObject;
  return rest;
};

export const buildSchemaComponents = (): Record<string, JsonObject> => {
  const registry = z.registry<{ id: string }>();
  for (const [id, schema] of Object.entries({
    ...requestSchemas,
    ...responseSchemas,
    ...sharedSchemas,
  })) {
    registry.add(schema, { id });
  }
  const { schemas } = z.toJSONSchema(registry, {
    ...toJsonSchemaOptions,
    io: "input",
    uri: (id) => `#/components/schemas/${id}`,
  });
  return Object.fromEntries(
    Object.entries(schemas).map(([id, schema]) => [id, withoutDialect(schema)]),
  );
};

export const buildParameters = (location: "path" | "query", schema: z.ZodObject): JsonObject[] => {
  const { properties = {}, required = [] } = z.toJSONSchema(schema, {
    ...toJsonSchemaOptions,
    io: "input",
  }) as { properties?: Record<string, unknown>; required?: string[] };
  return Object.entries(properties).map(([name, property]) => ({
    name,
    in: location,
    required: location === "path" || required.includes(name),
    schema: withoutDialect(property),
  }));
};

export const idParameters = buildParameters("path", idParamSchema);

export const algorithmParameters = [
  ...buildParameters("path", algorithmParamsSchema),
  ...buildParameters("query", algorithmSnippetQuerySchema),
];
