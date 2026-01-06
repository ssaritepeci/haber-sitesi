import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import CommentSection from '@/components/CommentSection'
import ThemeToggle from '@/components/ThemeToggle'
import connectDB from '@/lib/mongodb'
import News from '@/models/News'
import User from '@/models/User'
import Category from '@/models/Category'

async function getNewsDetail(slug: string) {
  await connectDB()
  
  const news = await News.findOne({ slug, status: 'published' })
    .populate('category')
    .lean()
  
  if (!news) return null

  // Görüntülenme sayısını artır
  await News.findByIdAndUpdate(news._id, { $inc: { viewCount: 1 } })
  
  return JSON.parse(JSON.stringify(news))
}

async function getRelatedNews(categoryId: string, currentSlug: string) {
  await connectDB()
  
  const news = await News.find({ 
    category: categoryId, 
    slug: { $ne: currentSlug },
    status: 'published' 
  })
    .populate('category')
    .sort({ publishedAt: -1 })
    .limit(3)
    .lean()
  
  return JSON.parse(JSON.stringify(news))
}

// Meta data için
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const news = await getNewsDetail(slug)
  
  if (!news) {
    return {
      title: 'Haber Bulunamadı'
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return {
    title: news.title,
    description: news.excerpt,
    keywords: news.tags?.join(', '),
    openGraph: {
      title: news.title,
      description: news.excerpt,
      url: `${baseUrl}/haber/${news.slug}`,
      siteName: 'Haber Sitesi',
      images: [
        {
          url: news.featuredImage || '/default-news-image.jpg',
          width: 1200,
          height: 630,
        }
      ],
      locale: 'tr_TR',
      type: 'article',
      publishedTime: news.publishedAt,
      authors: [news.author?.username || 'Haber Sitesi'],
    },
    twitter: {
      card: 'summary_large_image',
      title: news.title,
      description: news.excerpt,
      images: [news.featuredImage || '/default-news-image.jpg'],
    },
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const news = await getNewsDetail(slug)
  
  if (!news) {
    notFound()
  }

  const relatedNews = await getRelatedNews(news.category._id, slug)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
              ← Ana Sayfa
            </Link>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Haberler</Link>
                <Link href="/editor/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Editör Paneli</Link>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <li><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Ana Sayfa</Link></li>
            <li>/</li>
            <li className="text-blue-600 dark:text-blue-400">{news.category?.name || 'Genel'}</li>
          </ol>
        </nav>

        {/* Article */}
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
              {news.category?.name || 'Genel'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {news.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6 pb-6 border-b dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(news.publishedAt).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {news.viewCount || 0} görüntülenme
              </span>
            </div>
          </div>

          {/* Excerpt */}
          {news.excerpt && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-4 mb-6">
              <p className="text-lg text-gray-700 dark:text-gray-300 italic">{news.excerpt}</p>
            </div>
          )}

          {/* Featured Image Placeholder */}
          <div className="h-96 bg-gradient-to-br from-blue-400 to-indigo-500 dark:from-blue-600 dark:to-indigo-700 rounded-lg mb-8 flex items-center justify-center">
            <span className="text-white text-6xl">📰</span>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            {news.content.split('\n\n').map((paragraph: string, idx: number) => (
              <p key={idx} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          {news.tags && news.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Etiketler:</h3>
              <div className="flex flex-wrap gap-2">
                {news.tags.map((tag: string, idx: number) => (
                  <span key={idx} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="mt-8 pt-6 border-t dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Paylaş:</h3>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 text-sm">
                Twitter
              </button>
              <button className="px-4 py-2 bg-blue-800 dark:bg-blue-900 text-white rounded-lg hover:bg-blue-900 dark:hover:bg-blue-950 text-sm">
                Facebook
              </button>
              <button className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 text-sm">
                WhatsApp
              </button>
            </div>
          </div>
        </article>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">İlgili Haberler</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((item: any) => (
                <Link key={item._id} href={`/haber/${item.slug}`} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                  <div className="h-32 bg-gradient-to-br from-blue-400 to-indigo-500 dark:from-blue-600 dark:to-indigo-700 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-white text-2xl">📰</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {item.excerpt}
                  </p>
                  <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.publishedAt).toLocaleDateString('tr-TR')}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Comment Section */}
        <CommentSection newsId={news._id} />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>&copy; 2024 Haber Sitesi. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
