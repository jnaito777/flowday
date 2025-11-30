# Database Schema Migration Guide

## Issue
The Supabase `tasks` table is missing the following columns that the app expects:
- `description` (TEXT, optional)
- `category` (TEXT, optional)

## Status
✅ App UI is ready and running (vertical nav with dashboard, schedule, statistics, profile)  
❌ Database schema needs updating for full feature support

## Solution

### Option 1: Manual Migration (Recommended)

1. Open your Supabase project dashboard at: https://app.supabase.com
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Paste the following SQL:

```sql
-- Add missing columns to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS estimated_minutes INTEGER NOT NULL DEFAULT 30;

-- Optional: Add indexes for better query performance
CREATE INDEX IF NOT EXISTS tasks_category_idx ON tasks(category);
CREATE INDEX IF NOT EXISTS tasks_scheduled_start_idx ON tasks(scheduled_start);
```

5. Click **Run** (or Cmd+Enter / Ctrl+Enter)
6. Verify the columns were added by viewing the table structure

### Option 2: Automated Migration (Requires Service Role Key)

If you have your Supabase service role key, you can run:

```bash
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here" node scripts/run-migrations.mjs
```

Then verify:
```bash
node scripts/check-schema.mjs
```

## Verification

Once migrations are applied, run the schema check:

```bash
VITE_SUPABASE_URL="https://ltamxusuvywhxncwqsll.supabase.co" \
VITE_SUPABASE_ANON_KEY="sb_publishable_WiscdCJ9Pbi-5ZSb7mooYA_j0XEivSk" \
node scripts/check-schema.mjs
```

Expected output:
```
description column: ✓ EXISTS
category column: ✓ EXISTS
✓ All expected columns present!
```

## Next Steps

1. Apply the SQL migration above
2. Run the verification command
3. Test the app by:
   - Signing up at http://localhost:3002/
   - Creating a task with description and category
   - Dragging it to the scheduler
   - Verifying it persists in the database

## Notes

- The app gracefully handles missing columns (fields are optional)
- RLS (Row Level Security) policies require authentication to insert/update tasks
- All column additions are safe and won't affect existing data
