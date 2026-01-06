import { MetadataRoute } from 'next'

// Runtime generation - build zamanında bağlantı gerektirmiyor
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Ana sayfalar
    const routes: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'hourly' as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/arama`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      },
    ]

    // Runtime'da API'dan haberler ve kategorileri çek
    try {
      const newsResponse = await fetch(`${baseUrl}/api/news?status=published&limit=100`, {
        cache: 'no-store'
      })
      const newsData = await newsResponse.json()
      
      if (newsData.news && Array.isArray(newsData.news)) {
        const newsUrls = newsData.news.map((item: any) => ({
          url: `${baseUrl}/haber/${item.slug}`,
          lastModified: new Date(item.updatedAt || item.createdAt),
          changeFrequency: 'daily' as const,
          priority: 0.8,
        }))
        routes.push(...newsUrls)
      }
    } catch (e) {
      console.warn('Could not fetch news for sitemap:', e)
    }

    try {
      const catResponse = await fetch(`${baseUrl}/api/categories`, {
        cache: 'no-store'
      })
      const catData = await catResponse.json()
      
      if (catData.categories && Array.isArray(catData.categories)) {
        const categoryUrls = catData.categories.map((cat: any) => ({
          url: `${baseUrl}/kategori/${cat.slug}`,
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.7,
        }))
        routes.push(...categoryUrls)
      }
    } catch (e) {
      console.warn('Could not fetch categories for sitemap:', e)
    }

    return routes
  } catch (error) {
    console.error('Sitemap generation error:', error)
    
    // Fallback: Minimal sitemap
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'hourly' as const,
        priority: 1,
      },
    ]
  }
}
