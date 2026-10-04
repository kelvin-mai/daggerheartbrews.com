# Daggerheart Brews

A Next.js web application for creating and sharing homebrew content for the Daggerheart TTRPG. Create custom cards, adversaries, and access game master tools and reference materials.

**Live Site**: [daggerheartbrews.com](https://daggerheartbrews.com)

## Tech Stack

- **Framework**: Next.js 16 with App Router, TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL with Drizzle ORM (Neon serverless in production)
- **Authentication**: Better Auth
- **State Management**: Zustand
- **Email**: React Email with Resend
- **Testing**: Vitest + React Testing Library (unit), Playwright (E2E)
- **Deployment**: Vercel

## Features

- **Card Builder**: Create custom ability cards with domains, colors, images, and stats
- **Adversary Builder**: Design custom adversaries with customizable stats, attacks, and abilities
- **Community Sharing**: Browse and share homebrew content with the community
- **Bookmarks**: Save community cards and adversaries for quick access
- **Game Master Tools**: Quick reference for rules, tables, and game mechanics
- **Authentication**: Secure email/password and social login (Google, Discord)
- **Export**: Generate printable card images

## Getting Started

### Prerequisites

- Node.js 22.13+ (required by the pinned pnpm version)
- pnpm, enabled through Corepack: `corepack enable` (the version is pinned in `package.json`)
- [Docker Desktop](https://www.docker.com/get-started) or [Colima](https://github.com/abiosoft/colima) for the local PostgreSQL database

No third-party accounts are needed. The database runs locally in Docker, emails are printed to the server console, and social login is hidden until you configure it.

### Quick Start (Local Development)

1. **Clone and install:**

   ```bash
   git clone https://github.com/kelvin-mai/daggerheartbrews.com.git
   cd daggerheartbrews.com
   pnpm install
   ```

2. **Set up environment:**

   ```bash
   cp .env.example .env
   ```

   The defaults work as-is with the Docker database below.

   > **Important:** If you already have a `.env.local` file, delete it. Next.js loads `.env.local` with higher priority than `.env`, which can cause unexpected connection errors.

3. **Start the database** (make sure Docker Desktop or Colima is running first):

   ```bash
   docker compose up -d
   ```

   On first start, the container runs every file in `sql/`, creating the schema and seeding test users and sample content. See [docs/local-database-setup.md](docs/local-database-setup.md) for details.

4. **Start the dev server:**

   ```bash
   pnpm dev
   ```

Open http://localhost:3000 and log in with `admin@test.com` / `Password1` (also available: `user@test.com` and `user2@test.com`, same password).

> **Note:** Social login and email sending are disabled by default.
> To enable them, see [.env.example](.env.example) for the full list of optional environment variables.

### SRD Source (Optional)

`srd-source/` is a git submodule used only by the `sync:reference:*` scripts that regenerate the SRD data in `src/lib/constants/reference/srd/`. You don't need it to run the app. If you're working on SRD data:

```bash
git submodule update --init
```

See [docs/srd-sync.md](docs/srd-sync.md).

## Development

### Commands

```bash
pnpm dev             # Start dev server
pnpm build           # Build for production
pnpm start           # Start production server
pnpm lint            # Run ESLint
pnpm lint:fix        # Run ESLint with auto-fix
pnpm format          # Format code with Prettier
pnpm test            # Run unit tests with Vitest
pnpm test:e2e        # Run E2E tests with Playwright
pnpm test:e2e:ui     # Run E2E tests with Playwright UI
```

For detailed testing guidance, see [docs/testing.md](docs/testing.md).

### Database

```bash
pnpm db:generate             # Generate Drizzle migrations from schema
pnpm migration:generate      # Generate custom migration
```

Migrations are stored in the `sql/` directory with numbered prefixes. The Docker container applies them automatically on first start; see [docs/local-database-setup.md](docs/local-database-setup.md) for applying new ones to an existing database.

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected routes
│   └── api/               # API routes
├── components/            # React components
│   ├── card-creation/    # Card builder
│   ├── adversary-creation/ # Adversary builder
│   ├── game-master/      # GM tools
│   └── ui/               # Reusable UI components
├── lib/
│   ├── auth/             # Authentication config
│   ├── database/         # Drizzle schemas
│   ├── constants/        # SRD game data
│   └── utils/            # Utilities
├── actions/              # Server actions
├── store/                # Zustand stores
└── hooks/                # Custom React hooks
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](.github/CONTRIBUTING.md) for guidelines and [docs/contributing-code-standards.md](docs/contributing-code-standards.md) for code conventions.

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## Legal

Daggerheart™ is a trademark of Darrington Press, LLC. This project is an independent fan-made tool and is not affiliated with, endorsed by, or sponsored by Darrington Press. All game content and mechanics belong to their respective copyright holders.

This software creates content compatible with the Daggerheart System Reference Document (SRD).

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [Radix UI](https://radix-ui.com)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- SRD content from the official Daggerheart System Reference Document
