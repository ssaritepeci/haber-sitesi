import { notFound } from 'next/navigation'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import connectDB from '@/lib/mongodb'
import News from '@/models/News'
import Category from '@/models/Category'

async function getCategoryNews(slug: string) {
  await connectDB()
  
  const category = await Category.findOne({ slug }).lean()
  if (!category) return null

  const news = await News.find({ 
    category: category._id, 
    status: 'published' 
  })
    .populate('category')
    .sort({ publishedAt: -1 })
    .lean()
  
  return {
    category: JSON.parse(JSON.stringify(category)),
    news: JSON.parse(JSON.stringify(news))
  }
}

async function getAllCategories() {
  await connectDB()
  const categories = await Category.find().lean()
  return JSON.parse(JSON.stringify(categories))
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getCategoryNews(slug)
  
  if (!data) {
    notFound()
  }

  const { category, news } = data
  const allCategories = await getAllCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600">
              Haber Sitesi
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="text-gray-600 hover:text-gray-900">Ana Sayfa</Link>
                <Link href="/editor/login" className="text-gray-600 hover:text-gray-900">Editör Paneli</Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Category Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
          <p className="text-blue-100">{news.length} haber bulundu</p>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 overflow-x-auto py-4">
            {allCategories.map((cat: any) => (
              <Link
                key={cat._id}
                href={`/kategori/${cat.slug}`}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  cat.slug === category.slug
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* News Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {news.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📰</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Henüz haber yok</h2>
            <p className="text-gray-600">Bu kategoride henüz yayınlanmış haber bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item: any) => (
              <Link
                key={item._id}
                href={`/haber/${item.slug}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="text-white text-4xl">📰</span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {item.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {item.viewCount || 0}
                    </span>
                    <span>{new Date(item.publishedAt).toLocaleDateString('tr-TR')}</span>
                  </div>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 Haber Sitesi. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
