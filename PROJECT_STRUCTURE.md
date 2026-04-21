# Project Structure Reference

Complete guide to the Startup Network project layout and file purposes.

## Directory Tree

```
startup-network/
├── .github/
│   └── copilot-instructions.md    # AI development instructions
├── .gitignore                      # Git ignore rules
├── .env.example                    # Environment variables template
├── index.html                      # HTML entry point
├── package.json                    # Dependencies & scripts
├── README.md                       # Main documentation
├── QUICKSTART.md                   # 5-minute setup guide
├── SUPABASE_SETUP.md              # Detailed Supabase guide
├── DEPLOYMENT.md                  # How to deploy the app
├── tailwind.config.js             # Tailwind CSS config
├── postcss.config.js              # PostCSS config
├── tsconfig.json                  # TypeScript config
├── tsconfig.node.json             # TypeScript Node config
├── vite.config.ts                 # Vite bundler config
│
└── src/
    ├── main.tsx                   # React entry point
    ├── App.tsx                    # Main app routing
    ├── index.css                  # Tailwind styles
    │
    ├── components/                # React UI Components
    │   ├── index.ts               # Export all components
    │   ├── AuthForm.tsx           # Login/Signup component
    │   │                          # Features:
    │   │                          # - Sign up with email
    │   │                          # - Sign in with email
    │   │                          # - Toggle between modes
    │   │                          # - Error handling
    │   │
    │   ├── RoleSelection.tsx       # Role choice component
    │   │                          # Features:
    │   │                          # - Choose role (business/startup)
    │   │                          # - Enter username & bio
    │   │                          # - Save to database
    │   │                          # - Redirect to feed
    │   │
    │   ├── Feed.tsx               # User feed component
    │   │                          # Features:
    │   │                          # - Show users from opposite role
    │   │                          # - Display username & bio
    │   │                          # - Show online status
    │   │                          # - Load more pagination
    │   │                          # - Click to message or view profile
    │   │
    │   ├── Chat.tsx               # Real-time chat component
    │   │                          # Features:
    │   │                          # - Send/receive messages
    │   │                          # - Auto-scroll to bottom
    │   │                          # - Show timestamps
    │   │                          # - Left/right message bubbles
    │   │                          # - Suggested message: "What are you building?"
    │   │                          # - Real-time updates via Supabase
    │   │
    │   ├── Chats.tsx              # Conversations list
    │   │                          # Features:
    │   │                          # - Show all conversations
    │   │                          # - Last message preview
    │   │                          # - Click to open chat
    │   │                          # - Sorted by recent
    │   │
    │   ├── Profile.tsx            # User profile component
    │   │                          # Features:
    │   │                          # - View profile (own or other)
    │   │                          # - Edit mode for own profile
    │   │                          # - Change username & bio
    │   │                          # - Show role & online status
    │   │                          # - Sign out button
    │   │
    │   ├── BottomNav.tsx          # Mobile bottom navigation
    │   │                          # Features:
    │   │                          # - Network (Feed) tab
    │   │                          # - Messages (Chats) tab
    │   │                          # - Profile tab
    │   │                          # - Active tab highlighting
    │   │
    │   └── ProtectedRoute.tsx      # Auth guard wrapper
    │                              # Features:
    │                              # - Check if user logged in
    │                              # - Redirect to login if not
    │                              # - Show loading state
    │
    ├── hooks/                     # Custom React Hooks
    │   ├── index.ts               # Export all hooks
    │   ├── useAuth.ts             # Authentication hooks
    │   │                          # Exports:
    │   │                          # - useAuth(): auth & login/signup
    │   │                          # - useUserProfile(): fetch & update user
    │   │                          # - useUserFeed(): fetch users for feed
    │   │
    │   └── useMessages.ts         # Chat/Messaging hooks
    │                              # Exports:
    │                              # - useMessages(): send/receive messages
    │                              # - useConversations(): list conversations
    │
    ├── context/                   # React Context (Global State)
    │   ├── index.ts               # Export context
    │   └── AppContext.tsx         # Global app state
    │                              # Provides:
    │                              # - currentUserId
    │                              # - userRole
    │                              # - isOnline
    │                              # - updateOnlineStatus()
    │                              # Features:
    │                              # - Auto track online/offline
    │                              # - Update on tab visibility
    │
    └── lib/                       # Utilities & Configuration
        ├── index.ts               # Export utilities
        └── supabase.ts            # Supabase client setup
                                   # Exports:
                                   # - supabase: Initialized client
                                   # - Types: User, Message, UserProfile
                                   # Features:
                                   # - Singleton client instance
                                   # - TypeScript interfaces
```

## File Purposes

### Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Build tool settings, port, alias config |
| `tailwind.config.js` | Tailwind CSS customization, colors |
| `tsconfig.json` | TypeScript compiler settings |
| `postcss.config.js` | PostCSS plugin configuration |
| `package.json` | Dependencies, scripts, project metadata |

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main documentation, full setup guide |
| `QUICKSTART.md` | 5-minute quick start guide |
| `SUPABASE_SETUP.md` | Detailed Supabase configuration |
| `DEPLOYMENT.md` | How to deploy to production |
| `.github/copilot-instructions.md` | AI development guidelines |

