import { test, expect, type Page } from '@playwright/test';

import { gotoHomebrew, getItemRow, toggleVisibility } from '../fixtures';

const CARD_NAME = 'E2E Visibility Card';
const ADVERSARY_NAME = 'E2E Visibility Adversary';
const ENVIRONMENT_NAME = 'E2E Visibility Environment';

const ids: { adversary?: string; environment?: string } = {};

const createItem = async (
  page: Page,
  path: string,
  name: string,
  type?: string,
) => {
  await page.goto(path);
  await expect(page.getByText('Basic Details')).toBeVisible();
  if (type) {
    await page.locator('#type').click();
    await page.getByRole('option', { name: type }).click();
  }
  await page.locator('#name').fill(name);
  const saveButton = page.getByRole('button', { name: 'Save' });
  await expect(saveButton).not.toHaveAttribute('aria-disabled');
  await saveButton.click();
  await page.waitForURL(/\/profile\/homebrew/);
  const row = getItemRow(page, name);
  await toggleVisibility(page, row);
  await expect(row.getByText('Public')).toBeVisible();
};

const setVisibility = async (page: Page, name: string, label: string) => {
  await gotoHomebrew(page);
  const row = getItemRow(page, name);
  await toggleVisibility(page, row);
  await expect(row.getByText(label)).toBeVisible();
};

const detailId = async (page: Page, list: string, name: string) => {
  await page.goto(`/community/${list}`);
  const href = await getItemRow(page, name)
    .getByRole('link', { name })
    .getAttribute('href');
  return href!.split('/').pop()!;
};

const deleteItem = async (page: Page, name: string) => {
  await gotoHomebrew(page);
  const row = getItemRow(page, name);
  await row.getByRole('button', { name: 'More actions' }).click();
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await expect(page.getByText(name)).not.toBeVisible();
};

test.describe('Visibility and kind rules', () => {
  test.describe.configure({ mode: 'serial' });

  test('setup: create and publish a card, an adversary and an environment', async ({
    page,
  }) => {
    await createItem(page, '/card/create', CARD_NAME);
    await createItem(page, '/adversary/create', ADVERSARY_NAME);
    await createItem(
      page,
      '/adversary/create',
      ENVIRONMENT_NAME,
      'environment',
    );
  });

  test('bookmark the public card', async ({ page }) => {
    await page.goto('/community/cards');
    const row = getItemRow(page, CARD_NAME);
    await row.getByRole('button', { name: 'Add bookmark' }).click();
    await expect(
      row.getByRole('button', { name: 'Remove bookmark' }),
    ).toBeVisible();
  });

  test('bookmarked public card shows on the bookmarks page', async ({
    page,
  }) => {
    await page.goto('/profile/bookmarks');
    await expect(getItemRow(page, CARD_NAME)).toBeVisible();
  });

  test('making the card private hides it from bookmarks', async ({ page }) => {
    await setVisibility(page, CARD_NAME, 'Draft');

    await page.goto('/profile/bookmarks');
    await expect(page.getByText(CARD_NAME)).not.toBeVisible();
    await expect(page.getByText('No bookmarked cards')).toBeVisible();
  });

  test('making the card public again restores it on bookmarks', async ({
    page,
  }) => {
    await setVisibility(page, CARD_NAME, 'Public');

    await page.goto('/profile/bookmarks');
    await expect(getItemRow(page, CARD_NAME)).toBeVisible();
  });

  test('an adversary id does not resolve under the environments path', async ({
    page,
  }) => {
    ids.adversary = await detailId(page, 'adversaries', ADVERSARY_NAME);
    ids.environment = await detailId(page, 'environments', ENVIRONMENT_NAME);

    const wrong = await page.goto(`/community/environments/${ids.adversary}`);
    expect(wrong?.status()).toBe(404);
    const right = await page.goto(`/community/adversaries/${ids.adversary}`);
    expect(right?.status()).toBe(200);
  });

  test('an environment id does not resolve under the adversaries path', async ({
    page,
  }) => {
    const wrong = await page.goto(`/community/adversaries/${ids.environment}`);
    expect(wrong?.status()).toBe(404);
    const right = await page.goto(`/community/environments/${ids.environment}`);
    expect(right?.status()).toBe(200);
  });

  test('cleanup: delete the test items', async ({ page }) => {
    await deleteItem(page, CARD_NAME);
    await deleteItem(page, ADVERSARY_NAME);
    await deleteItem(page, ENVIRONMENT_NAME);
  });
});
