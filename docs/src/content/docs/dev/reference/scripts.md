---
title: Scripts and tooling
description: Workspace scripts, Biome, the git hooks and coding rules.
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

| Script                    | What it does                                           |
| ------------------------- | ------------------------------------------------------- |
| `bun run prisma:generate` | Generates the Prisma client                            |
| `bun run prisma:migrate`  | Creates and applies a migration                        |
| `bun run prisma:deploy`   | Applies existing migrations without creating a new one. Used in CI |
| `bun run prisma:studio`   | Opens Prisma Studio                                    |
| `bun run prisma:seed`     | Adds the learning styles and code languages. Also creates the dev admin login (`admin@growth.local`) when `SEED_DEV_ADMIN=true` and the database is on localhost |
| `bun run auth:generate`   | Merges anything new Better Auth needs into `infrastructure/auth/models/auth.prisma`. Run it after you upgrade Better Auth or add a plugin, then create a migration |

## Frontend scripts

| Script                          | What it does                                  |
| ------------------------------- | --------------------------------------------- |
| `bun run test`                  | Runs unit tests in Node and component tests in Chromium |
| `bun run test:install-browsers` | Downloads Chromium for the component tests    |

Files ending in `.test.ts` run in Node. Files ending in `.test.tsx` run in a real browser with Vitest browser mode.

## Git hooks

Lefthook runs two jobs before every commit:

1. `biome check --write --error-on-warnings` on staged files. Fixes are staged automatically, and anything that cannot be fixed blocks the commit.
2. `bun run typecheck` across every package.

Then a `commit-msg` hook runs commitlint on the message. It must be a conventional commit. See [Branches and commits](../git-workflow/).

## Continuous integration

GitHub Actions runs `.github/workflows/ci.yml` on pushes to `master` and on pull requests. Four jobs run in parallel:

| Job       | Command               | Blocks the pipeline |
| --------- | --------------------- | ------------------- |
| Lint      | `bunx biome ci .`     | Yes                 |
| Typecheck | `bun run typecheck`   | Yes                 |
| Build     | `bun run build`       | Yes                 |
| Test      | `bun run test`        | No                  |

The test job starts its own Postgres on port 5433 and installs Chromium. It uses `continue-on-error`, so failing tests are reported without failing the run.

## Docs site

`.github/workflows/docs.yml` builds this site and publishes it to GitHub Pages at https://hayley-d.github.io/growth/. It runs on every push to `master`, and you can also start it by hand from the Actions tab. The site is static, so it doesn't need the backend.

The site lives under `/growth`, set by `base` in `docs/astro.config.mjs`. Starlight adds the prefix to sidebar links for you, but not to links you write in pages. Use relative links there, like `../git-workflow/`, not `/dev/reference/git-workflow/`.

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
