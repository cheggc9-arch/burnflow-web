-- Fix Supabase sequence issue
-- Run this in your Supabase SQL Editor

-- Get the maximum ID from the table
SELECT MAX(id) as max_id FROM distributions;

-- Reset the sequence to the correct value
-- This ensures the next auto-generated ID will be higher than any existing ID
SELECT setval('distributions_id_seq', COALESCE((SELECT MAX(id) FROM distributions), 0) + 1, false);

-- Verify the sequence is now correct by checking next value
SELECT nextval('distributions_id_seq') as next_sequence_value;

-- Optional: Remove the sample record if it exists (ID = 1)
-- DELETE FROM distributions WHERE id = 1 AND status = 'threshold_not_met' AND total_distributed = 0;
