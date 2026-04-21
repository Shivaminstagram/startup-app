import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useConversations } from '@/hooks/useMessages'
import { useApp } from '@/context/AppContext'
import { AlertCircle, MessageCircle } from 'lucide-react'

export const Chats: React.FC = () => {
  const navigate = useNavigate()
  const { currentUserId } = useApp()
  const { conversations, loading, error } = useConversations(currentUserId || '')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading chats...</p>
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

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <MessageCircle size={48} className="text-gray-400 mb-4" />
        <p className="text-gray-500 font-medium mb-2">No conversations yet</p>
        <p className="text-sm text-gray-400">
          Start messaging from the Network tab
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4 space-y-2">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => navigate(`/chat/${conv.id}`)}
            className="w-full text-left bg-white p-4 rounded-lg hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">
                  {conv.username}
                </h3>
                <p className="text-sm text-gray-600 truncate mt-1">
                  {conv.last_message}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {new Date(conv.last_message_time).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
