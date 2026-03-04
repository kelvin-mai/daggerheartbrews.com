import { test, expect } from '@playwright/test';

import { getItemRow } from '../../fixtures';

async function createAdversary(
  page: Parameters<typeof getItemRow>[0],
  name: string,
) {
  await page.goto('/adversary/create');
  await expect(page.getByText('Basic Details')).toBeVisible();
  const saveButton = page.getByRole('button', { name: 'Save' });
  await expect(saveButton).not.toHaveAttribute('aria-disabled');
  await page.locator('#name').fill(name);
  await saveButton.click();
  await page.waitForURL(/\/profile\/homebrew/);
}

async function deleteAdversary(
  page: Parameters<typeof getItemRow>[0],
  name: string,
) {
  const row = getItemRow(page, name);
  await row.getByRole('button', { name: 'More actions' }).click();
  await page.getByRole('menuitem', { name: 'Delete' }).click();
}

test.describe('Adversary Creation – Authenticated', () => {
  test('can save a new adversary and see it on the profile page', async ({
    page,
  }) => {
    const name = 'E2E Save Adversary';
    await createAdversary(page, name);

    await expect(getItemRow(page, name)).toBeVisible();

    await deleteAdversary(page, name);
    await expect(page.getByText(name)).not.toBeVisible();
  });

  test('can edit a saved adversary', async ({ page }) => {
    const name = 'E2E Edit Adversary';
    const updatedName = 'E2E Edit Adversary Updated';
    await createAdversary(page, name);

    const row = getItemRow(page, name);
    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Edit' }).click();
    await page.waitForURL(/\/adversary\/edit\//);

    await page.locator('#name').fill(updatedName);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForURL(/\/profile\/homebrew/);

    await expect(getItemRow(page, updatedName)).toBeVisible();

    await deleteAdversary(page, updatedName);
  });

  test('can delete a saved adversary', async ({ page }) => {
    const name = 'E2E Delete Adversary';
    await createAdversary(page, name);

    await expect(getItemRow(page, name)).toBeVisible();

    await deleteAdversary(page, name);
    await expect(page.getByText(name)).not.toBeVisible();
  });

  test('can toggle adversary visibility between Draft and Public', async ({
    page,
  }) => {
    const name = 'E2E Visibility Adversary';
    await createAdversary(page, name);

    const row = getItemRow(page, name);
    await expect(row.getByText('Draft')).toBeVisible();

    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Toggle Visibility' }).click();
    await expect(row.getByText('Public')).toBeVisible();

    await row.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('menuitem', { name: 'Toggle Visibility' }).click();
    await expect(row.getByText('Draft')).toBeVisible();

    await deleteAdversary(page, name);
  });
});
