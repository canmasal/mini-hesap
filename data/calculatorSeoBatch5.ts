/**
 * Beşinci araç grubunun SEO içerikleri: kripto kâr/zarar, etkileşim oranı,
 * YouTube geliri, araç değer kaybı, elektrikli araç şarj maliyeti, araç
 * karşılaştırma ve market birim fiyatı.
 *
 * Her içeriğin girişi, arama sonucunda "öne çıkan snippet" olarak
 * kullanılabilecek tek cümlelik doğrudan bir tanım veya formülle başlar.
 * Örneklerdeki rakamlar lib/calculations/newTools.ts ile hesaplanır; metin
 * ile araç hiçbir zaman ayrışmaz.
 */

import type { ToolSeo } from "@/data/calculatorSeo";
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

/* Örnek hesaplar ------------------------------------------------------ */

const crypto = cryptoPosition({
  buys: [
    { quantity: 0.01, price: 2_400_000 },
    { quantity: 0.01, price: 2_000_000 },
  ],
  currentPrice: 2_500_000,
  feeRate: 0.001,
})!;

const eng = engagementRate({ likes: 850, comments: 40, shares: 15, saves: 30, followers: 20_000, reach: 12_000 })!;

const yt = youtubeRevenue({ mode: "cpm", views: 100_000, cpm: 120, monetizedRate: 0.5 })!;

const dep = vehicleDepreciation({ price: 1_500_000, firstYearRate: 0.15, yearlyRate: 0.1, years: 5 })!;

const ev = evChargingCost({
  batteryKwh: 60,
  consumption: 16,
  homePrice: 3,
  fastPrice: 12,
  fastShare: 0.2,
  chargingLoss: 0.1,
  yearlyKm: 15_000,
  fuelConsumption: 6.5,
  fuelPrice: 50,
})!;

const carA = vehicleTco(
  { name: "A", price: 1_400_000, consumption: 6.5, energyPrice: 50, insurance: 35_000, tax: 12_000, maintenance: 12_000, resaleRate: 0.6 },
  5,
  15_000,
)!;
const carB = vehicleTco(
  { name: "B", price: 1_800_000, consumption: 17, energyPrice: 4.8, insurance: 45_000, tax: 3_000, maintenance: 6_000, resaleRate: 0.5 },
  5,
  15_000,
)!;

const unit = unitPrices([
  { name: "500 g paket", price: 64.9, amount: 500, unit: "g" },
  { name: "1 kg paket", price: 119.9, amount: 1, unit: "kg" },
  { name: "3 × 400 g", price: 149.9, amount: 400, unit: "g", packs: 3 },
])!;

