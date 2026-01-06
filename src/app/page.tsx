import Link from 'next/link'
import Chatbot from '@/components/Chatbot'
import SearchButton from '@/components/SearchButton'
import ThemeToggle from '@/components/ThemeToggle'
import NewsletterForm from '@/components/NewsletterForm'

// ISR - Build zamanı veri çekmeyi skipla, runtime'da çek
export const dynamic = 'force-dynamic'

async function getLatestNews() {
  try {
    // Runtime'da API'dan çek (build zamanında değil)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/news?status=published&limit=6`, {
      cache: 'no-store'
    })
    
    if (!response.ok) return []
    const data = await response.json()
    return data.news || []
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}

async function getCategories() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/categories`, {
      cache: 'no-store'
    })
    
    if (!response.ok) return []
    const data = await response.json()
    return data.categories || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export default async function HomePage() {
  const latestNews = await getLatestNews()
  const categories = await getCategories()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Haber Sitesi</h1>
            </div>
            <div className="flex items-center gap-4">
              <SearchButton />
              <ThemeToggle />
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Ana Sayfa</Link>
                <Link href="/kategoriler" className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Kategoriler</Link>
                <Link href="/editor/login" className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Editör Paneli</Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-6xl">
            Güncel Haberler
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            En son haberleri ve gelişmeleri takip edin
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link 
              href="/haberler" 
              className="btn-primary"
            >
              Haberleri Görüntüle
            </Link>
            <Link 
              href="/editor/login" 
              className="btn-secondary"
            >
              Editör Girişi →
            </Link>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">Kategoriler</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category: any) => (
              <Link
                key={category._id}
                href={`/kategori/${category.slug}`}
                className="px-6 py-3 bg-white dark:bg-gray-700 rounded-full shadow-sm hover:shadow-md transition-shadow text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Featured News Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Öne Çıkan Haberler</h3>
          
          {latestNews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Henüz haber bulunmuyor. Haber robotu çalışıyor...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((news: any) => (
                <Link key={news._id} href={`/haber/${news.slug}`} className="card bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-white text-4xl">📰</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {news.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {news.excerpt}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {news.category?.name || 'Genel'}
                    </span>
                    <span>{new Date(news.publishedAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                  {news.tags && news.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {news.tags.slice(0, 3).map((tag: string, idx: number) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Newsletter */}
      <NewsletterForm />

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>&copy; 2024 Haber Sitesi. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      {/* AI Chatbot */}
      <Chatbot />
    </div>
  )
}