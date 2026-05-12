import { test, expect } from '@playwright/test';

import { getItemRow } from '../fixtures';

const CARD_NAME = 'E2E Detail Card';
const ADVERSARY_NAME = 'E2E Detail Adversary';
const ENVIRONMENT_NAME = 'E2E Detail Environment';

test.describe('Community Card Detail Page', () => {
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

  test('card title in community list links to detail page', async ({
    page,
  }) => {
    await page.goto('/community/cards');
    const row = getItemRow(page, CARD_NAME);
    const titleLink = row.getByRole('link', { name: CARD_NAME });
    await expect(titleLink).toBeVisible();
    await titleLink.click();
    await expect(page).toHaveURL(/\/community\/cards\/.+/);
  });

  test('detail page shows card name', async ({ page }) => {
    await page.goto('/community/cards');
    await getItemRow(page, CARD_NAME)
      .getByRole('link', { name: CARD_NAME })
      .click();
    await expect(page).toHaveURL(/\/community\/cards\/.+/);
    await expect(page.getByRole('heading', { name: CARD_NAME })).toBeVisible();
  });

  test('back link returns to community cards list', async ({ page }) => {
    await page.goto('/community/cards');
    await getItemRow(page, CARD_NAME)
      .getByRole('link', { name: CARD_NAME })
      .click();
    await expect(page).toHaveURL(/\/community\/cards\/.+/);
    await page.getByRole('link', { name: 'Back to Community Cards' }).click();
    await expect(page).toHaveURL('/community/cards');
  });

  test('"Use as Template" from detail page navigates to card creator', async ({
    page,
  }) => {
    await page.goto('/community/cards');
    await getItemRow(page, CARD_NAME)
      .getByRole('link', { name: CARD_NAME })
      .click();
    await expect(page).toHaveURL(/\/community\/cards\/.+/);
    await page.getByRole('button', { name: 'Use as Template' }).click();
    await expect(page).toHaveURL(/\/card\/create\?template=true/);
    await expect(page.locator('#name')).toHaveValue(CARD_NAME);
  });

  test('bookmark button is visible on card detail page', async ({ page }) => {
    await page.goto('/community/cards');
    await getItemRow(page, CARD_NAME)
      .getByRole('link', { name: CARD_NAME })
      .click();
    await expect(page).toHaveURL(/\/community\/cards\/.+/);
    await expect(page.getByRole('button', { name: 'Bookmark' })).toBeVisible();
  });

  test('creator name on community post links to a profile page', async ({
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

  test('creator name on card detail page links to profile page', async ({
    page,
  }) => {
    await page.goto('/community/cards');
    await getItemRow(page, CARD_NAME)
      .getByRole('link', { name: CARD_NAME })
      .click();
    await expect(page).toHaveURL(/\/community\/cards\/.+/);
    const creatorLink = page.locator('a[href^="/profile/"]');
    await expect(creatorLink).toBeVisible();
    await creatorLink.click();
    await expect(page).toHaveURL(/\/profile\/.+/);
  });

  test('cleanup: delete the test card', async ({ page }) => {
    await page.goto('/profile/homebrew');
    const row = getItemRow(page, CARD_NAME);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await expect(page.getByText(CARD_NAME)).not.toBeVisible();
  });
});

test.describe('Community Adversary Detail Page', () => {
  test.describe.configure({ mode: 'serial' });

  test('setup: create and publish an adversary', async ({ page }) => {
    await page.goto('/adversary/create');
    await expect(page.getByText('Basic Details')).toBeVisible();
    await page.locator('#name').fill(ADVERSARY_NAME);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForURL(/\/profile\/homebrew/);

    const row = getItemRow(page, ADVERSARY_NAME);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Toggle Visibility' }).click();
    await expect(row.getByText('Public')).toBeVisible();
  });

  test('adversary title in community list links to detail page', async ({
    page,
  }) => {
    await page.goto('/community/adversaries');
    const row = getItemRow(page, ADVERSARY_NAME);
    const titleLink = row.getByRole('link', { name: ADVERSARY_NAME });
    await expect(titleLink).toBeVisible();
    await titleLink.click();
    await expect(page).toHaveURL(/\/community\/adversaries\/.+/);
  });

  test('detail page shows adversary name', async ({ page }) => {
    await page.goto('/community/adversaries');
    await getItemRow(page, ADVERSARY_NAME)
      .getByRole('link', { name: ADVERSARY_NAME })
      .click();
    await expect(page).toHaveURL(/\/community\/adversaries\/.+/);
    await expect(
      page.getByRole('heading', { name: ADVERSARY_NAME }),
    ).toBeVisible();
  });

  test('back link returns to community adversaries list', async ({ page }) => {
    await page.goto('/community/adversaries');
    await getItemRow(page, ADVERSARY_NAME)
      .getByRole('link', { name: ADVERSARY_NAME })
      .click();
    await expect(page).toHaveURL(/\/community\/adversaries\/.+/);
    await page
      .getByRole('link', { name: 'Back to Community Adversaries' })
      .click();
    await expect(page).toHaveURL('/community/adversaries');
  });

  test('"Use as Template" from detail page navigates to adversary creator', async ({
    page,
  }) => {
    await page.goto('/community/adversaries');
    await getItemRow(page, ADVERSARY_NAME)
      .getByRole('link', { name: ADVERSARY_NAME })
      .click();
    await expect(page).toHaveURL(/\/community\/adversaries\/.+/);
    await page.getByRole('button', { name: 'Use as Template' }).click();
    await expect(page).toHaveURL(/\/adversary\/create\?template=true/);
    await expect(page.locator('#name')).toHaveValue(ADVERSARY_NAME);
  });

  test('cleanup: delete the test adversary', async ({ page }) => {
    await page.goto('/profile/homebrew');
    const row = getItemRow(page, ADVERSARY_NAME);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await expect(page.getByText(ADVERSARY_NAME)).not.toBeVisible();
  });
});

test.describe('Community Environment Detail Page', () => {
  test.describe.configure({ mode: 'serial' });

  test('setup: create and publish an environment', async ({ page }) => {
    await page.goto('/adversary/create');
    await expect(page.getByText('Basic Details')).toBeVisible();
    await page.locator('#type').click();
    await page.getByRole('option', { name: 'environment' }).click();
    await page.locator('#name').fill(ENVIRONMENT_NAME);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForURL(/\/profile\/homebrew/);

    const row = getItemRow(page, ENVIRONMENT_NAME);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Toggle Visibility' }).click();
    await expect(row.getByText('Public')).toBeVisible();
  });

  test('environment title in community list links to detail page', async ({
    page,
  }) => {
    await page.goto('/community/environments');
    const row = getItemRow(page, ENVIRONMENT_NAME);
    const titleLink = row.getByRole('link', { name: ENVIRONMENT_NAME });
    await expect(titleLink).toBeVisible();
    await titleLink.click();
    await expect(page).toHaveURL(/\/community\/environments\/.+/);
  });

  test('detail page shows environment name', async ({ page }) => {
    await page.goto('/community/environments');
    await getItemRow(page, ENVIRONMENT_NAME)
      .getByRole('link', { name: ENVIRONMENT_NAME })
      .click();
    await expect(page).toHaveURL(/\/community\/environments\/.+/);
    await expect(
      page.getByRole('heading', { name: ENVIRONMENT_NAME }),
    ).toBeVisible();
  });

  test('back link returns to community environments list', async ({ page }) => {
    await page.goto('/community/environments');
    await getItemRow(page, ENVIRONMENT_NAME)
      .getByRole('link', { name: ENVIRONMENT_NAME })
      .click();
    await expect(page).toHaveURL(/\/community\/environments\/.+/);
    await page
      .getByRole('link', { name: 'Back to Community Environments' })
      .click();
    await expect(page).toHaveURL('/community/environments');
  });

  test('"Use as Template" from detail page navigates to adversary creator', async ({
    page,
  }) => {
    await page.goto('/community/environments');
    await getItemRow(page, ENVIRONMENT_NAME)
      .getByRole('link', { name: ENVIRONMENT_NAME })
      .click();
    await expect(page).toHaveURL(/\/community\/environments\/.+/);
    await page.getByRole('button', { name: 'Use as Template' }).click();
    await expect(page).toHaveURL(/\/adversary\/create\?template=true/);
    await expect(page.locator('#name')).toHaveValue(ENVIRONMENT_NAME);
  });

  test('cleanup: delete the test environment', async ({ page }) => {
    await page.goto('/profile/homebrew');
    const row = getItemRow(page, ENVIRONMENT_NAME);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await expect(page.getByText(ENVIRONMENT_NAME)).not.toBeVisible();
  });
});
