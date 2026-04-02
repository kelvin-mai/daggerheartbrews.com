import fs from 'node:fs';
import path from 'node:path';
import { Client } from 'pg';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { hashPassword } = require('better-auth/crypto');

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

async function globalSetup() {
  loadEnv();

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const email = process.env.TEST_USER_EMAIL ?? 'test@example.com';
    const password = process.env.TEST_USER_PASSWORD ?? 'password123';

    let userId: string;
    const { rows: existing } = await client.query<{ id: string }>(
      'SELECT id FROM users WHERE email = $1',
      [email],
    );

    if (existing.length > 0) {
      userId = existing[0].id;
    } else {
      const { rows: inserted } = await client.query<{ id: string }>(
        `INSERT INTO users (name, email, email_verified)
         VALUES ($1, $2, true)
         RETURNING id`,
        ['Test User', email],
      );
      userId = inserted[0].id;
    }

    const { rows: settings } = await client.query(
      'SELECT id FROM user_settings WHERE user_id = $1',
      [userId],
    );
    if (settings.length === 0) {
      await client.query('INSERT INTO user_settings (user_id) VALUES ($1)', [
        userId,
      ]);
    }

    await client.query('DELETE FROM user_card_bookmarks WHERE user_id = $1', [
      userId,
    ]);
    await client.query(
      'DELETE FROM user_adversary_bookmarks WHERE user_id = $1',
      [userId],
    );

    await client.query(
      `DELETE FROM card_previews cp
       WHERE cp.id IN (
         SELECT uc.card_preview_id FROM user_cards uc WHERE uc.user_id = $1
       )`,
      [userId],
    );
    await client.query(
      `DELETE FROM adversary_previews ap
       WHERE ap.id IN (
         SELECT ua.adversary_preview_id FROM user_adversaries ua WHERE ua.user_id = $1
       )`,
      [userId],
    );

    const { rows: acct } = await client.query(
      `SELECT id FROM accounts WHERE user_id = $1 AND provider_id = 'credential'`,
      [userId],
    );
    if (acct.length === 0) {
      const hashed = await hashPassword(password);
      await client.query(
        `INSERT INTO accounts (account_id, provider_id, user_id, password)
         VALUES ($1, 'credential', $2, $3)`,
        [userId, userId, hashed],
      );
    }
  } finally {
    await client.end();
  }
}

export default globalSetup;
