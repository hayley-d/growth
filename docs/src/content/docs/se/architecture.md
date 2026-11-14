---
title: Architecture
description: The overarching design of our application and the stack we chose.
---

## The system

Growth is a web app consisting of three packages all in the same Bun workspace:

- A React SPA built using Vite.
- A Hono API for our backend, running on Bun.
- A shared package containing the AVL engine and Zod schemas used for validation.

Our backend stores data in a PostgreSQL database, and the frontend communicates with the backend via a REST API over HTTP.

![Architecture diagram: the frontend (routes, pages, components, hooks, services and Zustand stores) calls the backend over HTTP. The backend has presentation, application, domain and infrastructure layers, and infrastructure reads and writes PostgreSQL. Both sides import the shared package.](../../../assets/se/architecture-diagram.webp)

_Figure 2: The frontend, the backend and the shared package._

## Shared contracts

The shape of every request and response schema is detailed via a Zod schema in the `shared` package. The frontend and backend both import these schemas to ensure
that these contracts are honoured by both:

- The backend uses the schema to validate each request and to create each response shape.
- The frontend uses it to validate every response before rendering it in a component.

Zod is the natural choice, as it provides runtime checks and can be used to infer a TypeScript type. If a schema changes, the compiler provides a list of every place that must be updated.

Furthermore, the package holds the AVL tree engine and question generators. Everything from the playground to the tests uses the same AVL engine, so any AVL operation is identical
on the page and the backend.

## Backend

The backend is a [Hono](https://hono.dev/) API on Bun. We chose Hono because it is built on web standards (the same `Request` and `Response` objects as the browser) and because of its incredible
performance.

**PostgreSQL** is used to store our data. It was chosen since our data is inherently relational. **PostgreSQL** is also seen as an industry standard for relation databases and
has a mature ecosytem. We never interact with the database via raw SQL. Any interaction is done via our ORM, **Prisma** which provides a typed client and even manages migrations.
use **Prisma** as our ORM, which provides a typed client and manages migrations in our repository.

### Clean architecture

Our backend is split across four layer with inward pointing dependencies:

| Layer            | What it holds                                               | May depend on              |
| ---------------- | ----------------------------------------------------------- | -------------------------- |
| `domain`         | Entities, repository interfaces and errors. No I/O          | Nothing else in the app    |
| `application`    | One use case per action, like "start an attempt"            | `domain`                   |
| `infrastructure` | Prisma repositories, Better Auth, logging and configuration | `domain` and `application` |
| `presentation`   | Hono routes, controllers and middleware                     | `application` and `domain` |

We decided to organise our codebase around clean architecture since:

- the rules of the app can be verified without a running database or a server, using mocks .
- layers are independent, so once can change without affecting the other.
- files are naturally organised which helps when features are built by multiple devs at the same time.

## Frontend

The frontend is built with [React](https://react.dev/). We chose it because everyone on the team already knows it, which is important in a time-constrained project. Around it we use:

- **TanStack Router** for file-based routing and **TanStack Query** for data from the API.
- **Zustand** for managing browser state like colour schemes or playback speed.
- **Tailwind CSS** and shadcn/ui for styling.

Data follows a one-directional flow. A route renders a page, and the page calls a hook, which in turn calls a service. Finally, the service calls the API.

### Atomic design

Components are sorted by what they are made of:

| Level       | What it is                 | Example                   |
| ----------- | -------------------------- | ------------------------- |
| `atoms`     | One element                | button, tree node         |
| `molecules` | A few atoms together       | labelled input, nav links |
| `organisms` | A whole section of a page  | navbar, tree canvas       |
| `templates` | A page layout with no data | app layout                |

Atomic design was a natural fit as small parts are continually reused across the app. A tree is drawn in lessons, the playground, tests and even on the login page. Each component
can be tested by itself.

## Authentication

All authentication is handled by [Better Auth](https://www.better-auth.com/). It stores users and sessions and lives under `infrastructure` in the same database as the rest of the application. The backend middleware reads sessions cookies on requests and notes the signed in user. Any API routes that are gated behind auth checks use it. The frontend loads the session before opening the page and pages requiring a signed in user sits under a layout that will redirect any unauthenticated user to the login page.

## Course content

Lessons, questions and code snippets do not live in the database. They are stored as `.ts` files under `backend/prisma/content`. Thus, content is reviewed and versioned like our code.
A loader puts these files into the database. Files are read and validated against Zod schemas, and any problems are listed. Every lesson, question and answer option for MCQ is uniquely keyed, and the loader turns this key into a fixed id, so loading is idempotent. The frontend still receives lessons and questions via API and never reads these files directly.
