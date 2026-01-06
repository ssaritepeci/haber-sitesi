import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import connectDB from '@/lib/mongodb'
import News from '@/models/News'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Mesaj gerekli' },
        { status: 400 }
      )
    }

    // OpenAI API key kontrolü
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
      return NextResponse.json({
        response: "Merhaba! Ben AI Haber Asistanınızım. Şu anda OpenAI API key yapılandırılmadığı için demo modunda çalışıyorum. OpenAI API key eklemek için .env.local dosyasına OPENAI_API_KEY değişkenini ekleyin. Şimdilik size yardımcı olmaya çalışacağım!\n\nSorabileceğiniz sorular:\n- Son haberler neler?\n- Ekonomi haberleri göster\n- Spor kategorisindeki haberler\n- En çok okunan haberler"
      })
    }

    // Veritabanından haberleri çek
    await connectDB()
    const recentNews = await News.find({ status: 'published' })
      .populate('category', 'name')
      .sort({ publishedAt: -1 })
      .limit(10)
      .select('title excerpt category publishedAt viewCount')

    // Haberleri context olarak hazırla
    const newsContext = recentNews.map((news: any) => ({
      title: news.title,
      excerpt: news.excerpt,
      category: news.category?.name || 'Genel',
      date: new Date(news.publishedAt).toLocaleDateString('tr-TR'),
      views: news.viewCount
    }))

    // OpenAI'ya gönder
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Sen bir Türk haber sitesinin yardımcı asistanısın. İsmin "Haber Asistanı". Kullanıcılara haberleri bulmakta, kategorilere göre filtrelemekte ve haber özetleri vermekte yardımcı oluyorsun. Her zaman Türkçe yanıt ver, kibar ve profesyonel ol.

Mevcut haberler:
${JSON.stringify(newsContext, null, 2)}

Bu haberler hakkında sorular cevaplayabilir, kategori bazlı öneriler yapabilir ve genel haber sitesi hakkında bilgi verebilirsin.`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message?.content || 'Üzgünüm, yanıt oluşturamadım.'

    return NextResponse.json({ response })

  } catch (error: any) {
    console.error('Chat API error:', error)
    
    // OpenAI API hatası için özel mesaj
    if (error?.status === 401) {
      return NextResponse.json({
        response: "OpenAI API key geçersiz. Lütfen .env.local dosyasında OPENAI_API_KEY değişkenini kontrol edin ve geçerli bir API key girin."
      })
    }

    return NextResponse.json(
      { error: 'Bir hata oluştu', details: error.message },
      { status: 500 }
    )
  }
}

// GET endpoint - Chatbot durumunu kontrol et
export async function GET() {
  const hasApiKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here'
  
  return NextResponse.json({
    status: 'active',
    hasApiKey,
    message: hasApiKey ? 'Chatbot hazır' : 'OpenAI API key yapılandırılmamış - Demo modu aktif'
  })
}