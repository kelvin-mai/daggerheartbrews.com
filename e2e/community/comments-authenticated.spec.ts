import { test, expect } from '@playwright/test';

import { getItemRow } from '../fixtures';

const CARD_NAME = 'E2E Comment Card';
const COMMENT_BODY = 'This is a test comment for E2E.';

test.describe('Community Card Comments', () => {
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

  test('comment section is visible on detail page', async ({ page }) => {
    await page.goto('/community/cards');
    await getItemRow(page, CARD_NAME)
      .getByRole('link', { name: CARD_NAME })
      .click();
    await expect(page).toHaveURL(/\/community\/cards\/.+/);
    await expect(page.getByText('Comments')).toBeVisible();
    await expect(page.getByPlaceholder('Leave a comment...')).toBeVisible();
  });

  test('can submit a comment', async ({ page }) => {
    await page.goto('/community/cards');
    await getItemRow(page, CARD_NAME)
      .getByRole('link', { name: CARD_NAME })
      .click();
    await expect(page).toHaveURL(/\/community\/cards\/.+/);

    await page.getByPlaceholder('Leave a comment...').fill(COMMENT_BODY);
    await page.getByRole('button', { name: 'Comment' }).click();

    await expect(page.getByText(COMMENT_BODY)).toBeVisible();
    await expect(page.getByText('Comments (1)')).toBeVisible();
  });

  test('comment count badge shows on community card list', async ({ page }) => {
    await page.goto('/community/cards');
    const row = getItemRow(page, CARD_NAME);
    await expect(row.getByRole('button', { name: '1 Comment' })).toBeVisible();
  });

  test('sort toggle switches to newest order', async ({ page }) => {
    await page.goto('/community/cards');
    await getItemRow(page, CARD_NAME)
      .getByRole('link', { name: CARD_NAME })
      .click();
    await expect(page).toHaveURL(/\/community\/cards\/.+/);

    await expect(page.getByText(COMMENT_BODY)).toBeVisible();

    const newestBtn = page.getByRole('button', { name: 'Newest' });
    await expect(newestBtn).toBeVisible();
    await newestBtn.click();

    await expect(page.getByText(COMMENT_BODY)).toBeVisible();

    await page.getByRole('button', { name: 'Oldest' }).click();
    await expect(page.getByText(COMMENT_BODY)).toBeVisible();
  });

  test('can delete own comment', async ({ page }) => {
    await page.goto('/community/cards');
    await getItemRow(page, CARD_NAME)
      .getByRole('link', { name: CARD_NAME })
      .click();
    await expect(page).toHaveURL(/\/community\/cards\/.+/);

    await expect(page.getByText(COMMENT_BODY)).toBeVisible();
    await page.getByRole('button', { name: 'Delete comment' }).click();
    await expect(page.getByText(COMMENT_BODY)).not.toBeVisible();
    await expect(page.getByText('Comments (0)')).not.toBeVisible();
    await expect(page.getByText('Comments')).toBeVisible();
  });

  test('cleanup: delete the test card', async ({ page }) => {
    await page.goto('/profile/homebrew');
    const row = getItemRow(page, CARD_NAME);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await expect(page.getByText(CARD_NAME)).not.toBeVisible();
  });
});
