import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export const useBookmarks = (userId: string | null) => {
  const [bookmarks, setBookmarks] = useState<string[]>([]) // Array of bookmarked user IDs
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchBookmarks = async () => {
      try {
        const { data } = await supabase
          .from('bookmarks')
          .select('bookmarked_user_id')
          .eq('user_id', userId)

        setBookmarks(data?.map(b => b.bookmarked_user_id) || [])
      } catch (err) {
        console.error('Error fetching bookmarks:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookmarks()

    // Subscribe to bookmark changes
    const channel = supabase
      .channel(`user:${userId}:bookmarks`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookmarks' }, () => {
        fetchBookmarks()
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [userId])

  const toggleBookmark = async (bookmarkedUserId: string) => {
    if (!userId) return

    try {
      const isBookmarked = bookmarks.includes(bookmarkedUserId)

      if (isBookmarked) {
        // Remove bookmark
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', userId)
          .eq('bookmarked_user_id', bookmarkedUserId)

        setBookmarks(prev => prev.filter(id => id !== bookmarkedUserId))
      } else {
        // Add bookmark
        await supabase.from('bookmarks').insert({
          user_id: userId,
          bookmarked_user_id: bookmarkedUserId,
        })

        setBookmarks(prev => [...prev, bookmarkedUserId])
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err)
      throw err
    }
  }

  const isBookmarked = (userId: string) => bookmarks.includes(userId)

  return { bookmarks, loading, toggleBookmark, isBookmarked }
}
