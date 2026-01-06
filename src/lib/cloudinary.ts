import { v2 as cloudinary } from 'cloudinary'

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your-api-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your-api-secret'
})

export default cloudinary

// Görsel yükleme fonksiyonu
export async function uploadImage(imageUrl: string, folder: string = 'haber-sitesi') {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: folder,
      transformation: [
        { width: 800, height: 600, crop: 'fill' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    })
    
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    }
  } catch (error: any) {
    console.error('Cloudinary upload error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Görsel silme fonksiyonu
export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return {
      success: true,
      result
    }
  } catch (error: any) {
    console.error('Cloudinary delete error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
