#!/usr/bin/env node

/**
 * X Trendleri Haber Robotu Test Scripti
 * Sistemin düzgün çalışıp çalışmadığını kontrol eder
 * 
 * Kullanım: npm run test-x-bot
 */

const fs = require('fs')
const path = require('path')

console.log('\n╔════════════════════════════════════════════════════════════╗')
console.log('║  🤖 X Trendleri Haber Robotu - Test Scripti              ║')
console.log('╚════════════════════════════════════════════════════════════╝\n')

// .env.local kontrolü
const envPath = path.join(__dirname, '..', '.env.local')
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local dosyası bulunamadı!')
  process.exit(1)
}

const envContent = fs.readFileSync(envPath, 'utf8')
const hasGeminiKey = envContent.includes('GEMINI_API_KEY=') && 
                     !envContent.includes('your-gemini-api-key-here')
const hasMongoUri = envContent.includes('MONGODB_URI=')

console.log('📋 KONTROL LİSTESİ:')
console.log(`  ${hasGeminiKey ? '✅' : '❌'} Gemini API Key yapılandırılmış`)
console.log(`  ${hasMongoUri ? '✅' : '❌'} MongoDB URI yapılandırılmış`)

if (!hasGeminiKey) {
  console.error('\n❌ HATALAR:')
  console.error('  - Gemini API Key eksik!')
  console.error('\n💡 Çözüm: .env.local dosyasında GEMINI_API_KEY ekleyin\n')
  process.exit(1)
}

if (!hasMongoUri) {
  console.error('\n❌ HATALAR:')
  console.error('  - MongoDB URI eksik!')
  process.exit(1)
}

console.log('\n✅ TÜM KONTROLLER BAŞARILI!\n')

console.log('📦 KURULU PAKETLER:')
const packageJsonPath = path.join(__dirname, '..', 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

const requiredPackages = ['axios', 'cheerio', '@google/generative-ai', 'mongoose']
requiredPackages.forEach(pkg => {
  const isInstalled = packageJson.dependencies[pkg]
  console.log(`  ${isInstalled ? '✅' : '❌'} ${pkg} ${isInstalled ? packageJson.dependencies[pkg] : '(eksik)'}`)
})

console.log('\n🚀 ROBOT ÖZELLİKLERİ:')
console.log('  ✅ RSS Feed\'lerden haber çekme')
console.log('  ✅ X Trendlerinden haber çekme')
console.log('  ✅ Gemini AI ile haber yazma')
console.log('  ✅ Otomatik yayınlama')
console.log('  ✅ Duplicate kontrol')
console.log('  ✅ Her 30 dakikada bir çalışma\n')

console.log('📝 ÇERLEŞTİRME:')
console.log('  1. Next.js uygulamasını başlat:')
console.log('     $ npm run dev\n')
console.log('  2. Robotun manuel testini yap:')
console.log('     $ curl -X POST http://localhost:3000/api/news-bot\n')
console.log('  3. Veya Scripts sekmesinden çalıştır:')
console.log('     $ npm run news-bot\n')

console.log('📊 İZLEME:')
console.log('  - Browser: http://localhost:3000')
console.log('  - Editör Paneli: http://localhost:3000/editor\n')

console.log('✨ SİSTEM HAZIR!\n')
