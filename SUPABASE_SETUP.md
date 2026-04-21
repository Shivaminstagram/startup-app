# Supabase Setup Guide

This guide walks you through setting up Supabase for the Startup Network app.

## Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Sign Up"
3. Choose "Sign up with Email" or use GitHub
4. Verify your email
5. Create a password

## Step 2: Create a New Project

1. In your dashboard, click "New project"
2. Choose your organization (create one if needed)
3. Enter a project name (e.g., "startup-network")
4. Set a strong database password
5. Choose a region close to you
6. Click "Create new project"
7. Wait 2-3 minutes for setup to complete

## Step 3: Get API Credentials

1. Go to your project dashboard
2. Click "Settings" (gear icon, bottom left)
3. Click "API" in the left sidebar
4. Copy the following:
   - **Project URL** → `https://ydjluiiirwoxjhapfkjl.supabase.co`
   - **Project API keys** → Look for "anon public" → `sb_publishable_laD1f6fD-YaLnbm6rW-qIA_ihkHW6XE`

Example:
```
VITE_SUPABASE_URL=https://abcdefg123456.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Create Database Tables

### Option A: Using SQL Editor (Recommended)

1. In your project, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Copy the entire SQL script below
4. Paste it into the editor
5. Click **Run** (or press Ctrl+Enter)

### SQL Script

```sql
-- Create users table
CREATE TABLE users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  username text NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('business', 'startup')),
  bio text DEFAULT '',
  is_online boolean DEFAULT false,
  avatar_url text,
  created_at timestamp DEFAULT now()
);

-- Create messages table
CREATE TABLE messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Policy 1: Everyone can view all user profiles
CREATE POLICY "users_can_view_all_profiles"
  ON users FOR SELECT
  USING (true);

-- Policy 2: Users can update their own profile
CREATE POLICY "users_can_update_own_profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Policy 3: Users can insert their own profile (signup)
CREATE POLICY "users_can_create_own_profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for messages table
-- Policy 1: Users can only see messages they sent or received
CREATE POLICY "users_can_view_own_messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Policy 2: Users can only send messages as themselves
CREATE POLICY "users_can_send_messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Create indexes for query performance
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_online ON users(is_online);
```

### Verify Tables Were Created

1. Go to **Table Editor** in the left sidebar
2. You should see:
   - `users` table ✓
   - `messages` table ✓

If they don't appear, refresh the page or check the console for errors.

## Step 5: Enable Authentication

1. Go to **Authentication** in the left sidebar
2. Click **Providers** 
3. Make sure "Email" is enabled (should be by default)
4. You can also enable other providers like Google, GitHub, etc.

## Step 6: Configure Realtime (Real-time Chat)

1. Go to **Realtime** in the left sidebar
2. Under "Replication", you should see your tables
3. Make sure both `users` and `messages` are enabled (they should be)
4. If not enabled, click the toggle to enable

This allows the app to receive instant updates when messages are sent or user status changes.

## Step 7: Add Environment Variables

1. In your project root, create `.env.local` file
2. Add your credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
```

**Important**: 
- Never commit `.env.local` to git
- Never share these keys publicly
- The `.gitignore` already excludes `.env.local`

## Step 8: Test the Setup

1. Run the app: `npm run dev`
2. Try to sign up with an email
3. You should be able to create an account
4. Check the **Auth** section in Supabase to see your user

## Troubleshooting

### "Database does not contain any tables"

If tables aren't showing up:
1. Refresh the page
2. Try the SQL script again, line by line
3. Check for error messages in red text
4. Make sure you clicked **Run**

### "Email already exists" but you never signed up

This might be cached auth state:
1. Clear browser cookies for localhost
2. Or use a different email address

### "Permission denied" errors

This is likely an RLS policy issue:
1. Go to **Authentication** → **Policies**
2. Make sure the policies from the SQL script are applied
3. Check that policies are enabled (toggle switch)

### "Connection failed" in the chat

1. Make sure Realtime is enabled (Step 6)
2. Refresh the app
3. Check browser console for errors (F12)
4. Try on a different browser

### Auth User ID Doesn't Match

Make sure your user profile in the `users` table has:
- `id` = your auth user id (should match automatically)
- Populate this when creating profile

## Advanced: Security Rules

By default, RLS (Row Level Security) allows:
- **View**: Everyone can see user profiles
- **Update**: Users can only edit their own profile
- **Messages**: Users can only see/send messages to/from themselves

This is secure by default. Anyone can view the feed, but can't modify others' data.

## Advanced: Database Backups

Supabase automatically backs up your database daily. To download:
1. Go to **Settings** → **Backups**
2. Click **Download** on any backup

## Advanced: Database Access

If you need to manage data manually:
1. Go to **Table Editor**
2. Click a table to view/edit data
3. You can add/edit/delete rows directly

Be careful with direct edits! The app might break if data is inconsistent.

## Common Database Queries

If you need to debug, you can run SQL queries:

View all users:
```sql
SELECT id, username, role, is_online FROM users;
```

View all messages:
```sql
SELECT sender_id, receiver_id, message, created_at FROM messages ORDER BY created_at DESC LIMIT 50;
```

Mark all messages as read:
```sql
UPDATE messages SET read = true WHERE receiver_id = 'USER_ID';
```

Delete a user (and their messages):
```sql
DELETE FROM users WHERE id = 'USER_ID';
```

## Next Steps

1. Copy your credentials to `.env.local`
2. Run `npm install`
3. Run `npm run dev`
4. Create an account and start networking!

## Need Help?

- Check the app's README.md for more info
- Visit https://supabase.com/docs for documentation
- Check browser console (F12) for error messages
- Test in an incognito window to clear cache

## Security Best Practices

✓ Never share your anon key or project URL in public repos (we use .env.local)
✓ The anon key is safe to use client-side - it's limited by RLS
✓ The service_role key should NEVER be in client code
✓ Supabase handles password hashing securely
✓ Always use HTTPS in production

You're all set! Your Supabase project is ready for the Startup Network app.
