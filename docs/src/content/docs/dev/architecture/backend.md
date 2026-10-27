---
title: Backend
description: Clean architecture layers in the Hono API.
---

The backend follows clean architecture with a layer-first layout. Each layer holds one folder per feature.

```
backend/src/
  domain/<feature>/          entities, value objects, repository interfaces
  domain/errors/             errors use cases throw
  application/<feature>/commands/  use cases that change state
  application/<feature>/queries/   use cases that only read
  application/context/       request context (request id per request)
  application/logging/       the Logger type
  infrastructure/<module>/   prisma models and repositories for one module
  infrastructure/<module>/mappers/  turn prisma rows into domain entities and back
  infrastructure/config/     zod-validated environment
  infrastructure/database/   prisma client and prisma error mapping
  infrastructure/logging/    pino logger
  infrastructure/lifecycle/  process error handlers and graceful shutdown
  presentation/controllers/  one <feature>-controller.ts per feature, calls the use cases
  presentation/routes/       hono routes, one <feature>-routes.ts per feature, send each path to a controller
  presentation/middleware/   request id, request logging, validation, 404 and error handling
  presentation/http/         hono application factory
  main.ts                    composition root
```

## Dependency rule

Dependencies only point inward.

- `domain` imports nothing outside itself.
- `application` imports `domain` and `@shared/`.
- `infrastructure` implements the repository interfaces declared in `domain`.
- `presentation` calls use cases from `application`.
- `main.ts` wires concrete infrastructure into the use cases and starts the server.

Prisma types never leave `infrastructure`. Repositories use the mappers in `infrastructure/<module>/mappers/` to turn database rows into domain entities.

Use cases come in two kinds. Commands change something, like starting an attempt. Queries only read, like getting a lesson. If an action does both, it's a command.

Biome checks this for you. Import something from the wrong layer and you get an error like this:

```
× The domain layer must not import from application.
```

| Layer            | Can't import                                                         |
| ---------------- | -------------------------------------------------------------------- |
| `domain`         | application, infrastructure, presentation, Prisma, `@shared/`, Hono |
| `application`    | infrastructure, presentation, Prisma, Hono                           |
| `infrastructure` | presentation                                                         |
| `presentation`   | infrastructure, Prisma                                               |

If you hit one of these, the code is in the wrong layer. Move it, don't change the rule.

## Request flow

1. `secureHeaders` adds security headers to every response, like `x-content-type-options: nosniff`.
2. `requestContextMiddleware` gives the request a fresh ID and sends it back in the `x-request-id` header.
3. The request logger writes one line when the response finishes. It skips `/api/health`.
4. `bodyLimit` turns away bodies over 100kb with a 413.
5. A Hono route in `presentation/routes` receives the request.
6. `validate(target, schema)` parses the `json` body, `param` or `query` with a schema from `@shared/`. Read the parsed value with `context.req.valid(target)`, so defaults and coerced numbers reach your handler with the right types.
7. The route hands the request to a controller method in `presentation/controllers`, which calls a command or query in `application`.
8. The use case works with domain entities through repository interfaces.
9. A Prisma repository in `infrastructure` reads or writes the database.
10. Unknown routes go to `notFoundHandler` (set with `app.notFound`), which returns a 404.
11. The error handler (set with `app.onError`) turns anything thrown into a JSON response.

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

- `P2002`, a unique constraint failure, becomes `ConflictError`, which names the field. The field comes from the index name, like `user_email_key`, so keep Prisma's default index names.
- `P2025`, a record that doesn't exist, becomes `NotFoundError`.
- `P2003`, a foreign key failure, becomes `ConflictError` when you delete something another row still uses, and `BadRequestError` when you point at something that doesn't exist.
- `P2011`, a missing required value, becomes `BadRequestError`.
- `P2039` with Postgres code `23514`, a CHECK constraint failure, becomes `BadRequestError`, which names the constraint.

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

The schema is split over several files under `backend/src/infrastructure`, and `backend/prisma.config.ts` points Prisma at that folder. The generator and datasource live in `infrastructure/database/schema.prisma`. Each module has a `models/` folder with one `.prisma` file per table and an `enums.prisma` for its enums. Prisma reads them all as one schema, so a model can point at a model in another module. The client is generated into `backend/src/generated/prisma`, which is ignored by git. It connects through the `@prisma/adapter-pg` driver adapter.

