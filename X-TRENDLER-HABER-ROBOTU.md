# 🐦 X Trendleri Haber Robotu

## Genel Bakış

Bu sistem, **X (Twitter) üzerinde gündem olan trendleri** otomatik olarak algılayan ve **Google Gemini AI** kullanarak **tamamen özgün haberler** yazarak web sitenizde yayınlayan bir yapay zeka haber robotu'dur.

## ✨ Özellikler

### 1. **Dual Kaynak Sistemi**
- 📰 **RSS Feeds**: Anadolu Ajansı'ndan otomatik haber çekme (Genel, Ekonomi, Spor)
- 🐦 **X Trendleri**: Türkiye'de gündem olan top 10 trendin otomatik tespiti

### 2. **AI-Powered Haber Yazımı**
- 🤖 **Google Gemini 2.5 Flash** kullanarak:
  - Tamamen özgün başlık oluşturma
  - Profesyonel haber metni yazma (250-400 kelime)
  - Otomatik özet oluşturma
  - SEO uyumlu etiket önerme
  - Kategori tespiti

### 3. **Akıllı Yönetim**
- ✅ Duplicate kontrolü (24 saatlik pencere)
- ✅ Otomatik kategori yönetimi
- ✅ Doğrudan yayınlama (manuel onay gerekmez)
- ✅ Her 30 dakikada otomatik çalışma
- ✅ Hata yönetimi ve fallback mekanizmaları

## 🚀 Başlama

### 1. Uygulamayı Başlat

```bash
npm run dev
```

Tarayıcı açılacak: `http://localhost:3000`

### 2. Robotu Manuel Test Et

#### Seçenek A: cURL ile
```bash
curl -X POST http://localhost:3000/api/news-bot
```

#### Seçenek B: Browser'da
```
http://localhost:3000/api/news-bot
POST request gönderin
```

#### Seçenek C: Node Script ile
```bash
npm run news-bot
```

### 3. Sistem Kontrolü
```bash
npm run test-x-bot
```

## 📊 Sistem Mimarisi

```
┌─────────────────────────────────────────────────────┐
│         🤖 HABER ROBOTU (Her 30 dakika)            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📰 RSS FEEDS                │  🐦 X TRENDLERİ     │
│  ─────────────────           ─────────────────      │
│  • AA.com.tr (Genel)         • Getdaytrends.com    │
│  • AA.com.tr (Ekonomi)       • Top 10 Trend        │
│  • AA.com.tr (Spor)          • Türkiye Merkezli    │
│                              • Sosyal Medya Kateg. │
│         │                              │            │
│         └──────────────┬───────────────┘            │
│                        │                            │
│                  🤖 GEMINI AI                       │
│               Haber Yazma Motoru                   │
│               (Özgün İçerik)                       │
│                        │                            │
│              ✅ Duplicate Kontrol                   │
│              ✅ Kategori Tespiti                    │
│              ✅ Etiket Önerme                       │
│                        │                            │
│                        ↓                            │
│              💾 MongoDB Veritabanı                 │
│                  (Published)                       │
│                        │                            │
│                        ↓                            │
│              📱 WEB SİTESİNDE YAYINLA               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 📁 Dosya Yapısı

```
src/
├── lib/
│   ├── twitter-scraper.ts      ← 🐦 X Trendleri Scraper
│   ├── mongodb.ts              ← Database Bağlantısı
│   └── cloudinary.ts           ← Görsel Yükleme
│
├── app/api/
│   ├── news-bot/
│   │   └── route.ts            ← 🤖 Ana Robot Motoru
│   ├── news/
│   │   └── route.ts            ← Haber CRUD
│   ├── categories/
│   │   └── route.ts            ← Kategori Yönetimi
│   └── ...
│
└── models/
    ├── News.ts                 ← Haber Şeması
    ├── Category.ts             ← Kategori Şeması
    └── ...

scripts/
├── news-bot.js                 ← 🤖 Cron Scheduler
├── test-x-bot.js               ← ✅ Test Script
└── seed.js                      ← 🌱 Veritabanı Başlatma
```

## 🔧 Teknik Detaylar

### Kullanılan Teknolojiler

| Teknoloji | Kullanım | 
|-----------|----------|
| **Cheerio** | X Trendleri Web Scraping |
| **Axios** | HTTP İstekleri |
| **Google Gemini AI** | Haber Yazma Motoru |
| **Mongoose** | MongoDB ORM |
| **Node-Cron** | Zamanlanan Görevler |

### X Trendleri Çekme

```typescript
// Herkese açık sitelerden trendler çekiliyor (API gerekmez!)
// Kaynaklar:
// 1. getdaytrends.com (Primary)
// 2. trending.co (Fallback)
// 3. Örnek trendler (Fallback)
```

### Haber Yazma Süreci

```typescript
// 1. Trend tespiti
const trends = await getTurkeyTrends(10)

// 2. Tweet verisi toplanması (örnek)
const tweets = await getTweetsForTrend(trendName)

// 3. AI Prompt oluşturma
const prompt = createNewsPrompt(trendName, tweets)

// 4. Gemini ile haber yazma
const news = await generateNewsFromXTrend(trendName)

