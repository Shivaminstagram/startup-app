import { useState, useEffect } from 'react'
import { supabase, type User } from '@/lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Auth error')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    setError(null)
    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
      throw err
    }
  }

  const signIn = async (email: string, password: string) => {
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
      throw err
    }
  }

  const signOut = async () => {
    setError(null)
    try {
      await supabase.auth.signOut()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed')
    }
  }

  return { user, loading, error, signUp, signIn, signOut }
}

export const useUserProfile = (userId: string | null) => {
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()

        if (error) throw error
        setProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  const updateProfile = async (updates: Partial<User>) => {
    if (!userId) return
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)

      if (error) throw error
      setProfile(prev => prev ? { ...prev, ...updates } : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
      throw err
    }
  }

  return { profile, loading, error, updateProfile }
}

export const useUserFeed = (currentUserId: string | null, userRole: 'business' | 'startup' | null) => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!currentUserId || !userRole) {
      setLoading(false)
      return
    }

    const fetchFeed = async () => {
      try {
        const oppositeRole = userRole === 'business' ? 'startup' : 'business'
        
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('role', oppositeRole)
          .neq('id', currentUserId)
          .order('is_online', { ascending: false })
          .order('created_at', { ascending: false })

        if (error) throw error
        setUsers(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch feed')
      } finally {
        setLoading(false)
      }
    }

    fetchFeed()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('public:users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        fetchFeed() // Refresh on any user changes
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [currentUserId, userRole])

  return { users, loading, error }
}
