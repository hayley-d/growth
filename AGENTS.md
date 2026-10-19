# Growth

An interactive app for learning the tree data structures students struggle with: AVL, red-black, 2-3 / 2-3-4, splay, treap, B-tree, B+ tree, Merkle tree, trie and binary heap. `docs/src/content/docs/learn/trees.md` says what each one covers.

This is a Bun workspace with three packages plus a docs site. Each package and each layer has its own `AGENTS.md` with the rules for that folder. Read the nearest one before you add or move a file. `<important if="…">` blocks only apply when the condition is true.

## Rules

1. Never co-author commits. No `Co-Authored-By` lines or any AI attribution in commit messages or pull requests.
2. Never write comments in code.
3. Write every variable name in full: `request`, `response`, `error`, `index`, `event`, `parameters`, `properties`. Never `req`, `res`, `err`, `i`, `e`, `params`, `props`.
4. Keep the agent files current. When a change adds, moves or renames a folder, a file pattern, a script, a dependency or a convention, update the matching `AGENTS.md` in the same commit. Remove anything the change made wrong. A new folder with its own rules gets an `AGENTS.md`, a `CLAUDE.md` stub containing only `@AGENTS.md`, and a line in the index below.
5. A change is done when `bun run check` passes, the tests for what you touched pass, and the agent files and docs match the code.
6. Write docs, README text and agent files in simple, short, human-sounding language.

## Where things go

| Package | What it is | Rules |
| --- | --- | --- |
| `shared/` (`@growth/shared`) | Zod schemas and inferred types. Every request and response contract. | `shared/AGENTS.md` |
| `backend/` (`@growth/backend`) | Express 5 API on Bun, Prisma 7, PostgreSQL. Clean architecture, layer first. | `backend/AGENTS.md` |
| `frontend/` (`@growth/frontend`) | React 19, Vite, TanStack Router, Query, Form and Table, Zustand, Tailwind v4, shadcn/ui. Atomic design. | `frontend/AGENTS.md` |
| `docs/` (`@growth/docs`) | Astro Starlight site. | below |

A new feature usually touches all three packages in this order: the contract in `shared/`, then the backend layers, then the frontend service, hook and page. Each package's `AGENTS.md` has its own checklist.

## Tooling

- Use bun for everything: `bun install`, `bun add`, `bun run <script>`, `bunx`. Never npm, pnpm or yarn.
- Pin every dependency to an exact version. `bunfig.toml` sets `exact = true`, so `bun add` does it for you. Never write `^` or `~`.
- Add a dependency to the package that uses it (`bun add <name>` inside `frontend/`, `backend/` or `shared/`), not the root. The root only holds repo tooling.
- Biome is the only linter and formatter. `bun run check` formats, sorts imports and applies fixes.
- No relative imports (`./`, `../`) in `frontend`, `backend` or `shared`. Use `@/` for the current package and `@shared/` for shared code. Only `docs` may use relative imports.
- Imports come in two groups with a blank line between: external packages (bun, node, npm) first, then `@shared/` and `@/`. `bun run check` sorts them.
- Root scripts: `dev`, `build`, `test`, `typecheck`, `lint`, `format`, `check`. Run one package with `bun run --filter @growth/<package> <script>`.
- Tests sit next to the file they test: `thing.ts` and `thing.test.ts` in the same folder.

## Git

- `master` is what's released. `staging` is where finished work lands. Never push straight to either, except the release push below.
- Branch off `staging` as `<type>/<short-name>`, for example `feat/avl-insert` or `fix/navbar-gap`.
- Feature branches go into `staging` by pull request and are squash merged. The pull request title becomes the commit, so it must be a conventional commit.
- `staging` goes into `master` by fast-forward only. Open the pull request for CI, then run `git fetch origin && git push origin origin/staging:master`. Never click the merge button and never force push. A rebase merge rewrites the hashes and splits the two branches. Steps are in the git guide under Releasing.
- Conventional Commits only: `<type>(<optional scope>): <summary>`. Summary in lower case, no full stop. Then a blank line and a short bullet list of what changed. No ticket numbers.
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`. Scopes: `frontend`, `backend`, `shared`, `docs`. Leave the scope out when a change spans several.
- Full guide: `docs/src/content/docs/dev/reference/git-workflow.md`.

## Hooks and CI

- Lefthook runs on every commit (`lefthook.yml`, installed by `bun install`). Pre-commit runs `biome check --write --error-on-warnings` on staged files and re-stages fixes, then `bun run typecheck`. `commit-msg` runs commitlint (`commitlint.config.ts`).
- Never bypass the hooks with `--no-verify`. Fix the problem they report.
- CI (`.github/workflows/ci.yml`) runs on pushes to `master` and on every pull request: `biome ci .`, `bun run typecheck`, `bun run build`, `bun run test`. Lint, typecheck and build block. Tests only report.
- `.github/workflows/release-source.yml` fails any pull request into `master` that doesn't come from `staging`. It's a required check called **Source is staging**.

<important if="a Biome import rule rejects your import">
Never loosen `biome.json` to make an import pass. The rule is telling you the code is in the wrong place. Move it to the right layer or package instead.
</important>

## Docs

- Pages live in `docs/src/content/docs`. `learn/` is for people learning the trees, `dev/` is for people working on the code.
- Add every new page to the sidebar in `docs/astro.config.mjs`.
- Update the `dev/` pages whenever the architecture, scripts or setup change.
- `docs/` pins TypeScript 6 because `astro check` doesn't support TypeScript 7. Don't bump it.
- `docs/plans/` is git-ignored. It holds proposals the team hasn't agreed on. Share them directly.

## Running locally

```sh
docker compose up -d
bun install
cp backend/.env.example backend/.env
cd backend && bun run prisma:generate && cd ..
bun run dev
```

Backend on http://localhost:3000 (health check at `/api/health`). Frontend on http://localhost:5173, which proxies `/api` to the backend. Docs on http://localhost:4321. Postgres runs on port 5433.

## Keeping these files current

Record what a quick read of the code can't tell you: where things go, rules, gotchas and why they exist. Don't list every file or repeat function signatures. Every claim must be true of the code after your change. Put each rule in the smallest folder it applies to, and don't repeat it elsewhere. Keep this file under 150 lines.

## Index

Nested files load on their own when you work in their folder. This list is for finding one up front.

| File | Covers |
| --- | --- |
| `shared/AGENTS.md` | schemas, contracts, what can't go in shared |
| `backend/AGENTS.md` | backend overview, scripts, Prisma, migrations, testing, new feature checklist |
| `backend/src/domain/AGENTS.md` | entities, value objects, repository interfaces, errors |
| `backend/src/application/AGENTS.md` | use cases, DTO mapping, request context, Logger type |
| `backend/src/infrastructure/AGENTS.md` | Prisma repositories, config, logging, lifecycle |
| `backend/src/presentation/AGENTS.md` | routes, middleware, validation, error responses |
| `frontend/AGENTS.md` | frontend overview, mobile first, tests, new feature checklist |
| `frontend/src/components/AGENTS.md` | atoms, molecules, organisms, templates, shadcn |
| `frontend/src/services/AGENTS.md` | API services, error shaping, response parsing |
| `frontend/src/lib/AGENTS.md` | query and mutation hooks, query client, utilities |
| `frontend/src/routes/AGENTS.md` | file-based routes |
| `frontend/src/pages/AGENTS.md` | pages |
| `frontend/src/stores/AGENTS.md` | Zustand stores |
