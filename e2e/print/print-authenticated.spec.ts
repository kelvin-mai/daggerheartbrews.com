import { test, expect } from '@playwright/test';

import { getItemRow } from '../fixtures';

const CARD_NAME = 'E2E Print Card';

test.describe('Print Sheet', () => {
  test.describe.configure({ mode: 'serial' });

  test('setup: create a test card for print tests', async ({ page }) => {
    await page.goto('/card/create');
    await expect(page.getByText('Basic Details')).toBeVisible();
    const saveButton = page.getByRole('button', { name: 'Save' });
    await expect(saveButton).not.toHaveAttribute('aria-disabled');
    await page.locator('#name').fill(CARD_NAME);
    await saveButton.click();
    await page.waitForURL(/\/profile\/homebrew/);
    await expect(getItemRow(page, CARD_NAME)).toBeVisible();
  });

  test('print page is accessible from the sidebar', async ({ page }) => {
    await page.goto('/profile/homebrew');
    await page.getByRole('link', { name: 'Print' }).click();
    await expect(page).toHaveURL('/profile/print');
    await expect(page.getByRole('heading', { name: 'Print' })).toBeVisible();
  });

  test('print page shows card in My Cards list', async ({ page }) => {
    await page.goto('/profile/print');
    await expect(page.getByText('My Cards')).toBeVisible();
    await expect(getItemRow(page, CARD_NAME)).toBeVisible();
  });

  test('all cards are pre-selected when the page loads', async ({ page }) => {
    await page.goto('/profile/print');
    await expect(
      page.getByRole('button', { name: 'Generate PDF' }),
    ).toBeVisible();
    await expect(page.getByText(/\d+ cards? selected/)).toBeVisible();
  });

  test('deselecting all cards hides the Generate PDF button', async ({
    page,
  }) => {
    await page.goto('/profile/print');
    await expect(
      page.getByRole('button', { name: 'Generate PDF' }),
    ).toBeVisible();

    const checked = page.locator(
      'button[role="checkbox"][aria-checked="true"]',
    );
    while ((await checked.count()) > 0) {
      await checked.first().click();
    }

    await expect(page.getByText('0 cards selected')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Generate PDF' }),
    ).not.toBeVisible();
    await expect(
      page.getByText('Select cards below to generate a PDF'),
    ).toBeVisible();
  });

  test('clicking Generate PDF shows the Generating indicator then clears it', async ({
    page,
  }) => {
    await page.goto('/profile/print');
    await expect(
      page.getByRole('button', { name: 'Generate PDF' }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Generate PDF' }).click();

    await expect(page.getByText('Generating…')).toBeVisible();

    await expect(page.getByText('Generating…')).not.toBeVisible({
      timeout: 25000,
    });
  });

  test('cleanup: delete the test card', async ({ page }) => {
    await page.goto('/profile/homebrew');
    // Loop to handle stale cards left by prior failed runs
    let remaining = await getItemRow(page, CARD_NAME).count();
    while (remaining > 0) {
      await getItemRow(page, CARD_NAME)
        .first()
        .getByRole('button', { name: 'More actions' })
        .click();
      await page.getByRole('menuitem', { name: 'Delete' }).click();
      await expect(getItemRow(page, CARD_NAME)).toHaveCount(remaining - 1, {
        timeout: 5000,
      });
      remaining = await getItemRow(page, CARD_NAME).count();
    }
  });
});
