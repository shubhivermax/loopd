-- Add upvotes column to listings table if it doesn't exist
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0;

-- Update existing rows to have 0 upvotes if they don't have the column
UPDATE listings 
SET upvotes = 0 
WHERE upvotes IS NULL; 