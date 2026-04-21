import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export const AuthCallback = () => {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if there's a session from the email link
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) throw sessionError

        if (session) {
          // User is confirmed, redirect to role selection
          setTimeout(() => {
            navigate('/role')
          }, 1500)
        } else {
          setError('Email confirmation failed. Please try signing up again.')
          setTimeout(() => {
            navigate('/auth/signup')
          }, 2000)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setTimeout(() => {
          navigate('/auth/login')
        }, 2000)
      } finally {
        setLoading(false)
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
        {loading ? (
          <>
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Confirming your email...</p>
          </>
        ) : error ? (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Confirmation Failed</h1>
            <p className="text-gray-600">{error}</p>
            <p className="text-gray-500 text-sm mt-4">Redirecting...</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-2">Email Confirmed!</h1>
            <p className="text-gray-600">Redirecting to setup your profile...</p>
          </>
        )}
      </div>
    </div>
  )
}
