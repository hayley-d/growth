---
title: API reference
description: The OpenAPI file for the backend, and how to keep it current.
---

Every endpoint is listed in one OpenAPI 3.1 file: [`openapi.json`](/growth/openapi.json). It has the paths, the request and response bodies, the status codes and which endpoints need a signed-in learner.

## Read it

- Paste the file into [Swagger Editor](https://editor.swagger.io) to browse it.
- Or open `docs/public/openapi.json` in your editor.

Better Auth serves everything under `/api/auth`. Only the sign up, sign in, sign out and get session paths are listed, and the bodies it sends back are Better Auth's own.

## Where it comes from

The file is built from the Zod schemas in `shared/`, so a body in the spec is the same schema the backend validates with and the frontend parses with.

| File | What it holds |
| --- | --- |
| `shared/src/openapi/src/operations.ts` | One entry per endpoint: path, summary, auth, the schemas it uses and its status codes |
| `shared/src/openapi/src/schema-components.ts` | The schemas that become reusable components |
| `shared/src/openapi/src/document.ts` | Puts the two together into the document |
| `docs/public/openapi.json` | The generated file. Don't edit it by hand |

## Add or change an endpoint

1. Add the schemas in `shared/src/schemas/src/` as usual.
2. Add the request and response schemas to `schema-components.ts`.
3. Add the endpoint to `operations.ts`. Write paths as `/api/lessons/{id}`.
4. From `backend/`, run `bun run openapi` and commit the new `openapi.json`.

The tests tell you when you forget a step:

- A route the app serves that isn't in the spec fails `backend/src/test/openapi/openapi.test.ts`. So does an entry in the spec that the app doesn't serve.
- A committed `openapi.json` that doesn't match the code fails the same test. Run `bun run openapi` to fix it.
- A broken `$ref`, a missing path parameter or a repeated operation id fails `shared/src/openapi/test/document.test.ts`.
