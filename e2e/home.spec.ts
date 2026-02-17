import { test, expect } from '@playwright/test';

test('homepage loads and renders', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/DaggerheartBrews/);
});
