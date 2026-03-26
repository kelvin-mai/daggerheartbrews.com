---
name: code-standards
description: Coding conventions and standards for Daggerheart Brews. Reference when writing or reviewing code.
---

# Code Standards

## TypeScript

- Prefer `type` over `interface` unless declaration merging is needed
- No `any` — use `unknown` and narrow, or define proper types
- Export types from `src/lib/types/` for shared use; colocate types in the same file if only used locally
- Use `satisfies` operator to validate literal objects against a type without widening
- Prefer explicit return types on exported functions; infer for internal/inline functions
- Excludes: `src/components/ui/` (shadcn), `src/app/` (App Router), `src/hooks/` — these may be dynamically generated or follow framework conventions
- Prefer `export const` arrow function syntax over `export function` for components and hooks

```ts
// preferred
export const getCard = (id: string): Card => { ... }

// avoid
export function getCard(id: string): Card { ... }
```

---

## React / Next.js

- Server Components by default; add `'use client'` only when required (event handlers, hooks, browser APIs)
- Co-locate a component's subcomponents in the same file unless they're reused elsewhere
- Prefer named exports over default exports for components
- Keep components focused — extract logic into hooks if a component exceeds ~150 lines
- Do not use `useEffect` for data fetching; use Server Components or server actions

### Naming

- Components: `PascalCase`
- Hooks: `useCamelCase`
- Server actions: `camelCase` in `src/actions/`
- Files: `kebab-case.tsx`
- Variables: prefer one word when possible to avoid casing

### Props

- Define props inline for simple components; extract to a named type for reused or complex ones
- Avoid prop drilling beyond 2 levels — use Zustand store or React context

---

## Styling (Tailwind CSS v4)

- Use Tailwind utility classes directly; avoid arbitrary values where a design token exists
- Group classes: layout → spacing → typography → color → state (`hover:`, `dark:`)
- Prefer `cn()` utility for conditional class merging
- No inline `style={{}}` unless strictly necessary (e.g., dynamic values not expressible in Tailwind)
- Define reusable design tokens in `src/app/globals.css` under `@theme`

```tsx
// preferred
<div className={cn('flex items-center gap-2', isActive && 'text-primary')}>

// avoid
<div style={{ display: 'flex', gap: '8px' }}>
```

---

## State Management (Zustand)

- Follow the four-file store pattern: `types.ts`, `actions.ts`, `effects.ts`, `computed.ts`
- Do not read or mutate store state outside of its own module's actions/effects
- Keep derived values in `computed.ts`; do not recompute them in components
- Import via the barrel from `@/store`, not direct file paths

---

## Server Actions

- All server actions live in `src/actions/`
- Validate input with Zod at the action boundary before any DB call
- Return a typed result object `{ data, error }` — never throw to the client
- Use `revalidatePath` / `revalidateTag` to invalidate cache after mutations

```ts
// preferred return shape
return { data: result, error: null };
return { data: null, error: 'Not authorized' };
```

---

## Package Manager

- Always use `pnpm` instead of `npm` for running scripts and node tasks
- `pnpm run <script>`, `pnpm dlx <package>`, never `npm run` or `npx`

---

## Database (Drizzle ORM)

- Schema changes go in `src/lib/database/schema/`; run `pnpm run db:generate` after changes
- Never write raw SQL strings in application code — use the Drizzle query builder
- Keep queries in server actions or server-only utility files; never in Client Components
- Use transactions for multi-step writes

---

## Imports

- Use `@/` alias for most imports; no relative `../../` traversal
- Relative imports are fine within a sub-module (e.g. within `src/components/card-creation/`)
- Order imports: React → Next.js → third-party → internal (`@/`) → types
- Separate groups with a blank line (Prettier/ESLint enforces this)

---

## File & Directory Conventions

- Feature-first organization: group by feature, not by file type
- Do not create a new `utils/` file for one-off helpers — colocate or inline
- Barrel `index.ts` files are allowed for public component APIs, not for deep internal re-exports

---

## What Claude Should NOT Do

- Do not add comments to code that is self-explanatory
- Do not add error handling for impossible cases
- Do not refactor surrounding code when fixing a targeted bug
- Do not add `console.log` statements
- Do not create new abstractions for single-use logic
- Do not use `// TODO` or `// FIXME` without being asked to
