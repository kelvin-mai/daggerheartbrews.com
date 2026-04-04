-- Seed content: card_previews, adversary_previews, user_cards, user_adversaries
-- Uses test user emails from 0006_seed-test-users.sql for lookups

-- ─────────────────────────────────────────────
-- card_previews
-- ─────────────────────────────────────────────
insert into card_previews (
  name, type, subtype, subtitle,
  text,
  level, stress, evasion, thresholds, thresholds_enabled,
  tier, tier_enabled,
  hands, hands_enabled,
  armor, armor_enabled,
  domain_primary, domain_primary_color,
  domain_secondary, domain_secondary_color
) values

-- 1. Ancestry: Thornborn
(
  'Thornborn', 'ancestry', null, null,
  '<p><em>Thornborn are gnarled, bark-skinned humanoids rooted in ancient forests. Tendrils of living wood curl from their shoulders, and their eyes glow a soft amber in darkness.</em></p><p><strong><em>Briar Skin:</em></strong> Your bark-like hide grants natural protection. When you would take Severe damage, you may mark a Stress to reduce the Hit Points marked by 1.</p><p><strong><em>Deep Roots:</em></strong> Once per long rest, when you are in contact with soil or wood, you may spend a Hope to heal 1d6 HP as the earth restores you.</p>',
  null, 6, 10, '(5,12)', true,
  null, false,
  null, false,
  null, false,
  null, null,
  null, null
),

-- 2. Community: The Wandering Grove
(
  'The Wandering Grove', 'community', null, null,
  '<p><em>You were raised among a nomadic forest enclave that follows the migration of an ancient treant herd. Your people live between the roots, moving with the seasons and trusting in the wisdom of old growth.</em></p><p><strong><em>Communal Bond:</em></strong> Once per long rest, you may call upon the memory of your Grove. Ask the GM one question about the natural world or the history of a place; they must answer honestly.</p><p><strong><em>Wayfarer''s Pack:</em></strong> Your community taught you to carry only what matters. You begin each session with one additional Supply.</p>',
  null, null, null, null, false,
  null, false,
  null, false,
  null, false,
  null, null,
  null, null
),

-- 3. Domain ability: Shadowstep (Midnight + Grace)
(
  'Shadowstep', 'domain', 'ability', null,
  '<p>Spend a Hope. Melt into the nearest shadow and reappear at any shadow within Far range. Until the start of your next turn, attacks against you have disadvantage.</p>',
  1, null, null, null, false,
  1, true,
  null, false,
  null, false,
  'midnight', '#2c2c2c',
  'grace', '#cb3b90'
),

-- 4. Equipment: Soulrender Scythe (Blade)
(
  'Soulrender Scythe', 'equipment', null, 'One-Handed Melee',
  '<p><em>A weapon forged from the spine of a fallen warlord, its edge permanently stained with spectral residue.</em></p><p>On a Critical Success with this weapon, deal an additional 1d8 magic damage as the blade tears through the target''s soul.</p>',
  null, null, null, null, false,
  2, true,
  1, true,
  null, false,
  'blade', '#b93035',
  null, null
),

-- 5. Transformation: Voidmeld
(
  'Voidmeld', 'transformation', null, null,
  '<p><em>Your body unmakes itself at the seams, reforming as a creature of pure void-stuff — eyes like collapsed stars, limbs trailing frozen dark.</em></p><p><strong><em>Void Body:</em></strong> While transformed, you are immune to physical damage but vulnerability to radiant damage doubles.</p><p><strong><em>Event Horizon:</em></strong> Once per round, you may pull one target within Close range to Very Close range as a free action.</p>',
  5, 8, 14, '(8,18)', true,
  null, false,
  null, false,
  null, false,
  'midnight', '#2c2c2c',
  'arcana', '#664295'
),

-- 6. Subclass: Path of the Ashen Flame (Sorcerer subclass)
(
  'Path of the Ashen Flame', 'subclass', null, 'Sorcerer Subclass',
  '<p><em>You have bargained with the remnant heat of a dead god, and in exchange carry a flame that consumes without burning — a fire of pure erasure.</em></p><p><strong><em>Ashen Touch (Passive):</em></strong> Your spells that deal magic damage ignore resistance.</p><p><strong><em>Cinderfall (Action):</em></strong> Spend 3 Hope. Rain ash-fire across a Close area. Make a Presence attack against all targets in range; on a success each takes 2d10 magic damage and is Restrained until end of their next turn.</p>',
  null, null, null, null, false,
  null, false,
  null, false,
  null, false,
  'arcana', '#664295',
  'midnight', '#2c2c2c'
);
--> statement-breakpoint

