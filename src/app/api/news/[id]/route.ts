import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import News from '@/models/News'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET - Tek haber getir
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectDB()
    const { id } = await params
    
    const news = await News.findById(id)
      .populate('category', 'name slug')
      .populate('author', 'name email')

    if (!news) {
      return NextResponse.json(
        { message: 'Haber bulunamadı' },
        { status: 404 }
      )
    }

    // Görüntülenme sayısını artır
    news.viewCount += 1
    await news.save()

    return NextResponse.json({ 
      success: true,
      news 
    })

  } catch (error) {
    console.error('Get news error:', error)
    return NextResponse.json(
      { message: 'Haber yüklenemedi' },
      { status: 500 }
    )
  }
}

// PUT - Haber güncelle
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectDB()
    const { id } = await params
    
    // Token kontrolü
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    
    try {
      jwt.verify(token, JWT_SECRET)
    } catch (err) {
      return NextResponse.json(
        { message: 'Geçersiz token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    const news = await News.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate('category', 'name slug')
      .populate('author', 'name email')

    if (!news) {
      return NextResponse.json(
        { message: 'Haber bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Haber güncellendi',
      news
    })

  } catch (error: any) {
    console.error('Update news error:', error)
    return NextResponse.json(
      { message: error.message || 'Haber güncellenemedi' },
      { status: 500 }
    )
  }
}

// DELETE - Haber sil
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectDB()
    const { id } = await params
    
    // Token kontrolü
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    
    try {
      jwt.verify(token, JWT_SECRET)
    } catch (err) {
      return NextResponse.json(
        { message: 'Geçersiz token' },
        { status: 401 }
      )
    }

    const news = await News.findByIdAndDelete(id)

    if (!news) {
      return NextResponse.json(
        { message: 'Haber bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Haber silindi'
    })

  } catch (error) {
    console.error('Delete news error:', error)
    return NextResponse.json(
      { message: 'Haber silinemedi' },
      { status: 500 }
    )
  }
}