import { type Page } from '@playwright/test';

// Minimal 1×1 transparent PNG for image upload tests
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

/**
 * Locates the post row (PersonalPost or CommunityPost) that contains the
 * given item name. Works on both /profile/homebrew and /community/* pages.
 *
 * The name `<p class="truncate ...">` is always 3 DOM levels below the row
 * root: p → div.flex → div.min-w-0 → div.group (root).
 */
export function getItemRow(page: Page, name: string) {
  return page
    .locator('p.truncate')
    .filter({ hasText: name })
    .locator('xpath=../../..');
}
