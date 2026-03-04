import { test, expect } from '@playwright/test';

test.describe('Adversary Creator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/adversary/create');
    await expect(page.getByText('Basic Details')).toBeVisible();
  });

  test('page loads with correct heading', async ({ page }) => {
    await expect(page).toHaveTitle(/Create Adversary/);
    await expect(
      page.getByRole('heading', { name: 'Create an Adversary' }),
    ).toBeVisible();
  });

  test('basic details form is visible by default', async ({ page }) => {
    await expect(page.getByText('Basic Details')).toBeVisible();
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#type')).toBeVisible();
    await expect(page.locator('#tier')).toBeVisible();
  });

  test('adversary statistics section visible for default adversary type', async ({
    page,
  }) => {
    await expect(page.getByText('Adversary Statistics')).toBeVisible();
    await expect(page.getByText('Environment Statistics')).not.toBeVisible();
  });

  test('changing type to environment shows environment statistics', async ({
    page,
  }) => {
    await page.locator('#type').click();
    await page.getByRole('option', { name: 'Environment' }).click();

    await expect(page.getByText('Environment Statistics')).toBeVisible();
    await expect(page.getByText('Adversary Statistics')).not.toBeVisible();
  });

  test('switching back to adversary restores adversary statistics', async ({
    page,
  }) => {
    // switch to environment first
    await page.locator('#type').click();
    await page.getByRole('option', { name: 'Environment' }).click();
    await expect(page.getByText('Environment Statistics')).toBeVisible();

    // switch back
    await page.locator('#type').click();
    await page.getByRole('option', { name: 'Adversary' }).click();
    await expect(page.getByText('Adversary Statistics')).toBeVisible();
    await expect(page.getByText('Environment Statistics')).not.toBeVisible();
  });

  test('name input accepts text input', async ({ page }) => {
    const nameInput = page.locator('#name');
    await nameInput.fill('Test Adversary');
    await expect(nameInput).toHaveValue('Test Adversary');
  });

  test('difficulty input accepts text input', async ({ page }) => {
    const difficultyInput = page.locator('#difficulty');
    await difficultyInput.fill('15');
    await expect(difficultyInput).toHaveValue('15');
  });

  test('tier selector changes selected tier', async ({ page }) => {
    await page.locator('#tier').click();
    await page.getByRole('option', { name: '3' }).click();
    await expect(page.locator('#tier')).toContainText('3');
  });

  test('adversary preview is visible', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Export Statblock as PNG' }),
    ).toBeVisible();
  });
});
