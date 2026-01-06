# Haber Sitesi ve Editör Paneli

Modern, tam özellikli bir haber sitesi ve editör paneli projesi. Next.js 14+, MongoDB ve TypeScript kullanılarak geliştirilmiştir.

## 🚀 Özellikler

### Kullanıcı Sitesi
- ✅ Modern ve responsive tasarım
- ✅ Ana sayfa ile öne çıkan haberler
- ✅ Haber detay sayfaları
- ✅ Kategori bazlı haber listeleme
- ✅ Haber arama özelliği
- ✅ Görüntülenme sayacı

### Editör Paneli
- ✅ Güvenli giriş sistemi (JWT)
- ✅ Dashboard ile istatistikler
- ✅ Haber ekleme, düzenleme, silme (CRUD)
- ✅ Kategori yönetimi
- ✅ Taslak ve yayınlanmış haber durumları
- ✅ Görsel yükleme desteği
- ✅ Etiket sistemi

### 🤖 AI-Powered Haber Robotu
- ✅ **RSS Feed'lerden Otomatik Haber:** Anadolu Ajansı'ndan haber çekme
- ✅ **X (Twitter) Trendleri:** Türkiye'deki gündem trendlerini tespit etme
- ✅ **Gemini AI ile Haber Yazma:** Tamamen özgün haber içeriği oluşturma
- ✅ **Otomatik Yayınlama:** Haberler doğrudan yayınlanıyor
- ✅ **Duplicate Kontrol:** Aynı haberin tekrarlanmasını önleme
- ✅ **Zamanlı Çalışma:** Her 30 dakikada otomatik çalışma

## 🛠️ Teknolojiler

- **Framework:** Next.js 14+ (App Router)
- **Dil:** TypeScript
- **Veritabanı:** MongoDB + Mongoose
- **Kimlik Doğrulama:** JWT (JSON Web Token)
- **Stil:** Tailwind CSS
- **AI Motor:** Google Gemini (Haber Yazımı)
- **Web Scraping:** Axios, Cheerio (X Trendleri)
- **Paket Yöneticisi:** npm

## 📋 Gereksinimler

- Node.js 18+ 
- MongoDB (yerel veya Atlas)
- npm veya yarn

## 🔧 Kurulum

1. **Projeyi klonlayın:**
```bash
git clone <repository-url>
cd haber-sitesi
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Ortam değişkenlerini yapılandırın:**
```bash
# .env.local dosyasını oluşturun
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin:
```env
MONGODB_URI=mongodb://localhost:27017/haber-sitesi
JWT_SECRET=your-super-secret-jwt-key
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# Google Gemini API (Haber Robotu için - GEREKLI)
GEMINI_API_KEY=your-google-gemini-api-key

# (Opsiyonel) Cloudinary (Görsel yükleme için)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**API Key Almak İçin:**
- [Google Gemini API](https://makersuite.google.com/app/apikey) - Ücretsiz
- [Cloudinary](https://cloudinary.com/) - Ücretsiz hesap (opsiyonel)

4. **MongoDB'yi başlatın:**
```bash
# Yerel MongoDB kullanıyorsanız
mongod
```

5. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

6. **Tarayıcınızda açın:**
```
http://localhost:3000
```

## 🤖 Haber Robotu Kullanımı

### Otomatik Haber Oluşturma

Haber robotu **her 30 dakikada bir** otomatik olarak çalışır ve aşağıdakı kaynaklardan haber yazarak yayınlar:

1. **RSS Feeds** - Anadolu Ajansı'ndan (Genel, Ekonomi, Spor)
2. **X Trendleri** - Türkiye'de gündem olan konular

### Manuel Test

```bash
# Robotu manuel olarak tetikle
curl -X POST http://localhost:3000/api/news-bot

# Veya script ile
npm run news-bot

# Sistemi test et
npm run test-x-bot
```

### Çıktı Örneği

Robotu çalıştırdığında, aşağıdakine benzer bir sonuç döner:

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
    }
  ]
}
```

### Detaylı Dokümantasyon

Haber robotu hakkında daha fazla bilgi için: [`X-TRENDLER-HABER-ROBOTU.md`](./X-TRENDLER-HABER-ROBOTU.md)

---

## 📊 Veritabanı Seed (İlk Veriler)

Projeyi test etmek için örnek veriler eklemek isterseniz:

