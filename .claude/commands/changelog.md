---
name: changelog
description: Drafts or updates the pending changelog entry for Daggerheart Brews from git commit history. Use this whenever the user asks to write a changelog, update release notes, document recent changes, or runs `/changelog` — even if they just say "update the changelog" or "what's changed since the last release".
---

# Write Changelog

Draft or update the pending changelog entry for Daggerheart Brews.

## Step 1 — Gather commits

Find the most recent version tag:

```bash
git tag -l "v*" --sort=-version:refname | head -1
```

**If a tag exists** (e.g. `v1.1.0`), get commits since that tag:

```bash
git log v1.1.0..HEAD --oneline --no-merges
```

**If no tags exist yet**, use all commits and note that this is the initial release log:

```bash
git log --oneline --no-merges
```

Check whether `content/changelog/pending.mdx` already exists. If it does, read it so you understand what's already been documented — don't repeat entries already present.

Also read the most recent versioned changelog file in `content/changelog/` (e.g. `v1.1.0.mdx`) so you don't repeat anything already released.

## Step 2 — Categorise commits

Sort each commit into one of five buckets:

| Bucket            | Goes in section          | Examples                                                  |
| ----------------- | ------------------------ | --------------------------------------------------------- |
| New feature       | User → **New**           | "add blood domain", "add public by default setting"       |
| Redesign / visual | User → **Redesigned**    | "redesign class card previews", "refresh reference pages" |
| Improvement       | User → **Improved**      | "update filtering ui", "raise homebrew content limit"     |
| Bug fix           | User → **Fixed**         | "fix broken community link", "fix table hydration error"  |
| Internal / infra  | Developer → **Internal** | "add e2e testing", "upgrade next.js", "add admin portal"  |

Rules:

- If a commit is ambiguous, lean toward user-facing if it affects visible behaviour, technical if it's infrastructure, tooling, or refactoring.
- Ignore commits that are purely content/copy with no user impact (e.g. "add temporary changelog content").
- Merge related commits into a single bullet rather than listing each one separately.

## Step 3 — Write the entry

Do **not** ask the user for a version number or title — the file is always saved as `pending.mdx` with `version: 'pending'`, `date: 'Unreleased'`, and `title: 'Pending'`.

**If `pending.mdx` already exists:** merge the new commits into the existing file, adding bullets under the appropriate sections. Do not duplicate entries that are already there.

**If `pending.mdx` does not exist:** create it from scratch.

### Format

```mdx
---
version: 'pending'
date: 'Unreleased'
title: 'Pending'
---

## New

- **Feature name** — plain English description of what users can now do.

## Redesigned

- **Thing that changed** — what it looks like or how it works now.

## Improved

- **Thing that got better** — what improved and why it matters to the user.

## Fixed

- Description of the bug that was fixed, written from the user's perspective.

## Internal

- Technical detail — framework versions, schema changes, tooling, infrastructure.
```

Omit any section that has no entries.

### Copywriting rules for the user sections

- Write for a player or GM who uses the site, not a developer.
- Bold the feature or area name, plain English after the dash.
- Start bullets with what changed, not "We added" or "Users can now".
- Keep each bullet to one sentence.
- Omit anything the user would never notice (internal refactors, test setup, CI changes).

### Copywriting rules for Internal

- Be specific: include version numbers, file names, schema field names where useful.
- Audience is a developer reading the repo or considering contributing.
- Bullet per distinct technical change — don't merge unrelated items.

## Step 4 — Save the file

Write the finished entry to:

```
content/changelog/pending.mdx
```

Then confirm the file path and show the user a preview of the content.

## Releasing — renaming pending to a version

When the user creates a release tag (e.g. `v1.2.0`), rename `pending.mdx` to the versioned filename and update its frontmatter:

1. Read `content/changelog/pending.mdx`
2. Replace the frontmatter fields:
   - `version: 'pending'` → `version: '<version>'` (e.g. `'1.2.0'`)
   - `date: 'Unreleased'` → `date: '<month year>'` (e.g. `'April 2026'`)
   - `title: 'Pending'` → `title: '<one-line summary>'` (ask the user for month and title)
3. Write the updated content to `content/changelog/v<version>.mdx`
4. Delete `content/changelog/pending.mdx`

## Notes

- Version tags will be introduced at the v1.1.0 release. Until then, use the full commit history minus anything already covered in `content/changelog/v1.1.0.mdx`.
- Do not create a git tag — that happens as part of the release process, not here.
