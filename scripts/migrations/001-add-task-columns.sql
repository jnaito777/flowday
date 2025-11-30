-- Migration: add optional columns to tasks table used by the frontend
-- Run with a Supabase SQL editor or via a service role key

BEGIN;

-- Add description column if it does not exist
ALTER TABLE IF EXISTS public.tasks
ADD COLUMN IF NOT EXISTS description text;

-- Add category column if it does not exist
ALTER TABLE IF EXISTS public.tasks
ADD COLUMN IF NOT EXISTS category text;

-- Add estimated_minutes column
ALTER TABLE IF EXISTS public.tasks
ADD COLUMN IF NOT EXISTS estimated_minutes integer DEFAULT 0;

-- Add scheduled_start and scheduled_end columns (timestamps)
ALTER TABLE IF EXISTS public.tasks
ADD COLUMN IF NOT EXISTS scheduled_start timestamptz;

ALTER TABLE IF EXISTS public.tasks
ADD COLUMN IF NOT EXISTS scheduled_end timestamptz;

COMMIT;

-- Notes:
-- 1) Running this on production requires a SUPABASE_SERVICE_ROLE_KEY or use the Supabase SQL editor.
-- 2) If you use Supabase migrations or a migration tool, convert these statements into your migration format.
