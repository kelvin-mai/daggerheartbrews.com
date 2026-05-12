-- Seed votes and comments for local testing
-- Depends on: 0006_seed-test-users.sql, 0007_seed-content.sql, 0011_votes.sql, 0012_comments.sql

-- ─────────────────────────────────────────────
-- card votes
-- ─────────────────────────────────────────────
insert into user_card_votes (user_id, user_card_id, vote) values
-- user@test.com votes
(
  (select id from users where email = 'user@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Thornborn'),
  'up'
),
(
  (select id from users where email = 'user@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Shadowstep'),
  'up'
),
(
  (select id from users where email = 'user@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Soulrender Scythe'),
  'up'
),
-- user2@test.com votes
(
  (select id from users where email = 'user2@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Thornborn'),
  'up'
),
(
  (select id from users where email = 'user2@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Voidmeld'),
  'up'
),
(
  (select id from users where email = 'user2@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Shadowstep'),
  'down'
),
-- admin@test.com votes
(
  (select id from users where email = 'admin@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Voidmeld'),
  'up'
),
(
  (select id from users where email = 'admin@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'The Wandering Grove'),
  'up'
);
--> statement-breakpoint

-- sync upvote/downvote counts on user_cards
update user_cards set
  upvotes   = (select count(*) from user_card_votes where user_card_id = user_cards.id and vote = 'up'),
  downvotes = (select count(*) from user_card_votes where user_card_id = user_cards.id and vote = 'down');
--> statement-breakpoint

-- ─────────────────────────────────────────────
-- adversary votes
-- ─────────────────────────────────────────────
insert into user_adversary_votes (user_id, user_adversary_id, vote) values
-- user@test.com votes
(
  (select id from users where email = 'user@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'Gravewarden'),
  'up'
),
(
  (select id from users where email = 'user@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'Cult Zealot'),
  'up'
),
(
  (select id from users where email = 'user@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'The Whispering Bog'),
  'up'
),
-- user2@test.com votes
(
  (select id from users where email = 'user2@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'Thornmaw Hydra'),
  'up'
),
(
  (select id from users where email = 'user2@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'The Whispering Bog'),
  'up'
),
(
  (select id from users where email = 'user2@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'Gravewarden'),
  'down'
),
-- admin@test.com votes
(
  (select id from users where email = 'admin@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'Thornmaw Hydra'),
  'up'
),
(
  (select id from users where email = 'admin@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'The Sunken Bazaar'),
  'up'
);
--> statement-breakpoint

-- sync upvote/downvote counts on user_adversaries
update user_adversaries set
  upvotes   = (select count(*) from user_adversary_votes where user_adversary_id = user_adversaries.id and vote = 'up'),
  downvotes = (select count(*) from user_adversary_votes where user_adversary_id = user_adversaries.id and vote = 'down');
--> statement-breakpoint

-- ─────────────────────────────────────────────
-- card comments
-- Thornborn gets 12 comments to enable pagination work.
-- ─────────────────────────────────────────────
insert into user_card_comments (user_id, user_card_id, body, created_at) values

-- Thornborn: 12 comments (pagination target)
(
  (select id from users where email = 'admin@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Thornborn'),
  'The Deep Roots heal feels strong for a passive — our druid was abusing it every single session because contact with soil is basically always guaranteed underground. Might want to add a requirement that you aren''t in combat.',
  now() - interval '10 days'
),
(
  (select id from users where email = 'user@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Thornborn'),
  'Played this for three sessions now. Briar Skin is a lifesaver in boss fights. The bark flavour adds a lot to roleplay moments too.',
  now() - interval '9 days'
),
(
  (select id from users where email = 'user2@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Thornborn'),
  'How does Briar Skin interact with Armor? Does the HP reduction stack with armor mitigation or apply before it?',
  now() - interval '9 days' + interval '2 hours'
),
(
  (select id from users where email = 'admin@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Thornborn'),
  'Good question — I''ve been ruling that armor applies first, then Briar Skin reduces by 1. So Severe on a 2-armor character marks 3 HP normally but you''d mark 2. Open to feedback if others have ruled differently.',
  now() - interval '8 days'
),
(
  (select id from users where email = 'user@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Thornborn'),
  'Ran this in a sea campaign and it felt a bit out of place thematically, but mechanically it held up fine. The Stress cost on Briar Skin is well balanced.',
  now() - interval '7 days'
),
(
  (select id from users where email = 'user2@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Thornborn'),
  'Love the visual design. The amber glow detail in the description is a nice touch — one of my players asked me to describe it every single session.',
  now() - interval '6 days'
),
(
  (select id from users where email = 'admin@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Thornborn'),
  'Updated the Deep Roots wording to "not in active combat" based on feedback here. Thanks everyone for the playtesting reports!',
  now() - interval '5 days'
),
(
  (select id from users where email = 'user@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Thornborn'),
  'The Cold resistance that SRD ancestries sometimes have — is it intentional you left it out? Thornborn feel like they''d have some elemental affinity with nature.',
  now() - interval '4 days'
),
(
  (select id from users where email = 'user2@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Thornborn'),
  'These pair really well with the Verdant domain. Has anyone tried that combo?',
  now() - interval '3 days'
),
(
  (select id from users where email = 'admin@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Thornborn'),
  'Verdant + Thornborn is exactly the intended fantasy. Deep Roots stacks nicely with the domain''s regeneration abilities.',
  now() - interval '2 days'
),
(
  (select id from users where email = 'user@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Thornborn'),
  'Ran a T3 session with this and Deep Roots starts to feel underwhelming at higher tiers. Might scale the heal die — 1d8 at T2, 1d10 at T3?',
  now() - interval '1 day'
),
(
  (select id from users where email = 'user2@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Thornborn'),
  'Agreed on tier scaling. Otherwise this is one of my favourite ancestries in the brews community. Already bookmarked for my next campaign.',
  now() - interval '6 hours'
),

-- The Wandering Grove: 3 comments
(
  (select id from users where email = 'admin@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'The Wandering Grove'),
  'Communal Bond is a great mechanic — free information on nature/history without dominating exploration feels fair. Does the GM answer have to be accurate, or just honest to what they know?',
  now() - interval '5 days'
),
(
  (select id from users where email = 'user@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'The Wandering Grove'),
  'The extra Supply from Wayfarer''s Pack has been really useful in resource-tight campaigns. Simple but effective.',
  now() - interval '3 days'
),
(
  (select id from users where email = 'user2@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'The Wandering Grove'),
  'Lovely flavour text. "Moving with the seasons and trusting in the wisdom of old growth" is the kind of line that makes players want to roleplay their backstory.',
  now() - interval '1 day'
),

-- Shadowstep: 2 comments
(
  (select id from users where email = 'user@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Shadowstep'),
  'The Far range teleport for 1 Hope is strong, but requiring an actual shadow in both locations keeps it balanced. Had a funny moment where my rogue couldn''t escape a torchlit throne room.',
  now() - interval '4 days'
),
(
  (select id from users where email = 'user2@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Shadowstep'),
  'Midnight + Grace is a flavourful combo. Disadvantage on attacks until next turn is a solid rider for a tier 1 ability.',
  now() - interval '2 days'
),

-- Soulrender Scythe: 3 comments
(
  (select id from users where email = 'admin@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Soulrender Scythe'),
  'The extra 1d8 on a crit is satisfying to roll. One-handed melee weapons rarely feel this rewarding at tier 2.',
  now() - interval '6 days'
),
(
  (select id from users where email = 'user@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Soulrender Scythe'),
  'Love the lore — a weapon forged from a warlord''s spine is exactly the kind of dark flavour that fits a Blade-domain warrior.',
  now() - interval '3 days'
),
(
  (select id from users where email = 'user2@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Soulrender Scythe'),
  'Does the magic damage on crit count as a separate hit for abilities that trigger on dealing damage? Or is it all part of the same attack?',
  now() - interval '1 day'
),

-- Voidmeld: 2 comments
(
  (select id from users where email = 'admin@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Voidmeld'),
  'Event Horizon is a standout ability — free pull as a bonus action is incredible for denying movement. The radiant vulnerability doubles as a meaningful counterplay.',
  now() - interval '3 days'
),
(
  (select id from users where email = 'user@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Voidmeld'),
  'Physical immunity while transformed at tier 5 feels appropriate given the radiant weakness trade-off. Great capstone fantasy.',
  now() - interval '1 day'
);
--> statement-breakpoint

-- ─────────────────────────────────────────────
-- adversary comments
-- ─────────────────────────────────────────────
insert into user_adversary_comments (user_id, user_adversary_id, body, created_at) values

-- Gravewarden: 4 comments
(
  (select id from users where email = 'user@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'Gravewarden'),
  'Inexorable March making it immune to Stunned and Slow is brutal. We burned through all our control spells and then had nothing left when Judgment Stance kicked in. 10/10 boss design.',
  now() - interval '7 days'
),
(
  (select id from users where email = 'user2@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'Gravewarden'),
  'Grave Sentence is a really elegant reaction. Taxing Hope at exactly the moment players want to spend it creates great dramatic tension.',
  now() - interval '5 days'
),
(
  (select id from users where email = 'admin@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'Gravewarden'),
  'The HP feels right for a solo standard at tier 2. Our party of 4 took it down in 5 rounds without it being trivial.',
  now() - interval '3 days'
),
(
  (select id from users where email = 'user@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'Gravewarden'),
  'Judgment Stance at half HP is a great second-phase trigger. The +1d6 damage spike made my players immediately start playing more defensively.',
  now() - interval '1 day'
),

-- Thornmaw Hydra: 3 comments
(
  (select id from users where email = 'admin@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'Thornmaw Hydra'),
  'We ran this as the campaign finale and it was perfect. The head token mechanic made the party terrified to deal Severe damage without having fire/acid ready first.',
  now() - interval '8 days'
),
(
  (select id from users where email = 'user@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'Thornmaw Hydra'),
  'Thrashing Coil at 2 Fear is expensive but the AOE knockdown is worth it. Our warrior spent two turns just getting back up.',
  now() - interval '4 days'
),
(
  (select id from users where email = 'user2@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'Thornmaw Hydra'),
  '55 HP feels high even for a solo at tier 3. Our party of 5 finished the fight but it went 9 rounds. Might try it at 45 HP for a tighter encounter.',
  now() - interval '2 days'
),

-- Cult Zealot: 2 comments
(
  (select id from users where email = 'admin@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'Cult Zealot'),
  'Martyr''s Fervor is nasty in a group. My players stopped focusing down individual zealots because every kill triggered a free attack from a nearby enemy.',
  now() - interval '5 days'
),
(
  (select id from users where email = 'user@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'Cult Zealot'),
  'Great minion design. Unholy Invocation keeps the party on their toes — they have to decide whether to interrupt the chant or stay focused on the big threat.',
  now() - interval '2 days'
),

-- The Whispering Bog: 3 comments
(
  (select id from users where email = 'user@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'The Whispering Bog'),
  'Sinking Ground every round is relentless. One of my players failed the roll three turns in a row and spent most of the encounter stuck in place. Felt very swampy.',
  now() - interval '6 days'
),
(
  (select id from users where email = 'user2@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'The Whispering Bog'),
  'Ghost Voices is a favourite at my table. The moment a player had to move toward the voice of their dead mentor was incredibly dramatic.',
  now() - interval '3 days'
),
(
  (select id from users where email = 'admin@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'The Whispering Bog'),
  'Mist Veil at Close range visibility is tough on ranged characters. Make sure your players know before they build archer-heavy parties.',
  now() - interval '1 day'
),

-- The Sunken Bazaar: 2 comments
(
  (select id from users where email = 'user@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'The Sunken Bazaar'),
  'Currency of Secrets is the best social mechanic I''ve used in Daggerheart. It completely changed how my players approached information gathering.',
  now() - interval '4 days'
),
(
  (select id from users where email = 'user2@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'The Sunken Bazaar'),
  'Binding Debt stacking with the Presence disadvantage can spiral — had a player who ended up Indebted to three different merchants by the end of the session.',
  now() - interval '1 day'
);
