# Code Standards

This document covers the conventions and patterns used in this codebase. Please read it before submitting a pull request — it will save everyone time in review.

---

## TypeScript

**Use `type`, not `interface`**

Unless you specifically need declaration merging (e.g. extending a global), use `type` aliases.

```ts
// correct
type CardProps = {
  id: string;
  name: string;
};

// avoid
interface CardProps {
  id: string;
  name: string;
}
```

**No `any`**

Use `unknown` and narrow it, or define a proper type. `any` defeats the purpose of TypeScript.

**Explicit return types on exported functions**

This applies to functions in `src/lib/`, `src/actions/`, and `src/components/` (excluding `src/components/ui/` which is shadcn-generated). Functions internal to a file can rely on inference.

```ts
// correct
export const getCard = (id: string): Card => { ... }

// avoid
export const getCard = (id: string) => { ... }
```

**`export const` over `export function`**

Prefer arrow function syntax for exported functions and components.

**`satisfies` for literal objects**

When you have a literal object that should conform to a type without widening, use `satisfies`.

```ts
const config = {
  color: 'red',
  size: 4,
} satisfies CardConfig;
```

---

## React & Next.js

**Server Components by default**

Don't add `'use client'` unless you need browser APIs, event handlers, or hooks. Keep as much as possible on the server.

**Named exports for components**

```ts
// correct
export const MyComponent = () => { ... }

// avoid
export default function MyComponent() { ... }
```

Next.js page files (`page.tsx`, `layout.tsx`, `error.tsx`) are the exception — they require default exports per the framework.

**Keep components focused**

If a component exceeds ~150 lines, extract logic into a custom hook. Co-locate subcomponents in the same file unless they're reused elsewhere.

**No `useEffect` for data fetching**

Fetch data in Server Components or server actions. `useEffect` fetching leads to waterfalls, loading states, and race conditions that Server Components avoid entirely.

---

## Naming

| Thing          | Convention              |
| -------------- | ----------------------- |
| Components     | `PascalCase`            |
| Hooks          | `useCamelCase`          |
| Server actions | `camelCase`             |
| Files          | `kebab-case.tsx`        |
| Variables      | One word where possible |

---

## Styling

This project uses **Tailwind CSS v4**.

- Use utility classes directly — don't reach for arbitrary values (`[...]`) if a design token covers it
- Order classes: layout → spacing → typography → color → interactive states
- Use `cn()` from `@/lib/utils` for conditional class merging, not string interpolation
- Avoid `style={{}}` unless the value is genuinely dynamic and can't be expressed in Tailwind

```tsx
// correct
<div className={cn('flex items-center gap-2', isActive && 'text-primary')}>

// avoid
<div style={{ display: 'flex', gap: '8px' }}>
```

Custom design tokens live in `src/app/globals.css` under `@theme`.

---

## State Management

The app uses **Zustand** for client state. Each store follows a four-file pattern:

```
src/store/[feature]/
  types.ts      # State shape and related types
  actions.ts    # State mutations
  effects.ts    # Side effects (API calls, localStorage)
  computed.ts   # Derived values
```

- Don't read or mutate store state outside of its own `actions.ts` / `effects.ts`
- Don't recompute derived values in components — add them to `computed.ts`
- Import from the `@/store` barrel, not from individual files

---

## Server Actions

All server actions live in `src/actions/`. They follow a consistent pattern:

1. **Validate input with Zod** before touching the database
2. **Return `{ data, error }`** — never throw to the client
3. **Call `revalidatePath` or `revalidateTag`** after any mutation

```ts
// correct
export const updateCard = async (input: unknown) => {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { data: null, error: 'Invalid input' };

  const result = await db...;
  revalidatePath('/cards');
  return { data: result, error: null };
};
```

---

## Database

The project uses **Drizzle ORM** with PostgreSQL.

- Schema changes go in `src/lib/database/schema/` — run `npm run db:generate` after editing
- Use the Drizzle query builder; no raw SQL strings in application code
- Keep queries in server actions or server-only utility files — never in Client Components
- Use transactions for multi-step writes

---

## Imports

- Use the `@/` alias for all imports; avoid relative `../../` traversal
- Relative imports are fine within the same feature directory
- Import order: React → Next.js → third-party → internal (`@/`) → types (ESLint enforces this)

---

## Project Structure

The project is organized **feature-first**, not by file type:

```
src/
  app/           # Next.js App Router pages
  actions/       # Server actions
  components/
    card-creation/      # All card builder components
    adversary-creation/ # All adversary builder components
    ui/                 # Shared primitives (shadcn — don't edit directly)
  hooks/         # Custom React hooks
  lib/
    auth/        # Better Auth config
    constants/   # SRD game data
    database/    # Drizzle schema and setup
    types/       # Shared TypeScript types
    utils/       # Shared utility functions
  store/         # Zustand stores
```

Don't create a new `utils/` file for a one-off helper — colocate it or inline it. Barrel `index.ts` files are for public component APIs, not internal re-exports.

---

## Things to Avoid

- Comments on self-explanatory code
- Error handling for cases that can't happen
- `console.log` statements
- `// TODO` or `// FIXME` without prior discussion in an issue
- New abstractions for single-use logic
- Refactoring code that surrounds a targeted bug fix
