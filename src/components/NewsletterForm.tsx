'use client'

import { useState } from 'react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()
      setMessage(data.message)
      
      if (data.success) {
        setEmail('')
      }
    } catch (error) {
      setMessage('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            📧 Haberler E-postanızda
          </h3>
          <p className="text-blue-100 mb-6">
            Son haberleri kaçırmayın! Hemen abone olun.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresiniz"
                required
                className="flex-1 px-4 py-3 rounded-lg focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 font-medium"
              >
                {loading ? '...' : 'Abone Ol'}
              </button>
            </div>
            {message && (
              <p className="mt-3 text-white text-sm">{message}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
