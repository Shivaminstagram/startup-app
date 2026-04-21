# Startup Network - Full Stack Web App

A mobile-first networking platform connecting business investors with startup founders using React, Vite, Tailwind CSS, and Supabase.

## Features

- 🔐 **Authentication** - Email-based sign up/login via Supabase Auth
- 👤 **Role Selection** - Choose between "Business Mindset" or "Want to Start Startup"
- 💬 **Real-time Chat** - Instant messaging with live subscriptions
- 🔄 **User Feed** - Scrollable card feed of users from opposite role
- 📱 **Mobile-First Design** - Optimized for mobile with responsive layout
- 🟢 **Online Status** - Real-time online/offline indicators
- ⚡ **Performance** - Lightweight components and efficient real-time updates

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime Subscriptions
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Prerequisites

- Node.js 16.0 or higher
- npm or yarn
- Supabase account (free tier works)

## Setup Instructions

### 1. Install Node.js

If you don't have Node.js installed:
- Download from https://nodejs.org/
- Install the LTS version
- Verify installation: `node --version` and `npm --version`

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase Project

1. **Create a Supabase Account**
   - Go to https://supabase.com
   - Sign up with your email
   - Create a new project

2. **Get Your Credentials**
   - In your project, go to Settings → API
   - Copy your `Project URL` and `Anon Public Key`

3. **Create Database Tables**

In your Supabase project:
- Go to SQL Editor
- Create a new query
- Copy and paste the SQL below
- Run it

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
CREATE POLICY "Users can view all profiles"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can create own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for messages table
CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Create indexes for performance
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_created ON messages(created_at);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_online ON users(is_online);
```

### 4. Set Up Environment Variables

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Fill in your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Run the Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # React components
│   ├── AuthForm.tsx        # Login/Signup
│   ├── RoleSelection.tsx   # Role choice
│   ├── Feed.tsx            # User feed
│   ├── Chat.tsx            # Real-time chat
│   ├── Chats.tsx           # Conversations list
│   ├── Profile.tsx         # User profile
│   ├── BottomNav.tsx       # Mobile navigation
│   └── ProtectedRoute.tsx  # Auth guard
├── hooks/               # Custom React hooks
│   ├── useAuth.ts          # Auth & user profile
│   └── useMessages.ts      # Chat & messages
├── context/             # React context
│   └── AppContext.tsx      # Global app state
├── lib/                 # Utilities
│   └── supabase.ts        # Supabase client
├── App.tsx              # Main routing
├── main.tsx             # Entry point
└── index.css            # Tailwind styles

Configuration Files:
├── vite.config.ts       # Vite config
├── tailwind.config.js   # Tailwind config
├── tsconfig.json        # TypeScript config
└── postcss.config.js    # PostCSS config
```

## Usage Guide

### 1. Sign Up
- Create account with email and password
- Email confirmation required

### 2. Choose Role
- Select "Business Mindset" or "Want to Start Startup"
- Enter username and bio
- Save profile

### 3. Browse Feed
- See users from opposite role
- Active users appear first
- Click "Message" to start chat

### 4. Chat
- Send real-time messages
- Auto-suggested ice breaker: "What are you building?"
- Messages auto-load in real-time

### 5. Messages Tab
- View all conversations
- Click to continue chat

### 6. Profile
- View/edit your profile
- Change username and bio
- See your role and online status

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Deployment Options

### Netlify (Recommended for beginners)
1. Push code to GitHub
2. Connect GitHub repo to Netlify
3. Set environment variables in Netlify settings
4. Deploy automatically on push

### Vercel
1. Push code to GitHub
2. Import project on vercel.com
3. Add environment variables
4. Deploy

### Docker
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

Build and run:
```bash
docker build -t startup-network .
docker run -p 3000:3000 startup-network
```

## Database Schema Details

### Users Table
- `id` - UUID primary key
- `email` - User email
- `username` - Display name (unique)
- `role` - 'business' or 'startup'
- `bio` - Short bio
- `is_online` - Online status
- `avatar_url` - Profile picture URL
- `created_at` - Account creation time

### Messages Table
- `id` - UUID primary key
- `sender_id` - Sender user ID
- `receiver_id` - Receiver user ID
- `message` - Message text
- `read` - Read status
- `created_at` - Message timestamp

## Real-time Features

The app uses Supabase Realtime subscriptions:
- New messages appear instantly
- Online status updates in real-time
- User feed refreshes when new users join
- Subscriptions automatically clean up on unmount

## Performance Tips

- Lazy load components for better initial load
- Use React.memo for Feed cards if needed
- Implement pagination for large user lists
- Cache user profiles locally if needed

## Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#YOUR_COLOR',
      secondary: '#YOUR_COLOR',
    },
  },
}
```

### Change Auto Message
Edit `src/components/Chat.tsx`:
```typescript
const SUGGESTION = "Your custom message"
```

### Add Features
- User search
- Message typing indicator
- Read receipts
- User ratings/reviews
- Video call integration

## Troubleshooting

### "Missing Supabase environment variables"
- Check `.env.local` has correct URL and key
- Keys should not have quotes
- Restart dev server after changing .env

### "Cannot POST /auth/signup"
- Make sure Email/Password auth is enabled in Supabase
- Check auth providers in Supabase settings

### "Connection failed for real-time"
- Verify Supabase Realtime is enabled
- Check Row Level Security policies
- Try hard refresh (Ctrl+Shift+R)

### "Messages not appearing"
- Check RLS policies are set correctly
- Verify both users have profiles in DB
- Check browser console for errors

## Support & Resources

- [React Documentation](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev)

## License

MIT

## Contributing

Contributions welcome! Feel free to open issues and PRs.

## Future Enhancements

- [ ] User search functionality
- [ ] Typing indicators in chat
- [ ] Image/file sharing
- [ ] User ratings and reviews
- [ ] Connection requests/acceptance
- [ ] Notification system
- [ ] Dark mode
- [ ] Push notifications
- [ ] Video/audio calls
- [ ] User blocking/reporting
