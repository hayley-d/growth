# Infrastructure layer

Everything that talks to the outside world: the database, environment, logs and the process itself.

## Where things go

```
infrastructure/
  config/       environment.ts: zod-validated process.env
  database/     prismaClient and withPrismaErrors
  logging/      createPinoLogger, the only Logger implementation
  lifecycle/    process error handlers and graceful shutdown
  <feature>/    the Prisma repository for one feature
```

## Repositories

- One file per repository: `infrastructure/course/prisma-course-repository.ts`. It implements the interface from `domain/course/`.
- Wrap every Prisma call in `withPrismaErrors` from `@/infrastructure/database/prisma-errors`. It turns Prisma error codes into domain errors:

  | Prisma code | Becomes |
  | --- | --- |
  | `P2002` unique constraint | `ConflictError`, with the clashing fields |
  | `P2025` record not found | `NotFoundError` |
  | `P2003` foreign key | `BadRequestError` |

  Anything else is rethrown and ends up as a 500.
- Map Prisma rows to domain entities before returning. Prisma types never leave this layer.
- Use `prismaClient` from `@/infrastructure/database/prisma-client`. Never create another `PrismaClient`.
- For paged lists, use `toSkipTake` and `toPaginatedResponse` from `@shared/schemas/common`.

<important if="adding a new Prisma error code to handle">
Add it to `translatePrismaError` in `database/prisma-errors.ts` and add a case to `prisma-errors.test.ts`. Pick an existing domain error kind. Don't throw HTTP status codes from here.
</important>

## Config, logging and lifecycle

- New environment variables go in the schema in `config/environment.ts` and in `backend/.env.example`. Nothing else reads `process.env`.
- `createPinoLogger(level)` returns the app's `Logger`. It adds `service` and `requestId` to every line and redacts auth headers, cookies, passwords, tokens and secrets. Add new sensitive field names to `redact.paths`.
- `registerGracefulShutdown` closes the server, then runs each cleanup in order, and forces an exit after 10 seconds. Add a cleanup in `main.ts` for anything that holds a connection.

## What this layer may import

`@/domain`, `@/application` (for types like `Logger` and `requestContext`), `@/generated`, `@shared/` and npm packages. Biome rejects `@/presentation`.

Keep this file current: update it in the same commit when you add a folder, a client, a config variable pattern or a new error translation.
