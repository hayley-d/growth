# Domain layer

The core of the backend: the rules of the app with no I/O. No database, no HTTP, no logging.

## Where things go

```
domain/
  errors/       DomainError and its subclasses
  <feature>/    entities, value objects, repository interfaces for one feature
```

- Entities and value objects are plain TypeScript types and functions. Tree rules (balancing, rotations, invariants) belong here.
- A repository interface lives next to the entity it stores, for example `domain/course/course-repository.ts`. It describes what the application needs, in domain types. The Prisma version lives in `infrastructure/<feature>/`.
- One concept per file, named in kebab case after what it holds.

## What this layer may import

Only other files in `domain/` and plain npm packages with no I/O. Biome rejects imports from `@/application`, `@/infrastructure`, `@/presentation`, `@/generated`, `@prisma/*`, `@shared/` and `express`.

`@shared/` is off limits on purpose: shared schemas are the HTTP contract, and the domain shouldn't change when the contract does. The application layer maps between the two.

## Errors

Throw a subclass from `@/domain/errors`, never a plain `Error`, for anything the caller caused. The error handler in `presentation` turns each kind into a status code.

| Class | Status | Use it when |
| --- | --- | --- |
| `BadRequestError` | 400 | Input breaks a rule zod can't check |
| `UnauthorizedError` | 401 | Nobody is signed in |
| `ForbiddenError` | 403 | Signed in but not allowed |
| `NotFoundError` | 404 | The thing doesn't exist |
| `ConflictError` | 409 | It clashes with something that exists |

Every subclass takes `(message, details?)`. The message is sent to the client, so write it for a person and never put secrets in it.

<important if="adding a new error kind">
Add the kind to `DomainErrorKind`, add a subclass in `errors/domain-error.ts`, and add its status to `statusByKind` in `presentation/middleware/error-handler.ts`. TypeScript fails the build until all three match.
</important>

Keep this file current: update it in the same commit when you add a folder, an error kind or a new kind of domain building block.
