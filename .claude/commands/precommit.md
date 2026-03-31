---
name: precommit
description: Runs the full pre-commit quality check pipeline for Daggerheart Brews — build, tests, lint, format, docs, and changelog — in order, fixing issues along the way. Use this whenever the user wants to verify their changes are clean before committing, asks to "run pre-commit checks", or says something like "make sure everything passes".
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Grep
  - Glob
---

# Precommit

Run the pre-commit quality checks in order: build → tests → lint → format → docs → changelog. Do NOT commit anything.

## Output style

Announce each step before running it, then report the result on a single line once done. Use emoji to signal status — this is the closest we can get to color in Claude Code:

- ▶ **Running Build...** _(before running)_
- ✅ **Build passed** _(on success)_
- ❌ **Build failed** — brief reason _(on failure)_

Never use `echo` or a Bash tool call to print status — output it as assistant text so it's always visible and never collapsed.

Reserve the full summary checklist for the very end.

---

## Step 1 — Build

Announce: `▶ **Running Build...**`

Run: `pnpm run build`

- Passes → output `✅ **Build passed**` and continue.
- Fails → show the relevant error output, attempt to fix, re-run. Output `✅ **Build passed**` once fixed, or `❌ **Build failed** — could not auto-fix` if not.

## Step 2 — Tests

Announce: `▶ **Running Tests...**`

Run: `pnpm run test --run`

- Passes → output `✅ **Tests passed**` and continue.
- Fails → show the relevant error output, attempt to fix the failing test(s), re-run. Output `✅ **Tests passed**` once fixed, or `❌ **Tests failed** — could not auto-fix` if not.

## Step 3 — Lint

Announce: `▶ **Running Lint...**`

Run: `pnpm run lint:fix`

- Passes → output `✅ **Lint passed**` and continue.
- Fails → show the remaining errors, attempt to fix, re-run `pnpm run lint:fix`. Output `✅ **Lint passed**` once fixed, or `❌ **Lint failed** — could not auto-fix` if not.

## Step 4 — Format

Announce: `▶ **Running Format...**`

Run: `pnpm run format`

This always rewrites files. Output `✅ **Format done**` when the command completes.

## Step 5 — Docs

Announce: `▶ **Checking Docs...**`

Review staged changes (`git diff --cached`) and unstaged changes (`git diff`) to determine if any documentation needs updating. Check for:

- New or removed features, CLI options, env vars, or configuration that should be reflected in README files
- API or schema changes that affect documented interfaces
- New setup steps, dependencies, or commands that users or contributors need to know about
- Changes to existing documented behaviour that would make the docs incorrect

Rules:

- Only update docs that exist — do not create new documentation files
- Only update docs that are genuinely incorrect or incomplete as a result of the changes
- Do not document internal implementation details

Output `✅ **Docs up to date**` if nothing needed, or `✅ **Docs updated** — <list files changed>` if you made changes.

## Step 6 — Changelog

Announce: `▶ **Updating Changelog...**`

Run the `/changelog` command to update `content/changelog/pending.mdx` with any commits not yet documented there.

Output `✅ **Changelog updated**` if new entries were added, or `✅ **Changelog up to date**` if nothing was missing.

---

## Final summary

After all steps complete, output the full checklist as assistant text with a summary line:

```
**Pre-commit checks**
─────────────────────
✅ Build
✅ Tests
✅ Lint
✅ Format
✅ Docs
✅ Changelog

All checks passed. Ready to commit.
```

Replace ✅ with ❌ for any failed step, and change the summary to `Some checks failed. Review the errors above before committing.`
