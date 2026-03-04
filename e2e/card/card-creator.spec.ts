import { test, expect, type Page } from '@playwright/test';

import { PNG_1X1 } from '../fixtures';

async function useChainmailArmorAsTemplate(page: Page) {
  await page.goto('/reference/equipment');
  await expect(
    page.getByText('Chainmail Armor', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'More actions' }).first().click();
  await page.getByRole('menuitem', { name: 'Use as Template' }).click();
  await expect(page).toHaveURL(/\/card\/create\?template=true/);
  await expect(page.getByText('Basic Details')).toBeVisible();
}

test.describe('Card Creator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/card/create');
    await expect(page.getByText('Basic Details')).toBeVisible();
  });

  test('page loads with correct heading', async ({ page }) => {
    await expect(page).toHaveTitle(/Create Card/);
    await expect(
      page.getByRole('heading', { name: 'Create a card' }),
    ).toBeVisible();
  });

  test('basic details form is visible by default', async ({ page }) => {
    await expect(page.getByText('Basic Details')).toBeVisible();
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#type')).toBeVisible();
  });

  test('no type-specific properties section visible for default ancestry type', async ({
    page,
  }) => {
    await expect(page.getByText('Equipment Properties')).not.toBeVisible();
    await expect(page.getByText('Domain Properties')).not.toBeVisible();
  });

  test('changing type to equipment shows equipment properties', async ({
    page,
  }) => {
    await page.locator('#type').click();
    await page.getByRole('option', { name: 'Equipment' }).click();

    await expect(page.getByText('Equipment Properties')).toBeVisible();
    await expect(page.getByText('Domain Properties')).not.toBeVisible();
  });

  test('changing type to domain shows domain properties', async ({ page }) => {
    await page.locator('#type').click();
    await page.getByRole('option', { name: 'Domain' }).click();

    await expect(page.getByText('Domain Properties')).toBeVisible();
    await expect(page.getByText('Equipment Properties')).not.toBeVisible();
  });

  test('name input accepts text input', async ({ page }) => {
    const nameInput = page.locator('#name');
    await nameInput.fill('Test Card Name');
    await expect(nameInput).toHaveValue('Test Card Name');
  });

  test('card preview is visible', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Export as PNG' }),
    ).toBeVisible();
  });

  test('switching between types changes the visible properties form', async ({
    page,
  }) => {
    await page.locator('#type').first().click();
    await page.getByRole('option', { name: 'Equipment' }).click();
    await expect(page.getByText('Equipment Properties')).toBeVisible();

    await page.locator('#type').first().click();
    await page.getByRole('option', { name: 'Domain' }).click();
    await expect(page.getByText('Domain Properties')).toBeVisible();
    await expect(page.getByText('Equipment Properties')).not.toBeVisible();
  });
});

test.describe('Card Creator – Use as Template', () => {
  test('navigating by use as template has relevant details', async ({
    page,
  }) => {
    await useChainmailArmorAsTemplate(page);

    await expect(page.locator('#name')).toHaveValue('Chainmail Armor');
    await expect(page.locator('#type').first()).toContainText('equipment');
  });

  test('navigating from /card?template to /card resets state and image state', async ({
    page,
  }) => {
    await useChainmailArmorAsTemplate(page);

    // confirm template details are loaded
    await expect(page.locator('#name')).toHaveValue('Chainmail Armor');

    // upload an image while on the template page
    await page.setInputFiles('input[aria-label="Upload image file"]', {
      name: 'test.png',
      mimeType: 'image/png',
      buffer: PNG_1X1,
    });
    await expect(
      page.getByRole('button', { name: 'Remove image' }),
    ).toBeVisible();

    // navigate to the fresh creator (hard navigation — remounts everything)
    await page.goto('/card/create');
    await expect(page.getByText('Basic Details')).toBeVisible();

    // card state should be reset
    await expect(page.locator('#name')).toHaveValue('');
    await expect(page.locator('#type')).toContainText('ancestry');

    // image state should be reset — no uploaded file remains
    await expect(
      page.getByRole('button', { name: 'Remove image' }),
    ).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Image' })).toBeVisible();
  });
});
