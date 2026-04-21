import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface AppContextType {
  currentUserId: string | null
  userRole: 'business' | 'startup' | null
  setUserRole: (role: 'business' | 'startup') => void
  isOnline: boolean
  updateOnlineStatus: (online: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<'business' | 'startup' | null>(null)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setCurrentUserId(session.user.id)
        
        // Fetch user role
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()
        
        if (data?.role) {
          setUserRole(data.role as 'business' | 'startup')
        }
      }
    }

    checkUser()
  }, [])

  const updateOnlineStatus = async (online: boolean) => {
    setIsOnline(online)
    if (currentUserId) {
      await supabase
        .from('users')
        .update({ is_online: online })
        .eq('id', currentUserId)
    }
  }

  const handleOnlineStatusChange = (online: boolean) => {
    updateOnlineStatus(online)
  }

  // Update online status when user leaves/comes back
  useEffect(() => {
    const handleVisibility = () => {
      handleOnlineStatusChange(document.visibilityState === 'visible')
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [currentUserId])

  return (
    <AppContext.Provider value={{
      currentUserId,
      userRole,
      setUserRole,
      isOnline,
      updateOnlineStatus,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
