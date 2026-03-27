---
name: precommit
description: Runs pre-commit quality checks in order
allowed-tools:
  - Task
  - Bash
  - Read
  - Write
  - Edit
  - Grep
  - Glob
---

# Precommit command

Run the pre-commit quality checks in order: tests → lint → format → docs. Do NOT commit anything.

Output the checklist as plain assistant text before starting, and reprint it as plain assistant text after each step completes. Never use `echo` or a Bash tool call to render the checklist — always output it directly in your response so it is never collapsed in the UI.

Use this exact markdown format for the checklist:

```
**Pre-commit checks**
─────────────────
[ ] Tests
[ ] Lint
[ ] Format
[ ] Docs
```

- Pending: `[ ] Label`
- Passing: `[✓] Label`
- Failing: `[✗] Label`

After each step, reprint the full checklist with updated status for completed steps.

---

## Step 1 — Tests

Run: `pnpm run test --run`

- If it exits 0: mark Tests as `[✓]` and reprint the checklist, then proceed.
- If it exits non-zero: show the relevant error output, attempt to fix the failing test(s), re-run, and only proceed once passing (or report that you could not fix them and mark `[✗]`). Reprint the checklist after resolving.

## Step 2 — Lint

Run: `pnpm run lint:fix`

- If it exits 0: mark Lint as `[✓]` and reprint the checklist, then proceed.
- If it exits non-zero: show the relevant error output, attempt to fix the remaining lint errors, re-run `pnpm run lint:fix`, and only proceed once passing (or report that you could not fix them and mark `[✗]`). Reprint the checklist after resolving.

## Step 3 — Format

Run: `pnpm run format`

- This always rewrites files; mark Format as `[✓]` and reprint the checklist when the command completes.

## Step 4 — Docs

Review the staged changes (`git diff --cached`) and any unstaged changes (`git diff`) to determine if any documentation needs updating.

Check for:

- New or removed features, CLI options, env vars, or configuration that should be reflected in README files
- API or schema changes that affect documented interfaces
- New setup steps, dependencies, or commands that users or contributors need to know about
- Changes to existing documented behaviour that would make the docs incorrect

Rules:

- Only update docs that exist — do not create new documentation files
- Only update docs that are genuinely incorrect or incomplete as a result of the changes
- Do not document internal implementation details; focus on user-facing or contributor-facing information
- If no docs need updating, mark Docs as `[✓]` and note "No documentation changes needed"
- If docs were updated, mark Docs as `[✓]` and list which files were changed and why

---

## Final output

After all steps, output the final checklist as plain assistant text with the summary line. Never use a tool call to output this.

**Pre-commit checks**
─────────────────
[✓] Tests
[✓] Lint
[✓] Format
[✓] Docs

All checks passed. Ready to commit.

Replace `[✓]` with `[✗]` for any failed step, and change the summary to "Some checks failed. Review the errors above before committing." if any step failed.
