const cron = require('node-cron')

console.log('🤖 Haber Robotu Başlatılıyor...')

// Her 30 dakikada bir çalış
cron.schedule('*/30 * * * *', async () => {
  const now = new Date().toLocaleString('tr-TR')
  console.log(`\n[${now}] 📰 Haber robotu çalışıyor...`)
  
  try {
    const response = await fetch('http://localhost:3000/api/news-bot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    
    if (data.success) {
      console.log(`✅ ${data.message}`)
      if (data.news && data.news.length > 0) {
        console.log('📰 Oluşturulan haberler:')
        data.news.forEach((news, index) => {
          console.log(`   ${index + 1}. ${news.title} (${news.category})`)
        })
      }
      if (data.skipped > 0) {
        console.log(`⏭️  ${data.skipped} haber atlandı (duplicate veya hata)`)
      }
    } else {
      console.error(`❌ Hata: ${data.message}`)
    }
  } catch (error) {
    console.error('❌ Robot hatası:', error.message)
  }
})

console.log('✅ Haber robotu aktif!')
console.log('⏰ Her 30 dakikada otomatik haber oluşturulacak')
console.log('🌐 Sunucu: http://localhost:3000/api/news-bot')
console.log('\nManuel test için: POST http://localhost:3000/api/news-bot')
console.log('Durum kontrolü: GET http://localhost:3000/api/news-bot\n')