/**
 * Beşinci araç grubunun rehberleri: kripto ortalama maliyet, sosyal medya
 * etkileşim oranı, YouTube geliri, araç değer kaybı, elektrikli araç şarj
 * maliyeti, araç alırken toplam maliyet ve market birim fiyatı.
 *
 * Örnek rakamlar araçların kullandığı lib/calculations/newTools.ts ile
 * hesaplanır.
 */

import type { Guide } from "@/data/guides";
import { MTV_YEAR } from "@/data/mtv";
import {
  cryptoPosition,
  engagementRate,
  evChargingCost,
  unitPrices,
  vehicleDepreciation,
  vehicleTco,
  youtubeRevenue,
  YOUTUBE_CREATOR_SHARE,
} from "@/lib/calculations/newTools";

const tl = (v: number) =>
  `${v.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`;
const pc = (v: number) => `%${v.toLocaleString("tr-TR", { maximumFractionDigits: 2 })}`;
const SHARE = Math.round(YOUTUBE_CREATOR_SHARE * 100);

const PUBLISHED = "2026-10-12";
const common = { published: PUBLISHED, updated: PUBLISHED } as const;

/* Örnekler ----------------------------------------------------------- */

const dca = cryptoPosition({
  buys: [
    { quantity: 0.005, price: 2_600_000 },
    { quantity: 0.005, price: 2_300_000 },
    { quantity: 0.005, price: 2_000_000 },
  ],
  currentPrice: 2_400_000,
  feeRate: 0.002,
})!;

const smallAcc = engagementRate({ likes: 420, comments: 25, shares: 10, saves: 15, followers: 8_000 })!;
const bigAcc = engagementRate({ likes: 9_000, comments: 300, shares: 250, saves: 450, followers: 500_000 })!;

const ytLow = youtubeRevenue({ mode: "rpm", views: 200_000, rpm: 15 })!;
const ytHigh = youtubeRevenue({ mode: "rpm", views: 200_000, rpm: 45 })!;

const dep = vehicleDepreciation({ price: 2_000_000, firstYearRate: 0.18, yearlyRate: 0.1, years: 4 })!;

const evHome = evChargingCost({ batteryKwh: 60, consumption: 17, homePrice: 3, fastPrice: 12, fastShare: 0, chargingLoss: 0.1, yearlyKm: 20_000, fuelConsumption: 7, fuelPrice: 50 })!;
const evFast = evChargingCost({ batteryKwh: 60, consumption: 17, homePrice: 3, fastPrice: 12, fastShare: 1, chargingLoss: 0.05, yearlyKm: 20_000, fuelConsumption: 7, fuelPrice: 50 })!;

const tcoCheap = vehicleTco({ name: "A", price: 1_100_000, consumption: 7.5, energyPrice: 50, insurance: 30_000, tax: 10_000, maintenance: 15_000, resaleRate: 0.5 }, 5, 20_000)!;
const tcoPricey = vehicleTco({ name: "B", price: 1_350_000, consumption: 5, energyPrice: 50, insurance: 34_000, tax: 10_000, maintenance: 10_000, resaleRate: 0.6 }, 5, 20_000)!;

const deterjan = unitPrices([
  { name: "3 L", price: 239.9, amount: 3, unit: "l" },
  { name: "5 L (kampanyalı)", price: 349.9, amount: 5, unit: "l" },
  { name: "2 × 1,5 L", price: 219.9, amount: 1.5, unit: "l", packs: 2 },
])!;

