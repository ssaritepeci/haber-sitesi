import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import News from '@/models/News'

export async function GET(request: NextRequest) {
  await connectDB()

  const news = await News.find({ status: 'published' })
    .populate('category')
    .sort({ publishedAt: -1 })
    .limit(50)
    .lean()

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Haber Sitesi</title>
    <link>${baseUrl}</link>
    <description>Güncel haberler ve gelişmeler</description>
    <language>tr-TR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${news.map((item: any) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${baseUrl}/haber/${item.slug}</link>
      <description><![CDATA[${item.excerpt}]]></description>
      <pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>
      <category>${item.category?.name || 'Genel'}</category>
      <guid isPermaLink="true">${baseUrl}/haber/${item.slug}</guid>
    </item>`).join('\n')}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}
