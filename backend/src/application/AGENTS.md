# Application layer

Use cases: one action the app can do, like "create a course" or "insert a key into an AVL tree". They call domain rules and repository interfaces, and return DTOs.

## Where things go

```
application/
  context/      requestContext (AsyncLocalStorage): request id, user id, per-request state
  logging/      the Logger type every layer logs through
  <feature>/    use cases and DTO mapping for one feature
```

- One use case per file, named after the action: `application/course/create-course.ts`.
- A use case is a factory named `make<Action>` that takes its dependencies and returns a function, so tests can pass fakes: `makeCreateCourse({ courseRepository })` returns `createCourse(input) => Promise<CourseResponse>`.
- No use cases exist yet. The first one sets the pattern, so follow this shape and fix this file if you have to change it.
- Depend on the domain repository interface, never the Prisma class. `main.ts` passes the real one in.
- Map domain entities to response DTOs here, in a `<feature>-mapper.ts` next to the use cases. The DTO type comes from `@shared/schemas/<feature>`.

## What this layer may import

`@/domain/**`, `@shared/**` and plain npm packages. Biome rejects `@/infrastructure`, `@/presentation`, `@/generated`, `@prisma/*` and `express`.

<important if="you need a database, logger or other I/O inside a use case">
Don't import it. Describe what you need as an interface (in `domain/<feature>/` for repositories, or use the `Logger` type from `application/logging/logger.ts`), take it as a dependency, and let `main.ts` pass the real one in.
</important>

## Request context

- `requestContext` from `@/application/context/request-context` holds the current request's id and user id. The `presentation` middleware starts it for every request.
- Read with `getRequestId()`, `getUserId()` and `getState(key)`. Outside a request they return `undefined`.
- Pino adds `requestId` to every log line on its own, so don't pass it around.

## Logging

- Log through the injected `Logger`: `logger.info(message, data)`. Put details in `data`, not in the message string.
- Put a caught error under the `error` key so pino serialises it: `logger.error("Import failed", { error })`.
- Never log passwords, tokens or whole request bodies. Pino redacts `password`, `token` and `secret` fields, but don't lean on that.

Keep this file current: update it in the same commit when you add a folder here or change how use cases are shaped or wired.
