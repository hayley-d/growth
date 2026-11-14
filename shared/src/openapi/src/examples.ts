import {
  capturedErrors,
  capturedRequests,
  capturedResponses,
} from "@shared/openapi/src/captured-examples";

export const parameterExamples: Record<string, string> = {
  id: "bc0b4ade-53cc-5496-8713-0dcdf95fa107",
  code: "inorder",
  language: "pseudocode",
};

export const requestExamples = capturedRequests;

export const responseExamples = capturedResponses;

export const errorExamples = capturedErrors;
