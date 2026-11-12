import type { JsonObject, SchemaName } from "@shared/openapi/src/schema-components";
import { algorithmParameters, idParameters } from "@shared/openapi/src/schema-components";

export type ErrorResponseName =
  | "BadRequest"
  | "Unauthorized"
  | "Forbidden"
  | "NotFound"
  | "Conflict";

export type ResponseSpec = ErrorResponseName | { description: string; schema?: SchemaName };

export type OperationSpec = {
  operationId: string;
  method: "get" | "post" | "put" | "patch";
  path: string;
  tag: string;
  summary: string;
  description?: string;
  secured: boolean;
  parameters?: JsonObject[];
  requestBody?: SchemaName;
  responses: Record<string, ResponseSpec>;
};

export const tags = [
  { name: "Health", description: "Is the server up." },
  {
    name: "Auth",
    description:
      "Sign up, sign in and the session. Better Auth serves every path under /api/auth. Only the paths the frontend uses are listed here.",
  },
  { name: "Course content", description: "Reference data and code snippets. Public." },
  { name: "Profile", description: "The signed-in learner's settings." },
  {
    name: "Onboarding",
    description:
      "The learning style quiz and the answers a new learner gives before reaching the app.",
  },
  { name: "Learning path", description: "The units and lessons, with the learner's progress." },
  {
    name: "Leaderboard",
    description: "Today's daily challenge, ranked by how fast each learner finished.",
  },
  { name: "Lessons", description: "Open a lesson, keep a note and mark it started." },
  {
    name: "Tests",
    description:
      "Lesson tests, checkpoints and the final challenge. An attempt holds up to 5 questions chosen when it starts. The correct answer is only sent after the learner answers.",
  },
];

const lessonErrors: Record<string, ResponseSpec> = {
  "400": "BadRequest",
  "401": "Unauthorized",
  "403": "Forbidden",
  "404": "NotFound",
};

