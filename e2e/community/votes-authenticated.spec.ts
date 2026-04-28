import { test, expect } from '@playwright/test';

import { getItemRow } from '../fixtures';

const CARD_NAME = 'E2E Vote Card';
const ADVERSARY_NAME = 'E2E Vote Adversary';

const getScore = (row: ReturnType<typeof getItemRow>) =>
  row.locator('span.tabular-nums');

test.describe('Community Card Votes', () => {
  test.describe.configure({ mode: 'serial' });

  test('setup: create and publish a card for vote tests', async ({ page }) => {
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

  test('vote buttons are visible on the community cards page', async ({
    page,
  }) => {
    await page.goto('/community/cards');
    const row = getItemRow(page, CARD_NAME);
    await expect(row.getByRole('button', { name: 'Upvote' })).toBeVisible();
    await expect(row.getByRole('button', { name: 'Downvote' })).toBeVisible();
  });

  test('score starts at 0 for a new card', async ({ page }) => {
    await page.goto('/community/cards');
    const row = getItemRow(page, CARD_NAME);
    await expect(getScore(row)).toHaveText('0');
  });

  test('upvoting a card increments the score to 1', async ({ page }) => {
    await page.goto('/community/cards');
    const row = getItemRow(page, CARD_NAME);
    await row.getByRole('button', { name: 'Upvote' }).click();
    await expect(getScore(row)).toHaveText('1');
  });

  test('upvoting the same card again toggles the vote off', async ({
    page,
  }) => {
    await page.goto('/community/cards');
    const row = getItemRow(page, CARD_NAME);
    await expect(getScore(row)).toHaveText('1');
    await row.getByRole('button', { name: 'Upvote' }).click();
    await expect(getScore(row)).toHaveText('0');
  });

  test('downvoting a card decrements the score', async ({ page }) => {
    await page.goto('/community/cards');
    const row = getItemRow(page, CARD_NAME);
    await row.getByRole('button', { name: 'Downvote' }).click();
    await expect(getScore(row)).toHaveText('-1');
  });

  test('swapping downvote to upvote changes score by 2', async ({ page }) => {
    await page.goto('/community/cards');
    const row = getItemRow(page, CARD_NAME);
    await expect(getScore(row)).toHaveText('-1');
    await row.getByRole('button', { name: 'Upvote' }).click();
    await expect(getScore(row)).toHaveText('1');
  });

  test('cleanup: remove vote and delete the test card', async ({ page }) => {
    await page.goto('/community/cards');
    const communityRow = getItemRow(page, CARD_NAME);
    await communityRow.getByRole('button', { name: 'Upvote' }).click();
    await expect(getScore(communityRow)).toHaveText('0');

    await page.goto('/profile/homebrew');
    const row = getItemRow(page, CARD_NAME);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await expect(page.getByText(CARD_NAME)).not.toBeVisible();
  });
});

test.describe('Community Adversary Votes', () => {
  test.describe.configure({ mode: 'serial' });

  test('setup: create and publish an adversary for vote tests', async ({
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

  test('vote buttons are visible on the community adversaries page', async ({
    page,
  }) => {
    await page.goto('/community/adversaries');
    const row = getItemRow(page, ADVERSARY_NAME);
    await expect(row.getByRole('button', { name: 'Upvote' })).toBeVisible();
    await expect(row.getByRole('button', { name: 'Downvote' })).toBeVisible();
  });

  test('score starts at 0 for a new adversary', async ({ page }) => {
    await page.goto('/community/adversaries');
    const row = getItemRow(page, ADVERSARY_NAME);
    await expect(getScore(row)).toHaveText('0');
  });

  test('upvoting an adversary increments the score to 1', async ({ page }) => {
    await page.goto('/community/adversaries');
    const row = getItemRow(page, ADVERSARY_NAME);
    await row.getByRole('button', { name: 'Upvote' }).click();
    await expect(getScore(row)).toHaveText('1');
  });

  test('downvoting an adversary after upvoting changes score to -1', async ({
    page,
  }) => {
    await page.goto('/community/adversaries');
    const row = getItemRow(page, ADVERSARY_NAME);
    await expect(getScore(row)).toHaveText('1');
    await row.getByRole('button', { name: 'Downvote' }).click();
    await expect(getScore(row)).toHaveText('-1');
  });

  test('cleanup: remove vote and delete the test adversary', async ({
    page,
  }) => {
    await page.goto('/community/adversaries');
    const communityRow = getItemRow(page, ADVERSARY_NAME);
    await communityRow.getByRole('button', { name: 'Downvote' }).click();
    await expect(getScore(communityRow)).toHaveText('0');

    await page.goto('/profile/homebrew');
    const row = getItemRow(page, ADVERSARY_NAME);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await expect(page.getByText(ADVERSARY_NAME)).not.toBeVisible();
  });
});
