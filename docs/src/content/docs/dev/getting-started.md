---
title: Getting started
description: Get Growth running on your machine.
---

## What you need

- [Bun](https://bun.sh) 1.3 or newer
- [Docker](https://www.docker.com) for the database
- Git
- The Biome extension for your editor.

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

This also sets up the pre-commit hook. If you installed with `--ignore-scripts`, run `bunx lefthook install`.

Then download the browser for the component tests.

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
SEED_DEV_ADMIN=true
```

`LOG_LEVEL` can be `fatal`, `error`, `warn`, `info`, `debug`, `trace` or `silent`.

Generate a real `BETTER_AUTH_SECRET` and paste it in:

```sh
openssl rand -base64 32
```

Leave `BETTER_AUTH_URL` as `http://localhost:5173`. It has to match the origin your browser visits.

**4. Start the database**

```sh
docker compose up -d
cd backend
bun run prisma:migrate
bun run prisma:generate
cd ..
```

`prisma:migrate` runs the migrations.

**5. Seed the database**

```sh
cd backend
bun run prisma:seed
cd ..
```

Adds the four learning styles, three code languages, and the algorithms. 
When `SEED_DEV_ADMIN=true` and the database is on localhost, it creates a dev admin.

**6. Run it**

```sh
bun run dev
```

| What | Where                            |
| ---- | -------------------------------- |
| App  | http://localhost:5173            |
| API  | http://localhost:3000/api/health |
| Docs | http://localhost:4321            |


## Common commands

| Command                                  | What it does                       |
| ---------------------------------------- | ---------------------------------- |
| `bun run prisma:migrate` (in `backend`)  | Apply changes to the schema        |
| `bun run prisma:studio` (in `backend`)   | Browse the database in your browser |
| `bun run prisma:seed` (in `backend`)     | Add learning styles, code languages, algorithms and the dev admin |
| `bun run dev:progress <email> <0-12>` (in `backend`) | Fake a learner's progress to preview the dashboard |
| `bun run check`                          | Format and fix lint issues         |
