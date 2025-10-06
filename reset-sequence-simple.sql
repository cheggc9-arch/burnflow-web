-- Simple and reliable sequence reset
-- Run this in your Supabase SQL Editor

-- Step 1: Check current sequence value
SELECT last_value FROM distributions_id_seq;

-- Step 2: Reset sequence to 1 (this will make the next distribution #1)
SELECT setval('distributions_id_seq', 1, false);

-- Step 3: Verify the sequence is now at 1
SELECT last_value FROM distributions_id_seq;

-- The last_value should show 1, meaning the next distribution will be #1
