import { sql } from 'drizzle-orm';
import { timestamp, uuid } from 'drizzle-orm/pg-core';

export const timestamps = {
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
};

export const uuidPrimaryKey = {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
};
