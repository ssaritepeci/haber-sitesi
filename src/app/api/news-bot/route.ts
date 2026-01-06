import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Parser from 'rss-parser'
import connectDB from '@/lib/mongodb'
import News from '@/models/News'
import Category from '@/models/Category'
import User from '@/models/User'
import { getTurkeyTrends, getTweetsForTrend, createNewsPrompt } from '@/lib/twitter-scraper'

const parser = new Parser()

// RSS Feed kaynakları (Çalışan ve güncel feedler)
const RSS_FEEDS = [
  { url: 'https://www.aa.com.tr/tr/rss/default?cat=guncel', category: 'Genel' },
  { url: 'https://www.aa.com.tr/tr/rss/default?cat=ekonomi', category: 'Ekonomi' },
  { url: 'https://www.aa.com.tr/tr/rss/default?cat=spor', category: 'Spor' },
]

// Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

async function generateNewsContent(originalTitle: string, originalContent: string) {
  try {
    // Google Gemini AI ile içerik üret
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
    })

    const prompt = `Sen profesyonel bir Türk haber editörüsün. Aşağıdaki kaynak haberi TAMAMEN ORİJİNAL ve FARKLI bir şekilde yeniden yaz.

KAYNAK BAŞLIK: ${originalTitle}
KAYNAK İÇERİK: ${originalContent.substring(0, 400)}

GÖREVİN:
1. Farklı bir başlık yaz (5-10 kelime)
2. Özgün haber metni yaz (150-250 kelime)
3. Kısa özet yaz (40-60 kelime)
4. 3-5 etiket öner

ÖNEMLİ: Plagiarism yapma, özgün ol ama gerçekleri koru. Profesyonel ve SEO dostu yaz.

SADECE şu JSON formatında yanıt ver:
{"title":"Başlık buraya","content":"İçerik buraya","excerpt":"Özet buraya","tags":["etiket1","etiket2","etiket3"]}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log('Gemini AI Response:', text.substring(0, 200))
    
    // JSON'u bul ve parse et
    const jsonMatch = text.match(/\{[\s\S]*?"title"[\s\S]*?\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        title: parsed.title || originalTitle,
        content: parsed.content || originalContent.substring(0, 300),
        excerpt: parsed.excerpt || originalContent.substring(0, 150),
        tags: parsed.tags || ['güncel', 'haber']
      }
    }
    
    throw new Error('AI yanıtı parse edilemedi')
  } catch (error: any) {
    console.error('AI generation error:', error.message)
    
    // Fallback: Basit versiyon
    const cleanTitle = originalTitle.replace(/[^\w\sğüşıöçĞÜŞİÖÇ]/g, '').trim()
    return {
      title: `Gelişme: ${cleanTitle.substring(0, 50)}`,
      content: originalContent.substring(0, 300) + '...',
      excerpt: originalContent.substring(0, 150) + '...',
      tags: ['güncel', 'haber', 'türkiye']
    }
  }
}

/**
 * X Trendinden AI ile haber oluştur
 */
async function generateNewsFromXTrend(trendName: string, category: any) {
  try {
    console.log(`🚀 X Trendi: ${trendName} için haber oluşturuluyor...`)
    
    // Tweet verilerini al
    const tweets = await getTweetsForTrend(trendName)
    
    // Haber yazması için prompt oluştur
    const prompt = createNewsPrompt(trendName, tweets)
    
    // Gemini ile haber oluştur
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
    })

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log('X Trend Haber Response:', text.substring(0, 200))
    
    // JSON'u bul ve parse et
    const jsonMatch = text.match(/\{[\s\S]*?"title"[\s\S]*?\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        title: parsed.title || `${trendName} Trending Topic'te`,
        content: parsed.content || `${trendName} konusu X'te trend olan konular arasında yer alıyor...`,
        excerpt: parsed.excerpt || `${trendName} hakkında önemli gelişmeler...`,
        tags: parsed.tags || ['x', 'trending', 'gündem', trendName.toLowerCase().substring(0, 20)],
        category: parsed.category || 'Sosyal Medya'
      }
    }
    
    throw new Error('AI yanıtı parse edilemedi')
  } catch (error: any) {
    console.error('X Trend haber oluşturma hatası:', error.message)
    
    return {
      title: `${trendName} X'te Gündem Başında`,
      content: `${trendName} konusu sosyal medyada yoğun ilgi çekiyor. Kullanıcılar bu konu hakkında yoğun şekilde paylaşım yapıyor ve tartışmalar devam ediyor.`,
      excerpt: `X'teki gündem trendi: ${trendName}`,
      tags: ['x', 'trending', 'gündem'],
      category: 'Sosyal Medya'
    }
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100) + '-' + Date.now()
}

