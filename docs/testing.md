# Testing

This project uses two testing frameworks:

- **Vitest** with React Testing Library for unit and component tests
- **Playwright** for end-to-end (E2E) browser tests

## Unit Tests (Vitest)

Unit tests live in the `test/` directory and mirror the source structure. They use jsdom as the browser environment and support the `@/` path alias.

### Running Unit Tests

```bash
pnpm run test              # Run tests in watch mode
pnpm run test:ui           # Run with Vitest's browser UI
pnpm run test:coverage     # Run with coverage report
```

### Writing Unit Tests

Test files should be named `*.test.ts` or `*.test.tsx` and placed in `test/` following the source directory structure:

```
test/
└── store/
    ├── card/
    │   ├── actions.test.ts
    │   └── effects.test.ts
    └── adversary/
        ├── actions.test.ts
        └── effects.test.ts
```

Tests use `globals: true` in the Vitest config, so `describe`, `it`, `expect`, etc. are available without imports. React Testing Library and jest-dom matchers are set up in `test/setup.ts`.

Example:

```typescript
import { useCardStore } from '@/store';

describe('card store actions', () => {
  beforeEach(() => {
    useCardStore.getState().actions.reset();
  });

  it('should update card name', () => {
    useCardStore.getState().actions.setName('Fireball');
    expect(useCardStore.getState().card.name).toBe('Fireball');
  });
});
```

### What to Unit Test

- **Zustand store actions** — state mutations produce correct state
- **Zustand store effects** — side effects (API calls, localStorage) behave correctly
- **Utility functions** — pure logic in `src/lib/utils/`
- **Computed values** — derived state returns expected results

## E2E Tests (Playwright)

E2E tests live in the `e2e/` directory and run against the actual application in real browsers.

### Setup

Install Playwright browsers (one-time setup):

```bash
pnpm exec playwright install
```

### Running E2E Tests

```bash
pnpm run test:e2e          # Run all E2E tests (headless)
pnpm run test:e2e:ui       # Run with Playwright's interactive UI
```

Run a single test file or filter by name:

```bash
pnpm exec playwright test e2e/home/home.spec.ts
pnpm exec playwright test --grep "homepage"
```

Run against a specific browser:

```bash
pnpm exec playwright test --project=chromium
pnpm exec playwright test --project=firefox
```

### Viewing Test Reports

After a test run, open the HTML report:

```bash
pnpm exec playwright show-report
```

### Configuration

The Playwright config (`playwright.config.ts`) is set up to:

- Automatically start the dev server (`pnpm run dev`) before tests
- Reuse an existing dev server if one is already running locally
- Run against Chromium and Firefox
- Retry failed tests twice in CI, zero retries locally
- Capture traces on first retry for debugging

### Writing E2E Tests

Test files should be named `*.spec.ts` and placed in a directory that mirrors the page route being tested:

```
e2e/
├── fixtures.ts
├── global-setup.ts
├── auth.setup.ts
├── home/
│   └── home.spec.ts
├── card/
│   └── create/
│       ├── card-creator.spec.ts
│       └── card-creation-authenticated.spec.ts
├── adversary/
│   └── create/
│       ├── adversary-creator.spec.ts
│       └── adversary-creation-authenticated.spec.ts
└── community/
    └── community-template.spec.ts
```

Example:

```typescript
import { test, expect } from '@playwright/test';

test('homepage loads and renders', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/DaggerheartBrews/);
});
```

### Authenticated Tests

Tests that require a logged-in user are split into their own `*-authenticated.spec.ts` files and run in a dedicated `chromium-authenticated` Playwright project. The auth flow works as follows:

1. **`e2e/global-setup.ts`** runs once before all tests. It seeds a test user directly in the database (credentials from `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` env vars, defaulting to `test@example.com` / `password123`). It also cleans up any leftover items from previous test runs.

2. **`e2e/auth.setup.ts`** runs the login flow in a browser and saves the session to `e2e/.auth/user.json`.

3. Authenticated spec files load that saved session via `storageState`, so every test starts already logged in.

When writing authenticated tests, import helpers from `fixtures.ts` using a path relative to the spec file's location:

```typescript
import { getItemRow } from '../../fixtures'; // from e2e/card/create/
```

### What to E2E Test

- **Critical user flows** — card creation, adversary creation, auth flows
- **Navigation** — page links and routing work correctly
- **Public pages** — homepage, community pages render properly
- **Form submissions** — card builder, adversary builder produce expected results

### Tips

- Use `page.goto('/')` with relative paths; the `baseURL` is configured in the Playwright config
- Use `await expect(locator).toBeVisible()` over manual waits
- Use Playwright's [codegen](https://playwright.dev/docs/codegen) to help write selectors:
  ```bash
  pnpm exec playwright codegen http://localhost:3000
  ```
- For pages with async session loading, wait for the Save button to become enabled before interacting:
  ```typescript
  await expect(page.getByRole('button', { name: 'Save' })).not.toHaveAttribute(
    'aria-disabled',
  );
  ```
