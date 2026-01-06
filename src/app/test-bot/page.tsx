'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function TestBotPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const triggerBot = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/news-bot', {
        method: 'POST'
      })
      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🤖 Haber Robotu Test Paneli</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <button
            onClick={triggerBot}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '🔄 Haberler Oluşturuluyor...' : '🚀 Şimdi Haber Oluştur!'}
          </button>
          
          <p className="mt-4 text-sm text-gray-600">
            Bu butona tıkladığınızda robot RSS feedlerden son haberleri alıp AI ile özgün haberler oluşturacak ve otomatik yayınlayacak!
          </p>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Sonuç:</h2>
            
            {result.success ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <p className="text-green-800 font-semibold">✅ {result.message}</p>
                  <p className="text-sm text-green-600 mt-2">
                    Toplam: {result.news?.length || 0} haber | Atlanan: {result.skipped || 0}
                  </p>
                </div>

                {result.news && result.news.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">📰 Oluşturulan Haberler:</h3>
                    <ul className="space-y-2">
                      {result.news.map((news: any, index: number) => (
                        <li key={index} className="bg-gray-50 p-3 rounded">
                          <p className="font-medium">{news.title}</p>
                          <p className="text-sm text-gray-600">
                            Kategori: {news.category} | Kaynak: {news.source}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4">
                  <Link
                    href="/"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    → Ana sayfaya git ve yeni haberleri gör
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <p className="text-red-800">❌ Hata: {result.message || result.error}</p>
              </div>
            )}

            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-gray-600">
                🔍 Detaylı JSON Yanıt
              </summary>
              <pre className="mt-2 bg-gray-100 p-4 rounded text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}