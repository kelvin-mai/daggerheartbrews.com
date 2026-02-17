# Testing

This project uses two testing frameworks:

- **Vitest** with React Testing Library for unit and component tests
- **Playwright** for end-to-end (E2E) browser tests

## Unit Tests (Vitest)

Unit tests live in the `test/` directory and mirror the source structure. They use jsdom as the browser environment and support the `@/` path alias.

### Running Unit Tests

```bash
npm run test              # Run tests in watch mode
npm run test:ui           # Run with Vitest's browser UI
npm run test:coverage     # Run with coverage report
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

If prompted for missing system dependencies, install them with your system package manager. For example on Arch-based Linux:

```bash
yay -S icu libxml2 flite
```

### Running E2E Tests

```bash
npm run test:e2e          # Run all E2E tests (headless)
npm run test:e2e:ui       # Run with Playwright's interactive UI
```

Run a single test file or filter by name:

```bash
npx playwright test e2e/home.spec.ts
npx playwright test --grep "homepage"
```

Run against a specific browser:

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Viewing Test Reports

After a test run, open the HTML report:

```bash
npx playwright show-report
```

### Configuration

The Playwright config (`playwright.config.ts`) is set up to:

- Automatically start the dev server (`npm run dev`) before tests
- Reuse an existing dev server if one is already running locally
- Run against Chromium, Firefox, and WebKit
- Retry failed tests twice in CI, zero retries locally
- Capture traces on first retry for debugging

### Writing E2E Tests

Test files should be named `*.spec.ts` and placed in the `e2e/` directory:

```
e2e/
├── home.spec.ts
├── card-creation.spec.ts
└── auth.spec.ts
```

Example:

```typescript
import { test, expect } from '@playwright/test';

test('homepage loads and renders', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/DaggerheartBrews/);
});

test('can navigate to card builder', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Card Builder');
  await expect(page).toHaveURL(/\/card/);
});
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
  npx playwright codegen http://localhost:3000
  ```
- For tests that require authentication, create a shared auth state using Playwright's [storage state](https://playwright.dev/docs/auth) feature
