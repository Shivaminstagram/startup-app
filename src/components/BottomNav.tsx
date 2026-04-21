import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MessageCircle, Users, User } from 'lucide-react'
import { useApp } from '@/context/AppContext'

export const BottomNav: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUserId } = useApp()

  const tabs = [
    { path: '/feed', label: 'Network', icon: Users },
    { path: '/chats', label: 'Messages', icon: MessageCircle },
    { path: `/profile/${currentUserId}`, label: 'Profile', icon: User },
  ]

  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map(({ path, label, icon: Icon }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex-1 flex flex-col items-center justify-center py-3 px-2 transition border-t-2 ${
              isActive(path)
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon size={24} />
            <span className="text-xs font-medium mt-1">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
