# 🤖 Otomatik Haber Robotu Kurulum Kılavuzu

## 🚀 Özellikler

- ✅ **Otomatik Haber Oluşturma:** RSS feedlerinden haberleri tarar
- ✅ **Google Gemini AI:** Ücretsiz AI ile özgün içerik üretimi
- ✅ **Her 30 Dakikada:** Otomatik olarak yeni haberler ekler
- ✅ **Doğrudan Yayın:** Editör onayı olmadan otomatik yayınlar
- ✅ **Duplicate Kontrol:** Aynı haberleri tekrar yazmaz
- ✅ **Çoklu Kaynak:** TRT, NTV, Habertürk RSS feedleri

## 📋 Kurulum Adımları

### 1. Google Gemini API Key Alın (ÜCRETSİZ!)

1. https://makersuite.google.com/app/apikey adresine gidin
2. Google hesabınızla giriş yapın
3. **"Get API Key"** butonuna tıklayın
4. **"Create API key in new project"** seçin
5. API Key'i kopyalayın

### 2. API Key'i Ekleyin

`.env.local` dosyasını açın ve ekleyin:

\`\`\`bash
GEMINI_API_KEY=AIzaSy... (sizin key'iniz)
\`\`\`

### 3. Sunucuyu Başlatın

\`\`\`bash
# Terminal 1: Next.js sunucusu
npm run dev

# Terminal 2: Haber robotu (yeni terminal açın)
npm run news-bot
\`\`\`

## 🎯 Kullanım

### Otomatik Mod (Önerilen)
\`\`\`bash
npm run news-bot
\`\`\`
- Her 30 dakikada otomatik haber oluşturur
- Konsola log basar
- Ctrl+C ile durdurun

### Manuel Test
\`\`\`bash
# POST isteği gönderin
curl -X POST http://localhost:3000/api/news-bot

# Veya tarayıcıda Postman/Thunder Client ile test edin
\`\`\`

### Durum Kontrolü
\`\`\`bash
# GET isteği
curl http://localhost:3000/api/news-bot
\`\`\`

## 📊 Robot Nasıl Çalışır?

\`\`\`
1. RSS Feedleri Tara
   ↓
2. Son 3 haberi al
   ↓
3. Duplicate kontrolü
   ↓
4. Google Gemini AI'ya gönder
   ↓
5. Özgün haber oluştur
   ↓
6. Veritabanına kaydet
   ↓
7. OTOMATIK YAYINLA! 🚀
\`\`\`

## 🎛️ Özelleştirme

### RSS Kaynakları Değiştir

`src/app/api/news-bot/route.ts` dosyasında:

\`\`\`typescript
const RSS_FEEDS = [
  { url: 'https://www.trthaber.com/sondakika.rss', category: 'Genel' },
  { url: 'YOUR_RSS_URL', category: 'YOUR_CATEGORY' },
]
\`\`\`

### Zamanlama Değiştir

`scripts/news-bot.js` dosyasında:

\`\`\`javascript
// Her 30 dakika: '*/30 * * * *'
// Her saat: '0 * * * *'
// Her gün saat 9: '0 9 * * *'
cron.schedule('*/30 * * * *', async () => {
  // ...
})
\`\`\`

### Haber Sayısı Ayarla

`src/app/api/news-bot/route.ts` dosyasında:

\`\`\`typescript
// Son 3 haber yerine 5 haber
const recentItems = feed.items.slice(0, 5)
\`\`\`

## ⚙️ Production'a Alma

### Vercel Deploy

\`\`\`bash
# Environment variables ekleyin
GEMINI_API_KEY=your-key
MONGODB_URI=your-mongodb-uri

# Vercel cron jobs kullanın
# vercel.json oluşturun
\`\`\`

### vercel.json Örneği:

\`\`\`json
{
  "crons": [{
    "path": "/api/news-bot",
    "schedule": "0,30 * * * *"
  }]
}
\`\`\`

## 🔍 Sorun Giderme

### Haber Oluşturulmuyor
- Gemini API key'i kontrol edin
- RSS feedleri erişilebilir mi test edin
- Konsol loglarına bakın

### Duplicate Haberler
- Duplicate kontrolü çalışıyor
- Farklı RSS feedleri ekleyin

### AI Yanıt Vermiyor
- API limit'e ulaşmış olabilir (ücretsiz: 60 req/min)
- Biraz bekleyip tekrar deneyin

## 📈 İstatistikler

Dashboard'da robot tarafından oluşturulan haberleri görebilirsiniz:
- Yazar: "AI Haber Robotu"
- Durum: Otomatik "published"

## ⚠️ Önemli Notlar

1. **Etik Kullanım:** Haberler AI tarafından oluşturulur, gerçekleri doğrulayın
2. **Kaynak Belirt:** Her haberin kaynağı belirtilmeli
3. **İnsan Kontrolü:** Düzenli olarak robot haberlerini kontrol edin
4. **Rate Limit:** Gemini ücretsiz: 60 istek/dakika

## 🎉 Başarı!

Robot çalışıyorsa:
\`\`\`
✅ Haber robotu aktif!
⏰ Her 30 dakikada otomatik haber oluşturulacak
\`\`\`

http://localhost:3000 adresinde yeni haberler görünmeye başlayacak!

---

**Oluşturulma Tarihi:** 2025-10-20
**Teknoloji:** Google Gemini AI (Ücretsiz)
**Lisans:** MIT