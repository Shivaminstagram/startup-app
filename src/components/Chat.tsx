import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useMessages } from '@/hooks/useMessages'
import { useApp } from '@/context/AppContext'
import { useToast } from '@/context/ToastContext'
import { supabase, type User } from '@/lib/supabase'
import { Send, ArrowLeft, MoreVertical } from 'lucide-react'

const SUGGESTION = "What are you building?"

export const Chat: React.FC = () => {
  const { contactId } = useParams<{ contactId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUserId } = useApp()
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [contact, setContact] = useState<User | null>(location.state?.user || null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestionsShown, setSuggestionsShown] = useState(!location.state?.user)

  const { messages, error: messagesError, sendMessage } = useMessages(
    currentUserId || '',
    contactId || ''
  )

  // Fetch contact info if not in location state
  useEffect(() => {
    if (!contact && contactId) {
      const fetchContact = async () => {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', contactId)
          .single()
        
        if (data) {
          setContact(data)
        }
      }
      
      fetchContact()
    }
  }, [contactId, contact])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !currentUserId || !contactId) return

    setLoading(true)
    setSuggestionsShown(false)

    try {
      await sendMessage(text)
      setMessage('')
      toast('Message sent! ✓', 'success')
    } catch (err) {
      toast('Failed to send message', 'error')
      console.error('Failed to send message:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestedMessage = () => {
    handleSendMessage(SUGGESTION)
  }

  const handleSend = () => {
    handleSendMessage(message)
  }

  if (!contact) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading chat...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-white md:max-w-3xl md:mx-auto md:border-l md:border-r">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/feed')}
            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-semibold text-lg">{contact.username}</h2>
            <p className="text-xs text-gray-500">
              {contact.is_online ? 'Active now' : 'Away'}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition">
          <MoreVertical size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-3">👋</div>
            <p className="text-gray-600 font-medium mb-2">
              Start a conversation with {contact.username}
            </p>
            <p className="text-sm text-gray-500">
              Send a message to begin connecting
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.sender_id === currentUserId
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-900 rounded-bl-none'
              }`}
            >
              <p className="text-sm break-words">{msg.message}</p>
              <p className={`text-xs mt-1 ${
                msg.sender_id === currentUserId ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {suggestionsShown && messages.length === 0 && (
          <div className="flex justify-start">
            <button
              onClick={handleSuggestedMessage}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm transition"
            >
              💡 {SUGGESTION}
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messagesError && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200 text-red-600 text-sm">
          {messagesError}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 p-4 flex gap-2 sticky bottom-0 bg-white">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}
