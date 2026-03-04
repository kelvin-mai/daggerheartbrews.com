import { defineConfig, devices } from '@playwright/test';

const authFile = 'e2e/.auth/user.json';

const authenticatedSpecs = [
  '**/*-authenticated.spec.ts',
  '**/community-template.spec.ts',
];

export default defineConfig({
  globalSetup: './e2e/global-setup.ts',
  testDir: './e2e',
  expect: { timeout: 15000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    // Runs once before all authenticated projects
    { name: 'setup', testMatch: /auth\.setup\.ts/ },

    // Unauthenticated — all browsers, skip auth/authenticated specs
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ['**/auth.setup.ts', ...authenticatedSpecs],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: ['**/auth.setup.ts', ...authenticatedSpecs],
    },
    // Authenticated — Chromium only, uses saved auth state
    {
      name: 'chromium-authenticated',
      use: {
        ...devices['Desktop Chrome'],
        storageState: authFile,
      },
      testMatch: authenticatedSpecs,
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
