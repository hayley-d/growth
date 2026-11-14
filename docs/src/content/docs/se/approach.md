---
title: Software engineering approach
description: The method we follow and how the team works.
---

## Method

We follow **Agile**, with one sprint:

|         |                                     |
| ------- | ----------------------------------- |
| Sprint  | 26 October to 16 November (3 weeks) |
| Meeting | Mondays, 17:00 to 17:30             |

Since the project is constrained to a short timeframe, we decided on one sprint. Additional sprints involve more planning, backlog grooming and administration, and that time would be better spent building features.

The Monday meeting does three jobs: a standup (what was done, what is next, what is blocked), planning for the week, and backlog grooming. It matches the instructional design method we used, which also works in short iterations (see [Instructional design approach](../../id/approach/)).

## Planning and tracking

Work is planned and tracked on the Growth board on GitHub Projects. Every piece of work is a ticket (an issue) on the board. Implementation, documentation and course content design are all included. Tasks get moved from `Todo` to `In Progress` when a developer picks up a task. When a task is complete and ready for review, it moves to `In review`. If the review requires changes, the task moves back to `Revision`. Finally, a completed task is moved to `Done`.

## Roles

There are no fixed roles. Each developer takes up a comprehensive development role.

## Git workflow

```
feature branch ──▶ staging ──fast-forward──▶ master
```

- `master` is what is released. `staging` is our development branch. Feature branches are short-lived and come off `staging`.
- Every change goes in through a pull request. Pushes straight to `master` or `staging` are forbidden.
- A pull request needs one reviewer's approval before it merges.
- The pipeline checks every pull request. Lint, typecheck and build must pass. Tests run and report, but do not block.
- Feature branches are squash merged or rebased, and `staging` goes into `master` by fast-forward only. This keeps the history linear.
- Commits and pull request titles follow Conventional Commits, for example `feat(frontend): add tree loader`. A hook rejects anything else.
