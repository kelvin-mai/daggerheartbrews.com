ALTER TABLE user_cards ADD COLUMN upvotes INTEGER NOT NULL DEFAULT 0;
ALTER TABLE user_cards ADD COLUMN downvotes INTEGER NOT NULL DEFAULT 0;
ALTER TABLE user_adversaries ADD COLUMN upvotes INTEGER NOT NULL DEFAULT 0;
ALTER TABLE user_adversaries ADD COLUMN downvotes INTEGER NOT NULL DEFAULT 0;

CREATE TABLE user_card_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_card_id UUID NOT NULL REFERENCES user_cards(id) ON DELETE CASCADE,
  vote VARCHAR(4) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ,
  UNIQUE(user_id, user_card_id)
);

CREATE TABLE user_adversary_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_adversary_id UUID NOT NULL REFERENCES user_adversaries(id) ON DELETE CASCADE,
  vote VARCHAR(4) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ,
  UNIQUE(user_id, user_adversary_id)
);
