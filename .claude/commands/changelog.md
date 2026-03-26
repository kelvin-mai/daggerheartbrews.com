# Write Changelog

Draft a new changelog entry for Daggerheart Brews.

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

Also read the most recent existing changelog file in `content/changelog/` to understand what was already documented, so you don't repeat it.

## Step 2 — Categorise commits

Sort each commit into one of five buckets:

| Bucket            | Goes in section                | Examples                                                  |
| ----------------- | ------------------------------ | --------------------------------------------------------- |
| New feature       | User → **New**                 | "add blood domain", "add public by default setting"       |
| Redesign / visual | User → **Redesigned**          | "redesign class card previews", "refresh reference pages" |
| Improvement       | User → **Improved**            | "update filtering ui", "raise homebrew content limit"     |
| Bug fix           | User → **Fixed**               | "fix broken community link", "fix table hydration error"  |
| Internal / infra  | Developer → **Under the Hood** | "add e2e testing", "upgrade next.js", "add admin portal"  |

Rules:

- If a commit is ambiguous, lean toward user-facing if it affects visible behaviour, technical if it's infrastructure, tooling, or refactoring.
- Ignore commits that are purely content/copy with no user impact (e.g. "add temporary changelog content").
- Merge related commits into a single bullet rather than listing each one separately.

## Step 3 — Write the entry

Ask the user for:

- The new version number (e.g. `1.2.0`)
- The release month (e.g. `April 2026`)
- A one-line title summarising the release (e.g. `Email updates, audience sync, and admin tools`)

Then produce the MDX frontmatter and two sections.

### Format

```mdx
---
version: '<version>'
date: '<month year>'
title: '<one-line summary>'
---

## New

- **Feature name** — plain English description of what users can now do.

## Redesigned

- **Thing that changed** — what it looks like or how it works now.

## Improved

- **Thing that got better** — what improved and why it matters to the user.

## Fixed

- Description of the bug that was fixed, written from the user's perspective.

<DevNotes>

- Technical detail — framework versions, schema changes, tooling, infrastructure.

</DevNotes>
```

### Copywriting rules for the user sections

- Write for a player or GM who uses the site, not a developer.
- Bold the feature or area name, plain English after the dash.
- Start bullets with what changed, not "We added" or "Users can now".
- Keep each bullet to one sentence.
- Omit anything the user would never notice (internal refactors, test setup, CI changes).

### Copywriting rules for Under the Hood

- Be specific: include version numbers, file names, schema field names where useful.
- Audience is a developer reading the repo or considering contributing.
- Bullet per distinct technical change — don't merge unrelated items.

## Step 4 — Save the file

Write the finished entry to:

```
content/changelog/v<version>.mdx
```

Then confirm the file path and show the user a preview of the content.

## Notes

- Version tags will be introduced at the v1.1.0 release. Until then, use the full commit history minus anything already covered in `content/changelog/v1.1.0.mdx`.
- Do not create a git tag — that happens as part of the release process, not here.