1. MongoDB'ye bağlanın
2. Aşağıdaki komutları çalıştırın:

```javascript
// Kategoriler oluştur
use haber-sitesi

db.categories.insertMany([
  { name: "Politika", slug: "politika", isActive: true },
  { name: "Ekonomi", slug: "ekonomi", isActive: true },
  { name: "Spor", slug: "spor", isActive: true },
  { name: "Teknoloji", slug: "teknoloji", isActive: true },
  { name: "Kültür-Sanat", slug: "kultur-sanat", isActive: true }
])

// Test editör hesabı oluştur
db.users.insertOne({
  email: "editor@example.com",
  password: "$2a$10$8K1p/a0dL3cqKxHXJFqKKe8Q9hG3tX1l8r2X7F4w8T9y6K5L3m4N2", // 123456
  name: "Test Editör",
  role: "editor",
  isActive: true
})
```

## 👤 Giriş Bilgileri

**Editör Paneli:** `http://localhost:3000/editor/login`

```
Email: editor@example.com
Şifre: 123456
```

## 📁 Proje Yapısı

```
haber-sitesi/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/         # Kimlik doğrulama
│   │   │   ├── news/         # Haber CRUD
│   │   │   └── categories/   # Kategori yönetimi
│   │   ├── editor/           # Editör paneli sayfaları
│   │   │   ├── login/        # Giriş sayfası
│   │   │   ├── dashboard/    # Dashboard
│   │   │   └── news/         # Haber ekleme/düzenleme
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Ana sayfa
│   │   └── globals.css       # Global stiller
│   ├── lib/                  # Yardımcı kütüphaneler
│   │   └── mongodb.ts        # MongoDB bağlantısı
│   └── models/               # Mongoose modelleri
│       ├── User.ts           # Kullanıcı modeli
│       ├── News.ts           # Haber modeli
│       └── Category.ts       # Kategori modeli
├── public/                   # Statik dosyalar
├── .env.local               # Ortam değişkenleri
├── next.config.js           # Next.js yapılandırması
├── tailwind.config.js       # Tailwind yapılandırması
└── tsconfig.json            # TypeScript yapılandırması
```

## 🎯 API Endpoints

### Kimlik Doğrulama
- `POST /api/auth/login` - Editör girişi

### Haberler
- `GET /api/news` - Tüm haberleri listele
- `GET /api/news/:id` - Tek haber detayı
- `POST /api/news` - Yeni haber oluştur (Auth gerekli)
- `PUT /api/news/:id` - Haber güncelle (Auth gerekli)
- `DELETE /api/news/:id` - Haber sil (Auth gerekli)

### Kategoriler
- `GET /api/categories` - Tüm kategorileri listele
- `POST /api/categories` - Yeni kategori oluştur

## 🚀 Deployment

### Vercel'e Deploy
```bash
npm run build
vercel --prod
```

### MongoDB Atlas Kullanımı
1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) hesabı oluşturun
2. Cluster oluşturun
3. Connection string'i `.env.local` dosyasına ekleyin
4. IP whitelist'e `0.0.0.0/0` ekleyin (production için güvenlik ayarları yapın)

## 🔒 Güvenlik Notları

- **Üretim ortamında:**
  - `.env.local` dosyasını kesinlikle commit etmeyin
  - `JWT_SECRET` ve `NEXTAUTH_SECRET` değerlerini güçlü rastgele değerlerle değiştirin
  - MongoDB bağlantı bilgilerini güvenli tutun
  - CORS ayarlarını yapılandırın
  - Rate limiting ekleyin

## 📝 Yapılacaklar

- [ ] Resim yükleme servisi (Cloudinary entegrasyonu)
- [ ] Yorum sistemi
- [ ] Sosyal medya paylaşım butonları
- [ ] SEO optimizasyonları
- [ ] Site haritası (sitemap.xml)
- [ ] RSS feed
- [ ] Email bildirimleri
- [ ] İki faktörlü kimlik doğrulama
- [ ] Admin panel (editörleri yönetme)
- [ ] Gelişmiş arama ve filtreleme

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Sorularınız için issue açabilirsiniz.

---

**Not:** Bu proje eğitim ve geliştirme amaçlıdır. Üretim ortamında kullanmadan önce güvenlik testleri yapın ve gerekli optimizasyonları uygulayın.