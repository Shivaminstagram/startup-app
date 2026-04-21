import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export type User = {
  id: string
  email: string
  username: string
  role: 'business' | 'startup'
  bio: string
  is_online: boolean
  created_at: string
  avatar_url?: string
  skills?: string[]
}

export type Message = {
  id: string
  sender_id: string
  receiver_id: string
  message: string
  created_at: string
  read: boolean
}

export type Bookmark = {
  id: string
  user_id: string
  bookmarked_user_id: string
  created_at: string
}

export type Notification = {
  id: string
  user_id: string
  sender_id?: string
  type: 'message' | 'bookmark' | 'connection'
  title: string
  message?: string
  read: boolean
  created_at: string
}

export type UserProfile = {
  id: string
  email: string
  username: string
  role: 'business' | 'startup'
  bio: string
  is_online: boolean
  avatar_url?: string
  created_at: string
}
