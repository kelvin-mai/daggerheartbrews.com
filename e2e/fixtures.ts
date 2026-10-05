import { expect, type Locator, type Page } from '@playwright/test';

export const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQ' +
    'AABjkB6QAAAABJRU5ErkJggg==',
  'base64',
);

export const TEST_USER = {
  email: process.env.TEST_USER_EMAIL ?? 'test@example.com',
  password: process.env.TEST_USER_PASSWORD ?? 'password123',
};

export async function login(page: Page) {
  await page.goto('/login');
  await page.locator('#email').fill(TEST_USER.email);
  await page.locator('#password').fill(TEST_USER.password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/\/profile\/homebrew/);
}

export function getItemRow(page: Page, name: string) {
  return page
    .locator('.truncate.font-medium')
    .filter({ hasText: name })
    .locator('xpath=../../..');
}

export async function gotoHomebrew(page: Page) {
  await page.goto('/profile/homebrew');
  await page.waitForLoadState('networkidle');
}

export async function toggleVisibility(page: Page, row: Locator) {
  await row.getByRole('button', { name: 'More actions' }).click();
  const [res] = await Promise.all([
    page.waitForResponse(
      (r) =>
        r.request().method() === 'PUT' && r.url().includes('/api/community/'),
    ),
    page.getByRole('menuitem', { name: 'Toggle Visibility' }).click(),
  ]);
  expect(res.ok()).toBe(true);
}
