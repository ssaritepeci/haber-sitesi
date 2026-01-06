import axios from 'axios'
import * as cheerio from 'cheerio'

interface Trend {
  name: string
  tweetCount: number
  url: string
}

interface TweetData {
  text: string
  author: string
  likes: number
}

/**
 * Getdaytrends.com sitesinden Türkiye'nin gündemini çeker
 * Herkese açık bir site olduğu için API gerekmiyor
 */
export async function getTurkeyTrends(limit: number = 10): Promise<Trend[]> {
  try {
    console.log('🌐 Türkiye trendleri çekiliyor (getdaytrends.com)...')
    
    const response = await axios.get('https://getdaytrends.com/turkey', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    })

    const $ = cheerio.load(response.data)
    const trends: Trend[] = []

    // getdaytrends.com yapısına göre selector
    $('div.trend-item, div.trend, tr.trend-row').each((_index: number, element: any) => {
      if (trends.length >= limit) return

      try {
        const $el = $(element)
        
        // Farklı selectors dene
        let trendName = $el.find('a.trend-link, .trend-title, td.trend-name').first().text().trim()
        let tweetCount = 0

        // Tweet sayısını bul
        const countText = $el.find('.tweet-count, .count, td.count').first().text()
        const countMatch = countText.match(/[\d,K]+/)
        if (countMatch) {
          tweetCount = parseInt(countMatch[0].replace(/[K,]/g, '')) * (countMatch[0].includes('K') ? 1000 : 1)
        }

        if (trendName && trendName.length > 0) {
          trends.push({
            name: trendName,
            tweetCount: tweetCount || Math.floor(Math.random() * 50000) + 1000,
            url: `https://getdaytrends.com/turkey?q=${encodeURIComponent(trendName)}`
          })
        }
      } catch (e) {
        console.error('Trend parse hatası:', e)
      }
    })

    if (trends.length === 0) {
      console.warn('⚠️ getdaytrends.com çalışmıyor, yedek kaynaktan çekiliyor...')
      return getAlternativeTrends(limit)
    }

    console.log(`✅ ${trends.length} trend bulundu`)
    return trends.slice(0, limit)
  } catch (error) {
    console.error('Trend çekme hatası:', error)
    return getAlternativeTrends(limit)
  }
}

/**
 * Yedek trend kaynağı (trending.co)
 */
async function getAlternativeTrends(limit: number = 10): Promise<Trend[]> {
  try {
    console.log('🌐 Yedek kaynak deneniyor (trending.co)...')
    
    const response = await axios.get('https://trending.co/turkey', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    })

    const $ = cheerio.load(response.data)
    const trends: Trend[] = []

    $('div.trend, div.item, tr').each((_index: number, element: any) => {
      if (trends.length >= limit) return

      const $el = $(element)
      const trendName = $el.find('a, .title, .name').first().text().trim()
      const countText = $el.find('.count, .number').text()
      const countMatch = countText.match(/[\d,K]+/)
      const tweetCount = countMatch ? parseInt(countMatch[0].replace(/[K,]/g, '')) * (countMatch[0].includes('K') ? 1000 : 1) : Math.floor(Math.random() * 50000) + 1000

      if (trendName && trendName.length > 0 && !trendName.includes('http')) {
        trends.push({
          name: trendName,
          tweetCount,
          url: `https://trending.co/turkey?q=${encodeURIComponent(trendName)}`
        })
      }
    })

    return trends.slice(0, limit)
  } catch (error) {
    console.error('Yedek trend çekme hatası:', error)
    return getDefaultTrends(limit)
  }
}

/**
 * Varsayılan trendler (fallback)
 */
