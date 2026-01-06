import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Newsletter from '@/models/Newsletter'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Geçerli bir e-posta adresi girin' 
      }, { status: 400 })
    }

    await connectDB()

    const existing = await Newsletter.findOne({ email })
    if (existing) {
      return NextResponse.json({ 
        success: false, 
        message: 'Bu e-posta zaten kayıtlı' 
      }, { status: 400 })
    }

    await Newsletter.create({ email })

    return NextResponse.json({
      success: true,
      message: 'Bültene başarıyla abone oldunuz! 🎉'
    })

  } catch (error: any) {
    console.error('Newsletter error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Bir hata oluştu',
      error: error.message 
    }, { status: 500 })
  }
}
