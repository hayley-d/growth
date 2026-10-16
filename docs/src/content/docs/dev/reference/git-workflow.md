---
title: Branches and commits
description: How branches are named and merged, and how to write commit messages.
---

## Branches

```
feat/tree-loader ──squash──▶ staging ──fast-forward──▶ master
fix/navbar-gap   ──squash──▶
```

| Branch    | What it is                                                                       |
| --------- | -------------------------------------------------------------------------------- |
| `master`  | What's released. Only `staging` goes into it. The **Source is staging** check enforces that. |
| `staging` | Where finished work lands before a release.                                      |
| others    | Short-lived branches for one piece of work.                                      |

Never push straight to `master` or `staging`. Always open a pull request. The one exception is the release push below.

### Working on something

1. Branch off `staging`. Name it `<type>/<short-name>`, for example `feat/tree-loader` or `fix/navbar-gap`. Use the same types as commits.
2. Commit as often as you like.
3. Open a pull request into `staging`. Its title must be a conventional commit, like `feat(frontend): add tree loader`.
4. **Squash and merge.** The whole branch becomes one commit on `staging`, named after the pull request. Delete the branch after.

### Releasing

`master` only ever moves forward to where `staging` is. Same commits, same hashes, no merge commit. GitHub has no button for that, so a release is a push from your terminal.

1. Open a pull request from `staging` into `master`. This runs CI, including the **Source is staging** check.
2. Wait for every check to go green.
3. Release:

   ```sh
   git fetch origin
   git push origin origin/staging:master
   ```

4. GitHub marks the pull request as merged on its own.

Don't:

- **Click the merge button.** It's set to rebase only because GitHub needs at least one method, but a rebase merge gives the commits new hashes. Then `master` and `staging` drift apart and the next release conflicts.
- **Force push.** If the push is rejected as "non-fast-forward", `master` has a commit that `staging` doesn't. Find out how it got there and fix that first.
- **Push anything but `origin/staging`.** Only people on the ruleset's bypass list can push, and nothing checks what they push.

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org). A commit looks like this:

```
feat(frontend): add tree loader

- Added a TreeLoader that grows the logo tree one node at a time.
- Turned the animation off for people who prefer reduced motion.
```

- First line: `<type>(<scope>): <summary>`. The scope is optional.
- Summary in lower case, no full stop at the end.
- Then a blank line and a short list of what changed.
- No ticket numbers and no co-author lines.

Types:

| Type       | Use it for                                  |
| ---------- | ------------------------------------------- |
| `feat`     | Something new for users                     |
| `fix`      | A bug fix                                   |
| `docs`     | Docs only                                   |
| `style`    | Formatting, no code change                  |
| `refactor` | Code change that isn't a fix or a feature   |
| `perf`     | Making something faster                     |
| `test`     | Adding or fixing tests                      |
| `build`    | Dependencies and build setup                |
| `ci`       | GitHub Actions                              |
| `chore`    | Anything else                               |
| `revert`   | Undoing an earlier commit                   |

Scopes: `frontend`, `backend`, `shared`, `docs`. Leave it out if a change touches several.

Good:

- `fix(backend): return 404 when a course is missing`
- `docs: explain the squash merge rule`

Bad:

- `Fixed stuff` (no type)
- `feat: Add tree loader.` (capital letter and full stop)
- `RB-1 - add tree loader` (ticket number, no type)

A `commit-msg` hook runs [commitlint](https://commitlint.js.org) on every commit and rejects messages that don't follow the format. Test one yourself with `echo "feat: add thing" | bunx commitlint`.
