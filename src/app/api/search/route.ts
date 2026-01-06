import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import News from '@/models/News'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ 
        success: false, 
        message: 'Arama terimi en az 2 karakter olmalıdır' 
      }, { status: 400 })
    }

    await connectDB()

    // Başlık ve içerikte arama yap
    const news = await News.find({
      status: 'published',
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { excerpt: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    })
      .populate('category')
      .sort({ publishedAt: -1 })
      .limit(50)
      .lean()

    return NextResponse.json({
      success: true,
      query,
      count: news.length,
      results: news
    })

  } catch (error: any) {
    console.error('Search error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Arama sırasında bir hata oluştu',
      error: error.message 
    }, { status: 500 })
  }
}
