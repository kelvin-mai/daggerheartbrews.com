# Using AI with This Project

This project was initially set up with [Claude Code](https://claude.ai/code) and since been expanded to also support [OpenCode](https://opencode.ai). Both tools share the same goal — an AI coding agent that understands your codebase and helps you build — but they use different config files and conventions.

---

## Claude Code

### Setup

Install Claude Code:

```bash
npm install -g @anthropic-ai/claude-code
```

Run it from the project root:

```bash
claude
```

Claude Code automatically loads `CLAUDE.md` and the files it references (including `.claude/skills.md`), giving it full context about the project's architecture, conventions, and coding standards before you type anything.

### Slash Commands

Custom commands are defined in `.claude/commands/` and available in any session as `/command-name`.

#### `/precommit`

Runs the full pre-commit quality pipeline in order and attempts to fix any failures automatically.

Steps:

1. **Tests** — `pnpm run test --run`
2. **Lint** — `pnpm run lint:fix`
3. **Format** — `pnpm run format`
4. **Docs** — reviews staged changes and updates any affected documentation

Use this before committing to catch issues without needing to remember each check individually.

#### `/ship-feature <feature request>`

Runs a feature request through the agent dev team (see below): plan → implement → test → review → document. It's defined as a skill in `.claude/skills/ship-feature/` and only runs when invoked explicitly.

```
/ship-feature add a "duplicate card" button to the homebrew list
```

Steps:

1. **Preflight** — stops if you're on `main` or the working tree isn't clean, then resets `.pipeline/`
2. **Plan** — the `planner` writes a spec to `.pipeline/spec.md`. The pipeline **waits for your approval** (or changes) before any code is written
3. **Implement** — the `coder` implements the spec. If it reports `blocked`, the pipeline stops
4. **Test** — the `tester` writes and runs tests. If it finds source bugs, the coder gets one fix pass and the tester re-runs once
5. **Review** — the `reviewer` checks the uncommitted diff against the spec
6. **Document** — the `tech-writer` updates affected docs and `content/changelog/pending.mdx`
7. **Report** — test result, review verdict, files changed, changelog bullets added

Nothing is committed. Review `git diff` yourself, then run `/precommit` (which also runs the build) before committing.

### Agent Dev Team

Subagents are defined in `.claude/agents/`. Each runs in its own context with a fixed role, tool set, and model. `/ship-feature` chains them, but any of them can also be used on its own (e.g. "use the reviewer agent to review `git diff HEAD~3`").

| Agent         | Model  | Role                                                                  | Can edit                                              | Writes                 |
| ------------- | ------ | --------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------- |
| `planner`     | Opus   | Turns a request into a spec: files, signatures, edge cases, test plan | Nothing (read-only)                                   | spec (as its reply)    |
| `coder`       | Sonnet | Implements the spec exactly; runs lint and `tsc`                      | `src/` and other source files                         | `.pipeline/changes.md` |
| `tester`      | Sonnet | Writes and runs unit tests (e2e specs only if planned; not run)       | `test/`, `e2e/`                                       | `.pipeline/tests.md`   |
| `reviewer`    | Sonnet | Reviews a diff for bugs, security, and code-standards issues          | Nothing (read-only)                                   | review (as its reply)  |
| `tech-writer` | Sonnet | Updates existing docs and the pending changelog entry                 | `docs/`, `README.md`, `content/changelog/pending.mdx` | `.pipeline/docs.md`    |

How it fits together:

- **Handoffs go through files.** Agents can't see the main conversation, so each step reads and writes files in `.pipeline/` (git-ignored, cleared at the start of every run).
- **Code standards are shared.** The planner, coder, tester, and reviewer preload the `code-standards` skill. The tech-writer follows the format and copy rules in `.claude/commands/changelog.md`, but builds entries from the spec rather than `git log`, since nothing is committed yet.
- **Roles don't overlap.** The coder never writes tests, the tester never fixes source code (it reports source bugs instead), and the reviewer never edits.
- **No agent commits, pushes, or installs packages.** These limits are written into each agent's prompt. Enforce them with permissions in `.claude/settings.local.json` if you need a hard guarantee.

To change an agent's behaviour, edit its markdown file in `.claude/agents/`. The frontmatter controls tools, model, `maxTurns`, and preloaded skills; the body is its instructions. The agents and `/ship-feature` are Claude Code only; they aren't shared with OpenCode.

### Project Context

`CLAUDE.md` at the root is Claude Code's context file. It references `.claude/skills.md` which defines the project's code standards. Together they cover:

- Tech stack and architecture overview
- Directory structure and path aliases
- Database, auth, and state management patterns
- Code style rules (TypeScript, React, Tailwind, Zustand, server actions)
- What Claude should not do (no unnecessary comments, no console.log, no speculative abstractions)

---

## OpenCode

### Setup

Install OpenCode:

```bash
# install script
curl -fsSL https://opencode.ai/install | bash

# or via pnpm
pnpm add -g opencode-ai
```

Run it from the project root:

```bash
opencode
```

On first use, run `/connect` inside the TUI to configure your AI provider and API keys.

### Project Context

OpenCode automatically falls back to `CLAUDE.md` when no `AGENTS.md` is present — so no additional setup is needed. The existing `CLAUDE.md` and `.claude/skills.md` are picked up by both tools out of the box.

### Configuration

Project-level config lives in `opencode.json` at the root. The format is JSON with comments (JSONC). See the [OpenCode config docs](https://opencode.ai/docs/config) for available options including model selection, MCP servers, custom formatters, and tool permissions.

### Slash Commands

`.opencode/commands/` is symlinked to `.claude/commands/`, so all custom commands are shared between both tools. No duplication needed — adding or updating a command in `.claude/commands/` makes it available in both Claude Code and OpenCode.

Available built-in OpenCode commands:

| Command    | Description                                   |
| ---------- | --------------------------------------------- |
| `/init`    | Analyze project and generate `AGENTS.md`      |
| `/connect` | Configure AI provider and API keys            |
| `/undo`    | Undo the last change                          |
| `/redo`    | Redo an undone change                         |
| `/share`   | Generate a shareable link to the conversation |

---

## Tips

- **Reference files with `@`** (OpenCode) or by path (Claude Code). Both tools can read any file in the repo — being explicit is faster than describing what you mean.
- **Run `/precommit` before pushing.** It will catch and auto-fix lint and format issues, and flag failing tests before they hit CI.
- **Use `/ship-feature` for self-contained features.** Start from a clean feature branch and spend your attention on the spec approval step — it's much cheaper to fix a plan than an implementation.
- **Be specific about scope.** Both tools follow the project's conventions strictly. If you want a deliberate deviation, say so explicitly.
