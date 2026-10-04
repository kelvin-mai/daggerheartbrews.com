# Contributing to Daggerheart Brews

Thank you for your interest in contributing to Daggerheart Brews! This document provides guidelines for contributing to the project.

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (browser, OS, Node version)

### Suggesting Features

Feature suggestions are welcome! Please:

- **Check existing issues** to avoid duplicates
- **Provide clear use cases** for the feature
- **Explain why** this feature would be useful to most users
- **Consider the scope** - does it fit the project's goals?

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes**:
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation as needed
3. **Test your changes**:
   ```bash
   pnpm lint
   pnpm format
   pnpm test --run
   pnpm build
   ```
4. **Commit with clear messages**:
   - Use present tense ("Add feature" not "Added feature")
   - Reference issues when applicable ("Fixes #123")
5. **Push to your fork** and submit a pull request

## Development Setup

You need Node.js 22.13+, pnpm (`corepack enable`) and Docker. Then:

```bash
git clone https://github.com/kelvin-mai/daggerheartbrews.com.git
cd daggerheartbrews.com
pnpm install
cp .env.example .env
docker compose up -d
pnpm dev
```

Open http://localhost:3000 and log in with `admin@test.com` / `Password1`.

> **Tip:** If you already have a `.env.local` file, delete it first. It overrides `.env` in Next.js.

No third-party accounts needed: the database runs in Docker, emails are printed to the console, and OAuth is optional. See the [README Quick Start](../README.md#quick-start-local-development) and [docs/local-database-setup.md](../docs/local-database-setup.md) for details.

## Project Guidelines

### Code Style

See [docs/contributing-code-standards.md](../docs/contributing-code-standards.md) for the full conventions. In short:

- **TypeScript**: Use strong typing, avoid `any`
- **Formatting**: Run `pnpm format` before committing
- **Linting**: Ensure `pnpm lint` passes
- **Components**: Follow the existing component organization pattern
- **Naming**: Use descriptive names (prefer clarity over brevity)

### Component Organization

- Organize by feature, not by type
- Keep components small and focused
- Use TypeScript for all new files
- Extract reusable logic into hooks

### Database Changes

- Generate migrations with `pnpm db:generate`
- Test migrations on a clean database
- Document schema changes in PR description
- Never edit migration files directly

### State Management

- Use Zustand stores for global state
- Follow the existing store pattern (types, actions, effects, plus computed when a store needs derived values)
- Keep stores focused on specific domains
- Document complex state logic

### Commit Messages

Follow conventional commits format:

```
type(scope): description

[optional body]
[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:

```
feat(cards): add export to PDF functionality
fix(auth): resolve Discord OAuth redirect issue
docs(readme): update installation instructions
```

### Testing

- Test your changes in different browsers
- Verify responsive design on mobile devices
- Test database operations thoroughly
- Check authentication flows end-to-end

## Pull Request Process

1. **Update documentation** for any user-facing changes
2. **Add yourself** to contributors if you'd like
3. **Link related issues** in the PR description
4. **Wait for review** - maintainers will review and provide feedback
5. **Address feedback** - make requested changes promptly
6. **Squash commits** if requested before merging

## Questions?

Feel free to open an issue for questions about contributing or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
