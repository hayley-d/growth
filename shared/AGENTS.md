# Shared

Zod schemas and the types inferred from them. This is the contract between the frontend and the backend. Both import it through `@shared/`, for example `@shared/schemas/health`.

## Where things go

```
shared/src/
  index.ts           re-exports schemas/
  schemas/
    index.ts         re-exports every schema file
    common.ts        id params, pagination, paged responses
    error.ts         the error response body
    <feature>.ts     request and response schemas for one feature
```

- One file per feature, named after it: `schemas/course.ts`. Export it from `schemas/index.ts`.
- Name schemas `<thing>Schema` and export the inferred type next to it with the same name minus `Schema`:

  ```ts
  export const createCourseRequestSchema = z.object({ ... });
  export type CreateCourseRequest = z.infer<typeof createCourseRequestSchema>;
  ```

- Request schemas end in `RequestSchema`, response schemas in `ResponseSchema`, query strings in `QuerySchema`, path params in `ParamsSchema`.
- Query and path values arrive as strings. Use `z.coerce` for numbers, like `paginationQuerySchema` does.
- Reuse what's in `common.ts` before writing your own: `idParamSchema`, `paginationQuerySchema`, `paginatedResponseSchema(itemSchema)`, `toSkipTake`, `toPaginatedResponse`.

## Who uses it

- The backend validates requests with these schemas (`validateRequest` in `presentation`) and builds responses that match them.
- The frontend parses every response with them in `services/` and uses the types in hooks and components.
- The backend `domain` layer must not import `@shared/`. Application maps between shared DTOs and domain entities.

## What can't go here

- Only `zod` is a dependency. No Express, Prisma, React, axios or anything else tied to one side.
- No I/O, no environment variables, no app logic. Small pure helpers for a schema (like `toSkipTake`) are fine.
- No relative imports. Use `@shared/...` inside this package too.

<important if="changing an existing schema">
Both sides depend on it. Update the backend handler and the frontend service in the same change, and run `bun run typecheck` and `bun run test` from the root, not just here.
</important>

## Tests

Test any schema with defaults, coercion or helpers in `<feature>.test.ts` next to it. See `schemas/common.test.ts`.

Keep this file current: update it in the same commit when you add a folder, a naming pattern or a shared helper.
