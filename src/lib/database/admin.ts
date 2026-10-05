import 'server-only';

import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';

import { isDevelopment } from '@/lib/admin';
import { db } from '@/lib/database';

export const adminDb =
  isDevelopment() && process.env.ADMIN_DATABASE_URL
    ? drizzleNeon(process.env.ADMIN_DATABASE_URL)
    : db;
