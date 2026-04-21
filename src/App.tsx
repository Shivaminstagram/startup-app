import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useApp } from '@/context/AppContext'
import { AppProvider } from '@/context/AppContext'
import { ToastProvider, ToastContainer } from '@/context/ToastContext'

// Components
import { AuthForm } from '@/components/AuthForm'
import { AuthCallback } from '@/components/AuthCallback'
import { SplashScreen } from '@/components/SplashScreen'
import { RoleSelection } from '@/components/RoleSelection'
import { Feed } from '@/components/Feed'
import { Chat } from '@/components/Chat'
import { Chats } from '@/components/Chats'
import { Profile } from '@/components/Profile'
import { BottomNav } from '@/components/BottomNav'
import { ProtectedRoute } from '@/components/ProtectedRoute'

const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  const { currentUserId, userRole, updateOnlineStatus } = useApp()

  useEffect(() => {
    // Set user as online when component mounts
    if (user) {
      updateOnlineStatus(true)
    }

    // Handle visibility change
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        updateOnlineStatus(true)
      } else {
        updateOnlineStatus(false)
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [user, updateOnlineStatus])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  if (!userRole) {
    return <Navigate to="/role" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <>
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth/login" element={<AuthForm isSignUp={false} />} />
        <Route path="/auth/signup" element={<AuthForm isSignUp={true} />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Role Selection */}
        <Route
          path="/role"
          element={
            <ProtectedRoute>
              <RoleSelection />
            </ProtectedRoute>
          }
        />

        {/* App Routes */}
        <Route
          path="/feed"
          element={
            <RouteGuard>
              <>
                <Feed />
                <BottomNav />
              </>
            </RouteGuard>
          }
        />

        <Route
          path="/chat/:contactId"
          element={
            <RouteGuard>
              <>
                <Chat />
                <BottomNav />
              </>
            </RouteGuard>
          }
        />

        <Route
          path="/chats"
          element={
            <RouteGuard>
              <>
                <Chats />
                <BottomNav />
              </>
            </RouteGuard>
          }
        />

        <Route
          path="/profile/:userId"
          element={
            <RouteGuard>
              <>
                <Profile />
                <BottomNav />
              </>
            </RouteGuard>
          }
        />

        {/* Redirect */}
        <Route path="/" element={<Navigate to={user ? '/feed' : '/auth/login'} replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

function App() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <Router>
      <ToastProvider>
        <AppProvider>
          {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
          {!showSplash && <AppRoutes />}
          <ToastContainer />
        </AppProvider>
      </ToastProvider>
    </Router>
  )
}

export default App
