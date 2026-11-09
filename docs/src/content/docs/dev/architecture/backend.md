---
title: Backend
description: Clean architecture layers in the Hono API.
---

The backend follows clean architecture with a layer-first layout. Each layer holds one folder per feature.

```
backend/src/
  domain/<feature>/          entities, value objects, repository interfaces
  domain/errors/             errors use cases throw
  application/<feature>/commands/  use cases that change state
  application/<feature>/queries/   use cases that only read
  application/context/       request context (request id per request)
  application/logging/       the Logger type
  infrastructure/<module>/   prisma models and repositories for one module
  infrastructure/<module>/mappers/  turn prisma rows into domain entities and back
  infrastructure/config/     zod-validated environment
  infrastructure/database/   prisma client and prisma error mapping
  infrastructure/logging/    pino logger
  infrastructure/lifecycle/  process error handlers and graceful shutdown
  infrastructure/seed/       seed steps and their data, run by prisma/seed.ts
  presentation/controllers/  one <feature>-controller.ts per feature, calls the use cases
  presentation/routes/       hono routes, one <feature>-routes.ts per feature, send each path to a controller
  presentation/middleware/   request id, request logging, validation, 404 and error handling
  presentation/http/         hono application factory
  main.ts                    composition root
```

## Dependency rule

Dependencies only point inward.

- `domain` only imports the tree rules in `@shared/avl`.
- `application` imports `domain` and `@shared/`.
- `infrastructure` implements the repository interfaces declared in `domain`.
- `presentation` calls use cases from `application`.
- `main.ts` starts the server.

The AVL functions live in `shared/src/avl`, so the frontend and the backend use one copy of the tree rules. The rest of `@shared/` is the shared schemas that define request and response shapes.

Repositories use the mappers in `infrastructure/<module>/mappers/` to turn database rows into entities defined in the `domain` layer.

`Application` layer contains commands and queries. Commands write and queries read. 

## Use cases, controllers and routes

The algorithm endpoints were the first feature built end to end, so copy them.

| Endpoint | What it returns |
| --- | --- |
| `GET /api/algorithms` | Every algorithm's `code` and `name`, in the order the engine lists them |
| `GET /api/algorithms/:code/snippet?language=<code>` | The snippet's `source`, plus `lines`, a map from step key to line number |

Algorithm and language codes are lower case letters, digits and hyphens, up to 64 characters. Anything else gets a 400.

Both are public. The snippet's language is `?language` if it's given. If not, it's the signed-in learner's code language. If they haven't picked one, or nobody is signed in, it's pseudocode. An unknown algorithm, an unknown language or a snippet nobody has written yet each return a 404.

The pieces:

- **Use case.** `application/course-content/queries/get-algorithm-snippet.ts` exports `makeGetAlgorithmSnippet(dependencies)`, which returns the function that does the work. Its dependencies are repository interfaces, narrowed with `Pick<...>` to the methods it calls, so a test fake only needs those methods. It returns the response from a shared `to<Response>` helper, which drops fields like `id`.
- **Controller.** `presentation/controllers/algorithm-controller.ts` takes the use cases and has one method per endpoint. Each reads `context.req.valid(...)`, calls one use case and returns `context.json(...)`.
- **Routes.** `presentation/routes/algorithm-routes.ts` takes the controller and returns a `new Hono()` with the paths and validators. `create-application.ts` mounts it at `/api/algorithms`.
- **Wiring.** `main.ts` makes the Prisma repositories, the use cases and the controller, and passes the controller to `createApplication`.

### Lessons

All four endpoints need a signed-in learner. The use cases live in `application/lesson/`.

| Endpoint | What it returns |
| --- | --- |
| `GET /api/lessons/:id` | The lesson, its unit, its status, the previous and next lesson ids, and its steps |
| `GET /api/lessons/:id/note` | The learner's note, or an empty body and a `null` `updatedAt` when there isn't one yet |
| `PUT /api/lessons/:id/note` | Saves the note. It creates the note the first time and updates it after that |
| `POST /api/lessons/:id/start` | Marks the lesson `started` and returns an empty 204. A completed lesson stays completed |

The lesson endpoints and the learning path use one rule. The current lesson is the first one the learner hasn't completed. The current lesson and completed lessons are open, and every other lesson is locked. "First" follows the unit order, then the lesson order, and crosses unit boundaries. A locked lesson returns 403 on all four endpoints. A missing or retired lesson returns 404, and a retired lesson is never anyone's previous or next lesson. The rule is `canOpenLesson` in `domain/learning-path/lesson-access.ts`, built on `getLessonStatuses`. Only completed progress rows count. A passed test opens the next lesson because it completes the lesson it tests.

