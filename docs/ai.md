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
- **Be specific about scope.** Both tools follow the project's conventions strictly. If you want a deliberate deviation, say so explicitly.
