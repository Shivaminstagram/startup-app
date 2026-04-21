# Required SQL Migrations for New Features

Run this SQL in your Supabase SQL Editor to add the new features:

```sql
-- Add skills/interests column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS skills text[] DEFAULT '{}'::text[];

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bookmarked_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamp DEFAULT now(),
  UNIQUE(user_id, bookmarked_user_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('message', 'bookmark', 'connection')),
  title text NOT NULL,
  message text,
  read boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookmarks
CREATE POLICY "users_can_view_own_bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_can_create_bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_delete_own_bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "users_can_view_own_notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "system_can_create_notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "users_can_update_own_notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "users_can_delete_own_notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);
```

## Steps to Apply:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **SQL Editor** (left sidebar)
4. Click **New query**
5. Paste the entire SQL above
6. Click **Run** (or Ctrl+Enter)
7. Refresh the app

Done!