Two use cases in `application/learning-path/` have no route. Assessment calls them.

- `makeCompleteLesson({ userId, lessonId })` completes that lesson and every lesson before it (`completeThrough`), in one transaction. Lessons that were already completed keep their `completedAt`, so calling it twice changes nothing.
- `makeCanTakeTest(userId, lessonId)` says whether the learner may take a lesson's test. Any lesson that exists and isn't retired is allowed, locked ones included, so a learner can test out of them.

The status is `completed` when the learner's own progress says so, and `current` otherwise.

Steps are the lesson's content blocks grouped by `position`. In each step, the block with no learning style is the core block. The block for the learner's style is the style block, and it is `null` if they have no style. The other styled blocks go in `otherBlocks`. Every body is parsed with `contentBlockBodySchema`. A bad body, or a step without exactly one core block, is logged and returns a 500 `InvalidContentError`, so broken content shows up early.

The note is saved as typed, with no trimming. `PUT` returns 400 over 2000 characters, and 400 for a lesson with no `notePrompt`. `GET` on such a lesson returns the empty note.

## Request flow

1. `secureHeaders` adds security headers to every response, like `x-content-type-options: nosniff`.
2. `requestContextMiddleware` gives the request a fresh ID and sends it back in the `x-request-id` header.
3. The auth middleware resolves the session from the request's cookie, if any, and sets the user id and role on the request context. A missing or invalid session leaves the context unset, so the request continues as signed out. If the lookup itself fails, for example because the database is down, the error goes to the error handler and the request gets a 500. It doesn't carry on signed out, because then a server fault would show up as a 401. Routes that require a user go through their own guard. Better Auth caches the session in a cookie for 60 seconds, so a ban or role change can take up to a minute to apply.
4. The request logger writes one line when the response finishes. It skips `/api/health`.
5. `bodyLimit` turns away bodies over 100kb with a 413.
6. A Hono route in `presentation/routes` receives the request.
7. `validate(target, schema)` parses the `json` body, `param` or `query` with a schema from `@shared/`. Read the parsed value with `context.req.valid(target)`, so defaults and coerced numbers reach your handler with the right types.
8. The route hands the request to a controller method in `presentation/controllers`, which calls a command or query in `application`.
9. The use case works with domain entities through repository interfaces.
10. A Prisma repository in `infrastructure` reads or writes the database.
11. Unknown routes go to `notFoundHandler` (set with `app.notFound`), which returns a 404.
12. The error handler (set with `app.onError`) turns anything thrown into a JSON response.

## Errors

Throw an error from `@/domain/errors` anywhere in the backend. You never need to write an error response yourself.

```ts
import { NotFoundError } from "@/domain/errors";

throw new NotFoundError("Tree not found");
```

| Error               | Status |
| ------------------- | ------ |
| `BadRequestError`   | 400    |
| `UnauthorizedError` | 401    |
| `ForbiddenError`    | 403    |
| `NotFoundError`     | 404    |
| `ConflictError`     | 409    |
| `InvalidContentError` | 500  |
| `ZodError`          | 400    |
| malformed JSON      | 400    |
| body over 100kb     | 413    |
| anything else       | 500, and it gets logged |

The domain errors don't know about HTTP. Only the error handler in `presentation/middleware` picks the status code.

Every error body follows `errorResponseSchema` from `@shared/schemas`:

```json
{ "message": "Validation failed", "issues": [{ "path": ["name"], "message": "Required", "code": "invalid_type" }], "requestId": "..." }
```

`issues` only shows up for validation errors.

### Prisma errors

Wrap repository calls in `withPrismaErrors` from `@/infrastructure/database/prisma-errors`. It turns Prisma errors into domain errors, so Prisma never leaks out of `infrastructure`:

```ts
return withPrismaErrors(() => prismaClient.tree.create({ data }));
```

- `P2002`, a unique constraint failure, becomes `ConflictError`, which names the field. The field comes from the index name, like `user_email_key`, so keep Prisma's default index names.
- `P2025`, a record that doesn't exist, becomes `NotFoundError`.
- `P2003`, a foreign key failure, becomes `ConflictError` when you delete something another row still uses, and `BadRequestError` when you point at something that doesn't exist.
- `P2011`, a missing required value, becomes `BadRequestError`.
- `P2039` with Postgres code `23514`, a CHECK constraint failure, becomes `BadRequestError`, which names the constraint.

## Prisma

The schema is split over multiple files under `backend/src/infrastructure`. 
Each module has a `models/` folder with one `.prisma` file per table and an `enums.prisma` for its enums. 