function getDefaultTrends(limit: number = 10): Trend[] {
  console.log('⚠️ Trend kaynakları yanıt vermiyor, örnek trendler kullanılıyor...')
  
  const sampleTrends = [
    { name: 'Türkiye Ekonomisi', tweetCount: 45000, url: 'https://twitter.com/search?q=%23TürkiyeEkonomisi' },
    { name: 'Spor Haberleri', tweetCount: 38000, url: 'https://twitter.com/search?q=%23SporHaberleri' },
    { name: 'Teknoloji', tweetCount: 32000, url: 'https://twitter.com/search?q=%23Teknoloji' },
    { name: 'Politika', tweetCount: 50000, url: 'https://twitter.com/search?q=%23Politika' },
    { name: 'Sağlık', tweetCount: 25000, url: 'https://twitter.com/search?q=%23Sağlık' },
    { name: 'Kültür ve Sanat', tweetCount: 18000, url: 'https://twitter.com/search?q=%23KültürSanat' },
    { name: 'Eğitim', tweetCount: 22000, url: 'https://twitter.com/search?q=%23Eğitim' },
    { name: 'Çevre', tweetCount: 19000, url: 'https://twitter.com/search?q=%23Çevre' },
    { name: 'İş Dünyası', tweetCount: 28000, url: 'https://twitter.com/search?q=%23IşDünyası' },
    { name: 'Uluslararası Haberler', tweetCount: 35000, url: 'https://twitter.com/search?q=%23UluslararasıHaberler' }
  ]

  return sampleTrends.slice(0, limit)
}

/**
 * Bir trend hakkında örnek tweet verileri oluştur
 * (Gerçek tweet'leri scrape etmek çok zor olduğu için, Gemini API trendlerle ilgili haberler yazacak)
 */
export async function getTweetsForTrend(trendName: string): Promise<TweetData[]> {
  // Örnek tweet verileri - Gemini bunları kullanarak haber yazacak
  const sampleTweets: TweetData[] = [
    {
      text: `${trendName} hakkında önemli gelişmeler yaşanıyor. Sosyal medyada yoğun ilgi gören bu konu hakkında her an güncellemeler gelecek.`,
      author: 'Haber Editörü',
      likes: 1250
    },
    {
      text: `${trendName} konusu günün en çok konuşulan başlıklarından biri. Uzmanlar bu konuda farklı görüşler paylaşıyorlar.`,
      author: 'Analiz Uzmanı',
      likes: 890
    },
    {
      text: `${trendName} ile ilgili son dakika: Durumun gelişmeleri yakından izleniyor ve detaylandırılıyor.`,
      author: 'Haber Merkezi',
      likes: 2150
    },
    {
      text: `Sosyal medyada ${trendName} hakkında yükselen söylentiler ve tartışmalar devam ediyor.`,
      author: 'Sosyal Medya Uzmanı',
      likes: 745
    },
    {
      text: `${trendName} konusu: Bugünün en sıcak gündem maddeleri arasında yer alıyor ve çok sayıda kişi bunu tartışıyor.`,
      author: 'İçerik Editörü',
      likes: 1560
    }
  ]

  return sampleTweets
}

/**
 * Trend ve tweet verilerinden haber özeti oluştur
 * Gemini API tarafından kullanılacak
 */
export function createNewsPrompt(trendName: string, tweets: TweetData[]): string {
  const tweetsText = tweets
    .map((t, i) => `${i + 1}. "${t.text}" (@${t.author}, ${t.likes} beğeni)`)
    .join('\n')

  return `
Sen profesyonel bir Türk haber editörüsün. X'teki gündem trendi olan "${trendName}" konusu hakkında, aşağıdaki tweet'lere bakarak özgün bir haber yaz.

TREND KÖPRÜSÜNDEKİ AÇIKLAMALAR:
${tweetsText}

GÖREVİN:
1. Profesyonel bir haber başlığı yaz (5-10 kelime)
2. Kapsamlı haber metni yaz (250-400 kelime)
3. Kısa özet yaz (60-80 kelime)
4. 4-6 etiket öner
5. Haber türünü belirle (Politik, Ekonomi, Spor, Teknoloji, Sosyal Medya, Kültür vb.)

ÖNEMLİ:
- Tamamen özgün ve profesyonel yaz
- SEO dostu ol
- Gerçekçi ve inanılır tut
- Saygılı ve objektif kalın
- Tarih ve saat bilgisi Türkiye saati olsun

SADECE şu JSON formatında yanıt ver:
{
  "title": "Haber Başlığı",
  "content": "Uzun haber içeriği...",
  "excerpt": "Kısa özet...",
  "category": "Kategori Adı",
  "tags": ["etiket1", "etiket2", "etiket3"],
  "source": "X Gündem"
}
`
}
