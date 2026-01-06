const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/haber-sitesi';

// Şemalar
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  name: String,
  role: String,
  isActive: Boolean,
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  isActive: Boolean,
}, { timestamps: true });

const NewsSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  excerpt: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  featuredImage: String,
  tags: [String],
  status: String,
  viewCount: Number,
  publishedAt: Date,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Category = mongoose.model('Category', CategorySchema);
const News = mongoose.model('News', NewsSchema);

async function seed() {
  try {
    console.log('MongoDB bağlantısı kuruluyor...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ MongoDB bağlantısı başarılı');

    // Mevcut verileri temizle
    console.log('\nMevcut veriler temizleniyor...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await News.deleteMany({});
    console.log('✓ Veriler temizlendi');

    // Test kullanıcısı oluştur
    console.log('\nTest kullanıcısı oluşturuluyor...');
    const hashedPassword = await bcrypt.hash('123456', 10);
    const user = await User.create({
      username: 'editor',
      email: 'editor@example.com',
      password: hashedPassword,
      name: 'Test Editör',
      role: 'editor',
      isActive: true,
    });
    console.log('✓ Test kullanıcısı oluşturuldu');
    console.log('  Email: editor@example.com');
    console.log('  Şifre: 123456');

    // Kategoriler oluştur
    console.log('\nKategoriler oluşturuluyor...');
    const categories = await Category.insertMany([
      { name: 'Politika', slug: 'politika', description: 'Siyasi haberler', isActive: true },
      { name: 'Ekonomi', slug: 'ekonomi', description: 'Ekonomi haberleri', isActive: true },
      { name: 'Spor', slug: 'spor', description: 'Spor haberleri', isActive: true },
      { name: 'Teknoloji', slug: 'teknoloji', description: 'Teknoloji haberleri', isActive: true },
      { name: 'Kültür-Sanat', slug: 'kultur-sanat', description: 'Kültür ve sanat haberleri', isActive: true },
      { name: 'Sağlık', slug: 'saglik', description: 'Sağlık haberleri', isActive: true },
    ]);
    console.log(`✓ ${categories.length} kategori oluşturuldu`);

    // Örnek haberler oluştur
    console.log('\nÖrnek haberler oluşturuluyor...');
    const sampleNews = [
      {
        title: 'Yeni Teknoloji Trendleri 2024',
        slug: 'yeni-teknoloji-trendleri-2024',
        content: 'Teknoloji dünyasında 2024 yılı birçok yenilik getirmeye hazırlanıyor. Yapay zeka, kuantum bilgisayarlar ve yeşil teknolojiler öne çıkan konular arasında. Uzmanlar, bu yılın teknoloji sektörü için dönüm noktası olacağını düşünüyor. Özellikle yapay zeka alanındaki gelişmeler, günlük hayatımızı derinden etkileyecek.',
        excerpt: 'Teknoloji dünyasında 2024 yılı birçok yenilik getirmeye hazırlanıyor.',
        category: categories.find(c => c.slug === 'teknoloji')._id,
        author: user._id,
        tags: ['teknoloji', 'yapay zeka', '2024'],
        status: 'published',
        viewCount: 156,
        publishedAt: new Date(),
      },
      {
        title: 'Ekonomide Yeni Dönem',
        slug: 'ekonomide-yeni-donem',
        content: 'Ekonomi uzmanları, küresel ekonomide yeni bir dönemin başladığını belirtiyor. Merkez bankaları politikalarında değişikliğe giderken, yatırımcılar da stratejilerini gözden geçiriyor. Enflasyon ve faiz oranları konusunda önemli gelişmeler yaşanıyor.',
        excerpt: 'Ekonomi uzmanları, küresel ekonomide yeni bir dönemin başladığını belirtiyor.',
        category: categories.find(c => c.slug === 'ekonomi')._id,
        author: user._id,
        tags: ['ekonomi', 'finans', 'yatırım'],
        status: 'published',
        viewCount: 98,
        publishedAt: new Date(),
      },
      {
        title: 'Sporda Tarihi Başarı',
        slug: 'sporda-tarihi-basari',
        content: 'Milli takımımız tarihi bir başarıya imza attı. Çeyrek final maçında rakibini yenen takım, büyük bir coşkuyla yarı finale yükseldi. Teknik direktör ve oyuncular, bu başarının takım çalışmasının bir sonucu olduğunu vurguladı.',
        excerpt: 'Milli takımımız tarihi bir başarıya imza attı.',
        category: categories.find(c => c.slug === 'spor')._id,
        author: user._id,
        tags: ['spor', 'futbol', 'milli takım'],
        status: 'published',
        viewCount: 234,
        publishedAt: new Date(),
      },
      {
        title: 'Sağlıklı Yaşam İçin 10 Öneri',
        slug: 'saglikli-yasam-icin-10-oneri',
        content: 'Sağlıklı bir yaşam sürmek için uzmanlar 10 önemli öneri sunuyor. Düzenli egzersiz, dengeli beslenme ve yeterli uyku bunların başında geliyor. Stres yönetimi ve düzenli sağlık kontrolleri de ihmal edilmemesi gereken konular arasında.',
        excerpt: 'Sağlıklı bir yaşam sürmek için uzmanlar 10 önemli öneri sunuyor.',
        category: categories.find(c => c.slug === 'saglik')._id,
        author: user._id,
        tags: ['sağlık', 'yaşam', 'beslenme'],
        status: 'published',
        viewCount: 187,
        publishedAt: new Date(),
      },
      {
        title: 'Yeni Sanat Sergisi Açıldı',
        slug: 'yeni-sanat-sergisi-acildi',
        content: 'Ünlü sanatçının yeni sergisi sanatseverlerle buluştu. Sergide, sanatçının son dönem çalışmaları yer alıyor. Ziyaretçiler, eserlerin derinliğini ve anlatımını çok beğendiklerini ifade etti. Sergi önümüzdeki ay sonuna kadar açık kalacak.',
        excerpt: 'Ünlü sanatçının yeni sergisi sanatseverlerle buluştu.',
        category: categories.find(c => c.slug === 'kultur-sanat')._id,
        author: user._id,
        tags: ['sanat', 'kültür', 'sergi'],
        status: 'published',
        viewCount: 76,
        publishedAt: new Date(),
      },
      {
        title: 'Taslak Haber - Yakında Yayınlanacak',
        slug: 'taslak-haber-yakinda-yayinlanacak',
        content: 'Bu bir taslak haberdir. İçerik henüz tamamlanmadı ve editör onayı bekleniyor. Yayınlanmadan önce düzenlemeler yapılacak.',
        excerpt: 'Bu bir taslak haberdir.',
        category: categories.find(c => c.slug === 'politika')._id,
        author: user._id,
        tags: ['taslak'],
        status: 'draft',
        viewCount: 0,
      },
    ];

    await News.insertMany(sampleNews);
    console.log(`✓ ${sampleNews.length} örnek haber oluşturuldu`);

    console.log('\n✅ Seed işlemi başarıyla tamamlandı!');
    console.log('\n📝 Özet:');
    console.log(`   Kullanıcılar: ${await User.countDocuments()}`);
    console.log(`   Kategoriler: ${await Category.countDocuments()}`);
    console.log(`   Haberler: ${await News.countDocuments()}`);
    console.log(`   - Yayında: ${await News.countDocuments({ status: 'published' })}`);
    console.log(`   - Taslak: ${await News.countDocuments({ status: 'draft' })}`);

    console.log('\n🚀 Projeyi başlatmak için: npm run dev');
    console.log('🌐 Tarayıcıda açmak için: http://localhost:3000');
    console.log('🔐 Editör paneli: http://localhost:3000/editor/login');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✓ MongoDB bağlantısı kapatıldı');
  }
}

seed();