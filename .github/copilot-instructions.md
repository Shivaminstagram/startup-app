# Startup Network - Development Instructions

## Project Overview

Full-stack networking platform connecting business investors with startup founders.

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Mobile-first** responsive design
- **Real-time** chat with Supabase subscriptions

## Getting Started

1. Install Node.js: https://nodejs.org/
2. Install dependencies: `npm install`
3. Setup Supabase: See SUPABASE_SETUP.md
4. Create `.env.local` with Supabase credentials
5. Run: `npm run dev`

## Key Files

- `src/App.tsx` - Main routing and app container
- `src/context/AppContext.tsx` - Global state management
- `src/components/` - All UI components
- `src/hooks/useAuth.ts` - Authentication and profile hooks
- `src/hooks/useMessages.ts` - Chat and messaging hooks
- `src/lib/supabase.ts` - Supabase client setup

## Architecture

### Auth Flow
1. User signs up/logs in
2. Supabase creates auth session
3. User profile created in users table
4. User chooses role (business/startup)
5. Redirected to feed

### Chat Flow
1. User clicks "Message" on feed card
2. Opens real-time chat with that user
3. Messages sync instantly via Supabase subscriptions
4. Auto scroll to latest message

### Online Status
- Set to true when app opens/becomes visible
- Set to false when tab loses focus
- Updated automatically on user changes

## Coding Standards

- Use TypeScript for type safety
- Component files: `.tsx` (with JSX)
- Utility files: `.ts`
- Prefer functional components with hooks
- Use Tailwind for all styling
- Import from components/hooks/lib folders with @ alias

## Common Tasks

### Add a New Component
1. Create file in `src/components/YourComponent.tsx`
2. Export from components
3. Import in App.tsx and add route if needed

### Add a Route
1. Import component in App.tsx
2. Add `<Route>` in `AppRoutes()`
3. Wrap with `<ProtectedRoute>` if auth required

### Update Database Schema
1. Go to Supabase SQL Editor
2. Run migration SQL
3. Update types in `src/lib/supabase.ts`
4. Update hooks as needed

### Debug Real-time Issues
1. Check browser console (F12) for errors
2. Verify Realtime is enabled in Supabase
3. Check RLS policies allow operations
4. Try hard refresh (Ctrl+Shift+R)

## Environment Setup

### .env.local (NEVER commit this)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Database Schema

### users table
- id (UUID) - Primary key
- email (text) - Auth email
- username (text) - Display name
- role (text) - 'business' or 'startup'
- bio (text) - User bio
- is_online (boolean) - Online status
- avatar_url (text) - Profile picture
- created_at (timestamp) - Account creation

### messages table
- id (UUID) - Primary key
- sender_id (UUID) - FK to users
- receiver_id (UUID) - FK to users
- message (text) - Message content
- read (boolean) - Read status
- created_at (timestamp) - Send time

## Performance Optimization

- Component memoization where needed
- Lazy image loading
- Pagination for large lists
- Real-time subscriptions cleaned up on unmount
- Indexes on frequently queried columns

## Testing

To manually test:
1. Create 2 accounts with different emails
2. Assign one to "business" role, one to "startup"
3. Refresh, should see each other in feed
4. Send messages - should auto-sync both ways
5. Check online status updates

## Build & Deploy

Development:
```bash
npm run dev
```

Production build:
```bash
npm run build
```

Deploy to Netlify:
- Connect GitHub repo
- Set environment variables
- Auto-deploy on push

## Troubleshooting

Common issues and solutions in SUPABASE_SETUP.md and README.md

## Resources

- React: https://react.dev
- Supabase: https://supabase.com/docs
- Tailwind: https://tailwindcss.com
- Vite: https://vitejs.dev
- TypeScript: https://www.typescriptlang.org

## Project Goals

✓ MVP-ready production code
✓ Clean, maintainable architecture
✓ Mobile-first responsive design
✓ Real-time collaboration
✓ Simple to deploy and scale