The tables follow the team's ERD, which has three modules: `course-content`, `assessment` and `user`. Only a small example is built so far:

| Module | Tables |
| --- | --- |
| `course-content` | `learning_style`, `code_language` |
| `user` | `user` |

Every other table in the ERD is added by whoever builds the feature that needs it. The `user` example shows each step, so copy it.

A module folder looks like this:

```
infrastructure/user/
  models/
    enums.prisma
    user.prisma
  mappers/
    user-mapper.ts
  repositories/
    user-repository.ts
    index.ts
```

Every table has its own repository, named after the table. Each module uses the same name in every layer: the contract in `shared/src/schemas/<module>.ts`, the entity in `domain/<module>/<table>.ts`, the repository interface in `domain/<module>/repositories/<table>-repository.ts`, and the Prisma repository in `infrastructure/<module>/repositories/<table>-repository.ts`.

Every repository extends one base class, `PrismaRepository` in `infrastructure/database/prisma-repository.ts`. It does `findById`, `list`, `create`, `update` and `delete` once, wraps each in `withPrismaErrors`, and maps rows to domain entities. A repository only tells it which Prisma model to use and how to map it, then adds finders for its unique columns:

```ts
type UserModel = {
  row: UserRow;
  where: Prisma.UserWhereUniqueInput;
  create: Prisma.UserUncheckedCreateInput;
  update: Prisma.UserUncheckedUpdateInput;
  orderBy: Prisma.UserOrderByWithRelationInput;
};

export class PrismaUserRepository
  extends PrismaRepository<UserModel, User, NewUser, UserChanges>
  implements UserRepository
{
  constructor(client: PrismaClient) {
    super(client, client.user, {
      toEntity: toUser,
      toWhere: (id) => ({ id }),
      orderBy: [{ id: "asc" }],
      toCreateData: toUserCreateData,
      toUpdateData: toUserUpdateData,
    });
  }

  findByEmail(email: string) {
    return this.findOne({ email });
  }
}
```

`UserModel` lists the Prisma types for the table, so TypeScript checks the domain types, sort columns and finders against the real schema. When nothing needs converting, pass `(entity) => entity` and `(changes) => changes`, like `learning-style-repository.ts` does. A table with a two-column key uses the key object as its id, for example `findById({ userId, lessonId })`. The domain side matches: `UserRepository` is `Repository<User, NewUser, UserChanges>` from `domain/common/repository.ts`, plus `findByEmail`.

Tables and columns are snake_case in the database. In the schema, models are PascalCase and fields are camelCase, mapped with `@@map` and `@map`. Ids are UUIDs.

A user points at a learning style and a code language. Neither can be deleted while a user still uses it.

### Adding a table

1. Add the model in `infrastructure/<module>/models/<table>.prisma`, matching the ERD.
2. Create a migration with `bun run prisma:migrate --name <what-changed>`, then run `bun run prisma:generate`. For a rule Prisma can't express, like a CHECK, use `--create-only` and add the SQL to the migration by hand.
3. Add the entity and repository interface in `domain/<module>/`.
4. Add the mapper in `infrastructure/<module>/mappers/`.
5. Add a repository that extends `PrismaRepository`, and export it from `repositories/index.ts`.
6. Test whatever is special about it: mappers, finders, keys. The base class is already tested.
7. If the table differs from the ERD, change the ERD too.

Two branches that both add a migration will clash. Before you merge, rebase onto `staging`, delete your migration folder and create it again, so it builds on the migrations already there.

### Emails

The shared request schema trims and lowercases emails, so `Ada@x.com` and `ada@x.com` are the same account. Anything that writes or looks up a user's email without going through that schema must lowercase it first.

## Testing

All tests live in `src/test/`, at the same path as the code they cover. For example, the test for `src/presentation/http/create-application.ts` is `src/test/presentation/http/create-application.test.ts`. Vitest runs `src/test/**/*.test.ts`.

HTTP behaviour is tested with Hono's `app.request()` against `createApplication({ logger })`, so tests do not open a real port. Pass a stub logger made of `vi.fn()` calls so you can assert on what was logged.
