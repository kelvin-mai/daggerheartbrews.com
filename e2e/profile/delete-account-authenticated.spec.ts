import fs from 'node:fs';
import path from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import { Client } from 'pg';

const DELETE_USER = {
  email: 'delete-test@example.com',
  password: 'password123',
};

function loadEnv() {
  const envPath = path.resolve(__dirname, '../../.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/\/profile\/homebrew/);
}

test.describe('Delete Account', () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async () => {
    loadEnv();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { hashPassword } = require('better-auth/crypto');
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    try {
      await client.query('DELETE FROM users WHERE email = $1', [
        DELETE_USER.email,
      ]);
      const { rows } = await client.query<{ id: string }>(
        `INSERT INTO users (name, email, email_verified)
         VALUES ($1, $2, true)
         RETURNING id`,
        ['Delete Test User', DELETE_USER.email],
      );
      const userId = rows[0].id;
      await client.query('INSERT INTO user_settings (user_id) VALUES ($1)', [
        userId,
      ]);
      const hashed = await hashPassword(DELETE_USER.password);
      await client.query(
        `INSERT INTO accounts (account_id, provider_id, user_id, password)
         VALUES ($1, 'credential', $2, $3)`,
        [userId, userId, hashed],
      );
    } finally {
      await client.end();
    }
  });

  test('Delete Account section is visible on the profile page', async ({
    page,
  }) => {
    await loginAs(page, DELETE_USER.email, DELETE_USER.password);
    await page.goto('/profile');

    await expect(
      page.getByRole('heading', { name: 'Delete Account' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Delete Account' }),
    ).toBeVisible();
  });

  test('confirm button is disabled until the correct email is typed', async ({
    page,
  }) => {
    await loginAs(page, DELETE_USER.email, DELETE_USER.password);
    await page.goto('/profile');
    await page.getByRole('button', { name: 'Delete Account' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    const confirmButton = dialog.getByRole('button', {
      name: 'Permanently Delete Account',
    });
    await expect(confirmButton).toBeDisabled();

    await dialog.getByPlaceholder(DELETE_USER.email).fill('wrong@example.com');
    await expect(confirmButton).toBeDisabled();

    await dialog.getByPlaceholder(DELETE_USER.email).fill(DELETE_USER.email);
    await expect(confirmButton).toBeEnabled();
  });

  test('deletes the account and redirects to /login', async ({ page }) => {
    await loginAs(page, DELETE_USER.email, DELETE_USER.password);
    await page.goto('/profile');
    await page.getByRole('button', { name: 'Delete Account' }).click();

    const dialog = page.getByRole('dialog');
    await dialog.getByPlaceholder(DELETE_USER.email).fill(DELETE_USER.email);
    await dialog
      .getByRole('button', { name: 'Permanently Delete Account' })
      .click();

    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL('/login');
  });

  test('deleted user cannot log in', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill(DELETE_USER.email);
    await page.locator('#password').fill(DELETE_USER.password);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL('/login');
  });
});