// 5. Veritabanına kaydetme ve yayınlama
await News.create({...})
```

## 📊 Çıktı Örneği

```json
{
  "success": true,
  "message": "12 yeni haber otomatik oluşturuldu ve YAYINLANDI!",
  "summary": {
    "total": 12,
    "rssFeed": 5,
    "xTrends": 7
  },
  "news": [
    {
      "title": "Türkiye Ekonomisinde Yeni Dönem",
      "category": "Ekonomi",
      "source": "RSS Feed"
    },
    {
      "title": "X'te Viral Olan Konunun Detayları",
      "category": "Sosyal Medya",
      "source": "X Trend - 45,000 tweet"
    },
    ...
  ],
  "skipped": 3,
  "timestamp": "2026-01-06T14:30:00.000Z"
}
```

## 🛠️ Yapılandırma

### Environment Variables (.env.local)

```bash
# Gemini API (Gerekli)
GEMINI_API_KEY=AIzaSyDeeM8-BSmZtoRbd5g5swolWNmqpKRU-pY

# MongoDB (Gerekli)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# Diğer ayarlar (Varsayılan değerler vardır)
NEXTAUTH_SECRET=...
JWT_SECRET=...
```

### Robot Zamanlama

```javascript
// scripts/news-bot.js
// Her 30 dakikada bir çalıştırılır
cron.schedule('*/30 * * * *', async () => {
  // Robot kodu çalışır
})
```

### Özel Ayarlamalar

Robotun çalışma sıklığını veya trend sayısını değiştirmek için:

```typescript
// news-bot/route.ts

// Trend sayısını değiştir (şu an: 10)
const trends = await getTurkeyTrends(15) // 15 trend

// RSS feed'lerine yeni kaynak ekle
const RSS_FEEDS = [
  // ... mevcut feedler
  { url: 'https://example.com/rss', category: 'Teknoloji' }
]
```

## 📝 API Endpoints

### Robot Tetikleme

```bash
# Manuel robot çalıştırma
POST /api/news-bot

# Robot durumu kontrol
GET /api/news-bot
```

### Haberler

```bash
# Tüm haberleri listele
GET /api/news?status=published&limit=10

# Haber detayı
GET /api/news/[id]

# Editör panelinde haber yönetimi
POST/PUT/DELETE /api/news
```

## 🐛 Sorun Giderme

### "Gemini API key yapılandırılmamış" hatası

```bash
# Çözüm: .env.local'a ekleyin
GEMINI_API_KEY=AIzaSyDeeM8-BSmZtoRbd5g5swolWNmqpKRU-pY
```

### "MongoDB bağlantı hatası"

```bash
# Çözüm: MongoDB URI'nı kontrol edin
# .env.local'da doğru URI olması gerekiyor
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
```

### Trendler çekemiyor

```bash
# Fallback kaynakları otomatik devreye girer
# Veya varsayılan örnek trendler kullanılır
# Kontrol: npm run test-x-bot
```

## 📈 İzleme ve Analiz

### Dashboard'da Robotun Durumu

Editör panelinde robot tarafından yazılan haberler:
- 👤 Yazar: "AI Haber Robotu"
- 📧 E-mail: `newsbot@system.com`
- 🔖 Etiket: `trending`, `x`, `sosyal-medya`

### Log'ları İzle

```bash
# Next.js Server Output'unda görebilirsiniz:
# 🤖 Haber Robotu Başlatılıyor...
# 📰 RSS FEED'LERİ İŞLENİYOR...
# 🐦 X TRENDLERİ İŞLENİYOR...
# ✅ 12 yeni haber oluşturuldu
```

## ⚙️ İleri Ayarlamalar

### Gemini Model'i Değiştir

```typescript
// gemini-2.5-flash yerine başka model kullan
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-pro' // veya başka model
})
```

### Haber Türü Tespiti

```typescript
// AI'ya haber türü tespit ettirmek için prompt'u genişlet
category: parsed.category || 'Sosyal Medya'
```

### Sosyal Medya Entegrasyonu

Yazılan haberleri sosyal medyaya otomatik paylaşmak için:
```typescript
// Twitter/X, Facebook, LinkedIn API'leri eklenebilir
```

## 🔐 Güvenlik Notları

⚠️ **Önemli:**
- `GEMINI_API_KEY`'i asla GitHub'a commit'lemeyin
- `.env.local` dosyasını `.gitignore`'a ekleyin
- API key'lerinizi düzenli olarak değiştirin
- Staging ve Production ortamları için ayrı key'ler kullanın

## 📞 Destek

Sorunlar için:
1. `npm run test-x-bot` komutunu çalıştırın
2. Logs'ları kontrol edin
3. `.env.local` dosyasını doğrulayın
4. MongoDB bağlantısını test edin

## 🚀 Production Deployment

```bash
# Build
npm run build

# Start
npm start

# Robot cron job system'e ekleyin (Linux)
crontab -e
# */30 * * * * cd /path/to/app && npm run news-bot
```

---

**Geliştirici:** GitHub Copilot  
**Son Güncelleme:** 2026-01-06  
**Versiyon:** 2.0 (X Trendleri Desteğiyle)
