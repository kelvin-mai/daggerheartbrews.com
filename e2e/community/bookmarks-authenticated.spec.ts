import { test, expect } from '@playwright/test';

import { getItemRow } from '../fixtures';

const CARD_NAME = 'E2E Bookmark Card';
const ADVERSARY_NAME = 'E2E Bookmark Adversary';

test.describe('Bookmarks', () => {
  test.describe.configure({ mode: 'serial' });

  test('setup: create and publish a card for bookmark tests', async ({
    page,
  }) => {
    await page.goto('/card/create');
    await expect(page.getByText('Basic Details')).toBeVisible();
    const saveButton = page.getByRole('button', { name: 'Save' });
    await expect(saveButton).not.toHaveAttribute('aria-disabled');
    await page.locator('#name').fill(CARD_NAME);
    await saveButton.click();
    await page.waitForURL(/\/profile\/homebrew/);

    const row = getItemRow(page, CARD_NAME);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Toggle Visibility' }).click();
    await expect(row.getByText('Public')).toBeVisible();
  });

  test('setup: create and publish an adversary for bookmark tests', async ({
    page,
  }) => {
    await page.goto('/adversary/create');
    await expect(page.getByText('Basic Details')).toBeVisible();
    const saveButton = page.getByRole('button', { name: 'Save' });
    await expect(saveButton).not.toHaveAttribute('aria-disabled');
    await page.locator('#name').fill(ADVERSARY_NAME);
    await saveButton.click();
    await page.waitForURL(/\/profile\/homebrew/);

    const row = getItemRow(page, ADVERSARY_NAME);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Toggle Visibility' }).click();
    await expect(row.getByText('Public')).toBeVisible();
  });

  test('bookmarks page shows empty state when nothing is bookmarked', async ({
    page,
  }) => {
    await page.goto('/profile/bookmarks');
    await expect(page.getByText('No bookmarked cards')).toBeVisible();
    await expect(page.getByText('No bookmarked adversaries')).toBeVisible();
  });

  test('bookmarks page is accessible from the sidebar', async ({ page }) => {
    await page.goto('/profile/homebrew');
    await page.getByRole('link', { name: 'Bookmarks' }).click();
    await expect(page).toHaveURL('/profile/bookmarks');
    await expect(
      page.getByRole('heading', { name: 'Bookmarks' }),
    ).toBeVisible();
  });

  test('bookmark button is visible on the community cards page', async ({
    page,
  }) => {
    await page.goto('/community/cards');
    const row = getItemRow(page, CARD_NAME);
    await expect(
      row.getByRole('button', { name: 'Add bookmark' }),
    ).toBeVisible();
  });

  test('can bookmark a card from the community page', async ({ page }) => {
    await page.goto('/community/cards');
    const row = getItemRow(page, CARD_NAME);
    await row.getByRole('button', { name: 'Add bookmark' }).click();
    await expect(
      row.getByRole('button', { name: 'Remove bookmark' }),
    ).toBeVisible();
  });

  test('bookmarked card appears on the bookmarks page', async ({ page }) => {
    await page.goto('/profile/bookmarks');
    await expect(getItemRow(page, CARD_NAME)).toBeVisible();
  });

  test('bookmark stats reflect bookmarked card count', async ({ page }) => {
    await page.goto('/profile/bookmarks');
    const statsCards = page.locator('.bg-card.rounded-lg.border.p-3');
    await expect(statsCards.filter({ hasText: 'Total' })).toContainText('1');
    await expect(statsCards.filter({ hasText: 'Cards' })).toContainText('1');
  });

  test('card bookmark state persists after navigating away and back', async ({
    page,
  }) => {
    await page.goto('/profile/homebrew');
    await page.goto('/community/cards');
    const row = getItemRow(page, CARD_NAME);
    await expect(
      row.getByRole('button', { name: 'Remove bookmark' }),
    ).toBeVisible();
  });

  test('can unbookmark a card from the bookmarks page', async ({ page }) => {
    await page.goto('/profile/bookmarks');
    const row = getItemRow(page, CARD_NAME);
    await row.getByRole('button', { name: 'Remove bookmark' }).click();
    await expect(
      row.getByRole('button', { name: 'Add bookmark' }),
    ).toBeVisible();
    await page.reload();
    await expect(page.getByText(CARD_NAME)).not.toBeVisible();
    await expect(page.getByText('No bookmarked cards')).toBeVisible();
  });

  test('bookmark button is visible on the community adversaries page', async ({
    page,
  }) => {
    await page.goto('/community/adversaries');
    const row = getItemRow(page, ADVERSARY_NAME);
    await expect(
      row.getByRole('button', { name: 'Add bookmark' }),
    ).toBeVisible();
  });

  test('can bookmark an adversary from the community page', async ({
    page,
  }) => {
    await page.goto('/community/adversaries');
    const row = getItemRow(page, ADVERSARY_NAME);
    await row.getByRole('button', { name: 'Add bookmark' }).click();
    await expect(
      row.getByRole('button', { name: 'Remove bookmark' }),
    ).toBeVisible();
  });

  test('bookmarked adversary appears on the bookmarks page', async ({
    page,
  }) => {
    await page.goto('/profile/bookmarks');
    await expect(getItemRow(page, ADVERSARY_NAME)).toBeVisible();
  });

  test('can unbookmark an adversary from the community page', async ({
    page,
  }) => {
    await page.goto('/community/adversaries');
    const row = getItemRow(page, ADVERSARY_NAME);
    await row.getByRole('button', { name: 'Remove bookmark' }).click();
    await expect(
      row.getByRole('button', { name: 'Add bookmark' }),
    ).toBeVisible();
    await page.goto('/profile/bookmarks');
    await page.reload();
    await expect(page.getByText(ADVERSARY_NAME)).not.toBeVisible();
    await expect(page.getByText('No bookmarked adversaries')).toBeVisible();
  });

  test('cleanup: delete the test card', async ({ page }) => {
    await page.goto('/profile/homebrew');
    const row = getItemRow(page, CARD_NAME);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await expect(page.getByText(CARD_NAME)).not.toBeVisible();
  });

  test('cleanup: delete the test adversary', async ({ page }) => {
    await page.goto('/profile/homebrew');
    const row = getItemRow(page, ADVERSARY_NAME);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await expect(page.getByText(ADVERSARY_NAME)).not.toBeVisible();
  });
});
