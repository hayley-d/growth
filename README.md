# Growth

## Quick start

You need [Bun](https://bun.sh), [Docker](https://www.docker.com) and Git.

```sh
git clone git@github.com:hayley-d/growth.git
cd growth
bun install
cp backend/.env.example backend/.env
docker compose up -d
cd backend && bun run prisma:migrate && bun run prisma:generate && cd ..
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
- `backend/` is the Hono API, with Prisma and Postgres.
- `shared/` holds the zod schemas and the AVL tree functions both sides use.
- `docs/` is the docs site you're about to read.

## More

The full setup guide, architecture notes and a page on each tree live in the docs. Run `bun run dev` and open http://localhost:4321.

Before you commit, read the branches and commits page in the docs. Commits must be conventional commits, and a hook checks this.
