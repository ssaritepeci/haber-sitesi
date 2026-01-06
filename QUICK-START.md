# 🚀 QUICK START - X Trendleri Haber Robotu

## ⚡ 2 Dakika İçinde Başlat

### 1️⃣ Uygulamayı Başlat
```bash
npm run dev
```
✅ Terminal'de `http://localhost:3000` göreceksiniz

### 2️⃣ Robotu Test Et (Yeni Terminal'de)
```bash
curl -X POST http://localhost:3000/api/news-bot
```

### 3️⃣ Sonucu Kontrol Et
- Browser'da `http://localhost:3000` açın
- Ana sayfada yeni haberler görülecek (AI tarafından yazılmış, X trendlerinden)
- `http://localhost:3000/editor` (şifre: `123456`)

---

## 📊 Ne Oldu?

```
X'teki Trendler   →  Trendleri Çektik
         ↓
  AI Anlayış      →  Gemini ile Özgün Haber Yazdık
         ↓
  Veritabanı      →  MongoDB'ye Kaydettik
         ↓
  Web Sitesi      →  Otomatik Yayınlandı ✅
```

---

## 🎯 Sistem Özellikleri

| Özellik | Durum |
|---------|-------|
| 🐦 X Trendleri | ✅ Aktif |
| 📰 RSS Feed'ler | ✅ Aktif |
| 🤖 Gemini AI | ✅ Yapılandırılı |
| 💾 MongoDB | ✅ Bağlantılı |
| ⏰ Otomatik Çalışma | ✅ Her 30 dakika |
| 🔍 Duplicate Kontrol | ✅ 24 saatlik |

---

## 📁 Dosyalar

Yeni Eklenenler:
- `src/lib/twitter-scraper.ts` - 🐦 X Trendleri
- `src/app/api/news-bot/route.ts` - 🤖 Robot (güncellenmiş)
- `X-TRENDLER-HABER-ROBOTU.md` - 📚 Detaylı Doküman
- `KURULUM-OZETI.js` - 📋 Bu Dosya

---

## 🆘 Sorun Giderme

| Sorun | Çözüm |
|-------|-------|
| "Gemini key yok" | `.env.local`'da `GEMINI_API_KEY` var mı kontrol et |
| "MongoDB hatası" | `.env.local`'da `MONGODB_URI` doğru mu kontrol et |
| Trendler çekemiyor | Fallback kaynakları devreye girer (otomatik) |

---

## 💡 İpuçları

- 🔍 Logs'ları görmek için: `npm run dev` terminal'ini izle
- 🧪 Sistem testi: `npm run test-x-bot`
- 📖 Detaylı bilgi: `X-TRENDLER-HABER-ROBOTU.md`

---

## 🎉 Başarı!

Sistemi başarıyla kurdum! X'teki gündem konularından otomatik haberler yazılıyor ve web sitenizde yayınlanıyor.

Sorularınız varsa: `X-TRENDLER-HABER-ROBOTU.md` dosyasını okuyun.
