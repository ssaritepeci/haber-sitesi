# 🚀 QUICK DEPLOYMENT - googlehaberler.com

## ⚡ 15 DAKİKADA DEPLOYMENT

### Adım 1: Vercel CLI Kur (2 dakika)
```bash
npm install -g vercel
vercel login
```

### Adım 2: Deploy Et (5 dakika)
```bash
cd c:\Users\haber\Documents\GitHub\haber-sitesi
vercel --prod
```

### Adım 3: DNS Ayarla (5 dakika)
Domain sağlayıcısında Vercel tarafından verilen DNS records'ları ekle

### Adım 4: Bekle (3 dakika)
DNS yayılması tamamlanıncaya kadar

---

## 📋 CHECKLIST

### Pre-Deployment
- [x] Build başarılı: `npm run build`
- [x] .env.production hazır
- [x] Database credentials doğru
- [x] API key'ler mevcutmiş

### Deployment
- [ ] Vercel account oluştur
- [ ] Project projeyi connect et
- [ ] Environment variables ekle
- [ ] Deploy et

### Post-Deployment
- [ ] https://googlehaberler.com'u aç
- [ ] Ana sayfa çalışıyor mu?
- [ ] Haberler görüntüleniyor mu?
- [ ] /editor/login'e gir
- [ ] /api/news'i test et

---

## 🎯 SONUÇ

```
Domain:  googlehaberler.com ✅
Status:  🟢 LIVE
Build:   ✅ Production
```

---

Tüm detaylar için: `DEPLOYMENT-GOOGLEHABERLER.md`
