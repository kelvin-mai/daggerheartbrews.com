import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';

import { db } from '@/lib/database';

export const adminDb = process.env.ADMIN_DATABASE_URL
  ? drizzleNeon(process.env.ADMIN_DATABASE_URL)
  : db;
