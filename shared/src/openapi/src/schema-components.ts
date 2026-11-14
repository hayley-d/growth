import { z } from "zod";

import { parameterExamples } from "@shared/openapi/src/examples";
import {
  algorithmParamsSchema,
  algorithmSnippetQuerySchema,
  algorithmSnippetResponseSchema,
  attemptQuestionSchema,
  attemptResultSchema,
  attemptSchema,
  attemptStateResponseSchema,
  completeOnboardingRequestSchema,
  dailyChallengeStateResponseSchema,
  errorResponseSchema,
  expressionNodeSchema,
  getQuizResponseSchema,
  healthSchema,
  idParamSchema,
  leaderboardResponseSchema,
  learnerAnswerSchema,
  learningPathResponseSchema,
  lessonNoteResponseSchema,
  lessonResponseSchema,
  listAlgorithmsResponseSchema,
  listCodeLanguagesResponseSchema,
  listLearningStylesResponseSchema,
  meResponseSchema,
  practiceSummaryResponseSchema,
  practiceTopicsResponseSchema,
  requestHintRequestSchema,
  requestHintResponseSchema,
  saveLessonNoteRequestSchema,
  scoreQuizRequestSchema,
  scoreQuizResponseSchema,
  sessionResponseSchema,
  signInRequestSchema,
  signUpRequestSchema,
  startPracticeRequestSchema,
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
  StartPracticeRequest: startPracticeRequestSchema,
  ScoreQuizRequest: scoreQuizRequestSchema,
  CompleteOnboardingRequest: completeOnboardingRequestSchema,
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
  LeaderboardResponse: leaderboardResponseSchema,
  LessonResponse: lessonResponseSchema,
  LessonNoteResponse: lessonNoteResponseSchema,
  Attempt: attemptSchema,
  AttemptQuestion: attemptQuestionSchema,
  AttemptResult: attemptResultSchema,
  AttemptStateResponse: attemptStateResponseSchema,
  RequestHintResponse: requestHintResponseSchema,
  SubmitAnswerResponse: submitAnswerResponseSchema,
  PracticeTopicsResponse: practiceTopicsResponseSchema,
  PracticeSummaryResponse: practiceSummaryResponseSchema,
  DailyChallengeStateResponse: dailyChallengeStateResponseSchema,
  GetQuizResponse: getQuizResponseSchema,
  ScoreQuizResponse: scoreQuizResponseSchema,
};

const sharedSchemas = {
  LearnerAnswer: learnerAnswerSchema,
  ExpressionNode: expressionNodeSchema,
};

export type SchemaName = keyof typeof requestSchemas | keyof typeof responseSchemas;

const toJsonSchemaOptions = { unrepresentable: "any" } as const;

const safeInteger = Number.MAX_SAFE_INTEGER;

const withoutNoise = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(withoutNoise);
  if (value && typeof value === "object") {
    const object = value as JsonObject;
    return Object.fromEntries(
      Object.entries(object)
        .filter(
          ([key, child]) =>
            !(
              key === "pattern" &&
              typeof child === "string" &&
              typeof object.format === "string"
            ) &&
            !(key === "minimum" && child === -safeInteger) &&
            !(key === "maximum" && child === safeInteger),
        )
        .map(([key, child]) => [key, withoutNoise(child)]),
    );
  }
  return value;
};

const withoutDialect = (schema: unknown): JsonObject => {
  const { $schema: _dialect, $id: _identifier, ...rest } = schema as JsonObject;
  return withoutNoise(rest) as JsonObject;
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
    ...(parameterExamples[name] ? { example: parameterExamples[name] } : {}),
    schema: withoutDialect(property),
  }));
};

export const idParameters = buildParameters("path", idParamSchema);

export const algorithmParameters = [
  ...buildParameters("path", algorithmParamsSchema),
  ...buildParameters("query", algorithmSnippetQuerySchema),
];