export const toolSeoBatch5: Record<string, ToolSeo> = {
  /* ======================== KRİPTO ======================== */
  "kripto-kar-zarar": {
    title: "Kripto Kâr Zarar Hesaplama | Ortalama Maliyet Hesapla",
    description:
      "Kripto ortalama maliyet ve kâr/zarar hesaplama: farklı fiyatlardan yaptığınız alımların komisyon dahil ortalama maliyetini, başa baş fiyatını ve güncel kârınızı bulun.",
    intro:
      "Kripto ortalama maliyet, toplam ödenen tutarın (komisyon dahil) toplam alınan miktara bölünmesiyle bulunur. Bu araç, farklı fiyatlardan yaptığınız alımları tek bir ortalama maliyette birleştirir; güncel fiyata göre kâr veya zararınızı ve zarar etmeden satabileceğiniz en düşük fiyatı gösterir.",
    howItWorks: [
      "Her alımınızın miktarını ve birim fiyatını ayrı satıra girin; gerekirse satır ekleyin.",
      "Varlığın güncel fiyatını yazın.",
      "Platformunuzun işlem komisyonunu yüzde olarak girin.",
      "İsterseniz hedef satış fiyatı ekleyerek o fiyattaki kârınızı görün.",
    ],
    sections: [
      {
        heading: "Ortalama maliyet formülü",
        body: [
          "Ortalama maliyet = Σ(miktar × fiyat) × (1 + komisyon) ÷ toplam miktar",
          "Kâr/zarar = güncel fiyat × miktar × (1 − komisyon) − toplam maliyet",
          "Başa baş fiyatı = toplam maliyet ÷ (miktar × (1 − komisyon))",
          "Komisyon hem alışta hem satışta kesildiği için başa baş fiyatı, ortalama maliyetin biraz üzerindedir.",
        ],
      },
      {
        heading: "Örnek hesaplama",
        body: [
          "0,01 adet 2.400.000 TL'den, 0,01 adet 2.000.000 TL'den alındığını ve komisyonun %0,1 olduğunu varsayalım:",
          `- Toplam maliyet: <strong>${tl(crypto.totalCost)}</strong> (komisyon ${tl(crypto.buyFees)})`,
          `- Ortalama maliyet: <strong>${tl(crypto.averageCost)}</strong>`,
          `- Başa baş satış fiyatı: ${tl(crypto.breakEven)}`,
          `- Fiyat 2.500.000 TL olduğunda net kâr: <strong>${tl(crypto.current!.profit)}</strong> (${pc(crypto.current!.profitPercent)})`,
        ],
      },
      {
        heading: "Ortalama maliyeti düşürme (maliyet ortalaması)",
        body: [
          "Fiyat düştüğünde ek alım yapmak ortalama maliyeti aşağı çeker; düzenli aralıklarla sabit tutarda alım yapma yöntemine maliyet ortalaması denir. Bu yöntem giriş zamanlamasının etkisini azaltır, ancak zarar riskini ortadan kaldırmaz.",
          "Her ek alımın komisyonu da maliyete eklenir. Çok küçük ve sık alımlarda komisyon toplamı belirgin bir maliyet hâline gelebilir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kripto ortalama maliyet nasıl hesaplanır?",
        answer:
          "Her alımın miktarı fiyatıyla çarpılıp toplanır, alış komisyonu eklenir ve toplam, alınan toplam miktara bölünür. Sonuç, elinizdeki her bir birimin size ortalama kaça mal olduğunu gösterir.",
      },
      {
        question: "Başa baş fiyatı neden ortalama maliyetten yüksek?",
        answer:
          "Satış sırasında da komisyon kesildiği için, satıştan eline geçen tutarın maliyeti karşılaması gerekir. Bu yüzden zararsız çıkış fiyatı ortalama maliyetin komisyon oranı kadar üzerindedir.",
      },
      {
        question: "Hesaba transfer ücretleri dahil mi?",
        answer:
          "Hayır. Araç yalnızca girdiğiniz işlem komisyonunu hesaba katar. Ağ (transfer) ücreti ödediyseniz bu tutarı maliyetinize ayrıca eklemeniz gerekir.",
      },
      {
        question: "Kripto kazancı vergiye tabi mi?",
        answer:
          "Kripto varlıkların vergilendirilmesine ilişkin düzenlemeler değişebilmektedir. Beyan yükümlülüğünüz olup olmadığını öğrenmek için güncel mevzuatı takip edin ve bir mali müşavire danışın.",
      },
    ],
  },

  /* ======================== ETKİLEŞİM ORANI ======================== */
  "etkilesim-orani": {
    title: "Etkileşim Oranı Hesaplama | Instagram Engagement Rate",
    description:
      "Instagram, TikTok ve diğer sosyal medya hesapları için etkileşim oranı (engagement rate) hesaplama: beğeni, yorum, paylaşım ve kaydetmeyi takipçi ve erişime göre oranlayın.",
    intro:
      "Etkileşim oranı, bir gönderiye gelen toplam etkileşimin (beğeni + yorum + paylaşım + kaydetme) takipçi sayısına bölünüp 100 ile çarpılmasıyla bulunur. Bu araç oranı hem takipçiye hem erişime göre hesaplar ve sonucun düşük mü yüksek mi olduğunu yorumlar.",
    howItWorks: [
      "Hesabınızın takipçi sayısını girin.",
      "Gönderinin beğeni, yorum, paylaşım ve kaydetme sayılarını yazın.",
      "Varsa gönderinin erişim (gören hesap) sayısını ekleyin.",
      "Birden fazla gönderinin toplamını girdiyseniz gönderi sayısını belirtin; ortalama hesaplanır.",
    ],
    sections: [
      {
        heading: "Etkileşim oranı formülü",
        body: [
          "Takipçiye göre etkileşim oranı = (beğeni + yorum + paylaşım + kaydetme) ÷ takipçi × 100",
          "Erişime göre etkileşim oranı = toplam etkileşim ÷ erişim × 100",
          "Takipçiye göre oran hesaplar arası kıyas için, erişime göre oran ise içeriğin gören kişiyi ne kadar harekete geçirdiğini ölçmek için daha uygundur.",
        ],
      },
      {
        heading: "Örnek hesaplama",
        body: [
          "20.000 takipçili bir hesabın gönderisi 850 beğeni, 40 yorum, 15 paylaşım ve 30 kaydetme aldı, 12.000 kişiye ulaştı:",
          `- Toplam etkileşim: ${eng.interactions.toLocaleString("tr-TR")}`,
          `- Takipçiye göre oran: <strong>${pc(eng.byFollowers)}</strong> (${eng.level.toLocaleLowerCase("tr-TR")})`,
          `- Erişime göre oran: <strong>${pc(eng.byReach!)}</strong>`,
        ],
      },
      {
        heading: "İyi etkileşim oranı kaçtır?",
        body: [
          "Tek bir doğru eşik yoktur; oran platforma, sektöre ve hesap büyüklüğüne göre değişir. Kaba bir rehber olarak:",
          "- %1'in altı: düşük",
          "- %1–3: ortalama",
          "- %3–6: iyi",
          "- %6'nın üzeri: çok yüksek",
          "Küçük hesaplarda takipçiyle bağ daha güçlü olduğu için oran genellikle daha yüksek çıkar. En anlamlı kıyas, kendi geçmiş gönderilerinizle ve benzer büyüklükteki hesaplarla yapılandır.",
        ],
      },
      {
        heading: "Etkileşimi artırmanın yolları",
        body: [
          "- Kaydetmeye ve paylaşmaya değer, bilgi veren içerikler üretin.",
          "- Yorumlara yanıt verin; ilk saatlerdeki etkileşim gönderinin dağılımını etkiler.",
          "- Takipçilerinizin en aktif olduğu saatlerde paylaşım yapın.",
          "- Satın alınmış takipçi ve beğenilerden kaçının; oranı düşürür ve hesabın güvenilirliğini zedeler.",
        ],
      },
    ],
    faqs: [
      {
        question: "Instagram etkileşim oranı nasıl hesaplanır?",
        answer:
          "Gönderinin beğeni, yorum, paylaşım ve kaydetme sayıları toplanır, takipçi sayısına bölünür ve 100 ile çarpılır. Birden fazla gönderinin ortalamasını almak tek gönderiye göre daha güvenilir sonuç verir.",
      },
      {
        question: "Etkileşim oranı neden düşüyor?",
        answer:
          "Takipçi sayısı arttıkça oran doğal olarak düşer. Ayrıca etkileşimsiz (pasif veya sahte) takipçiler, içerik türü değişikliği ve paylaşım saatleri de oranı etkiler.",
      },
      {
        question: "Markalar hangi oranı dikkate alır?",
        answer:
          "Markalar genellikle takipçiye göre ortalama etkileşim oranına ve erişim/gösterim verilerine birlikte bakar. Tutarlı bir oran, tek bir viral gönderiden daha değerlidir.",
      },
    ],
  },

  /* ======================== YOUTUBE ======================== */
  "youtube-geliri": {
    title: "YouTube Geliri Hesaplama | RPM ve CPM ile İzlenme Başına Kazanç",
    description:
      "YouTube izlenme geliri hesaplama: aylık izlenme ile RPM veya CPM değerine göre kanalınızın tahmini günlük, aylık ve yıllık reklam gelirini bulun.",
    intro: `YouTube reklam geliri, izlenme sayısının 1.000'e bölünüp RPM (1.000 izlenme başına gelir) ile çarpılmasıyla tahmin edilir. CPM biliniyorsa gelir; reklam gösterilen izlenme × CPM ÷ 1.000 × %${Math.round(YOUTUBE_CREATOR_SHARE * 100)} (uzun videolarda içerik üreticisi payı) formülüyle bulunur.`,
    howItWorks: [
      "Hesaplama yöntemini seçin: RPM (önerilen) veya CPM.",
      "Aylık izlenme sayınızı girin.",
      "YouTube Studio'daki RPM değerinizi ya da CPM ve reklamlı izlenme oranını yazın.",
      "Günlük, aylık ve yıllık tahmini geliri inceleyin.",
    ],
    sections: [
      {
        heading: "RPM ve CPM arasındaki fark",
        body: [
          "<strong>CPM</strong> (bin gösterim başına maliyet), reklamverenin 1.000 reklam gösterimi için ödediği tutardır; YouTube'un payı düşülmemiştir.",
          `<strong>RPM</strong> (bin izlenme başına gelir), kanalın her 1.000 izlenmeden eline geçen tutardır. Reklam gösterilmeyen izlenmeleri ve YouTube'un payını içerdiği için RPM, CPM'den belirgin şekilde düşüktür. Uzun videolarda reklam gelirinin %${Math.round(YOUTUBE_CREATOR_SHARE * 100)}'i içerik üreticisine kalır.`,
          "Gerçek kazancı tahmin etmek için RPM daha doğru bir göstergedir.",
        ],
      },
      {
        heading: "Örnek hesaplama",
        body: [
          "Aylık 100.000 izlenme, 120 TL CPM ve izlenmelerin yarısında reklam gösterildiğini varsayalım:",
          `- Reklamlı izlenme: 50.000`,
          `- Aylık tahmini gelir: 50.000 ÷ 1.000 × 120 × %${Math.round(YOUTUBE_CREATOR_SHARE * 100)} = <strong>${tl(yt.monthly)}</strong>`,
          `- Bu senaryodaki RPM: ${tl(yt.perThousand)}`,
        ],
      },
      {
        heading: "Geliri etkileyen etkenler",
        body: [
          "- <strong>İzleyici ülkesi:</strong> Reklam fiyatları ülkeden ülkeye büyük fark gösterir.",
          "- <strong>Konu:</strong> Finans, teknoloji ve eğitim gibi alanlarda reklamverenler daha yüksek ücret öder.",
          "- <strong>Video süresi:</strong> 8 dakikayı aşan videolara video ortasında reklam eklenebilir.",
          "- <strong>Sezon:</strong> Yıl sonu alışveriş döneminde reklam fiyatları genellikle yükselir.",
          "- <strong>Para birimi:</strong> Ödemeler dolar üzerinden yapıldığı için TL karşılığı kura göre değişir.",
        ],
      },
    ],
    faqs: [
      {
        question: "YouTube 1.000 izlenme başına ne kadar öder?",
        answer:
          "Sabit bir tutar yoktur. Kanalınızın RPM değeri; izleyici ülkesine, konuya ve sezona göre değişir. Kendi RPM'inizi YouTube Studio > Analytics > Gelir sekmesinde görebilirsiniz.",
      },
      {
        question: "YouTube'dan para kazanmak için şartlar neler?",
        answer:
          "Reklam gelirine erişmek için YouTube İş Ortağı Programı'na kabul edilmek gerekir. Programın abone ve izlenme süresi şartları YouTube tarafından belirlenir ve zaman zaman güncellenir; güncel şartları YouTube yardım sayfasından kontrol edin.",
      },
      {
        question: "Shorts gelirleri bu hesaba dahil mi?",
        answer:
          "Hayır. Shorts gelirleri farklı bir havuz modeliyle paylaştırılır. Araç uzun videoların reklam gelirini tahmin eder.",
      },
      {
        question: "YouTube geliri vergiye tabi mi?",
        answer:
          "Evet, YouTube'dan elde edilen kazanç gelir vergisine tabidir. Türkiye'de sosyal içerik üreticileri için özel bir istisna ve stopaj düzenlemesi bulunur; şartlarını ve beyan yükümlülüğünüzü mali müşavirinize danışın.",
      },
    ],
  },

  /* ======================== ARAÇ DEĞER KAYBI ======================== */
  "arac-deger-kaybi": {
    title: "Araç Değer Kaybı Hesaplama | Arabam Kaç Yılda Ne Kadar Değer Kaybeder?",
    description:
      "Araç değer kaybı hesaplama: aracın fiyatı ve yıllık kayıp oranına göre yıllara göre tahmini değerini, toplam değer kaybını ve yıllık ortalama kaybı tablo hâlinde görün.",
    intro:
      "Araç değer kaybı, her yıl aracın o anki değeri üzerinden belirli bir oranda azalma olarak hesaplanır (azalan bakiyeler yöntemi). Bu araç, ilk yıl ve sonraki yıllar için ayrı oran girmenize izin verir ve aracın yıllara göre tahmini değerini tablo hâlinde gösterir.",
    howItWorks: [
      "Aracın bugünkü fiyatını girin.",
      "İlk yıl ve sonraki yıllar için yıllık değer kaybı oranını belirleyin.",
      "Kaç yıllık tahmin istediğinizi yazın.",
      "Yıl sonu değerlerini ve toplam kaybı tablodan inceleyin.",
    ],
    sections: [
      {
        heading: "Değer kaybı formülü",
        body: [
          "Yıl sonu değeri = önceki yıl değeri × (1 − yıllık kayıp oranı)",
          "Toplam değer kaybı = alış fiyatı − son yıl değeri",
          "Oran her yıl kalan değere uygulandığı için kayıp tutarı yıllar geçtikçe küçülür.",
        ],
      },
      {
        heading: "Örnek: 1.500.000 TL'lik araç",
        body: [
          "İlk yıl %15, sonraki yıllarda %10 değer kaybı varsayımıyla:",
          ...dep.rows.map((r) => `- ${r.year}. yıl sonu: ${tl(r.value)} (toplam kayıp ${pc(r.totalLossPercent)})`),
          `5 yılda toplam değer kaybı <strong>${tl(dep.totalLoss)}</strong>, yıllık ortalama ${tl(dep.averageYearlyLoss)} olur.`,
        ],
      },
      {
        heading: "Değer kaybını etkileyen etkenler",
        body: [
          "- <strong>Marka ve model talebi:</strong> İkinci elde aranan modeller daha yavaş değer kaybeder.",
          "- <strong>Kilometre:</strong> Yıllık ortalamanın üzerinde kullanım değeri düşürür.",
          "- <strong>Hasar kaydı ve boya/değişen:</strong> Tramer kaydı fiyatı doğrudan etkiler.",
          "- <strong>Bakım geçmişi:</strong> Yetkili serviste düzenli bakım değeri korur.",
          "- <strong>Yakıt türü ve vergi düzenlemeleri:</strong> ÖTV ve MTV değişiklikleri ikinci el fiyatlarını etkiler.",
        ],
      },
      {
        heading: "Enflasyon ortamında değer kaybı",
        body: [
          "Yüksek enflasyon dönemlerinde ikinci el araç fiyatları TL olarak artabilir; bu, aracın değer kazandığı anlamına gelmez. Gerçek değer kaybını görmek için ikinci el fiyatını aynı modelin güncel sıfır fiyatıyla karşılaştırın. Bu araç, bugünkü fiyat üzerinden reel kaybı tahmin eder.",
        ],
      },
    ],
    faqs: [
      {
        question: "Bir araba yılda ne kadar değer kaybeder?",
        answer:
          "Değer kaybı model, kilometre ve piyasa koşullarına göre değişir. Genellikle ilk yıllarda kayıp daha hızlıdır, sonraki yıllarda yavaşlar. Kendi aracınız için ikinci el ilanlarındaki aynı model ve yaştaki fiyatları karşılaştırarak bir oran belirleyebilirsiniz.",
      },
      {
        question: "Sıfır araç neden ilk yıl daha çok değer kaybeder?",
        answer:
          "Araç tescil edildiği anda ikinci el statüsüne geçer ve satış fiyatına dahil vergiler ile bayi kârı ikinci el değerine tam yansımaz. Bu nedenle ilk yıl kaybı genellikle sonraki yıllardan yüksektir.",
      },
      {
        question: "Değer kaybı ile kaza sonrası değer kaybı aynı şey mi?",
        answer:
          "Hayır. Bu araç zamana bağlı olağan değer kaybını hesaplar. Kaza sonrası değer kaybı, hasar nedeniyle aracın piyasa değerinde oluşan düşüştür ve kusurlu tarafın sigortasından ayrıca talep edilebilir.",
      },
    ],
  },

  /* ======================== ELEKTRİKLİ ARAÇ ======================== */
  "elektrikli-arac-sarj": {
    title: "Elektrikli Araç Şarj Maliyeti Hesaplama | 100 km Kaç TL?",
    description:
      "Elektrikli araç şarj maliyeti hesaplama: evde ve hızlı şarjda 100 km maliyetini, tam şarj ücretini ve benzinli/dizel araca göre yıllık tasarrufu hesaplayın.",
    intro:
      "Elektrikli araçta 100 km maliyeti, aracın 100 km'deki enerji tüketimi (kWh) ile elektrik birim fiyatının çarpılmasıyla bulunur; şarj sırasında oluşan kayıp da eklenir. Bu araç ev ve hızlı şarj karışımına göre ortalama maliyeti hesaplar ve benzinli ya da dizel bir araçla yıllık karşılaştırma yapar.",
    howItWorks: [
      "Aracın batarya kapasitesini ve 100 km'deki tüketimini girin.",
      "Evdeki elektrik birim fiyatını ve kullandığınız hızlı şarj ağının kWh fiyatını yazın.",
      "Şarjlarınızın ne kadarını hızlı şarjda yaptığınızı yüzde olarak belirtin.",
      "Karşılaştırma için yakıtlı aracın tüketimini ve yakıt litre fiyatını girin.",
    ],
    sections: [
      {
        heading: "Şarj maliyeti formülü",
        body: [
          "100 km maliyeti = tüketim (kWh/100 km) ÷ (1 − şarj kaybı) × ortalama kWh fiyatı",
          "Ortalama kWh fiyatı = ev fiyatı × ev şarj payı + hızlı şarj fiyatı × hızlı şarj payı",
          "Tam şarj ücreti = batarya kapasitesi ÷ (1 − şarj kaybı) × kWh fiyatı",
        ],
      },
      {
        heading: "Örnek karşılaştırma",
        body: [
          "16 kWh/100 km tüketen, 60 kWh bataryalı bir araç; evde 3 TL/kWh, hızlı şarjda 12 TL/kWh, şarjların %20'si hızlı şarjda ve %10 şarj kaybıyla; 6,5 L/100 km yakan, yakıtı 50 TL olan bir araçla karşılaştırıldığında (örnek fiyatlar):",
          `- Elektrikli araç 100 km: <strong>${tl(ev.evPer100)}</strong>`,
          `- Yakıtlı araç 100 km: <strong>${tl(ev.fuelPer100!)}</strong>`,
          `- Yılda 15.000 km için tasarruf: <strong>${tl(ev.yearlySaving!)}</strong>`,
          "Kendi hesabınızda güncel elektrik tarifenizi ve şarj ağının fiyatını kullanın; sonuç fiyatlara çok duyarlıdır.",
        ],
      },
      {
        heading: "Ev şarjı ile hızlı şarj farkı",
        body: [
          "Evde (AC) şarj, şebeke elektrik tarifesiyle yapıldığı için en ekonomik seçenektir. Hızlı (DC) şarj istasyonlarında kWh fiyatı genellikle birkaç kat yüksektir. Bu yüzden hızlı şarj payınız arttıkça elektrikli aracın yakıtlı araca göre avantajı azalır; çoğunlukla hızlı şarj kullananlarda fark kapanabilir.",
          "Şarj kaybı; şarj cihazı, kablo ve batarya ısıl yönetiminde harcanan enerjidir. Ev şarjında genellikle hızlı şarja göre daha belirgindir; bu yüzden faturanıza yansıyan tüketim, aracın gösterdiği tüketimden biraz yüksek olur.",
        ],
      },
    ],
    faqs: [
      {
        question: "Elektrikli araç 100 km'de kaç TL tutar?",
        answer:
          "Aracın tüketimi ile elektrik fiyatına bağlıdır. 100 km'de 16 kWh tüketen bir araç, ev şarjında yaklaşık 16 kWh + şarj kaybı kadar elektrik harcar. Bunu kendi tarifenizdeki kWh fiyatıyla çarparak maliyeti bulabilirsiniz; araç bu hesabı otomatik yapar.",
      },
      {
        question: "Tam şarj kaç TL?",
        answer:
          "Batarya kapasitesi, şarj kaybı payıyla birlikte kWh fiyatıyla çarpılır. 60 kWh bataryayı 3 TL/kWh tarifeyle ve %10 kayıpla sıfırdan doldurmak yaklaşık 200 TL tutar. Pratikte batarya genellikle %20–80 arasında şarj edildiği için tek seferlik ücret daha düşüktür.",
      },
      {
        question: "Kışın menzil neden düşer?",
        answer:
          "Soğuk havada batarya kimyası daha verimsiz çalışır ve kabin ısıtması ek enerji harcar. Bu nedenle kış aylarında tüketim artar, menzil kısalır.",
      },
    ],
  },

  /* ======================== ARAÇ KARŞILAŞTIRMA ======================== */
  "arac-karsilastirma": {
    title: "Araç Karşılaştırma Hesaplama | İki Arabayı Toplam Maliyetle Kıyasla",
    description:
      "Araç karşılaştırma (araç kıyaslama): iki aracı alış fiyatı, yakıt/elektrik, sigorta-kasko, MTV, bakım ve değer kaybıyla toplam sahip olma maliyetine göre karşılaştırın.",
    intro:
      "Toplam sahip olma maliyeti, aracın değer kaybı (alış − satış fiyatı) ile kullanım süresi boyunca ödenen yakıt, sigorta, vergi ve bakım giderlerinin toplamıdır. Bu araç iki aracı aynı süre ve kilometre üzerinden karşılaştırır; hangisinin toplamda, aylık ve kilometre başına daha ekonomik olduğunu gösterir.",
    howItWorks: [
      "Aracı ne kadar süre kullanacağınızı ve yıllık kaç kilometre yaptığınızı girin.",
      "Her iki araç için alış fiyatı, tüketim ve yakıt/elektrik birim fiyatını yazın.",
      "Yıllık sigorta-kasko, MTV ve bakım giderlerini ekleyin.",
      "Süre sonunda aracın alış fiyatının yüzde kaçına satılacağını tahmin edin.",
    ],
    sections: [
      {
        heading: "Toplam maliyet formülü",
        body: [
          "Toplam maliyet = (alış fiyatı − satış değeri) + süre × (yıllık enerji + sigorta + MTV + bakım)",
          "Yıllık enerji gideri = 100 km tüketim × birim fiyat × yıllık km ÷ 100",
          "Kilometre maliyeti = toplam maliyet ÷ (süre × yıllık km)",
        ],
      },
      {
        heading: "Örnek: benzinli ile elektrikli araç",
        body: [
          "5 yıl ve yılda 15.000 km kullanım için iki örnek araç (örnek fiyatlar):",
          `- <strong>Benzinli</strong> (1.400.000 TL, 6,5 L/100 km, %60 satış değeri): toplam <strong>${tl(carA.total)}</strong>, km başına ${tl(carA.perKm)}`,
          `- <strong>Elektrikli</strong> (1.800.000 TL, 17 kWh/100 km, %50 satış değeri): toplam <strong>${tl(carB.total)}</strong>, km başına ${tl(carB.perKm)}`,
          `Bu senaryoda ${carA.total <= carB.total ? "benzinli" : "elektrikli"} araç ${tl(Math.abs(carA.total - carB.total))} daha ekonomiktir. Yıllık kilometre arttıkça düşük işletme giderli aracın avantajı büyür.`,
        ],
      },
      {
        heading: "Karşılaştırmada sık yapılan hatalar",
        body: [
          "- Yalnızca alış fiyatına bakmak: Ucuz araç, yüksek tüketim ve hızlı değer kaybıyla toplamda pahalıya gelebilir.",
          "- Değer kaybını unutmak: Çoğu araçta en büyük maliyet kalemi değer kaybıdır.",
          "- Kredi faizini eklememek: Krediyle alınan araçta faiz, toplam maliyeti ciddi şekilde artırır.",
          "- Gerçek kullanımı yansıtmamak: Şehir içi ağırlıklı kullanımda tüketim katalog değerinin üzerine çıkar.",
        ],
      },
    ],
    faqs: [
      {
        question: "İki araba nasıl karşılaştırılır?",
        answer:
          "Alış fiyatına ek olarak yakıt, sigorta-kasko, MTV, bakım ve süre sonundaki satış değeri birlikte hesaplanmalıdır. Aynı süre ve kilometre üzerinden bulunan toplam sahip olma maliyeti, iki aracı adil biçimde karşılaştırır.",
      },
      {
        question: "Elektrikli araç mı benzinli mi daha ekonomik?",
        answer:
          "Yıllık kilometreniz, ev şarjı imkânınız, elektrik ve yakıt fiyatları ile iki aracın alış fiyatı farkına bağlıdır. Çok yol yapan ve evde şarj edebilen kullanıcılarda elektrikli araç genellikle avantajlıdır; araç bu karşılaştırmayı kendi rakamlarınızla yapar.",
      },
      {
        question: "Satış değeri yüzdesini nasıl tahmin ederim?",
        answer:
          "İkinci el ilanlarında aynı modelin planladığınız yaştaki fiyatını, bugünkü sıfır fiyatına bölün. Araç Değer Kaybı aracıyla da yıllara göre tahmin yapabilirsiniz.",
      },
    ],
  },

  /* ======================== BİRİM FİYAT ======================== */
  "birim-fiyat": {
    title: "Birim Fiyat Hesaplama | Market Ürünlerinde Hangisi Daha Ucuz?",
    description:
      "Market birim fiyat karşılaştırma: farklı gramaj, litre ve paket boyutlarındaki ürünlerin kilogram, litre veya adet başına fiyatını hesaplayıp en ucuzunu bulun.",
    intro:
      "Birim fiyat, ürünün fiyatının paket miktarına bölünmesiyle bulunur ve farklı boyutlardaki ürünleri aynı ölçüde (kilogram, litre veya adet başına) karşılaştırmayı sağlar. Bu araç girdiğiniz ürünlerin birim fiyatlarını hesaplar, en ucuzu işaretler ve diğerlerinin ne kadar pahalı olduğunu yüzde olarak gösterir.",
    howItWorks: [
      "Karşılaştırmak istediğiniz her ürünün raf fiyatını girin.",
      "Paket miktarını ve birimini (gram, kilogram, mililitre, litre, adet) seçin.",
      "Çoklu paketlerde paketteki adet sayısını yazın (örneğin 6×1 L için 6).",
      "Tablodan en ucuz ürünü ve fiyat farklarını görün.",
    ],
    sections: [
      {
        heading: "Birim fiyat formülü",
        body: [
          "Birim fiyat = ürün fiyatı ÷ (paket miktarı × paketteki adet)",
          "Gram ve mililitre değerleri karşılaştırma için kilograma ve litreye çevrilir: 500 g = 0,5 kg, 750 ml = 0,75 L.",
        ],
      },
      {
        heading: "Örnek: aynı ürünün üç farklı paketi",
        body: [
          ...unit.rows.map(
            (r) =>
              `- ${r.name}: <strong>${tl(r.unitPrice)}/kg</strong>${r.overCheapestPercent === 0 ? " (en ucuz)" : ` (en ucuzdan ${pc(r.overCheapestPercent ?? 0)} pahalı)`}`,
          ),
          "Büyük paket her zaman daha ucuz değildir; çoklu paket kampanyaları ve indirimler sıralamayı değiştirebilir.",
        ],
      },
      {
        heading: "Markette tasarruf için ipuçları",
        body: [
          "- Raf etiketindeki birim fiyatı (TL/kg, TL/L) kontrol edin; etiket yoksa bu araçla hesaplayın.",
          "- \"2 al 1 öde\" gibi kampanyaları birim fiyata çevirerek değerlendirin.",
          "- Çabuk bozulan ürünlerde büyük paketin tamamını tüketip tüketemeyeceğinizi göz önünde bulundurun.",
          "- Konsantre ürünlerde (deterjan, şampuan) kullanım başına maliyete bakmak daha doğru sonuç verir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Birim fiyat nasıl hesaplanır?",
        answer:
          "Ürünün fiyatı, içerdiği miktara bölünür. Örneğin 500 gramı 65 TL olan ürünün kilogram fiyatı 65 ÷ 0,5 = 130 TL'dir.",
      },
      {
        question: "Büyük paket her zaman daha mı ucuz?",
        answer:
          "Hayır. Çoğu zaman büyük paket avantajlı olsa da indirimdeki küçük paketler veya çoklu paket kampanyaları birim fiyatta daha ucuz olabilir. Kesin karşılaştırma için birim fiyata bakılmalıdır.",
      },
      {
        question: "Kilogram ile litre karşılaştırılabilir mi?",
        answer:
          "Doğrudan karşılaştırılamaz; ürünün yoğunluğu bilinmeden kilogram ve litre birbirine çevrilemez. Araç farklı ölçü türlerinde karşılaştırma yapmaz ve sizi uyarır.",
      },
    ],
  },
};
