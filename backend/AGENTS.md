# Backend

Express 5 API on the Bun runtime. Prisma 7 with PostgreSQL through the `@prisma/adapter-pg` driver adapter. Vitest and supertest for tests. Pino for logs.

## Layers

Clean architecture, organised layer first. Each layer has its own `AGENTS.md`.

```
backend/src/
  domain/          pure rules: entities, value objects, repository interfaces, errors
  application/     use cases and DTO mapping
  infrastructure/  Prisma repositories, config, logging, lifecycle
  presentation/    Express routes, middleware and the application factory
  generated/       Prisma client (git-ignored, never edit)
  main.ts          composition root: builds everything and wires it together
```

Dependencies point inward: `presentation` and `infrastructure` → `application` → `domain`. Biome enforces this with a `noRestrictedImports` override per layer in `biome.json`:

| Layer | Must not import |
| --- | --- |
| `domain` | application, infrastructure, presentation, Prisma, `@shared/`, Express |
| `application` | infrastructure, presentation, Prisma, Express |
| `infrastructure` | presentation |
| `presentation` | infrastructure, Prisma |

`main.ts` is the only file that sees every layer. It creates the logger, the repositories and the use cases, and passes them into `createApplication`.

Imports use `@/` for `backend/src` (for example `@/domain/errors`) and `@shared/` for shared code.

<important if="editing a layer override in biome.json">
Each override replaces the base `noRestrictedImports` options instead of adding to them. That's why every override repeats the "no relative imports" pattern. Keep it in every override you touch.
</important>

## Adding a feature

Use a singular feature name (`course`, `lesson`) and the same name in every layer.

1. Contract: request and response schemas in `shared/src/schemas/<feature>.ts`.
2. Domain: the entity and the repository interface in `domain/<feature>/`.
3. Application: one use case per action in `application/<feature>/`. Takes the repository interface, returns a DTO that matches the shared response schema.
4. Infrastructure: the Prisma repository in `infrastructure/<feature>/`, implementing the domain interface.
5. Presentation: `presentation/routes/<feature>-routes.ts`, built by a factory that takes the use cases. Mount it in `presentation/http/create-application.ts`.
6. Wiring: create the repository and use cases in `main.ts` and pass them to `createApplication`.
7. Tests next to each file. Then add the feature to the matching `AGENTS.md` if it brings a new rule.

## Scripts

Run these from `backend/`.

| Script | What it does |
| --- | --- |
| `bun run dev` | Watches `src/main.ts`, logs through `pino-pretty` |
| `bun run test` | Vitest, `src/**/*.test.ts` |
| `bun run typecheck` | Generates the Prisma client, then `tsc --noEmit` |
| `bun run build` | Typecheck, then bundles to `dist/` |
| `bun run prisma:generate` | Generates the client into `src/generated/prisma` |
| `bun run prisma:migrate` | Creates and applies a migration |
| `bun run prisma:studio` | Opens Prisma Studio |

## Prisma

- Schema: `prisma/schema.prisma`. Config, including the migrations path and `DATABASE_URL`: `prisma.config.ts`.
- The client is generated into `src/generated/prisma` and imported as `@/generated/prisma/client`. Only `infrastructure` may import it.
- After editing the schema, run `bun run prisma:migrate --name <what-changed>`, then `bun run prisma:generate`. Prisma 7 doesn't regenerate the client on migrate.
- There are no models or migrations yet. The first migration creates `prisma/migrations/`.

<important if="changing the database">
Never edit, rename or delete an existing migration in `prisma/migrations/`. Change `schema.prisma` and create a new migration. If a migration is wrong, fix it with another migration.
</important>

## Environment

- `infrastructure/config/environment.ts` parses `process.env` with zod at startup and exports `environment`. A bad or missing value crashes the app on boot, on purpose.
- To add a variable: add it to the schema there and to `backend/.env.example`. Never read `process.env` anywhere else.
- `backend/.env` is git-ignored. Never commit it.

## Testing

- Tests sit next to the file they test and end in `.test.ts`.
- Route and middleware tests build an app with `createApplication({ logger })` or a small `express()` app and call it with supertest.
- Pass a stub `Logger` built from `vi.fn()`. Never use the real pino logger in tests.
- Test use cases with an in-memory fake of the domain repository interface. Don't mock Prisma.

Keep this file current: update it in the same commit when scripts, Prisma setup, environment handling or the feature checklist change.
