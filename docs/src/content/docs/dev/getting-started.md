---
title: Getting started
description: Get Growth running on your machine.
---

## What you need

- [Bun](https://bun.sh) 1.3 or newer
- [Docker](https://www.docker.com) for the database
- Git
- The Biome extension for your editor. In VS Code that's `biomejs.biome`. Set it as your default formatter.

## Set it up

**1. Clone the repo**

```sh
git clone git@github.com:hayley-d/growth.git
cd growth
```

**2. Install everything**

```sh
bun install
```

This also sets up the pre-commit hook. You don't need to do anything else for Lefthook. If you installed with `--ignore-scripts`, run `bunx lefthook install`.

Then download the browser for the component tests. You only do this once:

```sh
cd frontend
bun run test:install-browsers
cd ..
```

**3. Add your env file**

```sh
cp backend/.env.example backend/.env
```

It should look like this:

```sh
DATABASE_URL="postgresql://growth:growth@localhost:5433/growth?schema=public"
PORT=3000
LOG_LEVEL=info
BETTER_AUTH_SECRET="replace-with-32-plus-random-characters"
BETTER_AUTH_URL="http://localhost:5173"
```

`LOG_LEVEL` can be `fatal`, `error`, `warn`, `info`, `debug`, `trace` or `silent`.

Generate a real `BETTER_AUTH_SECRET` and paste it in:

```sh
openssl rand -base64 32
```

Leave `BETTER_AUTH_URL` as `http://localhost:5173`. It has to match the origin your browser visits (the Vite dev server, which proxies `/api` to the backend), not the backend's own port.

**4. Start the database**

```sh
docker compose up -d
cd backend
bun run prisma:migrate
bun run prisma:generate
cd ..
```

`prisma:migrate` creates every table. Run it again whenever you pull a new migration.

Postgres runs on port `5433`, not the usual `5432`, so it won't clash with any Postgres you already have.

**5. Seed a dev admin (optional)**

```sh
cd backend
bun run prisma:seed
cd ..
```

Creates `admin@growth.local` / `growth123` with the `admin` role. Safe to re-run: it resets that password if the admin already exists. Refuses to run against anything but a localhost database.

**6. Run it**

```sh
bun run dev
```

| What | Where                            |
| ---- | -------------------------------- |
| App  | http://localhost:5173            |
| API  | http://localhost:3000/api/health |
| Docs | http://localhost:4321            |

Only need one part? Run `bun run --filter @growth/frontend dev`. The same works for `backend` and `docs`.

## Check it works

- http://localhost:3000/api/health should show `{"status":"ok"}`.
- `bun run typecheck` and `bun run test` should both pass.

## Handy commands

| Command                                  | What it does                       |
| ---------------------------------------- | ---------------------------------- |
| `docker compose down`                    | Stop the database                  |
| `docker compose down -v`                 | Stop it and wipe all its data      |
| `bun run prisma:migrate` (in `backend`)  | Apply changes to the schema        |
| `bun run prisma:studio` (in `backend`)   | Browse the database in your browser |
| `bun run prisma:seed` (in `backend`)     | Create the dev admin login         |
| `bun run check`                          | Format and fix lint issues         |

## If something breaks

:::caution[Port already in use]
Something else is on that port, often a dev server that didn't close. Find it with `lsof -iTCP:4321 -sTCP:LISTEN` and stop it with `kill <pid>`. Swap in whichever port is stuck.
:::

:::caution[The API can't reach the database]
Make sure Docker is running and that `backend/.env` uses port `5433` and the `growth` user.
:::

:::caution[Missing `routeTree.gen.ts` or Prisma client]
These files are generated, not committed. Run `bun run typecheck` and it will create them.
:::

:::caution[The hook fails on the very first commit]
Lefthook can't run in a repo with no commits yet. Use `git commit --no-verify` for that one commit only.
:::
