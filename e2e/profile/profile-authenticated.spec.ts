import { test, expect } from '@playwright/test';

import { getItemRow } from '../fixtures';

const CARD_NAME = 'E2E Profile Card';

test.describe('User Profile Page', () => {
  test.describe.configure({ mode: 'serial' });

  test('setup: create and publish a card', async ({ page }) => {
    await page.goto('/card/create');
    await expect(page.getByText('Basic Details')).toBeVisible();
    await page.locator('#name').fill(CARD_NAME);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForURL(/\/profile\/homebrew/);

    const row = getItemRow(page, CARD_NAME);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Toggle Visibility' }).click();
    await expect(row.getByText('Public')).toBeVisible();
  });

  test('creator name on community post links to profile page', async ({
    page,
  }) => {
    await page.goto('/community/cards');
    const row = getItemRow(page, CARD_NAME);
    const creatorLink = row
      .locator('a[href^="/profile/"]')
      .filter({ hasNotText: CARD_NAME });
    await expect(creatorLink).toBeVisible();
    await creatorLink.click();
    await expect(page).toHaveURL(/\/profile\/.+/);
  });

  test('own profile page shows Settings button', async ({ page }) => {
    await page.goto('/community/cards');
    const row = getItemRow(page, CARD_NAME);
    const creatorLink = row
      .locator('a[href^="/profile/"]')
      .filter({ hasNotText: CARD_NAME });
    await creatorLink.click();
    await expect(page).toHaveURL(/\/profile\/.+/);
    await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
  });

  test('Settings button on own profile navigates to /profile', async ({
    page,
  }) => {
    await page.goto('/community/cards');
    await getItemRow(page, CARD_NAME)
      .locator('a[href^="/profile/"]')
      .filter({ hasNotText: CARD_NAME })
      .click();
    await expect(page).toHaveURL(/\/profile\/.+/);
    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page).toHaveURL('/profile');
  });

  test('own profile page shows public card in Cards section', async ({
    page,
  }) => {
    await page.goto('/community/cards');
    await getItemRow(page, CARD_NAME)
      .locator('a[href^="/profile/"]')
      .filter({ hasNotText: CARD_NAME })
      .click();
    await expect(page).toHaveURL(/\/profile\/.+/);
    await expect(getItemRow(page, CARD_NAME)).toBeVisible();
  });

  test('profile page shows non-zero card count in stats grid', async ({
    page,
  }) => {
    await page.goto('/community/cards');
    await getItemRow(page, CARD_NAME)
      .locator('a[href^="/profile/"]')
      .filter({ hasNotText: CARD_NAME })
      .click();
    await expect(page).toHaveURL(/\/profile\/.+/);
    const statsCards = page.locator('.bg-card.rounded-lg.border.p-3');
    await expect(statsCards.filter({ hasText: 'Cards' })).not.toContainText(
      '0',
    );
  });

  test('profile page is accessible without authentication', async ({
    browser,
  }) => {
    const unauthContext = await browser.newContext();
    const page = await unauthContext.newPage();
    await page.goto('/community/cards');
    const profileLink = page.locator('a[href^="/profile/"]').first();
    const href = await profileLink.getAttribute('href');
    if (href) {
      await page.goto(href);
      await expect(page).toHaveURL(/\/profile\/.+/);
      await expect(page.locator('h1')).toBeVisible();
    }
    await unauthContext.close();
  });

  test('cleanup: delete the test card', async ({ page }) => {
    await page.goto('/profile/homebrew');
    const row = getItemRow(page, CARD_NAME);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await expect(page.getByText(CARD_NAME)).not.toBeVisible();
  });
});
