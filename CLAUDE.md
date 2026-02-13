# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Daggerheart Brews is a Next.js web application for creating and sharing homebrew content for the Daggerheart TTRPG. Users can create custom cards, adversaries, and access game master tools and reference materials.

## Tech Stack

- **Framework**: Next.js 15 with App Router, TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL with Drizzle ORM (Neon serverless in production, node-postgres in development)
- **Authentication**: Better Auth with email/password and social providers (Google, Discord)
- **State Management**: Zustand
- **Email**: React Email with Resend
- **Deployment**: Vercel

## Commands

### Development
```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm start            # Start production server
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run format       # Format code with Prettier
```

### Database
```bash
npm run db:generate           # Generate Drizzle migrations from schema
npm run migration:generate    # Generate custom migration (runs tsx ./scripts/generate-migration.ts)
```

Migrations are stored in `sql/` directory with numbered prefixes (e.g., `0000_options.sql`, `0001_auth.sql`).

## Architecture

### Directory Structure

- **`src/app/`** - Next.js App Router pages
  - `(auth)/` - Authentication routes: login, register, forgot-password, reset-password, verify
  - `(dashboard)/` - Protected routes: card/adversary creation, profile, reference pages, community
  - `api/` - API routes for previews, auth, community items

- **`src/components/`** - React components organized by feature
  - `card-creation/` - Card builder components
  - `adversary-creation/` - Adversary builder components
  - `game-master/` - GM screen tools
  - `auth/` - Authentication forms
  - `ui/` - Reusable UI components (Radix UI based)

- **`src/lib/`** - Core library code
  - `auth/` - Better Auth configuration and client
  - `database/` - Drizzle setup and schemas
  - `constants/` - Game data (SRD content for ancestries, classes, domains, etc.)
  - `types/` - TypeScript type definitions
  - `utils/` - Utility functions
  - `env.ts` - Environment variable validation with Zod

- **`src/actions/`** - Server actions for auth, profile, user-items
- **`src/store/`** - Zustand stores (card, adversary)
- **`src/hooks/`** - Custom React hooks
- **`sql/`** - Database migrations

### Path Aliases

The project uses `@/` as an alias for `src/`:
```typescript
import { db } from '@/lib/database';
import type { CardState } from '@/store/card/types';
```

### Database Architecture

- **Setup**: Drizzle ORM with PostgreSQL
  - Production uses `drizzle-orm/neon-serverless` for Neon database
  - Development uses `drizzle-orm/node-postgres`
  - Client selection is environment-based (see `src/lib/database/index.ts`)

- **Schemas**: Located in `src/lib/database/schema/`
  - `auth.sql.ts` - Better Auth tables (users, sessions, accounts, verification)
  - `user-items.sql.ts` - User-created content (cards, adversaries)
  - `constants.sql.ts` - Reference data tables

- **Migrations**: Drizzle Kit generates migrations to `migrations/` directory, but they are stored/applied from `sql/` directory

### Authentication

Better Auth configuration in `src/lib/auth/index.ts`:
- Email/password authentication with verification
- Social providers: Google, Discord
- Email verification sends users to `/profile` after verification
- Password reset via email
- Drizzle adapter for database
- Middleware protects `/profile` and `/profile/homebrew` routes

### State Management

Zustand stores follow a consistent pattern with three modules:
- **`types.ts`** - Store state and types
- **`actions.ts`** - State mutations
- **`effects.ts`** - Side effects (API calls, local storage)
- **`computed.ts`** - Derived values (card store only)

Example usage:
```typescript
import { useCardStore, useCardActions, useCardEffects } from '@/store';

const { card, settings } = useCardStore();
const actions = useCardActions();
const effects = useCardEffects();
```

### Environment Variables

Environment variables are validated with Zod in `src/lib/env.ts`. Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Auth secret key
- `BETTER_AUTH_URL` - Base URL for auth callbacks
- `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` - Discord OAuth
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth
- `RESEND_API_KEY` - Email service API key
- `ENV` - Environment (development/testing/production)
- `PORT` - Optional port number

## Key Patterns

### Route Groups
The app uses Next.js route groups for organization:
- `(auth)` - Public authentication pages
- `(dashboard)` - Protected application pages

### Component Organization
Components are organized by feature area, not by type. Each feature directory contains all related components, not split into "forms", "cards", etc.

### API Routes
Preview endpoints (`/api/card-preview`, `/api/adversary-preview`) generate images of user-created content. Community endpoints serve homebrew content from the database.

### Image Handling
The app uses `@jpinsonneau/html-to-image` for generating card/adversary images and `@origin-space/image-cropper` for user image uploads.

### Rich Text Editing
TipTap editor is used for card text content with custom extensions for text alignment.

## Important Notes

- The project is MIT licensed and creates Daggerheart™ compatible content
- SRD (System Reference Document) data is stored in `src/lib/constants/srd/`
- Card and adversary creation tools support customizable domains, colors, images, and stats
- Community features allow users to share and browse homebrew content
- The middleware only protects profile routes; other dashboard routes may need authentication checks in components/actions
