import { useState, useEffect } from 'react'
import { supabase, type Message } from '@/lib/supabase'

export const useMessages = (userId: string, contactId: string) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId || !contactId) {
      setLoading(false)
      return
    }

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(
            `and(sender_id.eq.${userId},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${userId})`
          )
          .order('created_at', { ascending: true })

        if (error) throw error
        setMessages(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch messages')
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    // Subscribe to new messages
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload: any) => {
        if (
          (payload.new.sender_id === userId && payload.new.receiver_id === contactId) ||
          (payload.new.sender_id === contactId && payload.new.receiver_id === userId)
        ) {
          setMessages(prev => [...prev, payload.new])
        }
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [userId, contactId])

  const sendMessage = async (message: string) => {
    try {
      const { error } = await supabase.from('messages').insert({
        sender_id: userId,
        receiver_id: contactId,
        message,
        created_at: new Date().toISOString(),
        read: false,
      })

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
      throw err
    }
  }

  return { messages, loading, error, sendMessage }
}

export const useConversations = (userId: string) => {
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchConversations = async () => {
      try {
        // Get unique conversations
        const { data: messages, error: msgError } = await supabase
          .from('messages')
          .select('sender_id, receiver_id, created_at, message')
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
          .order('created_at', { ascending: false })

        if (msgError) throw msgError

        // Group by conversation partner
        const partners: { [key: string]: any } = {}

        messages?.forEach((msg: any) => {
          const partnerId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id
          if (!partners[partnerId]) {
            partners[partnerId] = {
              id: partnerId,
              last_message: msg.message,
              last_message_time: msg.created_at,
            }
          }
        })

        // Fetch partner details
        const partnerIds = Object.keys(partners)
        if (partnerIds.length > 0) {
          const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*')
            .in('id', partnerIds)

          if (usersError) throw usersError

          const enriched = users?.map(user => ({
            ...partners[user.id],
            username: user.username,
            avatar_url: user.avatar_url,
          })) || []

          setConversations(enriched.sort((a, b) => 
            new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime()
          ))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch conversations')
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()

    // Subscribe to new messages
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        fetchConversations()
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [userId])

  return { conversations, loading, error }
}
