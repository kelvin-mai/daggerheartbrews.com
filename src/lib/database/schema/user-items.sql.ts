import { boolean, integer, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

import { timestamps, uuidPrimaryKey } from './columns.helpers';
import { users } from './auth.sql';
import { adversaryPreviews, cardPreviews } from './constants.sql';

export const userCards = pgTable('user_cards', {
  ...uuidPrimaryKey,
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  public: boolean('public').default(false),
  cardPreviewId: uuid('card_preview_id')
    .notNull()
    .references(() => cardPreviews.id, { onDelete: 'cascade' }),
  upvotes: integer('upvotes').default(0).notNull(),
  downvotes: integer('downvotes').default(0).notNull(),
  ...timestamps,
});

export const userAdversaries = pgTable('user_adversaries', {
  ...uuidPrimaryKey,
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  public: boolean('public').default(false),
  adversaryPreviewId: uuid('adversary_preview_id')
    .notNull()
    .references(() => adversaryPreviews.id, { onDelete: 'cascade' }),
  upvotes: integer('upvotes').default(0).notNull(),
  downvotes: integer('downvotes').default(0).notNull(),
  ...timestamps,
});

export const userCardBookmarks = pgTable('user_card_bookmarks', {
  ...uuidPrimaryKey,
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  userCardId: uuid('user_card_id')
    .notNull()
    .references(() => userCards.id, { onDelete: 'cascade' }),
  ...timestamps,
});

export const userAdversaryBookmarks = pgTable('user_adversary_bookmarks', {
  ...uuidPrimaryKey,
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  userAdversaryId: uuid('user_adversary_id')
    .notNull()
    .references(() => userAdversaries.id, { onDelete: 'cascade' }),
  ...timestamps,
});

export const userCardVotes = pgTable('user_card_votes', {
  ...uuidPrimaryKey,
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  userCardId: uuid('user_card_id')
    .notNull()
    .references(() => userCards.id, { onDelete: 'cascade' }),
  vote: varchar('vote', { length: 4 }).notNull(),
  ...timestamps,
});

export const userAdversaryVotes = pgTable('user_adversary_votes', {
  ...uuidPrimaryKey,
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  userAdversaryId: uuid('user_adversary_id')
    .notNull()
    .references(() => userAdversaries.id, { onDelete: 'cascade' }),
  vote: varchar('vote', { length: 4 }).notNull(),
  ...timestamps,
});
