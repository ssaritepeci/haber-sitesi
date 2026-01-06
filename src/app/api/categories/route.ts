import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Category from '@/models/Category'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 })

    return NextResponse.json({ 
      success: true,
      categories 
    })

  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { message: 'Kategoriler yüklenemedi' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { name, description } = await request.json()

    // Slug oluştur
    const slug = name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const category = await Category.create({
      name,
      slug,
      description,
    })

    return NextResponse.json({
      success: true,
      message: 'Kategori oluşturuldu',
      category
    }, { status: 201 })

  } catch (error: any) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { message: error.message || 'Kategori oluşturulamadı' },
      { status: 500 }
    )
  }
}