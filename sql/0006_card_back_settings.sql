-- Add card back settings to card_previews table
ALTER TABLE card_previews 
ADD COLUMN card_back TEXT DEFAULT 'default',
ADD COLUMN custom_card_back_logo TEXT;

-- Update existing cards to have default card back
UPDATE card_previews 
SET card_back = 'default' 
WHERE card_back IS NULL;
