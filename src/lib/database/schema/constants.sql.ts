import { boolean, integer, pgTable, point, text } from 'drizzle-orm/pg-core';

import { uuidPrimaryKey } from './columns.helpers';

export const domainOptions = pgTable('domain_options', {
  ...uuidPrimaryKey,
  name: text('name').notNull().unique(),
  color: text('color').notNull(),
  source: text('source').notNull(),
});

export const classOptions = pgTable('class_options', {
  ...uuidPrimaryKey,
  name: text('name').notNull().unique(),
  domainPrimary: text('domain_primary').notNull(),
  domainSecondary: text('domain_secondary').notNull(),
  source: text('source').notNull(),
});

export const cardPreviews = pgTable('card_previews', {
  ...uuidPrimaryKey,
  name: text('name').notNull(),
  type: text('type').notNull(),
  image: text('image'),
  text: text('text'),
  artist: text('artist'),
  credits: text('credits'),
  subtype: text('subtype'),
  subtitle: text('subtitle'),
  level: integer('level'),
  stress: integer('stress'),
  evasion: integer('evasion'),
  thresholds: point('thresholds', { mode: 'tuple' }),
  thresholdsEnabled: boolean('thresholds_enabled').default(false),
  tier: integer('tier'),
  tierEnabled: boolean('tier_enabled').default(false),
  hands: integer('hands'),
  handsEnabled: boolean('hands_enabled').default(false),
  armor: integer('armor'),
  armorEnabled: boolean('armor_enabled').default(false),
  domainPrimary: text('domain_primary'),
  domainPrimaryColor: text('domain_primary_color'),
  domainPrimaryIcon: text('domain_primary_icon'),
  domainSecondary: text('domain_secondary'),
  domainSecondaryColor: text('domain_secondary_color'),
  domainSecondaryIcon: text('domain_secondary_icon'),
  cardBack: text('card_back').default('default'),
  customCardBackLogo: text('custom_card_back_logo'),
});

export const adversaryPreviews = pgTable('adversary_previews', {
  ...uuidPrimaryKey,
  name: text('name').notNull(),
  type: text('type').notNull(),
  subtype: text('subtype'),
  image: text('image'),
  artist: text('artist'),
  credits: text('credits'),
  tier: integer('tier'),
  description: text('description'),
  subDescription: text('sub_description'),
  experience: text('experience'),
  text: text('text'),
  difficulty: text('difficulty'),
  hp: integer('hp'),
  stress: integer('stress'),
  thresholds: point('thresholds', { mode: 'tuple' }),
  attack: text('attack'),
  weapon: text('weapon'),
  distance: text('distance'),
  damageType: text('damage_type'),
  damageAmount: text('damage_amount'),
  potential: text('potential'),
});
