-- =================================================================================
-- Migration: Add Concurrency-Safe Unique Order IDs
-- =================================================================================

-- 1. Create a sequence starting at 3422.
-- Sequences in PostgreSQL guarantee atomic increments, meaning multiple
-- concurrent transactions will never get the same number. It prevents race conditions.
CREATE SEQUENCE IF NOT EXISTS order_id_seq START 3422;

-- 2. Alter the existing 'orders' table to add 'display_id' column.
-- It defaults to 'ORDER-' concatenated with the next value from the sequence.
-- The UNIQUE constraint ensures no duplicates are ever stored.
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS display_id TEXT UNIQUE 
DEFAULT 'ORDER-' || nextval('order_id_seq'::regclass);

-- 3. (Optional but recommended) Backfill existing orders
-- If you already have orders in the database, this will generate a unique display_id 
-- for each of them using the sequence, so no field is left blank.
UPDATE orders 
SET display_id = 'ORDER-' || nextval('order_id_seq'::regclass) 
WHERE display_id IS NULL;

-- Note: 
-- To change or reset the starting number later, you can run:
-- ALTER SEQUENCE order_id_seq RESTART WITH [NEW_NUMBER];
