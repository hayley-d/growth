# Rebalance

## Quick start

You need [Bun](https://bun.sh), [Docker](https://www.docker.com) and Git.

```sh
git clone git@github.com:hayley-d/rebalance.git
cd rebalance
bun install
cp backend/.env.example backend/.env
docker compose up -d
cd backend && bun run prisma:generate && cd ..
bun run dev
```

Then open:

| What     | Where                                |
| -------- | ------------------------------------ |
| App      | http://localhost:5173                |
| API      | http://localhost:3000/api/health     |
| Docs     | http://localhost:4321                |

## What's in here

- `frontend/` is the React app.
- `backend/` is the Express API, with Prisma and Postgres.
- `shared/` holds the zod schemas both sides use.
- `docs/` is the docs site you're about to read.

## More

The full setup guide, architecture notes and a page on each tree live in the docs. Run `bun run dev` and open http://localhost:4321.
