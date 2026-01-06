'use client'

import { useState, useEffect } from 'react'

interface Comment {
  _id: string
  author: string
  content: string
  createdAt: string
}

export default function CommentSection({ newsId }: { newsId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    content: ''
  })

  useEffect(() => {
    fetchComments()
  }, [newsId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?newsId=${newsId}`)
      const data = await response.json()
      if (data.success) {
        setComments(data.comments)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, newsId })
      })

      const data = await response.json()
      
      if (data.success) {
        alert('✅ Yorumunuz gönderildi! Onaylandıktan sonra görünecektir.')
        setFormData({ author: '', email: '', content: '' })
      } else {
        alert('❌ Hata: ' + data.message)
      }
    } catch (error) {
      alert('❌ Yorum gönderilirken bir hata oluştu!')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Yorumlar ({comments.length})
      </h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Adınız *"
            required
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="email"
            placeholder="E-posta *"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <textarea
          placeholder="Yorumunuzu yazın... *"
          required
          rows={4}
          maxLength={500}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{formData.content.length}/500</span>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Gönderiliyor...' : 'Yorum Gönder'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Henüz yorum yapılmamış. İlk yorumu siz yapın! 💬
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {comment.author.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-gray-900 dark:text-white">{comment.author}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 ml-13">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
