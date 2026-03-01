import { pgTable, text, uuid, timestamp, boolean } from 'drizzle-orm/pg-core';

import { uuidPrimaryKey, timestamps } from './columns.helpers';

export const users = pgTable('users', {
  ...uuidPrimaryKey,
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  emailUpdates: boolean('email_updates').notNull().default(true),
  publicByDefault: boolean('public_by_default').notNull().default(false),
  ...timestamps,
});

export const sessions = pgTable('sessions', {
  ...uuidPrimaryKey,
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  ...timestamps,
});

export const accounts = pgTable('accounts', {
  ...uuidPrimaryKey,
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  ...timestamps,
});

export const verification = pgTable('verification', {
  ...uuidPrimaryKey,
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  ...timestamps,
});