async function checkDuplicate(title: string): Promise<boolean> {
  // Benzer başlık var mı kontrol et (daha esnek - ilk 20 karakter)
  const similarNews = await News.findOne({
    title: { $regex: title.substring(0, 20).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' },
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Son 24 saat
  })
  return !!similarNews
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // API key kontrolü
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key-here') {
      return NextResponse.json({
        success: false,
        message: 'Gemini API key yapılandırılmamış. .env.local dosyasına GEMINI_API_KEY ekleyin.'
      }, { status: 400 })
    }

    const generatedNews = []
    let skippedCount = 0

    // Bot kullanıcısını bul veya oluştur
    let botUser = await User.findOne({ email: 'newsbot@system.com' })
    if (!botUser) {
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash('bot-secure-password-' + Date.now(), 10)
      botUser = await User.create({
        email: 'newsbot@system.com',
        password: hashedPassword,
        name: 'AI Haber Robotu',
        role: 'editor',
        isActive: true
      })
    }

    // ============================================
    // 1. RSS FEED'LERİ ÇEKME
    // ============================================
    console.log('\n📰 RSS FEED\'LERİ İŞLENİYOR...')
    for (const feedSource of RSS_FEEDS) {
      try {
        const feed = await parser.parseURL(feedSource.url)
        
        // Son 5 haberi al
        const recentItems = feed.items.slice(0, 5)

        for (const item of recentItems) {
          if (!item.title || !item.contentSnippet) continue

          // Duplicate kontrolü
          const isDuplicate = await checkDuplicate(item.title)
          if (isDuplicate) {
            skippedCount++
            continue
          }

          // AI ile yeni haber oluştur
          const aiNews = await generateNewsContent(
            item.title,
            item.contentSnippet || item.content || ''
          )

          if (!aiNews) {
            skippedCount++
            continue
          }

          // Kategoriyi bul
          const category = await Category.findOne({ 
            name: { $regex: feedSource.category, $options: 'i' } 
          })

          if (!category) {
            skippedCount++
            continue
          }

          // Yeni haberi veritabanına kaydet
          const news = await News.create({
            title: aiNews.title,
            slug: generateSlug(aiNews.title),
            content: aiNews.content,
            excerpt: aiNews.excerpt,
            category: category._id,
            author: botUser._id,
            tags: aiNews.tags || [],
            status: 'published',
            publishedAt: new Date(),
            viewCount: 0
          })

          generatedNews.push({
            title: news.title,
            category: category.name,
            source: 'RSS Feed'
          })
        }
      } catch (feedError) {
        console.error(`Feed error for ${feedSource.url}:`, feedError)
      }
    }

    // ============================================
    // 2. X TRENDLERİNİ ÇEKME VE HABER YAZMA
    // ============================================
    console.log('\n🐦 X TRENDLERİ İŞLENİYOR...')
    try {
      const trends = await getTurkeyTrends(10) // Top 10 trend
      console.log(`✅ ${trends.length} trend bulundu`)

      // "Sosyal Medya" kategorisini bul veya oluştur
      let socialMediaCategory = await Category.findOne({ 
        name: { $regex: 'Sosyal Medya|Social', $options: 'i' } 
      })

      if (!socialMediaCategory) {
        console.log('📌 Sosyal Medya kategorisi oluşturuluyor...')
        socialMediaCategory = await Category.create({
          name: 'Sosyal Medya',
          slug: 'sosyal-medya',
          description: 'X ve sosyal ağlarda gündem olan konular',
          isActive: true
        })
      }

      // Her trend için haber oluştur
      for (const trend of trends) {
        try {
          // Trend hakkında duplicate kontrol
          const trendDuplicate = await checkDuplicate(trend.name)
          if (trendDuplicate) {
            console.log(`⏭️  Trend atlandı (zaten vardı): ${trend.name}`)
            skippedCount++
            continue
          }

          // Trend hakkında AI ile haber oluştur
          const trendNews = await generateNewsFromXTrend(trend.name, socialMediaCategory)

          if (!trendNews) {
            skippedCount++
            continue
          }

          // Veritabanına kaydet
          const news = await News.create({
            title: trendNews.title,
            slug: generateSlug(trendNews.title),
            content: trendNews.content,
            excerpt: trendNews.excerpt,
            category: socialMediaCategory._id,
            author: botUser._id,
            tags: trendNews.tags || [],
            status: 'published',
            publishedAt: new Date(),
            viewCount: 0
          })

          generatedNews.push({
            title: news.title,
            category: 'Sosyal Medya',
            source: `X Trend - ${trend.tweetCount.toLocaleString('tr-TR')} tweet`
          })

          console.log(`✅ Haber oluşturuldu: ${news.title}`)
        } catch (trendError) {
          console.error(`Trend haber oluşturma hatası (${trend.name}):`, trendError)
          skippedCount++
        }
      }
    } catch (trendError) {
      console.error('X Trendleri çekme hatası:', trendError)
    }

    return NextResponse.json({
      success: true,
      message: `${generatedNews.length} yeni haber otomatik oluşturuldu ve YAYINLANDI!`,
      summary: {
        total: generatedNews.length,
        rssFeed: generatedNews.filter(n => n.source === 'RSS Feed').length,
        xTrends: generatedNews.filter(n => n.source.startsWith('X Trend')).length
      },
      news: generatedNews,
      skipped: skippedCount,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('News bot error:', error)
    return NextResponse.json({
      success: false,
      message: 'Haber robotu hatası',
      error: error.message
    }, { status: 500 })
  }
}

// GET - Bot durumunu kontrol et
export async function GET() {
  const hasGeminiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here'
  
  await connectDB()
  const recentBotNews = await News.find()
    .populate('author', 'name email')
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title status createdAt author')

  const botNews = recentBotNews.filter((n: any) => n.author?.email === 'newsbot@system.com')

  return NextResponse.json({
    status: 'active',
    hasGeminiKey,
    botNewsCount: botNews.length,
    recentNews: botNews,
    message: hasGeminiKey 
      ? 'Haber robotu hazır! POST isteği gönderin.' 
      : 'Gemini API key gerekli'
  })
}