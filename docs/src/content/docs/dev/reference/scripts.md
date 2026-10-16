---
title: Scripts and tooling
description: Workspace scripts, Biome, the pre-commit hook and coding rules.
---

## Root scripts

| Script              | What it does                                         |
| ------------------- | ---------------------------------------------------- |
| `bun run dev`       | Starts the backend, frontend and docs together       |
| `bun run build`     | Builds every package                                 |
| `bun run test`      | Runs every package's tests                           |
| `bun run typecheck` | Type checks every package                            |
| `bun run lint`      | Lints with Biome                                     |
| `bun run format`    | Formats with Biome                                   |
| `bun run check`     | Formats, organises imports and applies lint fixes    |

## Backend scripts

| Script                    | What it does                       |
| ------------------------- | ---------------------------------- |
| `bun run prisma:generate` | Generates the Prisma client        |
| `bun run prisma:migrate`  | Creates and applies a migration    |
| `bun run prisma:studio`   | Opens Prisma Studio                |

## Frontend scripts

| Script                          | What it does                                  |
| ------------------------------- | --------------------------------------------- |
| `bun run test`                  | Runs unit tests in Node and component tests in Chromium |
| `bun run test:install-browsers` | Downloads Chromium for the component tests    |

Files ending in `.test.ts` run in Node. Files ending in `.test.tsx` run in a real browser with Vitest browser mode.

## Pre-commit hook

Lefthook runs two jobs on every commit:

1. `biome check --write --error-on-warnings` on staged files. Fixes are staged automatically, and anything that cannot be fixed blocks the commit.
2. `bun run typecheck` across every package.

## Continuous integration

GitHub Actions runs `.github/workflows/ci.yml` on pushes to `master` and on pull requests. Four jobs run in parallel:

| Job       | Command               | Blocks the pipeline |
| --------- | --------------------- | ------------------- |
| Lint      | `bunx biome ci .`     | Yes                 |
| Typecheck | `bun run typecheck`   | Yes                 |
| Build     | `bun run build`       | Yes                 |
| Test      | `bun run test`        | No                  |

The test job starts its own Postgres on port 5433 and installs Chromium. It uses `continue-on-error`, so failing tests are reported without failing the run.

## Coding rules

- Pin every dependency to an exact version. No `^` or `~`. `bunfig.toml` sets `exact = true`, so `bun add` does this for you.
- Import with `@/` for the current package and `@shared/` for shared code. Biome rejects `./` and `../` imports everywhere except `docs`.
- Imports are organised into external packages, a blank line, then internal `@shared/` and `@/` imports. `bun run check` applies this automatically.

```ts
import { z } from "zod";

import { createUserSchema } from "@shared/schemas/user";
import { UserRepository } from "@/domain/users/user-repository";
```

- Never write comments in code.
- Write every variable name in full: `request`, `response`, `error`, `index`, never `req`, `res`, `err`, `i`.
- Never add co-author lines to commits.
