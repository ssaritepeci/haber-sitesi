import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Comment from '@/models/Comment'

export async function POST(request: NextRequest) {
  try {
    const { newsId, author, email, content } = await request.json()

    if (!newsId || !author || !email || !content) {
      return NextResponse.json({ 
        success: false, 
        message: 'Tüm alanlar gereklidir' 
      }, { status: 400 })
    }

    await connectDB()

    const comment = await Comment.create({
      news: newsId,
      author,
      email,
      content,
      status: 'pending'
    })

    return NextResponse.json({
      success: true,
      message: 'Yorumunuz onay bekliyor',
      comment
    })

  } catch (error: any) {
    console.error('Comment error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Yorum eklenirken hata oluştu',
      error: error.message 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const newsId = searchParams.get('newsId')

    if (!newsId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Haber ID gereklidir' 
      }, { status: 400 })
    }

    await connectDB()

    const comments = await Comment.find({ 
      news: newsId, 
      status: 'approved' 
    })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      comments
    })

  } catch (error: any) {
    console.error('Fetch comments error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Yorumlar alınırken hata oluştu',
      error: error.message 
    }, { status: 500 })
  }
}
