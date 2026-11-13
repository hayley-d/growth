---
title: Quality and testing
description: Ensuring specifications are met and code quality is high.
---

## Testing approach

It is important to ensure that Growth meets the outlined specification and
that code quality is high and verifiable. Given the very short timeline of the project, as described in the [software engineering approach](/growth/se/approach/),
it was not reasonable for us to write an extensive test suite by hand. Therefore, all our tests were generated using agentic development practices, but
tests were still included in the review process like the rest of the code.

Testing is conducted across three levels and run using Vitest. The tests can be run via `bun run test` from the project root. Most tests sit under `src/test` at the same path as
the code they cover. In `shared/` (e.g. the AVL engine), each folder has a `test/` folder next to `src/`.

| Level       | Where                                            | Runs in                                                | What it covers                                                                             |
| ----------- | ------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Unit        | `shared/`, `backend/`, `frontend/` (`*.test.ts`) | Node                                                   | Schemas, the AVL and question generation engine, domain rules, use cases, services, stores |
| Component   | `frontend/` (`*.test.tsx`)                       | Chromium browser (Vitest browser mode with Playwright) | Atoms, molecules, organisms and pages                                                      |
| Integration | `backend/`                                       | Node (real PostgreSQL instance)                        | Prisma repositories, Better Auth, content loading                                          |

E2E tests were not included. Cohesive app functionality was instead tested manually.
At time of writing there are approximately 100 test files in `frontend`, another 89 in `backend` and 27 in `shared`.

## Linting and type checks

### Linting

**Biome** is used for linting and formatting to keep code style consistent among the development team. `bun run check` formats source code, sorts imports alphabetically and applies fixes where code does not
conform to these rules. `biome ci` runs the same checks (without writing) in the CI pipeline.

The following rules apply:

- Two spaces, 100-column width, double quotes, semicolons and trailing commas.
- Imports are sorted into two groups: external packages, then `@shared/` and `@/`.
- Relative imports are an error in `frontend`, `backend` and `shared`, so imports use the `@/` and `@shared/` aliases. Only `docs` may use relative imports.
- Each backend layer has its own import rules, which enforce clean architecture:
  - `domain` cannot import `application`, `infrastructure`, `presentation`, Prisma or Hono.
  - `application` cannot import `infrastructure`, `presentation`, Prisma or Hono.
  - `infrastructure` cannot import `presentation`.
  - `presentation` cannot import `infrastructure` or Prisma.
- Generated files ( e.g. `routeTree.gen.ts`, `src/generated` and `openapi.json`) are ignored by Biome.

### Type checking

`bun run typecheck` runs `tsc --noEmit` on every package, ensuring our code complies with TypeScript 7 checks (strict mode). Our `tsconfig.base.json` file
is set up with `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters` and `verbatimModuleSyntax`.

## Git hooks

Git hooks are set up to automatically run the formatter and ensure that commits are in line with the [Conventional Commits standard](https://www.conventionalcommits.org/en/v1.0.0/),
e.g. `feat(frontend): add tree loader`. We use Lefthook, which installs the hooks when you run `bun install`.

| Hook         | What runs                                                                                                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pre-commit` | `biome check --write --error-on-warnings` on staged files, and fixes are re-staged. Then PNGs staged under `docs/src/assets/` are converted to WebP to save space. Then `bun run typecheck` |
| `commit-msg` | commitlint with `@commitlint/config-conventional` (body line length is not limited)                                                                                                         |

## The CI pipeline

GitHub Actions runs three workflows. The CI workflow (`ci.yml`) runs on every pull request and on pushes to `master`. It has four jobs:

| Job             | Runs                                                                                                      | Blocks the merge         |
| --------------- | --------------------------------------------------------------------------------------------------------- | ------------------------ |
| Lint and format | `biome ci .`                                                                                              | Yes                      |
| Typecheck       | `bun run typecheck`                                                                                       | Yes                      |
| Build           | Prisma generate, then `bun run build`                                                                     | Yes                      |
| Test            | Prisma deploy against a PostgreSQL 17 service container, Playwright Chromium install, then `bun run test` | No (`continue-on-error`) |

The test job reports but is non-blocking. Because of `continue-on-error`, the job still indicates a pass when a test fails, so check the job logs should be checked for failures.

**Release source** (`release-source.yml`) runs on all pull requests. It fails any pull request created into `master` that doesn't originate from `staging`.

**Docs** (`docs.yml`) runs on pushes to `master` (and by hand). It builds the docs site and deploys it to GitHub Pages.

Every pull request also needs at least one reviewer's approval. The branch and merge rules are in the [software engineering approach](/growth/se/approach/#git-workflow).