export const operations: OperationSpec[] = [
  {
    operationId: "getHealth",
    method: "get",
    path: "/api/health",
    tag: "Health",
    summary: "Health check",
    secured: false,
    responses: { "200": { description: "The server is up.", schema: "Health" } },
  },
  {
    operationId: "signUpWithEmail",
    method: "post",
    path: "/api/auth/sign-up/email",
    tag: "Auth",
    summary: "Create an account",
    description:
      "Creates the account and signs the learner in. A default profile is created with it. The response body is defined by Better Auth.",
    secured: false,
    requestBody: "SignUpRequest",
    responses: {
      "200": { description: "Account created. The session cookie is set." },
      "400": { description: "The email is already used, or a field is invalid." },
    },
  },
  {
    operationId: "signInWithEmail",
    method: "post",
    path: "/api/auth/sign-in/email",
    tag: "Auth",
    summary: "Sign in",
    description:
      "The request must come from the origin in BETTER_AUTH_URL, or Better Auth rejects it with INVALID_ORIGIN. The response body is defined by Better Auth.",
    secured: false,
    requestBody: "SignInRequest",
    responses: {
      "200": { description: "Signed in. The session cookie is set." },
      "401": { description: "Wrong email or password." },
    },
  },
  {
    operationId: "signOut",
    method: "post",
    path: "/api/auth/sign-out",
    tag: "Auth",
    summary: "Sign out",
    secured: true,
    responses: { "200": { description: "Signed out. The session cookie is cleared." } },
  },
  {
    operationId: "getSession",
    method: "get",
    path: "/api/auth/get-session",
    tag: "Auth",
    summary: "Read the current session",
    description: "Returns null when nobody is signed in.",
    secured: false,
    responses: { "200": { description: "The session, or null.", schema: "Session" } },
  },
  {
    operationId: "listAlgorithms",
    method: "get",
    path: "/api/algorithms",
    tag: "Course content",
    summary: "List the algorithms",
    secured: false,
    responses: { "200": { description: "The algorithms.", schema: "ListAlgorithmsResponse" } },
  },
  {
    operationId: "getAlgorithmSnippet",
    method: "get",
    path: "/api/algorithms/{code}/snippet",
    tag: "Course content",
    summary: "Get an algorithm's code",
    description:
      "The language is `language` if it is given. If not, it is the signed-in learner's code language, and pseudocode when they have none or nobody is signed in.",
    secured: false,
    parameters: algorithmParameters,
    responses: {
      "200": {
        description: "The source and the line of each step.",
        schema: "AlgorithmSnippetResponse",
      },
      "400": "BadRequest",
      "404": "NotFound",
    },
  },
  {
    operationId: "listLearningStyles",
    method: "get",
    path: "/api/learning-styles",
    tag: "Course content",
    summary: "List the learning styles",
    secured: false,
    responses: {
      "200": { description: "The learning styles.", schema: "ListLearningStylesResponse" },
    },
  },
  {
    operationId: "listCodeLanguages",
    method: "get",
    path: "/api/code-languages",
    tag: "Course content",
    summary: "List the code languages",
    secured: false,
    responses: {
      "200": { description: "The code languages.", schema: "ListCodeLanguagesResponse" },
    },
  },
  {
    operationId: "getMe",
    method: "get",
    path: "/api/me",
    tag: "Profile",
    summary: "Get the signed-in learner",
    secured: true,
    responses: {
      "200": { description: "The learner and their profile.", schema: "MeResponse" },
      "401": "Unauthorized",
      "404": "NotFound",
    },
  },
  {
    operationId: "updateProfile",
    method: "patch",
    path: "/api/me/profile",
    tag: "Profile",
    summary: "Change the learner's profile",
    description: "Send only the fields that change.",
    secured: true,
    requestBody: "UpdateUserProfileRequest",
    responses: {
      "200": { description: "The learner and the updated profile.", schema: "MeResponse" },
      "400": "BadRequest",
      "401": "Unauthorized",
      "404": "NotFound",
    },
  },
  {
    operationId: "completeOnboarding",
    method: "post",
    path: "/api/onboarding",
    tag: "Onboarding",
    summary: "Save the onboarding answers",
    description:
      "Saves the learning style, code language, leaderboard and text to speech answers and marks onboarding complete in one write. Sending it again overwrites the answers.",
    secured: true,
    requestBody: "CompleteOnboardingRequest",
    responses: {
      "200": { description: "The learner and the updated profile.", schema: "MeResponse" },
      "400": "BadRequest",
      "401": "Unauthorized",
      "404": "NotFound",
    },
  },
  {
    operationId: "getQuiz",
    method: "get",
    path: "/api/onboarding/quiz",
    tag: "Onboarding",
    summary: "Get the learning style quiz",
    description:
      "Eight questions with four options each. The options don't say which style they count towards.",
    secured: true,
    responses: {
      "200": { description: "The questions.", schema: "GetQuizResponse" },
      "401": "Unauthorized",
    },
  },
  {
    operationId: "scoreQuiz",
    method: "post",
    path: "/api/onboarding/quiz",
    tag: "Onboarding",
    summary: "Work out the learning style from the answers",
    description:
      "Answer every question once. The style with the most picks wins, and a tie goes to visual, auditory, reading/writing, then kinesthetic. Nothing is saved.",
    secured: true,
    requestBody: "ScoreQuizRequest",
    responses: {
      "200": { description: "The learning style.", schema: "ScoreQuizResponse" },
      "400": "BadRequest",
      "401": "Unauthorized",
    },
  },
  {
    operationId: "getLearningPath",
    method: "get",
    path: "/api/learning-path",
    tag: "Learning path",
    summary: "Get the learning path",
    description:
      "The current lesson is the first one the learner has not completed. Completed lessons and the current lesson are open, every other lesson is locked.",
    secured: true,
    responses: {
      "200": { description: "Units, lessons and progress.", schema: "LearningPathResponse" },
      "401": "Unauthorized",
    },
  },
  {
    operationId: "getLeaderboard",
    method: "get",
    path: "/api/leaderboard",
    tag: "Leaderboard",
    summary: "Get today's leaderboard",
    description:
      "Ranks learners by how fast they finished today's daily challenge. Time is whole seconds after 00:00 South African time, and ties share a rank. The top 10 only includes learners who chose to appear. The signed-in learner's own entry is separate, and is hidden with no rank when they opted out.",
    secured: true,
    responses: {
      "200": {
        description: "The top ten and the learner's own entry.",
        schema: "LeaderboardResponse",
      },
      "401": "Unauthorized",
    },
  },
  {
    operationId: "getLesson",
    method: "get",
    path: "/api/lessons/{id}",
    tag: "Lessons",
    summary: "Get a lesson",
    description: "A locked lesson returns 403. A missing or retired lesson returns 404.",
    secured: true,
    parameters: idParameters,
    responses: {
      "200": { description: "The lesson and its steps.", schema: "LessonResponse" },
      ...lessonErrors,
    },
  },
  {
    operationId: "getLessonNote",
    method: "get",
    path: "/api/lessons/{id}/note",
    tag: "Lessons",
    summary: "Get the learner's note",
    description: "Returns an empty body and a null `updatedAt` when there is no note yet.",
    secured: true,
    parameters: idParameters,
    responses: {
      "200": { description: "The note.", schema: "LessonNoteResponse" },
      ...lessonErrors,
    },
  },
  {
    operationId: "saveLessonNote",
    method: "put",
    path: "/api/lessons/{id}/note",
    tag: "Lessons",
    summary: "Save the learner's note",
    description:
      "Creates the note the first time and updates it after that. Returns 400 over 2000 characters, or for a lesson with no notes step.",
    secured: true,
    parameters: idParameters,
    requestBody: "SaveLessonNoteRequest",
    responses: {
      "200": { description: "The saved note.", schema: "LessonNoteResponse" },
      ...lessonErrors,
    },
  },
  {
    operationId: "startLesson",
    method: "post",
    path: "/api/lessons/{id}/start",
    tag: "Lessons",
    summary: "Mark a lesson started",
    description: "A completed lesson stays completed.",
    secured: true,
    parameters: idParameters,
    responses: { "204": { description: "Started." }, ...lessonErrors },
  },
  {
    operationId: "startAttempt",
    method: "post",
    path: "/api/lessons/{id}/attempts",
    tag: "Tests",
    summary: "Start a test",
    description:
      "Starts a lesson test, or a checkpoint test for a checkpoint. Locked lessons can be tested, so a learner can test out of them. If the learner already has an unfinished attempt for the lesson, that one is returned with 200. Two starts at the same moment make one attempt. A lesson with no questions returns 409.",
    secured: true,
    parameters: idParameters,
    responses: {
      "200": {
        description: "The unfinished attempt that was already there.",
        schema: "AttemptStateResponse",
      },
      "201": {
        description: "A new attempt and its first question.",
        schema: "AttemptStateResponse",
      },
      "400": "BadRequest",
      "401": "Unauthorized",
      "404": "NotFound",
      "409": "Conflict",
    },
  },
  {
    operationId: "getAttempt",
    method: "get",
    path: "/api/attempts/{id}",
    tag: "Tests",
    summary: "Get an attempt",
    description:
      "Use it to pick up after a reload. An attempt in progress returns its current question with the hints already unlocked. A finished attempt returns its result. Another learner's attempt returns 404.",
    secured: true,
    parameters: idParameters,
    responses: {
      "200": {
        description: "The attempt with a question or a result.",
        schema: "AttemptStateResponse",
      },
      "400": "BadRequest",
      "401": "Unauthorized",
      "404": "NotFound",
    },
  },
  {
    operationId: "requestHint",
    method: "post",
    path: "/api/attempts/{id}/hints",
    tag: "Tests",
    summary: "Unlock the next hint",
    description:
      "Each hint lowers the score for that answer. Returns 409 when the question is not the current one, is already answered, has no hints left, or the attempt is finished.",
    secured: true,
    parameters: idParameters,
    requestBody: "RequestHintRequest",
    responses: {
      "200": { description: "The hint.", schema: "RequestHintResponse" },
      "400": "BadRequest",
      "401": "Unauthorized",
      "404": "NotFound",
      "409": "Conflict",
    },
  },
  {
    operationId: "submitAnswer",
    method: "post",
    path: "/api/attempts/{id}/answers",
    tag: "Tests",
    summary: "Answer the current question",
    description:
      "Grades the answer, updates the learner's rating for the question's lesson and returns the correct answer and the explanation. After the last answer, `question` is null and `result` is set. A pass completes the lesson and every lesson before it. The answer type must match the question type. A question id that is not in the attempt returns 404. A question that is already answered, is not the current one, or an attempt that is finished returns 409.",
    secured: true,
    parameters: idParameters,
    requestBody: "SubmitAnswerRequest",
    responses: {
      "200": {
        description: "The feedback, and the next question or the result.",
        schema: "SubmitAnswerResponse",
      },
      "400": "BadRequest",
      "401": "Unauthorized",
      "404": "NotFound",
      "409": "Conflict",
    },
  },
];
