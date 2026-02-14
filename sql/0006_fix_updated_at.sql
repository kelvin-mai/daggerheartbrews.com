-- Fix updatedAt field to have default value and not null constraint
-- This ensures updatedAt is properly set when records are created/updated

-- First, update any existing records that have NULL updated_at
UPDATE user_cards SET updated_at = now() WHERE updated_at IS NULL;
UPDATE user_adversaries SET updated_at = now() WHERE updated_at IS NULL;

-- Then update user_cards table schema
ALTER TABLE user_cards 
ALTER COLUMN updated_at SET NOT NULL,
ALTER COLUMN updated_at SET DEFAULT now();

-- Then update user_adversaries table schema
ALTER TABLE user_adversaries
ALTER COLUMN updated_at SET NOT NULL,
ALTER COLUMN updated_at SET DEFAULT now();
