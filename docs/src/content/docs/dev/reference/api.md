---
title: API reference
description: The OpenAPI file for the backend, and how to keep it current.
---

Every endpoint is listed in one OpenAPI 3.1 file: [`openapi.json`](/growth/openapi.json). It has the paths, the request and response bodies, the status codes and which endpoints need a signed-in learner.

## Read it

- Browse the pages built from it in the [SE document](../../../se/api/).
- Or paste the file into [Swagger Editor](https://editor.swagger.io).
- Or open `docs/public/openapi.json` in your editor.

Better Auth serves everything under `/api/auth`. Only the sign up, sign in, sign out and get session paths are listed, and the bodies it sends back are Better Auth's own.

## Where it comes from

The file is built from the Zod schemas in `shared/`, so a body in the spec is the same schema the backend validates with and the frontend parses with.

| File | What it holds |
| --- | --- |
| `shared/src/openapi/src/operations.ts` | One entry per endpoint: path, summary, auth, the schemas it uses and its status codes |
| `shared/src/openapi/src/schema-components.ts` | The schemas that become reusable components |
| `shared/src/openapi/src/document.ts` | Puts the two together into the document |
| `shared/src/openapi/src/captured-examples.ts` | The example bodies, captured from a running backend. Don't edit it by hand |
| `backend/scripts/capture-openapi-examples.ts` | Calls every endpoint and writes the examples file |
| `docs/public/openapi.json` | The generated file. Don't edit it by hand |

## Add or change an endpoint

1. Add the schemas in `shared/src/schemas/src/` as usual.
2. Add the request and response schemas to `schema-components.ts`.
3. Add the endpoint to `operations.ts`. Write paths as `/api/lessons/{id}`.
4. Add a call for it to `backend/scripts/capture-openapi-examples.ts`, then capture the examples (see below).
5. From `backend/`, run `bun run openapi` and commit the new `openapi.json`.

## Capture the examples

The example requests and responses in the API reference come from the real backend, not from hand-written JSON. `bun run openapi:examples` in `backend/` calls every endpoint in a realistic order: it signs up a learner, finishes onboarding, opens three lessons, takes a lesson test, practises and plays the daily challenge. It writes what came back to `captured-examples.ts`.

Use a throwaway database, never your dev data. The script creates a new learner each time, but it also starts tests and a daily challenge.

1. Create an empty database in the Postgres from `docker compose`, for example `growth_examples`, and point `DATABASE_URL` at it.
2. Run `bun run prisma:deploy` and `bun run prisma:seed` in `backend/`. The seed loads the course content.
3. Start the backend on a free port with `BETTER_AUTH_URL=http://localhost:5173` and a `BETTER_AUTH_SECRET`.
4. Run `CAPTURE_URL=http://localhost:3100 bun run openapi:examples` with the same `DATABASE_URL`, then `bunx biome check --write shared/src/openapi/src/captured-examples.ts`.

It lists any status the spec doesn't document, and any success response it didn't capture. The script answers every test question with a guess, because the API only shows the right answer afterwards. So the examples show a failed attempt with its review lessons.

The tests tell you when you forget a step:

- A route the app serves that isn't in the spec fails `backend/src/test/openapi/openapi.test.ts`. So does an entry in the spec that the app doesn't serve.
- A committed `openapi.json` that doesn't match the code fails the same test. Run `bun run openapi` to fix it.
- A broken `$ref`, a missing path parameter or a repeated operation id fails `shared/src/openapi/test/document.test.ts`. The same file fails when an example doesn't match its schema, or when a request body or a success response with a body has no example.
