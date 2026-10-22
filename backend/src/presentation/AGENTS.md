# Presentation layer

HTTP only: turn a request into a use case call, and the result into a response. No business rules here.

## Where things go

```
presentation/
  http/         create-application.ts: builds the Express app
  middleware/   request id, request logging, validation, 404 and error handling
  routes/       one <feature>-routes.ts per feature
```

## Middleware order

`createApplication` sets this up. Keep the order when you add to it:

1. `helmet()` for security headers
2. `requestContextMiddleware`: makes a request id, sends it back as `x-request-id`, starts `requestContext`
3. `createRequestLogger(logger)`: one log line per response, skips `/api/health`
4. `express.json({ limit: "100kb" })`
5. Feature routes, each mounted under `/api/<feature>`
6. `notFoundHandler`
7. `createErrorHandler(logger)`, always last

## Routes

- One file per feature: `routes/<feature>-routes.ts`. Mount it in `http/create-application.ts`.
- A feature with dependencies exports a factory: `createCourseRoutes({ createCourse, listCourses })` returns a `Router`. Use cases come in through `createApplication`'s dependencies, which `main.ts` fills. `healthRoutes` is a plain `Router` only because it needs nothing.
- Validate input with `validateRequest({ body, query, params })` and a schema from `@shared/schemas/<feature>`. After it runs, `request.body`, `request.query` and `request.params` hold the parsed values.
- Handlers call one use case and send the result with `response.json(...)`. Set the status only when it isn't 200, for example `response.status(201)`.
- Express 5 passes rejected promises to the error handler, so handlers can be `async` and just `throw`.

## Errors

Handlers and middleware throw. They never write an error response themselves. `createErrorHandler` turns:

| Thrown | Status | Body |
| --- | --- | --- |
| `ZodError` | 400 | `Validation failed` plus `issues` |
| `DomainError` subclass | from its kind | its message |
| malformed JSON | 400 | `Malformed JSON body` |
| body over 100kb | 413 | `Request body too large` |
| anything else | 500 | `Internal server error`, and it's logged |

Every error body matches `errorResponseSchema` in `@shared/schemas/error` and carries the `requestId`.

<important if="changing validate-request.ts">
Express 5 makes `request.query` a getter, so plain assignment does nothing. That's why `validateRequest` replaces it with `Object.defineProperty`. Keep it that way.
</important>

## What this layer may import

`@/application`, `@/domain`, `@shared/`, Express and middleware packages. Biome rejects `@/infrastructure`, `@/generated` and `@prisma/*`. The logger arrives through `createApplication({ logger })`. Never import pino or the Prisma client here.

## Tests

Use supertest against `createApplication({ logger })` with a stub logger built from `vi.fn()`. See `http/create-application.test.ts`.

Keep this file current: update it in the same commit when the middleware order, error mapping or route pattern changes.
