import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserFeed } from '@/hooks/useAuth'
import { useApp } from '@/context/AppContext'
import { useBookmarks } from '@/hooks/useBookmarks'
import { MessageCircle, AlertCircle, Heart } from 'lucide-react'
import { type User } from '@/lib/supabase'

const SKILLS_OPTIONS = [
  'AI/ML', 'Web Development', 'Mobile App', 'Blockchain', 'SaaS',
  'E-Commerce', 'FinTech', 'HealthTech', 'EdTech', 'UI/UX Design',
  'Data Science', 'Cloud Infrastructure', 'DevOps', 'Product Management',
  'Growth Marketing', 'Sales', 'Business Development',
]

export const Feed: React.FC = () => {
  const navigate = useNavigate()
  const { currentUserId, userRole } = useApp()
  const { users, loading, error } = useUserFeed(currentUserId, userRole)
  const { toggleBookmark, isBookmarked } = useBookmarks(currentUserId)
  const [visibleCount, setVisibleCount] = useState(10)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const filteredUsers = useMemo(() => {
    if (selectedSkills.length === 0) return users

    return users.filter(user => {
      const userSkills = user.skills || []
      return selectedSkills.some(skill => userSkills.includes(skill))
    })
  }, [users, selectedSkills])

  const handleCardClick = (user: User) => {
    navigate(`/chat/${user.id}`, { state: { user } })
  }

  const handleBookmarkToggle = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation()
    toggleBookmark(userId)
  }

  const loadMore = () => {
    setVisibleCount(prev => prev + 10)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading users...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No users available yet</p>
        </div>
      </div>
    )
  }

  const visibleUsers = filteredUsers.slice(0, visibleCount)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Network</h1>
          <p className="text-sm text-gray-600">
            Discover and connect with {userRole === 'business' ? 'startups' : 'business experts'}
          </p>

          {/* Skills Filter */}
          <div className="mt-4 flex flex-wrap gap-2">
            {SKILLS_OPTIONS.map(skill => (
              <button
                key={skill}
                onClick={() => setSelectedSkills(prev =>
                  prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
                )}
                className={`px-3 py-1 text-sm rounded-full transition ${
                  selectedSkills.includes(skill)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {visibleUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{user.username}</h3>
                    {user.is_online && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Active now</span>
                      </div>
                    )}
                  </div>
                  {user.bio && (
                    <p className="text-sm text-gray-600 mt-1">{user.bio}</p>
                  )}

                  {/* Skills Display */}
                  {user.skills && user.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {user.skills.map(skill => (
                        <span key={skill} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bookmark Button */}
                <button
                  onClick={(e) => handleBookmarkToggle(e, user.id)}
                  className="ml-2 p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <Heart
                    size={20}
                    className={isBookmarked(user.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                  />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleCardClick(user)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  Message
                </button>
                <button
                  onClick={() => navigate(`/profile/${user.id}`, { state: { user } })}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}

        {visibleCount < users.length && (
          <div className="text-center py-6">
            <button
              onClick={loadMore}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
