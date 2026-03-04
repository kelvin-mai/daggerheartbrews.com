import { test, expect } from '@playwright/test';

import { getItemRow } from '../fixtures';

async function createCard(
  page: Parameters<typeof getItemRow>[0],
  name: string,
) {
  await page.goto('/card/create');
  await expect(page.getByText('Basic Details')).toBeVisible();
  const saveButton = page.getByRole('button', { name: 'Save' });
  await expect(saveButton).not.toHaveAttribute('aria-disabled');
  await page.locator('#name').fill(name);
  await saveButton.click();
  await page.waitForURL(/\/profile\/homebrew/);
}

async function deleteCard(
  page: Parameters<typeof getItemRow>[0],
  name: string,
) {
  const row = getItemRow(page, name);
  await row.getByRole('button', { name: 'More actions' }).click();
  await page.getByRole('menuitem', { name: 'Delete' }).click();
}

test.describe('Card Creation – Authenticated', () => {
  test('can save a new card and see it on the profile page', async ({
    page,
  }) => {
    const name = 'E2E Save Card';
    await createCard(page, name);

    await expect(getItemRow(page, name)).toBeVisible();

    await deleteCard(page, name);
    await expect(page.getByText(name)).not.toBeVisible();
  });

  test('can edit a saved card', async ({ page }) => {
    const name = 'E2E Edit Card';
    const updatedName = 'E2E Edit Card Updated';
    await createCard(page, name);

    const row = getItemRow(page, name);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Edit' }).click();
    await page.waitForURL(/\/card\/edit\//);

    await page.locator('#name').fill(updatedName);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForURL(/\/profile\/homebrew/);

    await expect(getItemRow(page, updatedName)).toBeVisible();

    await deleteCard(page, updatedName);
  });

  test('can delete a saved card', async ({ page }) => {
    const name = 'E2E Delete Card';
    await createCard(page, name);

    await expect(getItemRow(page, name)).toBeVisible();

    await deleteCard(page, name);
    await expect(page.getByText(name)).not.toBeVisible();
  });

  test('can toggle card visibility between Draft and Public', async ({
    page,
  }) => {
    const name = 'E2E Visibility Card';
    await createCard(page, name);

    const row = getItemRow(page, name);
    await expect(row.getByText('Draft')).toBeVisible();

    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Toggle Visibility' }).click();
    await expect(row.getByText('Public')).toBeVisible();

    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Toggle Visibility' }).click();
    await expect(row.getByText('Draft')).toBeVisible();

    await deleteCard(page, name);
  });
});
