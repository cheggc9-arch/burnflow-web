-- Fix burn_records table to include buy_signature and burn_signature columns
-- Run this directly in your Supabase SQL Editor

-- Add buy_signature column if it doesn't exist
ALTER TABLE public.burn_records 
ADD COLUMN IF NOT EXISTS buy_signature TEXT;

-- Add burn_signature column if it doesn't exist  
ALTER TABLE public.burn_records 
ADD COLUMN IF NOT EXISTS burn_signature TEXT;

-- Update the status column to allow 'buy_only' status
DO $$
BEGIN
    -- First, check if the status column is using an enum type
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns 
        WHERE table_name = 'burn_records' 
        AND column_name = 'status'
        AND data_type = 'USER-DEFINED'
    ) THEN
        -- If it's an enum, add the new value
        IF NOT EXISTS (
            SELECT 1
            FROM pg_type t
            JOIN pg_enum e ON t.oid = e.enumtypid
            WHERE t.typname = 'burn_records_status' AND e.enumlabel = 'buy_only'
        ) THEN
            ALTER TYPE burn_records_status ADD VALUE 'buy_only';
            RAISE NOTICE 'Added "buy_only" to burn_records_status enum type.';
        ELSE
            RAISE NOTICE 'Value "buy_only" already exists in burn_records_status enum type.';
        END IF;
    ELSE
        -- If it's not an enum, we can just update the check constraint
        RAISE NOTICE 'Status column is not using enum type, skipping enum update.';
    END IF;
END $$;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'burn_records' 
AND table_schema = 'public'
AND column_name IN ('buy_signature', 'burn_signature')
ORDER BY column_name;
