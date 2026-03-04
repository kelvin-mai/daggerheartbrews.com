/**
 * Tests for using other users' public cards/adversaries as templates.
 *
 * Each describe block creates a public item in setup, runs the feature tests,
 * then deletes the item in cleanup. Tests run serially so the shared items
 * are available to all tests within the block.
 */

import { test, expect } from '@playwright/test';

import { getItemRow } from '../fixtures';

const COMMUNITY_CARD = 'E2E Community Card Template';
const COMMUNITY_ADVERSARY = 'E2E Community Adversary Template';

test.describe('Community Cards – Use as Template', () => {
  test.describe.configure({ mode: 'serial' });

  test('setup: create a public card for community template tests', async ({
    page,
  }) => {
    await page.goto('/card/create');
    await expect(page.getByText('Basic Details')).toBeVisible();
    const cardSaveButton = page.getByRole('button', { name: 'Save' });
    await expect(cardSaveButton).not.toHaveAttribute('aria-disabled');
    await page.locator('#name').fill(COMMUNITY_CARD);
    await cardSaveButton.click();
    await page.waitForURL(/\/profile\/homebrew/);

    const row = getItemRow(page, COMMUNITY_CARD);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Toggle Visibility' }).click();
    await expect(row.getByText('Public')).toBeVisible();
  });

  test('can use a public card from the community page as a template', async ({
    page,
  }) => {
    await page.goto('/community/cards');
    await expect(getItemRow(page, COMMUNITY_CARD)).toBeVisible();

    const row = getItemRow(page, COMMUNITY_CARD);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Use as Template' }).click();

    await expect(page).toHaveURL(/\/card\/create\?template=true/);
    await expect(page.locator('#name')).toHaveValue(COMMUNITY_CARD);
  });

  test('cleanup: delete the test community card', async ({ page }) => {
    await page.goto('/profile/homebrew');
    const row = getItemRow(page, COMMUNITY_CARD);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await expect(page.getByText(COMMUNITY_CARD)).not.toBeVisible();
  });
});

test.describe('Community Adversaries – Use as Template', () => {
  test.describe.configure({ mode: 'serial' });

  test('setup: create a public adversary for community template tests', async ({
    page,
  }) => {
    await page.goto('/adversary/create');
    await expect(page.getByText('Basic Details')).toBeVisible();
    const adversarySaveButton = page.getByRole('button', { name: 'Save' });
    await expect(adversarySaveButton).not.toHaveAttribute('aria-disabled');
    await page.locator('#name').fill(COMMUNITY_ADVERSARY);
    await adversarySaveButton.click();
    await page.waitForURL(/\/profile\/homebrew/);

    const row = getItemRow(page, COMMUNITY_ADVERSARY);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Toggle Visibility' }).click();
    await expect(row.getByText('Public')).toBeVisible();
  });

  test('can use a public adversary from the community page as a template', async ({
    page,
  }) => {
    await page.goto('/community/adversaries');
    await expect(getItemRow(page, COMMUNITY_ADVERSARY)).toBeVisible();

    const row = getItemRow(page, COMMUNITY_ADVERSARY);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Use as Template' }).click();

    await expect(page).toHaveURL(/\/adversary\/create\?template=true/);
    await expect(page.locator('#name')).toHaveValue(COMMUNITY_ADVERSARY);
  });

  test('cleanup: delete the test community adversary', async ({ page }) => {
    await page.goto('/profile/homebrew');
    const row = getItemRow(page, COMMUNITY_ADVERSARY);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await expect(page.getByText(COMMUNITY_ADVERSARY)).not.toBeVisible();
  });
});