-- ─────────────────────────────────────────────
-- adversary_previews
-- ─────────────────────────────────────────────
insert into adversary_previews (
  name, type, subtype,
  tier, description, sub_description, experience,
  text,
  difficulty, hp, stress, thresholds,
  attack, weapon, distance, damage_type, damage_amount, potential
) values

-- 1. Gravewarden (Solo Standard)
(
  'Gravewarden', 'adversary', 'standard',
  2,
  'A hulking knight who died mid-oath and refused to stop. The Gravewarden patrols cursed crypts in silence, its armour sealed shut over centuries of decay. It cannot be reasoned with — only outlasted.',
  'When the Gravewarden drops below half HP, it enters Judgment Stance: all its attacks deal +1d6 damage and it gains resistance to physical damage.',
  'Undead Lore',
  '<p><strong>Inexorable March (Passive):</strong> The Gravewarden cannot be Stunned, Slowed, or moved against its will.</p><p><strong>Grave Sentence (Reaction):</strong> When a creature within Very Close range uses a Hope, the Gravewarden may spend a Fear to impose disadvantage on that creature''s next roll.</p>',
  'Standard', 24, 3, '(10,20)',
  'Deathblow', 'Rusted Greatsword', 'Melee', 'physical', '1d12+5', '+3'
),

-- 2. Thornmaw Hydra (Solo)
(
  'Thornmaw Hydra', 'adversary', 'solo',
  3,
  'A six-headed serpent whose necks are wrapped in living thorns. Each head operates independently, snapping and lunging from different angles. Severing a head only accelerates its hunger — two grow back, each angrier than the last.',
  'Each time the Hydra takes Severe damage, add one Head Token. At the start of each round, the Hydra makes one additional attack for each Head Token (max 3 bonus attacks).',
  'Ancient Beasts, Swamp Survival',
  '<p><strong>Regenerating Heads (Passive):</strong> When the Hydra takes Severe damage, add a Head Token (max 3). Remove all Head Tokens when the Hydra takes fire or acid damage equal to its Severe threshold in a single hit.</p><p><strong>Thrashing Coil (Action — 2 Fear):</strong> The Hydra lashes out. Make an attack against all targets within Close range; on a success each target takes 2d8 physical damage and is knocked Prone.</p><p><strong>Venom Spit (Action):</strong> Ranged attack at one target within Far range. On a success, deal 1d10 magic damage and the target is Poisoned until they take a short rest.</p>',
  'Dangerous', 55, 0, '(15,30)',
  'Snap and Tear', 'Thorned Maw', 'Very Close', 'physical', '2d10+6', '+4'
),

-- 3. Cult Zealot (Standard)
(
  'Cult Zealot', 'adversary', 'standard',
  1,
  'Hollow-eyed and feverish, the Zealot fights not with skill but with utter conviction. They feel no fear because they''ve traded it away for certainty. Their patron''s symbol is burned into their palm.',
  null,
  null,
  '<p><strong>Martyr''s Fervor (Passive):</strong> When the Zealot drops to 0 HP, the nearest ally adversary may immediately make a free attack as a reaction.</p><p><strong>Unholy Invocation (Action):</strong> The Zealot chants and spends a Fear. One adversary within Far range heals 1d6 HP.</p>',
  'Standard', 8, 2, '(4,9)',
  'Frenzied Strike', 'Ritual Dagger', 'Melee', 'physical', '1d8+2', '+1'
),

-- 4. Deepmire Lurker (Skulk)
(
  'Deepmire Lurker', 'adversary', 'skulk',
  2,
  'Something that used to be an eel before the dark water changed it. The Lurker moves through flooded ruins with silent efficiency, striking from below and retreating into murk. It hunts by heat and breath.',
  null,
  'Aberrant Creatures, Deep Water Navigation',
  '<p><strong>Murk Veil (Passive):</strong> While in water or dim light, the Lurker is Concealed. Attacks against it have disadvantage until it attacks or takes damage.</p><p><strong>Drag Under (Reaction):</strong> When the Lurker hits with its standard attack, it may spend a Fear to grapple the target and pull them into the nearest body of water within Very Close range.</p>',
  'Tricky', 14, 2, '(7,14)',
  'Lunge Bite', 'Serrated Maw', 'Very Close', 'physical', '1d10+3', '+2'
);
--> statement-breakpoint

