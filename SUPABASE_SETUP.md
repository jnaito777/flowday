# Supabase Setup Guide

This guide will help you set up Supabase for FlowDay's database and authentication.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name: FlowDay (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Choose the closest region to you
5. Click "Create new project" and wait for it to initialize

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll find:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

## Step 4: Create the Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of `supabase-schema.sql`
4. Click "Run" to execute the SQL
5. You should see "Success. No rows returned"

## Step 5: Verify Setup

1. Make sure your `.env` file is in the root of the project
2. Restart your dev server:
   ```bash
   npm run dev
   ```
3. You should now be able to:
   - Sign up for a new account
   - Sign in with your credentials
   - Create tasks that are saved to Supabase
   - See your tasks persist across page refreshes

## Security Notes

- The `anon` key is safe to use in client-side code (it's public)
- Row Level Security (RLS) policies ensure users can only access their own data
- Never commit your `.env` file to version control (it's already in `.gitignore`)

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env` file has the correct values
- Make sure there are no extra spaces or quotes
- Restart your dev server after changing `.env`

### "relation 'tasks' does not exist" error
- Make sure you've run the SQL schema in Step 4
- Check that the table was created in the Supabase dashboard under **Table Editor**

### Authentication not working
- Check that email authentication is enabled in Supabase:
  - Go to **Authentication** → **Providers**
  - Make sure "Email" is enabled

## Next Steps

Once set up, your FlowDay app will:
- ✅ Store all tasks in Supabase
- ✅ Sync tasks across devices
- ✅ Persist data between sessions
- ✅ Use secure authentication
- ✅ Real-time updates (if multiple tabs are open)


