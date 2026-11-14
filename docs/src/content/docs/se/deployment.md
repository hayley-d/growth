---
title: Deployment and running
description: How to run Growth.
---

## Deployment

Growth is not currently deployed anywhere; it was built as a prototype for COS750. It is easy to run on any developer's machine. We only host our documentation site, using GitHub Pages.

## Running locally

### Requirements

- [Bun](https://bun.sh) 1.3 or newer
- [Docker](https://www.docker.com), for the PostgreSQL database
- Git
- Node 24, the version pinned in `.nvmrc`

### Services

| Service  | How it runs                     | Address                               |
| -------- | ------------------------------- | ------------------------------------- |
| Database | PostgreSQL 17 in Docker         | `localhost:5433`                      |
| Backend  | Hono API on Bun                 | http://localhost:3000 (`/api/health`) |
| Frontend | Vite dev server, proxies `/api` | http://localhost:5173                 |
| Docs     | Astro dev server                | http://localhost:4321                 |

Docker is only used for running our PostgreSQL database. A `docker-compose.yml` defines a database service that uses `growth` as the user, password and database name. This setup is only suitable for
local development. Data is stored in a Docker volume called `database-data`.

### Setup

```sh
git clone git@github.com:hayley-d/growth.git
cd growth
bun install
cp backend/.env.example backend/.env
docker compose up -d
cd backend
bun run prisma:migrate
bun run prisma:generate
bun run prisma:seed
cd ..
bun run dev
```

- `bun install` also installs the Git hooks for developers.
- `BETTER_AUTH_SECRET` in `backend/.env` must be generated with `openssl rand -base64 32`. Better Auth uses it to sign sessions, and the backend refuses to start with the placeholder value.
- `BETTER_AUTH_URL` must be set to `http://localhost:5173` to match the browser origin.
- `prisma:migrate` applies the migrations and `prisma:generate` builds the Prisma client (ORM).
- `prisma:seed` loads the learning styles, code languages and course content. When `SEED_DEV_ADMIN=true` and the database is running locally, it creates a dev admin account (`admin@growth.local`).
- `bun run dev` starts the frontend, backend and docs site.

### Updating

After pulling new changes, run `bun install` and then `bun run prisma:migrate` in `backend/`. A database that is missing a migration returns 500 errors on the endpoints that use the new columns.

### Other commands

| Command                              | What it does                            |
| ------------------------------------ | --------------------------------------- |
| `bun run build`                      | Typechecks and builds every package     |
| `bun run test`                       | Runs every test suite                   |
| `bun run check`                      | Formats and fixes lint issues           |
| `bun run prisma:studio` (`backend/`) | Opens the database in the browser       |
| `bun run unlock` (`backend/`)        | Marks lessons as completed for a user   |
| `docker compose down`                | Stops the database and keeps its data   |
| `docker compose down -v`             | Stops the database and deletes its data |

## The docs site

Our documentation is built using Astro Starlight that lives under `docs/`. It includes this Software Engineering document and our Instructional Design document. The live site is at [hayley-d.github.io/growth](https://hayley-d.github.io/growth/).

A `Docs` workflow (`docs.yml`) builds the site and deploys it to GitHub Pages on pushes to `master`. To build docs locally, run `bun run --filter @growth/docs build`.

The PDFs we hand in are made from the docs site itself, so they never drift from it. `bun run pdf` makes one PDF for this document and one for the ID document, and `bun run pdf:api` makes one for the API reference. The API reference is left out of this document's PDF because it is very long. The files are written to `docs/dist-pdf/`. The first run downloads Chrome for Puppeteer.

## The repository

All our code and documentation is in [the GitHub repository](https://github.com/hayley-d/growth).
