# Daggerheart Brews

A Next.js web application for creating and sharing homebrew content for the Daggerheart TTRPG. Create custom cards, adversaries, and access game master tools and reference materials.

**Live Site**: [daggerheartbrews.com](https://daggerheartbrews.com)

## Features

- **Card Builder**: Create custom ability cards with domains, colors, images, and stats
- **Adversary Builder**: Design custom adversaries with customizable stats, attacks, and abilities
- **Community Sharing**: Browse and share homebrew content with the community
- **Game Master Tools**: Quick reference for rules, tables, and game mechanics
- **Authentication**: Secure email/password and social login (Google, Discord)
- **Export**: Generate printable card images

## Tech Stack

- **Framework**: Next.js 15 with App Router, TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL with Drizzle ORM (Neon serverless in production)
- **Authentication**: Better Auth
- **State Management**: Zustand
- **Email**: React Email with Resend
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (local or Neon)
- OAuth credentials (Discord, Google)
- Resend API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kelvin-mai/daggerheartbrews.com.git
cd daggerheartbrews.com
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
- **DATABASE_URL**: PostgreSQL connection string
- **BETTER_AUTH_SECRET**: Generate with `openssl rand -base64 32`
- **BETTER_AUTH_URL**: Your app URL (http://localhost:3000 for dev)
- **DISCORD_CLIENT_ID/SECRET**: From [Discord Developer Portal](https://discord.com/developers/applications)
- **GOOGLE_CLIENT_ID/SECRET**: From [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- **RESEND_API_KEY**: From [Resend](https://resend.com/api-keys)

4. Generate and run database migrations:
```bash
npm run db:generate
```

Apply migrations manually by running the SQL files in the `sql/` directory against your database.

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Development

### Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run format       # Format code with Prettier
```

### Database

```bash
npm run db:generate           # Generate Drizzle migrations from schema
npm run migration:generate    # Generate custom migration
```

Migrations are stored in `sql/` directory with numbered prefixes.

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

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

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
