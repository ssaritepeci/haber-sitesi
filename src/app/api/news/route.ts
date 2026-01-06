import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import News from '@/models/News'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// GET - Tüm haberleri listele
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    let query: any = {}
    
    if (status) {
      query.status = status
    }
    
    if (category) {
      query.category = category
    }

    const news = await News.find(query)
      .populate('category', 'name slug')
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)

    return NextResponse.json({ 
      success: true,
      news 
    })

  } catch (error) {
    console.error('Get news error:', error)
    return NextResponse.json(
      { message: 'Haberler yüklenemedi' },
      { status: 500 }
    )
  }
}

// POST - Yeni haber oluştur
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    // Token kontrolü
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    let decoded: any
    
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (err) {
      return NextResponse.json(
        { message: 'Geçersiz token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, content, excerpt, category, tags, status, featuredImage } = body

    // Slug oluştur
    const slug = title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Yeni haber oluştur
    const news = await News.create({
      title,
      slug: `${slug}-${Date.now()}`,
      content,
      excerpt: excerpt || content.substring(0, 200),
      category,
      author: decoded.userId,
      tags,
      status: status || 'draft',
      featuredImage,
    })

    const populatedNews = await News.findById(news._id)
      .populate('category', 'name slug')
      .populate('author', 'name email')

    return NextResponse.json({
      success: true,
      message: 'Haber başarıyla oluşturuldu',
      news: populatedNews
    }, { status: 201 })

  } catch (error: any) {
    console.error('Create news error:', error)
    return NextResponse.json(
      { message: error.message || 'Haber oluşturulamadı' },
      { status: 500 }
    )
  }
}