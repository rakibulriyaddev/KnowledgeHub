Commit staged/working changes, push, open a PR from `development` into
`main`, and merge it.

---

## Step 0 — Check state

```bash
git status
git branch --show-current
```

Refuse to proceed on `main` — this flow only ships `development` → `main`.
If not on `development`, stop and ask the user.

## Step 1 — Commit

Review `git status` / `git diff` for what's actually changing. Stage
specific files by name (never `git add -A`/`git add .`) and commit with a
message describing the *why*, matching this repo's existing commit style
(`git log` for reference). Skip this step if there's nothing to commit.

## Step 2 — Push

```bash
git push -u origin development
```

**Ask the user to confirm before running this** — pushing is a shared,
visible action. State what's about to be pushed (commit summary) when
asking.

## Step 3 — Open the PR

```bash
gh pr create --base main --head development --title "<title>" --body "<summary + test plan>"
```

If a PR from `development` → `main` already exists, reuse it
(`gh pr list --base main --head development`) instead of creating a
duplicate.

## Step 4 — Merge

**Ask the user to confirm before merging** — merging into `main` is
irreversible in the sense that matters (releases branch from `main`).
Confirm the PR number/URL and that CI (if any) is green first.

```bash
gh pr merge <number> --merge
```

Use `--merge` (real merge commit), matching this repo's existing history —
`git log --oneline --merges` shows every prior PR merged this way, not
squashed or rebased. Report the resulting merge commit hash.

---

Do not use this skill to push/merge anything the user hasn't reviewed in
this conversation. Each run needs its own confirmation at Step 2 and Step
4 — an earlier approval doesn't carry over to a later run.
