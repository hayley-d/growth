---
title: Backend
description: Clean architecture layers in the Express API.
---

The backend follows clean architecture with a layer-first layout. Each layer holds one folder per feature.

```
backend/src/
  domain/<feature>/          entities, value objects, repository interfaces
  domain/errors/             errors use cases throw
  application/<feature>/     use cases and DTO mapping
  application/context/       request context (request id per request)
  application/logging/       the Logger type
  infrastructure/<feature>/  prisma repository implementations
  infrastructure/config/     zod-validated environment
  infrastructure/database/   prisma client and prisma error mapping
  infrastructure/logging/    pino logger
  infrastructure/lifecycle/  process error handlers and graceful shutdown
  presentation/routes/       express routes, one <feature>-routes.ts per feature
  presentation/middleware/   request id, request logging, validation, 404 and error handling
  presentation/http/         express application factory
  main.ts                    composition root
```

## Dependency rule

Dependencies only point inward.

- `domain` imports nothing outside itself.
- `application` imports `domain` and `@shared/`.
- `infrastructure` implements the repository interfaces declared in `domain`.
- `presentation` calls use cases from `application`.
- `main.ts` wires concrete infrastructure into the use cases and starts the server.

Prisma types never leave `infrastructure`. Repositories map database rows to domain entities.

Biome checks this for you. Import something from the wrong layer and you get an error like this:

```
× The domain layer must not import from application.
```

| Layer            | Can't import                                            |
| ---------------- | ------------------------------------------------------- |
| `domain`         | application, infrastructure, presentation, Prisma, `@shared/`, Express |
| `application`    | infrastructure, presentation, Prisma, Express           |
| `infrastructure` | presentation                                            |
| `presentation`   | infrastructure, Prisma                                  |

If you hit one of these, the code is in the wrong layer. Move it, don't change the rule.

## Request flow

1. `helmet` adds security headers to every response, like `x-content-type-options: nosniff`.
2. `requestContextMiddleware` gives the request a fresh ID and sends it back in the `x-request-id` header.
3. The request logger writes one line when the response finishes. It skips `/api/health`.
4. `express.json` reads the body. Bodies over 100kb are turned away with a 413.
5. An Express route in `presentation/routes` receives the request.
6. `validateRequest` parses the body, params and query with schemas from `@shared/`. The parsed values replace the raw ones, so defaults and coerced numbers reach your handler.
7. The controller calls a use case in `application`.
8. The use case works with domain entities through repository interfaces.
9. A Prisma repository in `infrastructure` reads or writes the database.
10. Unknown routes fall through to `notFoundHandler`, which returns a 404.
11. The error handler turns anything thrown into a JSON response.

## Errors

Throw an error from `@/domain/errors` anywhere in the backend. You never need to write an error response yourself.

```ts
import { NotFoundError } from "@/domain/errors";

throw new NotFoundError("Tree not found");
```

| Error               | Status |
| ------------------- | ------ |
| `BadRequestError`   | 400    |
| `UnauthorizedError` | 401    |
| `ForbiddenError`    | 403    |
| `NotFoundError`     | 404    |
| `ConflictError`     | 409    |
| `ZodError`          | 400    |
| malformed JSON      | 400    |
| body over 100kb     | 413    |
| anything else       | 500, and it gets logged |

The domain errors don't know about HTTP. Only the error handler in `presentation/middleware` picks the status code.

Every error body follows `errorResponseSchema` from `@shared/schemas/error`:

```json
{ "message": "Validation failed", "issues": [{ "path": ["name"], "message": "Required", "code": "invalid_type" }], "requestId": "..." }
```

`issues` only shows up for validation errors.

### Prisma errors

Wrap repository calls in `withPrismaErrors` from `@/infrastructure/database/prisma-errors`. It turns Prisma errors into domain errors, so Prisma never leaks out of `infrastructure`:

```ts
return withPrismaErrors(() => prismaClient.tree.create({ data }));
```

- `P2002`, a unique constraint failure, becomes `ConflictError`, which names the fields.
- `P2025`, a record that doesn't exist, becomes `NotFoundError`.
- `P2003`, a foreign key failure, becomes `BadRequestError`.

## Logging

The logger is pino. `application/logging/logger.ts` defines the `Logger` type and `infrastructure/logging/pino-logger.ts` builds it. `main.ts` creates it once and passes it into `createApplication({ logger })`. Never import the pino logger in `presentation`. Take the logger as a parameter, like `createErrorHandler(logger)` does.

Every log line written during a request includes its `requestId`, read from `requestContext` in `application/context`. Passwords, tokens and auth headers are redacted.

`bun run dev` pipes the output through `pino-pretty`, so it's readable in the terminal. Set `LOG_LEVEL` in `.env` to make it more or less chatty.

## Shutdown

`main.ts` registers two things:

- `registerProcessErrorHandlers` logs unhandled rejections. It also logs uncaught exceptions and exits.
- `registerGracefulShutdown` runs on `SIGTERM` or `SIGINT`. It stops taking requests, disconnects Prisma and exits. If that takes longer than 10 seconds, it forces the exit.

Add any new cleanup (a cache client, say) to the `cleanups` list in `main.ts`.

## Pagination

`@shared/schemas/common` has the pieces for list endpoints:

- `paginationQuerySchema` parses `?page=` and `?pageSize=`. They default to 1 and 20, and `pageSize` can be at most 100.
- `toSkipTake(query)` turns the parsed query into Prisma's `{ skip, take }`.
- `toPaginatedResponse(items, total, query)` builds `{ items, page, pageSize, total, totalPages }`.
- `paginatedResponseSchema(itemSchema)` is the matching response schema for the frontend.
- `idParamSchema` validates a `:id` route param as a UUID.

## Prisma

The schema is `backend/prisma/schema.prisma` and the configuration is `backend/prisma.config.ts`. The client is generated into `backend/src/generated/prisma`, which is ignored by git. It connects through the `@prisma/adapter-pg` driver adapter.

## Testing

Vitest runs `src/**/*.test.ts`. HTTP behaviour is tested with Supertest against `createApplication({ logger })`, so tests do not open a real port. Pass a stub logger made of `vi.fn()` calls so you can assert on what was logged.