-- ─────────────────────────────────────────────
-- adversary_previews (environments)
-- ─────────────────────────────────────────────
insert into adversary_previews (
  name, type, subtype,
  tier, description, sub_description, experience,
  text,
  difficulty, hp, stress, thresholds,
  attack, weapon, distance, damage_type, damage_amount, potential
) values

-- 5. The Whispering Bog (traversal)
(
  'The Whispering Bog', 'environment', 'traversal',
  null,
  'A vast expanse of black water and sunken earth draped in perpetual mist. Ghostly voices murmur just below hearing, and every path that seemed solid a moment ago has since swallowed itself in mud.',
  'Disorient, separate, and exhaust the party before dragging them under.',
  null,
  '<p><strong>Sinking Ground (Passive):</strong> At the start of each round, one PC of the GM''s choice must succeed on an Agility reaction roll or become Restrained in the mud until the start of their next turn.</p><p><strong>Ghost Voices (Action — 1 Fear):</strong> The bog speaks to one PC in the voice of someone they trust. That character must succeed on an Instinct reaction roll or spend their next action moving toward the voice.</p><p><strong>Mist Veil (Passive):</strong> Visibility is limited to Close range. Ranged attacks beyond Close range have disadvantage.</p>',
  'Dangerous', null, null, null,
  null, null, null, null, null, 'Deepmire Lurker, Will-o-Wisp'
),

-- 6. The Sunken Bazaar (social)
(
  'The Sunken Bazaar', 'environment', 'social',
  null,
  'A drowned trading post that somehow still operates beneath thirty feet of seawater. Merchants in glass helmets haggle over secrets and stolen names. Coin is worthless here — only information has value.',
  'Extract secrets, create obligations, and ensure no one leaves without owing something.',
  null,
  '<p><strong>Currency of Secrets (Passive):</strong> Any PC who asks for goods or information must first offer a secret in return. The GM decides whether the secret is valuable enough.</p><p><strong>Binding Debt (Reaction):</strong> When a PC accepts aid or goods without offering a secret, the GM may spend 2 Fear to mark them as Indebted. An Indebted character has disadvantage on Presence rolls until the debt is repaid.</p><p><strong>Leverage (Action — 1 Fear):</strong> A merchant reveals they already know something the party wanted kept hidden. One PC of the GM''s choice must make an Instinct reaction roll or become Shaken.</p>',
  'Moderate', null, null, null,
  null, null, null, null, null, 'Corrupt Merchant, Sea Witch, Debt Collector'
);
--> statement-breakpoint

-- ─────────────────────────────────────────────
-- user_cards (links users → card_previews)
-- ─────────────────────────────────────────────
insert into user_cards (user_id, public, card_preview_id) values
(
  (select id from users where email = 'admin@test.com'),
  true,
  (select id from card_previews where name = 'Thornborn')
),
(
  (select id from users where email = 'user@test.com'),
  true,
  (select id from card_previews where name = 'The Wandering Grove')
),
(
  (select id from users where email = 'admin@test.com'),
  true,
  (select id from card_previews where name = 'Shadowstep')
),
(
  (select id from users where email = 'user2@test.com'),
  true,
  (select id from card_previews where name = 'Soulrender Scythe')
),
(
  (select id from users where email = 'user@test.com'),
  true,
  (select id from card_previews where name = 'Voidmeld')
),
(
  (select id from users where email = 'user2@test.com'),
  false,
  (select id from card_previews where name = 'Path of the Ashen Flame')
);
--> statement-breakpoint

-- ─────────────────────────────────────────────
-- user_adversaries (links users → adversary_previews)
-- ─────────────────────────────────────────────
insert into user_adversaries (user_id, public, adversary_preview_id) values
(
  (select id from users where email = 'admin@test.com'),
  true,
  (select id from adversary_previews where name = 'Gravewarden')
),
(
  (select id from users where email = 'user@test.com'),
  true,
  (select id from adversary_previews where name = 'Thornmaw Hydra')
),
(
  (select id from users where email = 'user2@test.com'),
  true,
  (select id from adversary_previews where name = 'Cult Zealot')
),
(
  (select id from users where email = 'admin@test.com'),
  false,
  (select id from adversary_previews where name = 'Deepmire Lurker')
),
(
  (select id from users where email = 'user@test.com'),
  true,
  (select id from adversary_previews where name = 'The Whispering Bog')
),
(
  (select id from users where email = 'user2@test.com'),
  true,
  (select id from adversary_previews where name = 'The Sunken Bazaar')
);
