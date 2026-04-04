insert into user_card_bookmarks (user_id, user_card_id) values
-- user@test.com bookmarks admin's and user2's cards
(
  (select id from users where email = 'user@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Thornborn')
),
(
  (select id from users where email = 'user@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Shadowstep')
),
(
  (select id from users where email = 'user@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Soulrender Scythe')
),
-- user2@test.com bookmarks admin's and user's cards
(
  (select id from users where email = 'user2@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Thornborn')
),
(
  (select id from users where email = 'user2@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Voidmeld')
),
-- admin@test.com bookmarks user2's card
(
  (select id from users where email = 'admin@test.com'),
  (select uc.id from user_cards uc join card_previews cp on uc.card_preview_id = cp.id where cp.name = 'Soulrender Scythe')
);

insert into user_adversary_bookmarks (user_id, user_adversary_id) values
-- user@test.com bookmarks admin's and user2's adversaries
(
  (select id from users where email = 'user@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'Gravewarden')
),
(
  (select id from users where email = 'user@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'Cult Zealot')
),
-- user2@test.com bookmarks user's adversaries
(
  (select id from users where email = 'user2@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'Thornmaw Hydra')
),
(
  (select id from users where email = 'user2@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'The Whispering Bog')
),
-- admin@test.com bookmarks user's and user2's adversaries
(
  (select id from users where email = 'admin@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'Thornmaw Hydra')
),
(
  (select id from users where email = 'admin@test.com'),
  (select ua.id from user_adversaries ua join adversary_previews ap on ua.adversary_preview_id = ap.id where ap.name = 'The Sunken Bazaar')
);