### Source Code Structure

```
src/
├── main.tsx ..................... React DOM rendering
├── App.tsx ...................... Application routing
├── index.css .................... Global Tailwind styles
│
├── components/ .................. React Components (8 files)
│   ├── AuthForm.tsx ............. Authentication UI
│   ├── RoleSelection.tsx ........ Role chooser
│   ├── Feed.tsx ................. User feed cards
│   ├── Chat.tsx ................. Real-time messaging
│   ├── Chats.tsx ................ Conversations list
│   ├── Profile.tsx .............. User profile page
│   ├── BottomNav.tsx ............ Mobile navigation
│   └── ProtectedRoute.tsx ....... Auth guard
│
├── hooks/ ....................... Custom React hooks (2 files)
│   ├── useAuth.ts ............... Auth & user profile
│   └── useMessages.ts ........... Chat & conversations
│
├── context/ ..................... Global state (1 file)
│   └── AppContext.tsx ........... App-wide state
│
└── lib/ ......................... Utilities (1 file)
    └── supabase.ts .............. Database client
```

## Data Flow

### Authentication Flow
```
Sign Up Page
    ↓
Supabase Auth
    ↓
Create User Profile
    ↓
Role Selection
    ↓
Feed
```

### Chat Flow
```
Feed Card
    ↓ Click "Message"
Chat Component
    ↓ Subscribe to messages
Real-time Supabase
    ↓ New message
Auto-update UI
```

### Online Status Flow
```
App Opens
    ↓ useApp hook
    ↓ updateOnlineStatus(true)
Supabase Update
    ↓ Other users see "Active now"
Tab Loses Focus
    ↓ visibilitychange event
    ↓ updateOnlineStatus(false)
Supabase Update
    ↓ Users see "Away"
```

## Key Components & Their Props

### AuthForm
```typescript
<AuthForm isSignUp={true|false} />
```

### Chat
```typescript
// Accessed via URL: /chat/:contactId
<Chat />  // Gets contactId from useParams
```

### Profile
```typescript
// Accessed via URL: /profile/:userId
<Profile />  // Gets userId from useParams
```

## Hook Usage Examples

### useAuth
```typescript
const { user, loading, signUp, signIn, signOut } = useAuth()
```

### useUserFeed
```typescript
const { users, loading, error } = useUserFeed(userId, userRole)
```

### useMessages
```typescript
const { messages, sendMessage } = useMessages(userId, contactId)
```

### useApp
```typescript
const { currentUserId, userRole, isOnline, updateOnlineStatus } = useApp()
```

## Environment Variables

```
VITE_SUPABASE_URL       = Your Supabase project URL
VITE_SUPABASE_ANON_KEY  = Your Supabase public anon key
```

## Database Tables

### users
- id (UUID)
- email (text)
- username (text, unique)
- role (text: 'business' | 'startup')
- bio (text)
- is_online (boolean)
- avatar_url (text, optional)
- created_at (timestamp)

### messages
- id (UUID)
- sender_id (UUID → users)
- receiver_id (UUID → users)
- message (text)
- read (boolean)
- created_at (timestamp)

## Import Patterns

### Components
```typescript
import { Feed } from '@/components'
// or
import { Feed } from '@/components/index'
```

### Hooks
```typescript
import { useAuth, useMessages } from '@/hooks'
```

### Context
```typescript
import { useApp } from '@/context'
```

### Supabase
```typescript
import { supabase, type User } from '@/lib'
```

## Build & Run Commands

```bash
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Create production build
npm run preview    # Preview production build
npm install        # Install dependencies
```

## Tailwind Classes Used

### Layout
- `flex`, `grid`, `absolute`, `relative`, `sticky`
- `px-`, `py-`, `p-`, `m-`, `space-`
- `min-h-screen`, `h-screen`, `w-full`

### Colors
- `bg-white`, `bg-blue-*`, `bg-gray-*`, `bg-green-*`
- `text-gray-*`, `text-blue-*`, `text-green-*`
- `border-*`, `border-gray-*`

### Effects
- `shadow`, `shadow-lg`, `rounded-lg`, `rounded-full`
- `hover:`, `transition`, `opacity-*`

### Responsive
- `md:` for tablets & desktop
- Mobile-first by default

## Performance Considerations

1. **Real-time Subscriptions**
   - Auto cleanup on component unmount
   - Only subscribe to needed tables

2. **List Rendering**
   - Pagination with "Load More" button
   - Map with unique keys

3. **Lazy Loading**
   - Images load on demand
   - Route components lazy loaded with React Router

4. **Caching**
   - User profiles cached in component state
   - Feed sorted by online status first

## Next Steps for Customization

1. **Add features**: Create new components in `src/components/`
2. **Add pages**: Add routes in `App.tsx`
3. **Add hooks**: Create in `src/hooks/`
4. **Modify styles**: Update `src/index.css` or Tailwind config
5. **Connect to backend**: Use `supabase` from `src/lib/`

---

This structure keeps everything organized, scalable, and easy to maintain!
