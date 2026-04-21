import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useUserProfile } from '@/hooks/useAuth'
import { useAuth } from '@/hooks/useAuth'
import { useApp } from '@/context/AppContext'
import { useToast } from '@/context/ToastContext'
import { supabase, type User } from '@/lib/supabase'
import { ArrowLeft, Edit2, LogOut } from 'lucide-react'
import { SkillsSelector } from '@/components/SkillsSelector'

type ViewMode = 'view' | 'edit'

export const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUserId } = useApp()
  const { signOut } = useAuth()
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<ViewMode>('view')
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<User | null>(location.state?.user || null)
  const [editData, setEditData] = useState({ username: '', bio: '', skills: [] as string[] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isOwnProfile, setIsOwnProfile] = useState(false)

  // Fetch profile if not in location state
  useEffect(() => {
    if (!profile && userId) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()
        
        if (data) {
          setProfile(data)
          setEditData({ 
            username: data.username, 
            bio: data.bio,
            skills: data.skills || []
          })
        }
      }
      
      fetchProfile()
    } else if (profile) {
      setEditData({ 
        username: profile.username, 
        bio: profile.bio,
        skills: profile.skills || []
      })
    }
  }, [userId, profile])

  useEffect(() => {
    setIsOwnProfile(currentUserId === userId)
  }, [currentUserId, userId])

  const handleSaveProfile = async () => {
    if (!profile) return

    if (!editData.username.trim()) {
      setError('Username is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({
          username: editData.username.trim(),
          bio: editData.bio.trim(),
          skills: editData.skills && editData.skills.length > 0 ? editData.skills : [],
        })
        .eq('id', profile.id)

      if (updateError) {
        console.error('Update error details:', updateError)
        throw updateError
      }

      setProfile(prev => prev ? {
        ...prev,
        username: editData.username.trim(),
        bio: editData.bio.trim(),
        skills: editData.skills,
      } : null)
      setIsEditing(false)
      toast('Profile updated successfully! ✓', 'success')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Update failed'
      console.error('Profile update error:', err)
      setError(errorMsg)
      toast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      // Set offline before signing out
      if (currentUserId) {
        await supabase
          .from('users')
          .update({ is_online: false })
          .eq('id', currentUserId)
      }
      await signOut()
      navigate('/auth/login')
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="flex-1 text-xl font-bold">Profile</h1>
        {isOwnProfile && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <Edit2 size={20} className="text-gray-600" />
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                    className="border border-gray-300 rounded px-3 py-1"
                  />
                ) : (
                  profile.username
                )}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {profile.role === 'business' ? 'Business Mindset' : 'Startup Founder'}
                </span>
                {profile.is_online && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Active
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">About</h3>
            {isEditing ? (
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                maxLength={150}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            ) : (
              <p className="text-gray-700">
                {profile.bio || 'No bio added'}
              </p>
            )}
            {isEditing && (
              <p className="text-xs text-gray-500 mt-1">
                {editData.bio.length}/150 characters
              </p>
            )}
          </div>

          {/* Skills */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Skills & Interests</h3>
            {isEditing ? (
              <SkillsSelector 
                skills={editData.skills} 
                onChange={(skills) => setEditData({ ...editData, skills })}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map(skill => (
                    <span key={skill} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No skills added</p>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {isEditing && (
            <div className="flex gap-2">
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditData({ 
                    username: profile.username, 
                    bio: profile.bio,
                    skills: profile.skills || []
                  })
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isOwnProfile && (
          <div className="bg-white rounded-lg shadow p-6">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