export const dijitalAracGuides: Guide[] = [
  /* ======================== KRİPTO ======================== */

  /* ======================== ETKİLEŞİM ======================== */

  /* ======================== YOUTUBE ======================== */

  /* ======================== DEĞER KAYBI ======================== */
  {
    slug: "araba-yilda-ne-kadar-deger-kaybeder",
    title: "Araba Yılda Ne Kadar Değer Kaybeder?",
    metaTitle: "Araba Yılda Ne Kadar Değer Kaybeder? Değer Kaybı Hesaplama",
    description:
      "Araç değer kaybının nasıl hesaplandığı, ilk yılın neden daha yüksek olduğu, enflasyonun ikinci el fiyatlarına etkisi ve değer kaybını azaltmanın yolları.",
    category: "Günlük",
    icon: "📉",
    ...common,
    readingMinutes: 6,
    tool: { slug: "arac-deger-kaybi", label: "Araç Değer Kaybı Hesaplama" },
    intro:
      "Bir araç satın aldığınız andan itibaren değer kaybetmeye başlar ve çoğu sürücü için bu kayıp, yakıt veya bakımdan daha büyük bir maliyet kalemidir. Ne kadar değer kaybedileceğini bilmek; hangi aracı alacağınıza, ne kadar süre kullanacağınıza ve ne zaman satacağınıza karar verirken işinize yarar.",
    sections: [
      {
        heading: "Değer kaybı nasıl hesaplanır?",
        body: [
          "En yaygın yöntem <strong>azalan bakiyeler</strong> yöntemidir: Her yıl, aracın o yılın başındaki değeri üzerinden belirli bir oranda kayıp hesaplanır. Oran sabit kalsa bile, kayıp tutarı her yıl küçülür.",
          "Formül: Yıl sonu değeri = yıl başı değeri × (1 − yıllık kayıp oranı)",
        ],
      },
      {
        heading: "Örnek: 2.000.000 TL'lik sıfır araç",
        body: [
          "İlk yıl %18, sonraki yıllarda %10 değer kaybı varsayımıyla (örnek oranlar):",
          ...dep.rows.map((r) => `- ${r.year}. yıl sonu: ${tl(r.value)} — toplam kayıp ${pc(r.totalLossPercent)}`),
          `Dört yılda toplam <strong>${tl(dep.totalLoss)}</strong> değer kaybı oluşur; bu, yıllık ortalama ${tl(dep.averageYearlyLoss)} demektir.`,
        ],
      },
      {
        heading: "İlk yıl neden daha fazla kaybedilir?",
        body: [
          "Sıfır araç tescil edildiği anda \"ikinci el\" olur. Satış fiyatının içindeki bayi kârı, teslim masrafları ve sıfır araca özel kampanyalar ikinci el değerine tam olarak yansımaz. Bu yüzden ilk yıldaki kayıp oranı genellikle sonraki yıllardan yüksektir. 1–3 yaşındaki ikinci el araçlar, bu ilk büyük kaybı önceki sahibi üstlendiği için çoğu zaman daha avantajlı alımlardır.",
        ],
      },
      {
        heading: "Enflasyonda araba değer kazanır mı?",
        body: [
          "Yüksek enflasyon dönemlerinde ikinci el araç fiyatları TL olarak artabilir ve bu, aracın değer kazandığı izlenimini verir. Oysa aynı dönemde sıfır araç fiyatları ve genel fiyat seviyesi de yükselir. Gerçek değer kaybını görmek için aracınızın ikinci el fiyatını, aynı modelin güncel sıfır fiyatıyla karşılaştırın. Örneğin sıfırı 2.500.000 TL olan modelin 3 yaşındaki örneği 1.800.000 TL'ye satılıyorsa, reel değer kaybı %28'dir.",
        ],
      },
      {
        heading: "Değer kaybını azaltmanın yolları",
        body: [
          "- İkinci elde talep gören marka ve modelleri tercih edin.",
          "- Bakımları zamanında ve belgeli yaptırın; servis kayıtlarını saklayın.",
          "- Hasar kaydı (tramer) ve boya-değişen, fiyatı en çok düşüren etkenlerdir; küçük hasarlarda onarım yöntemini dikkatle seçin.",
          "- Yıllık kilometreyi makul tutun; ortalamanın çok üzerindeki kullanım değeri düşürür.",
          "- Model değişimi veya vergi düzenlemesi öncesi satış zamanlamasını takip edin.",
        ],
      },
    ],
    faqs: [
      {
        question: "Arabanın değer kaybı nasıl öğrenilir?",
        answer:
          "İkinci el ilanlarında aynı model, yıl, kilometre ve donanımdaki araçların fiyatlarını karşılaştırarak gerçek piyasa değerini görebilirsiniz. Gelecek yıllar için tahmin yapmak isterseniz Araç Değer Kaybı aracına bir oran girerek tablo oluşturabilirsiniz.",
      },
      {
        question: "Kaza sonrası değer kaybı talep edilebilir mi?",
        answer:
          "Evet. Kusuru olmayan araç sahibi, kazanın aracın piyasa değerinde yarattığı düşüşü karşı tarafın trafik sigortasından talep edebilir. Bu, zamana bağlı olağan değer kaybından farklı bir tazminattır.",
      },
    ],
    related: [`mtv-${MTV_YEAR}-nasil-hesaplanir`],
  },

  /* ======================== ELEKTRİKLİ ARAÇ ======================== */
  {
    slug: "elektrikli-arac-sarj-maliyeti-ev-mi-istasyon-mu",
    title: "Elektrikli Araç Şarj Maliyeti: Ev mi, İstasyon mu?",
    metaTitle: "Elektrikli Araç Şarj Maliyeti: Evde ve İstasyonda 100 km Kaç TL?",
    description:
      "Elektrikli aracın evde ve hızlı şarj istasyonunda 100 km maliyeti, şarj kaybı, benzinli araçla karşılaştırma ve şarj maliyetini düşürme önerileri.",
    category: "Günlük",
    icon: "🔌",
    ...common,
    readingMinutes: 6,
    tool: { slug: "elektrikli-arac-sarj", label: "Elektrikli Araç Şarj Maliyeti" },
    intro:
      "Elektrikli araç almayı düşünenlerin ilk sorusu, aracın kilometre maliyetinin benzinli veya dizel bir araca göre ne kadar düşük olacağıdır. Cevap büyük ölçüde nerede şarj ettiğinize bağlıdır: Evde şarj ile hızlı şarj istasyonu arasındaki kWh fiyat farkı, elektrikli aracın avantajını belirleyen ana etkendir.",
    sections: [
      {
        heading: "Şarj maliyeti nasıl hesaplanır?",
        body: [
          "100 km maliyeti = aracın 100 km tüketimi (kWh) × kWh fiyatı ÷ (1 − şarj kaybı)",
          "Aracın gösterdiği tüketim, bataryadan çekilen enerjidir. Şebekeden çekilen enerji, şarj sırasındaki kayıplar nedeniyle biraz daha fazladır. Bu kayıp ev (AC) şarjında genellikle daha belirgindir.",
        ],
      },
      {
        heading: "Örnek: aynı araç, iki farklı şarj alışkanlığı",
        body: [
          "100 km'de 17 kWh tüketen bir elektrikli aracı, 100 km'de 7 L yakan ve yakıtı 50 TL olan bir araçla karşılaştıralım (örnek fiyatlar: ev 3 TL/kWh, hızlı şarj 12 TL/kWh):",
          `- Sadece evde şarj: 100 km <strong>${tl(evHome.evPer100)}</strong>, yılda 20.000 km için ${tl(evHome.evYearly)}`,
          `- Sadece hızlı şarj: 100 km <strong>${tl(evFast.evPer100)}</strong>, yılda ${tl(evFast.evYearly)}`,
          `- Yakıtlı araç: 100 km <strong>${tl(evHome.fuelPer100!)}</strong>, yılda ${tl(evHome.fuelYearly!)}`,
          "Evde şarjda elektrikli araç belirgin şekilde ucuzdur; tamamen hızlı şarja dayanan kullanımda ise fark ciddi ölçüde azalır. Kendi rakamlarınız için güncel elektrik tarifenizi ve şarj ağının fiyatını kullanın.",
        ],
      },
      {
        heading: "Şarj maliyetini düşürmenin yolları",
        body: [
          "- Mümkünse evde veya iş yerinde AC şarj imkânı oluşturun; sitelerde ortak şarj ünitesi için yönetimle görüşün.",
          "- Hızlı şarjı uzun yollara bırakın; günlük kullanımda yavaş şarj hem ucuz hem bataryaya daha az yük bindirir.",
          "- Bataryayı günlük kullanımda %20–80 aralığında tutmak, hem şarj süresini kısaltır hem batarya ömrünü destekler.",
          "- Şarj ağlarının üyelik ve abonelik paketlerini karşılaştırın; sık kullanılan ağda paket avantajlı olabilir.",
          "- Kışın, araç prizdeyken kabini ön ısıtma özelliğiyle ısıtmak, yolda bataryadan harcanan enerjiyi azaltır.",
        ],
      },
      {
        heading: "Sadece enerji maliyetine bakmayın",
        body: [
          "Elektrikli araçların bakım gideri genellikle daha düşüktür ve MTV tutarları farklı hesaplanır. Öte yandan alış fiyatı, sigorta-kasko primi ve ikinci el değeri de toplam maliyeti etkiler. Bu kalemleri birlikte görmek için Araç Karşılaştırma aracını kullanabilirsiniz.",
        ],
      },
    ],
    faqs: [
      {
        question: "Elektrikli aracı evde şarj etmek faturayı ne kadar artırır?",
        answer:
          "Aylık kilometrenizi 100'e bölüp aracın 100 km tüketimiyle çarparak aylık kWh ihtiyacını bulabilirsiniz. Örneğin ayda 1.500 km yapan ve 100 km'de 17 kWh tüketen araç, şarj kaybıyla birlikte yaklaşık 280 kWh elektrik harcar; bunu tarifenizdeki kWh fiyatıyla çarpın.",
      },
      {
        question: "Hızlı şarj bataryaya zarar verir mi?",
        answer:
          "Ara sıra hızlı şarj normaldir ve araçlar buna göre tasarlanır. Ancak sürekli ve yüksek sıcaklıkta hızlı şarj, batarya yaşlanmasını hızlandırabilir. Günlük kullanımda yavaş şarj tercih etmek önerilir.",
      },
    ],
    related: ["yakit-maliyeti-nasil-hesaplanir"],
  },

  /* ======================== TOPLAM MALİYET ======================== */

  /* ======================== BİRİM FİYAT ======================== */
  {
    slug: "markette-birim-fiyat-nasil-hesaplanir",
    title: "Markette Birim Fiyat Nasıl Hesaplanır?",
    metaTitle: "Birim Fiyat Nasıl Hesaplanır? Markette Hangisi Daha Ucuz?",
    description:
      "Market ürünlerinde birim fiyat hesaplama, büyük paketin her zaman ucuz olmadığı durumlar, kampanyaları değerlendirme ve alışverişte tasarruf ipuçları.",
    category: "Günlük",
    icon: "🛒",
    ...common,
    readingMinutes: 5,
    tool: { slug: "birim-fiyat", label: "Market Birim Fiyat Karşılaştırma" },
    intro:
      "Raflarda aynı ürünün farklı gramaj ve paketleri yan yana durur: 500 gram, 1 kilogram, 3'lü paket... Hangisinin daha ucuz olduğunu raf fiyatından anlamak çoğu zaman mümkün değildir. Doğru karşılaştırma için ürünlerin <strong>birim fiyatına</strong>, yani kilogram, litre veya adet başına fiyatına bakmak gerekir.",
    sections: [
      {
        heading: "Birim fiyat formülü",
        body: [
          "Birim fiyat = raf fiyatı ÷ toplam miktar",
          "Miktarı aynı ölçüye çevirmeyi unutmayın: 750 g = 0,75 kg, 330 ml = 0,33 L. Çoklu paketlerde paket sayısıyla çarpın: 6 × 1 L = 6 L.",
          "Örneğin 750 gramı 82,50 TL olan bir ürünün kilogram fiyatı 82,50 ÷ 0,75 = 110 TL'dir.",
        ],
      },
      {
        heading: "Örnek: deterjan paketleri",
        body: [
          "Aynı deterjanın üç farklı seçeneği (örnek fiyatlar):",
          ...deterjan.rows.map(
            (r) =>
              `- ${r.name}: <strong>${tl(r.unitPrice)}/L</strong>${r.overCheapestPercent === 0 ? " — en ucuz" : ` — en ucuzdan ${pc(r.overCheapestPercent ?? 0)} pahalı`}`,
          ),
          `En pahalı seçenek yerine en ucuzunu almak birim fiyatta ${pc(deterjan.savingPercent ?? 0)} tasarruf sağlar.`,
        ],
      },
      {
        heading: "Büyük paket her zaman daha mı ucuz?",
        body: [
          "Genellikle büyük paketlerin birim fiyatı daha düşüktür, ancak bu bir kural değildir. Küçük paketlere uygulanan indirimler, \"2 al 1 öde\" kampanyaları veya çoklu paketler sıralamayı değiştirebilir. Ayrıca büyük paketin tamamını son kullanma tarihinden önce tüketemeyecekseniz, ucuz birim fiyat israfa dönüşebilir.",
        ],
      },
      {
        heading: "Kampanyaları birim fiyata çevirin",
        body: [
          "- \"2 al 1 öde\": iki ürünün fiyatına göre birim fiyat %50 düşer.",
          "- \"3 al 2 öde\": birim fiyat yaklaşık %33 düşer.",
          "- \"İkincisi %50 indirimli\": iki ürün alındığında birim fiyat %25 düşer.",
          "Kampanyalı fiyatı aracın raf fiyatı alanına, toplam miktarı da miktar alanına yazarak diğer seçeneklerle doğrudan karşılaştırabilirsiniz.",
        ],
      },
      {
        heading: "Raf etiketlerindeki birim fiyat",
        body: [
          "Türkiye'de fiyat etiketlerinde ürünün satış fiyatıyla birlikte birim fiyatının da gösterilmesi gerekir. Etiketteki küçük yazılı TL/kg veya TL/L bilgisini kontrol etmek, hesaplama yapmadan hızlı karşılaştırma sağlar. Etiket eksik ya da okunaksızsa bu aracı kullanabilirsiniz.",
        ],
      },
    ],
    faqs: [
      {
        question: "Birim fiyat ile raf fiyatı arasındaki fark nedir?",
        answer:
          "Raf fiyatı paketin toplam fiyatıdır. Birim fiyat ise bu fiyatın kilogram, litre veya adet başına düşen kısmıdır ve farklı boyuttaki paketleri karşılaştırmayı sağlar.",
      },
      {
        question: "Konsantre ürünler nasıl karşılaştırılır?",
        answer:
          "Konsantre deterjan veya şampuanlarda litre fiyatı yanıltıcı olabilir. Paket üzerinde yazan yıkama veya kullanım sayısını adet olarak girip kullanım başına maliyeti karşılaştırmak daha doğru sonuç verir.",
      },
    ],
    related: ["indirim-hesaplama-nasil-yapilir", "yuzde-hesaplama-nasil-yapilir"],
  },
];
