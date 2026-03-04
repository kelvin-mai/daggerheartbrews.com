import fs from 'node:fs';
import path from 'node:path';
import { test as setup } from '@playwright/test';

import { login } from './fixtures';

const authFile = path.join(__dirname, '.auth/user.json');

setup('authenticate', async ({ page }) => {
  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  await login(page);
  await page.context().storageState({ path: authFile });
});
