import { test, expect } from '@playwright/test';

import { getItemRow } from './fixtures';

const COMMUNITY_CARD = 'E2E Community Card Template';
const COMMUNITY_ADVERSARY = 'E2E Community Adversary Template';

test.describe('Community Cards – Use as Template', () => {
  test.describe.configure({ mode: 'serial' });

  test('setup: create a public card for community template tests', async ({
    page,
  }) => {
    await page.goto('/card/create');
    await expect(page.getByText('Basic Details')).toBeVisible();
    await page.locator('#name').fill(COMMUNITY_CARD);
    await page.getByRole('button', { name: 'Save' }).click();
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
    const row = getItemRow(page, COMMUNITY_CARD);
    await expect(row).toBeVisible();

    await row.getByRole('button', { name: 'Use as Template' }).click();

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
    await page.locator('#name').fill(COMMUNITY_ADVERSARY);
    await page.getByRole('button', { name: 'Save' }).click();
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
    const row = getItemRow(page, COMMUNITY_ADVERSARY);
    await expect(row).toBeVisible();

    await row.getByRole('button', { name: 'Use as Template' }).click();

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
