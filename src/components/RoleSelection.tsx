import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/context/ToastContext'
import { supabase } from '@/lib/supabase'
import { Briefcase, Rocket } from 'lucide-react'
import { SkillsSelector } from '@/components/SkillsSelector'

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedRole, setSelectedRole] = useState<'business' | 'startup' | null>(null)
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole || !username.trim()) {
      setError('Please select a role and enter a username')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Create or update user profile
      const { error: upsertError, data } = await supabase
        .from('users')
        .upsert({
          id: user?.id,
          email: user?.email,
          username: username.trim(),
          role: selectedRole,
          bio: bio.trim(),
          skills: skills && skills.length > 0 ? skills : [],
          is_online: true,
        })

      if (upsertError) {
        console.error('Upsert error details:', upsertError)
        throw upsertError
      }

      toast('Profile created successfully! 🎉', 'success')
      navigate('/feed')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error saving profile'
      console.error('Profile save error:', err)
      setError(errorMsg)
      toast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-2">Choose Your Role</h1>
        <p className="text-gray-600 text-center mb-8">
          Help us connect you with the right people
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your username"
              required
            />
          </div>

          {/* Bio Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio (Optional)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell others about yourself (max 150 chars)"
              maxLength={150}
              rows={3}
            />
          </div>

          {/* Skills Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills & Interests (Optional)
            </label>
            <SkillsSelector skills={skills} onChange={setSkills} />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I am a:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Business Mindset */}
              <button
                type="button"
                onClick={() => setSelectedRole('business')}
                className={`p-6 rounded-lg border-2 transition flex flex-col items-center gap-3 ${
                  selectedRole === 'business'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <Briefcase size={32} className={selectedRole === 'business' ? 'text-blue-600' : 'text-gray-400'} />
                <span className="font-semibold text-lg">Business Mindset</span>
                <span className="text-sm text-gray-600 text-center">
                  Looking for startups to invest in or partner with
                </span>
              </button>

              {/* Startup */}
              <button
                type="button"
                onClick={() => setSelectedRole('startup')}
                className={`p-6 rounded-lg border-2 transition flex flex-col items-center gap-3 ${
                  selectedRole === 'startup'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <Rocket size={32} className={selectedRole === 'startup' ? 'text-blue-600' : 'text-gray-400'} />
                <span className="font-semibold text-lg">Want to Start Startup</span>
                <span className="text-sm text-gray-600 text-center">
                  Looking for business advice and connections
                </span>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!selectedRole || !username.trim() || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Setting up...' : 'Continue to Feed'}
          </button>
        </form>
      </div>
    </div>
  )
}
