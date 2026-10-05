import type { SelectedFields } from 'drizzle-orm/pg-core';

import { users } from './schema';

export const publicAuthor = {
  id: users.id,
  name: users.name,
  image: users.image,
} satisfies SelectedFields;
