import { test, expect } from '@playwright/test';

const COMMUNITY_PAGES = [
  { path: '/community/cards', label: 'cards' },
  { path: '/community/adversaries', label: 'adversaries' },
  { path: '/community/environments', label: 'environments' },
];

for (const { path, label } of COMMUNITY_PAGES) {
  test.describe(`Community ${label} – sort tabs`, () => {
    test('Hot, New, and Top sort buttons are visible', async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole('button', { name: 'Hot' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'New' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Top' })).toBeVisible();
    });

    test('can switch to New sort without error', async ({ page }) => {
      await page.goto(path);
      await page.getByRole('button', { name: 'New' }).click();
      await expect(page.getByRole('button', { name: 'New' })).toBeVisible();
      await expect(page.locator('body')).not.toContainText(
        'Something went wrong',
      );
    });

    test('can switch to Top sort without error', async ({ page }) => {
      await page.goto(path);
      await page.getByRole('button', { name: 'Top' }).click();
      await expect(page.getByRole('button', { name: 'Top' })).toBeVisible();
      await expect(page.locator('body')).not.toContainText(
        'Something went wrong',
      );
    });

    test('can switch back to Hot after changing sort', async ({ page }) => {
      await page.goto(path);
      await page.getByRole('button', { name: 'New' }).click();
      await page.getByRole('button', { name: 'Hot' }).click();
      await expect(page.getByRole('button', { name: 'Hot' })).toBeVisible();
    });
  });
}