Better Auth owns four tables. Their models all live in one file, `auth/models/auth.prisma`, because that's the file `bun run auth:generate` writes to. Don't split the file, the generator only writes one file.

Our own user columns (`colourTheme`, `learningStyleId`, …) live in `userProfile`, not in `user`. Better Auth's `additionalFields` can't type a column as `uuid` or add a foreign key, and a separate table keeps Better Auth's table to what Better Auth writes. `userProfile.userId` is a normal foreign key to `user.id`, which is `TEXT` because Better Auth makes the ids.

A module folder looks like this:

```
infrastructure/user/
  models/
    enums.prisma
    user-profile.prisma
  mappers/
    user-mapper.ts
    user-profile-mapper.ts
  repositories/
    user-repository.ts
    user-profile-repository.ts
    index.ts
```

Every table has its own repository, named after the table. Each module uses the same name in every layer.

Every repository extends one base class, `PrismaRepository` in `infrastructure/database/prisma-repository.ts`. It does `findById`, `list`, `create`, `update` and `delete` once, wraps each in `withPrismaErrors`, and maps rows to domain entities. A repository only tells it which Prisma model to use and how to map it, then adds finders for its unique columns:

```ts
type UserProfileModel = {
  row: UserProfileRow;
  where: Prisma.UserProfileWhereUniqueInput;
  create: Prisma.UserProfileUncheckedCreateInput;
  update: Prisma.UserProfileUncheckedUpdateInput;
  orderBy: Prisma.UserProfileOrderByWithRelationInput;
};

export class PrismaUserProfileRepository
  extends PrismaRepository<UserProfileModel, UserProfile, NewUserProfile, UserProfileChanges>
  implements UserProfileRepository
{
  constructor(client: PrismaClient) {
    super(client, client.userProfile, {
      toEntity: toUserProfile,
      toWhere: (userId) => ({ userId }),
      orderBy: [{ userId: "asc" }],
      toCreateData: toUserProfileCreateData,
      toUpdateData: toUserProfileUpdateData,
    });
  }
}
```

The base class only lists a whole table, a page at a time. For a filtered list add a method that calls `this.client.<model>.findMany({ where, orderBy })` inside `withPrismaErrors` and maps the rows with the mapper.

`PrismaUserRepository` is the one exception. Better Auth creates, updates and deletes users, so that repository only reads: `findById`, `findByEmail` and `list`. Change a user through Better Auth's API, not through Prisma.

### Adding a table

1. Add the model in `infrastructure/<module>/models/<table>.prisma`.
2. Create a migration with `bun run prisma:migrate --name <what-changed>`, then run `bun run prisma:generate`.
3. Add the entity and repository interface in `domain/<module>/`.
4. Add the mapper in `infrastructure/<module>/mappers/`.
5. Add a repository that extends `PrismaRepository`, and export it from `repositories/index.ts`.
6. Add tests 

### Course content files

Lessons, questions, code snippets and case studies are written as files in `backend/prisma/content/`. `bun run content:load` loads them into the database, and `bun run prisma:seed` does the same as one of its steps.

```
backend/prisma/content/
  units.ts                    the units: key, position, title
  02-pre-order/               one folder per lesson; the name is only for people
    lesson.ts                 key, unit, position, title, summary, kind, notePrompt, objectives
    blocks/
      01-what-is-it.md        a text block: frontmatter, then the markdown
      01-what-is-it-visual.ts any other block, or a styled one
    questions.ts              written questions, with their answers and hints
    generated.ts              questions a generator makes
  snippets/<algorithm>/<language>.<ext>
  case-studies/<key>.ts
```

A text block's frontmatter holds `position`, `transcript` and an optional `style` (`visual`, `auditory`, `reading-writing` or `kinesthetic`). A block with no style is the core block for its position. It can also hold a `tree`, a list of keys like `[8, 4, 12]`. The tree is drawn under the heading, before the rest of the text, so a task can show a real tree without needing a second block.

Every other block is a `.ts` file whose body matches `contentBlockBodySchema` in `shared/src/schemas/src/content-block.ts`:

| Type | Body |
| --- | --- |
| `diagram` | a tree from `startingKeys`, with highlighted nodes and a caption |
| `animation` | insert, delete and search steps run on a tree |
| `playground` | a tree the learner works on, with the operations they may use and an optional goal |
| `code_trace` | one algorithm run on a tree, line by line, with the call stack. The `operation` is `{ operation: "traverse" }` for `preorder`, `inorder`, `postorder` and `levelorder`, and an insert, delete or search with a key for the rest. The checker rejects any other pairing. An optional `markdown` holds text shown above the trace, heading included |
| `copy_tree` | a tree copied into an empty one, a node at a time, in pre-order. An optional `markdown` holds text shown above it, heading included |
| `expression_tree` | a maths expression as a tree (`{ value }` or `{ operator, left, right }`, operators `+ - × ÷`), stepped through in pre-, in- or post-order. An optional `markdown` holds text shown above it, heading included |

