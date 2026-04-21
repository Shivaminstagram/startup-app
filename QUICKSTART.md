# Quick Start Guide

Get the app running in 5 minutes!

## Prerequisites

1. **Node.js installed?**
   - If not: https://nodejs.org/ → Install LTS
   - Verify: Run `node --version` in terminal

2. **Supabase account?**
   - If not: https://supabase.com → Sign up free

## Steps to Run

### 1. Get Supabase Credentials (3 min)

1. Create a Supabase project: https://supabase.com/dashboard
2. Go to **Settings** → **API**
3. Copy these values:
   - Project URL
   - Anon Public Key

### 2. Setup Database (1 min)

1. In Supabase project → **SQL Editor** → **New Query**
2. Paste this entire script:

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

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_can_view_all_profiles" ON users FOR SELECT USING (true);
CREATE POLICY "users_can_update_own_profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "users_can_create_own_profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_can_view_own_messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "users_can_send_messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_online ON users(is_online);
```

3. Click **Run**

### 3. Configure App (1 min)

1. In the project folder, create `.env.local`:

```
VITE_SUPABASE_URL=your-url-here
VITE_SUPABASE_ANON_KEY=your-key-here
```

2. Install dependencies:
```bash
npm install
```

### 4. Start Dev Server (instant!)

```bash
npm run dev
```

The app opens at http://localhost:5173

## Try It Out

1. **Sign up** with any test email
2. **Choose a role** (Business or Startup)
3. **Add your info** (username + bio)
4. **See the feed** with other users
5. **Send a message** - you'll see "What are you building?" suggestion
6. **Check Messages tab** - see all conversations

## Common Issues

| Issue | Solution |
|-------|----------|
| "Missing env variables" | Check `.env.local` has your Supabase URL and key |
| "Cannot sign up" | Make sure Email provider is enabled in Supabase Auth |
| "Messages not loading" | Refresh page, check RLS policies were applied |
| "App won't start" | Run `npm install` again, then `npm run dev` |

## What's Next?

- Read README.md for full documentation
- Read SUPABASE_SETUP.md for detailed Supabase guide
- Customize colors in tailwind.config.js
- Deploy to Netlify (see README)

## Architecture

```
Login → Choose Role → Browse Feed → Chat Real-time → See Messages
```

## File Structure

```
src/
├── components/ (UI - login, feed, chat, profile)
├── hooks/ (Data fetching - auth, messages)
├── context/ (Global state - user, online status)
└── lib/ (Supabase client)
```

## Commands

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run preview  # Preview production build
```

---

**You're ready! 🚀 Start the app with `npm run dev`**
