import { test, expect } from '@playwright/test';

import { getItemRow } from '../fixtures';

const ENVIRONMENT_NAME = 'E2E Community Environment';

test.describe('Community Environments', () => {
  test.describe.configure({ mode: 'serial' });

  test('setup: create a public environment', async ({ page }) => {
    await page.goto('/adversary/create');
    await expect(page.getByText('Basic Details')).toBeVisible();

    await page.locator('#type').click();
    await page.getByRole('option', { name: 'environment' }).click();

    await page.locator('#name').fill(ENVIRONMENT_NAME);

    const saveButton = page.getByRole('button', { name: 'Save' });
    await expect(saveButton).not.toHaveAttribute('aria-disabled');
    await saveButton.click();
    await page.waitForURL(/\/profile\/homebrew/);

    const row = getItemRow(page, ENVIRONMENT_NAME);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Toggle Visibility' }).click();
    await expect(row.getByText('Public')).toBeVisible();
  });

  test('environment appears on the community environments page', async ({
    page,
  }) => {
    await page.goto('/community/environments');
    await expect(getItemRow(page, ENVIRONMENT_NAME)).toBeVisible();
  });

  test('environment does not appear on the community adversaries page', async ({
    page,
  }) => {
    await page.goto('/community/adversaries');
    await expect(page.getByText(ENVIRONMENT_NAME)).not.toBeVisible();
  });

  test('environments page is accessible from the sidebar', async ({ page }) => {
    await page.goto('/community/cards');
    await page.getByRole('link', { name: 'Environments' }).click();
    await expect(page).toHaveURL('/community/environments');
    await expect(
      page.getByRole('heading', { name: 'Community Environments' }),
    ).toBeVisible();
  });

  test('can use a public environment as a template', async ({ page }) => {
    await page.goto('/community/environments');
    const row = getItemRow(page, ENVIRONMENT_NAME);
    await row.getByRole('button', { name: 'Use as Template' }).click();

    await expect(page).toHaveURL(/\/adversary\/create\?template=true/);
    await expect(page.locator('#name')).toHaveValue(ENVIRONMENT_NAME);
  });

  test('bookmark button is visible on the community environments page', async ({
    page,
  }) => {
    await page.goto('/community/environments');
    const row = getItemRow(page, ENVIRONMENT_NAME);
    await expect(
      row.getByRole('button', { name: 'Add bookmark' }),
    ).toBeVisible();
  });

  test('can bookmark an environment from the community page', async ({
    page,
  }) => {
    await page.goto('/community/environments');
    const row = getItemRow(page, ENVIRONMENT_NAME);
    await row.getByRole('button', { name: 'Add bookmark' }).click();
    await expect(
      row.getByRole('button', { name: 'Remove bookmark' }),
    ).toBeVisible();
  });

  test('bookmarked environment appears in the Environments section on the bookmarks page', async ({
    page,
  }) => {
    await page.goto('/profile/bookmarks');
    await expect(getItemRow(page, ENVIRONMENT_NAME)).toBeVisible();
    await expect(
      page.getByText('No bookmarked environments'),
    ).not.toBeVisible();
  });

  test('can unbookmark an environment from the community page', async ({
    page,
  }) => {
    await page.goto('/community/environments');
    const row = getItemRow(page, ENVIRONMENT_NAME);
    await row.getByRole('button', { name: 'Remove bookmark' }).click();
    await expect(
      row.getByRole('button', { name: 'Add bookmark' }),
    ).toBeVisible();
    await page.goto('/profile/bookmarks');
    await page.reload();
    await expect(page.getByText(ENVIRONMENT_NAME)).not.toBeVisible();
    await expect(page.getByText('No bookmarked environments')).toBeVisible();
  });

  test('environment appears in the Environments section on the homebrew page', async ({
    page,
  }) => {
    await page.goto('/profile/homebrew');
    await expect(getItemRow(page, ENVIRONMENT_NAME)).toBeVisible();
    await expect(page.getByText('No environments yet')).not.toBeVisible();
  });

  test('environment does not appear in the Adversaries section on the homebrew page', async ({
    page,
  }) => {
    await page.goto('/profile/homebrew');
    const adversariesSection = page
      .locator('.group\\/collapsible')
      .filter({ hasText: 'Adversaries' });
    await expect(
      adversariesSection.getByText(ENVIRONMENT_NAME),
    ).not.toBeVisible();
  });

  test('cleanup: delete the test environment', async ({ page }) => {
    await page.goto('/profile/homebrew');
    const row = getItemRow(page, ENVIRONMENT_NAME);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await expect(page.getByText(ENVIRONMENT_NAME)).not.toBeVisible();
  });
});