A position holds one core block. When a step needs text and a picture, write the text at one position and the picture at the next, so every learner sees both. `02-pre-order/blocks/` is the example. A code trace, copy tree or expression tree is the exception: put its text in its own `markdown`, so the learner reads it next to the Step button instead of a step earlier. The frontend doesn't draw `copy_tree` or `expression_tree` yet.

Written questions come in two kinds. `multiple_choice` lists `options`, with exactly one correct. `text` lists `accepted` answers, and each becomes a correct option. `build_tree`, `order_nodes` and `predict_rotation` have a `tree` and an `answer` that matches `learnerAnswerSchema`. A generated question only names its `generatorKey`, type, difficulty, Bloom's level and review lesson. It is stored with an empty explanation and no prompt, because the generator writes those when the question is asked.

A snippet marks the line for each step with a trailing comment, like `if (key < node.key) { // @step insert.compare-left`. One line can carry several keys. The loader strips the markers from the stored source and turns them into `codeLine` rows. Every step the algorithm can emit needs exactly one marker. A marker with no key is a problem.

Units, lessons, questions and options have a readable `key`. The loader turns each key into a fixed UUID (`content-id.ts`), so the same file always gives the same row. Folder names and positions don't affect ids, so you can rename folders and reorder lessons. Learners' progress and notes stay on the right lesson. Never reuse a key for something different: make a new key instead.

**Removing things.**
| Removed from the files | What the loader does |
| --- | --- |
| Lesson | Sets `isRetired`, and moves it to position -1, -2 and so on in its unit. The lesson API returns 404 for it and the path skips it. Notes and progress stay in the database |
| Question | Sets `isRetired`. Question pickers must skip retired questions: use `listActiveByLessonId` on the question repository |
| Answer option nobody answered | Deletes it |
| Answer option someone answered | Fails. Retire the question and add a new one with a new key |
| Unit | Fails. Units are never removed |
| Snippet file | Deletes the snippet and its code lines. The files are the only source of snippets |

Changing what learners already answered fails too. You can't change the text of an answered option, or the type of an answered question. Retire the question and add a new one with a new key. You can fix which option is correct, because each attempt stores its own result.

Blocks, hints, code lines and case studies are deleted and written again on every load, so their ids change each time. Keep it that way: nothing may point at these tables. If a feature needs to, give that table keys and write it like lessons first.

**How it runs.** `read-content.ts` reads the files and is the only part that touches the disk. `check-content.ts` checks them without a database and lists every problem with its file. `write-content.ts` writes everything in one transaction, so a failure leaves the database as it was. It takes a Postgres advisory lock first, so two loads at once (a seed and `content:load`, say) run one after the other. It reads what's in the database and `plan-content-write.ts` works out what changed, so only new and changed questions and options are written, and a load with nothing new writes almost nothing. Before it writes, it moves every position out of the way, because Postgres checks the unique `(unitId, position)` key one row at a time and a swap would clash otherwise. The transaction has 60 seconds. If it runs out, nothing is written and the error says to raise `contentTransactionOptions.timeout`.

Units and lessons seeded before the loader (#61) had random ids. The `adopt_seeded_content_ids` migration gives them their key ids, matched by position and title, and progress, notes and attempts move with them because every foreign key to them is `ON UPDATE CASCADE`. It does nothing on a database without those rows.

`write-content.database.test.ts` runs the writer against the real Postgres in `DATABASE_URL`. Each test runs inside a transaction that it rolls back, so your local data is never changed.

`content.test.ts` checks the real `prisma/content/` folder in CI. The course needs at least 14 generated questions so the daily challenge doesn't repeat for two weeks. `content:load` and the seed skip that rule, so a half-written course still deploys. Once the lessons have their generated questions, add a test to `content.test.ts` that checks the folder with `complete: true`.

## Testing

All tests live in `src/test/`, at the same path as the code they cover. For example, the test for `src/presentation/http/create-application.ts` is `src/test/presentation/http/create-application.test.ts`. Vitest runs `src/test/**/*.test.ts`.

HTTP behaviour is tested with Hono's `app.request()` against `createApplication({ logger })`, so tests do not open a real port. Pass a stub logger made of `vi.fn()` calls so you can assert on what was logged.
