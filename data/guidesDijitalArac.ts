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
  {
    slug: "kripto-ortalama-maliyet-nasil-hesaplanir",
    title: "Kripto Ortalama Maliyet Nasıl Hesaplanır?",
    metaTitle: "Kripto Ortalama Maliyet ve Kâr/Zarar Nasıl Hesaplanır?",
    description:
      "Kripto alımlarında ortalama maliyet, komisyonun etkisi, başa baş fiyatı ve düzenli alım (maliyet ortalaması) yönteminin örnekli anlatımı.",
    category: "Finans",
    icon: "🪙",
    ...common,
    readingMinutes: 6,
    tool: { slug: "kripto-kar-zarar", label: "Kripto Kâr/Zarar Hesaplama" },
    intro:
      "Bir kripto varlığı farklı zamanlarda ve farklı fiyatlardan aldığınızda, elinizdeki pozisyonun gerçek maliyeti tek tek alım fiyatlarının basit ortalaması değildir. Doğru ortalama maliyet, her alımın miktarıyla ağırlıklandırılır ve ödenen komisyonları da içerir. Kâr ya da zararınızı doğru görmek için önce bu rakamı bilmeniz gerekir.",
    sections: [
      {
        heading: "Ağırlıklı ortalama neden önemli?",
        body: [
          "Örneğin 1.000 TL'ye 1 adet, 500 TL'ye 3 adet aldıysanız ortalama fiyatınız (1.000 + 500) ÷ 2 = 750 TL değildir. Toplam ödediğiniz 2.500 TL'yi 4 adede böldüğünüzde ortalama maliyetiniz <strong>625 TL</strong> olur. Daha çok miktar aldığınız fiyat, ortalamayı kendine doğru çeker.",
          "Formül: Ortalama maliyet = (Σ miktar × fiyat + alış komisyonları) ÷ toplam miktar",
        ],
      },
      {
        heading: "Komisyon kârı nasıl etkiler?",
        body: [
          "Kripto platformları hem alışta hem satışta işlem tutarının belli bir yüzdesini komisyon olarak keser. Alış komisyonu maliyetinizi artırır, satış komisyonu ise satıştan elinize geçen tutarı azaltır. Bu yüzden zarar etmeden çıkabileceğiniz fiyat (başa baş fiyatı), ortalama maliyetinizin biraz üzerindedir.",
          "Sık ve küçük tutarlı işlemlerde komisyonların toplamı küçümsenmeyecek bir maliyete dönüşebilir. Platformların komisyon oranları, piyasa yapıcı/alıcı ayrımı ve işlem hacmine göre değişebilir; kendi oranınızı hesap ayarlarınızdan kontrol edin.",
        ],
      },
      {
        heading: "Örnek: üç ayrı alım",
        body: [
          "Bir varlıktan 0,005 adet 2.600.000 TL'den, 0,005 adet 2.300.000 TL'den ve 0,005 adet 2.000.000 TL'den alındığını, komisyonun %0,2 olduğunu varsayalım:",
          `- Toplam maliyet: ${tl(dca.totalCost)}`,
          `- Ortalama maliyet: <strong>${tl(dca.averageCost)}</strong>`,
          `- Başa baş satış fiyatı: ${tl(dca.breakEven)}`,
          `- Fiyat 2.400.000 TL iken: ${dca.current!.profit >= 0 ? "kâr" : "zarar"} <strong>${tl(Math.abs(dca.current!.profit))}</strong> (${pc(dca.current!.profitPercent)})`,
          "İlk alım fiyatı 2.600.000 TL olmasına rağmen, düşüşte yapılan ek alımlar ortalamayı aşağı çektiği için fiyat 2.400.000 TL'deyken pozisyon kâra geçmiştir.",
        ],
      },
      {
        heading: "Düzenli alım (maliyet ortalaması) yöntemi",
        body: [
          "Belirli aralıklarla (örneğin her ay) sabit bir tutarla alım yapmaya maliyet ortalaması denir. Fiyat düştüğünde aynı tutarla daha çok, yükseldiğinde daha az birim alınır. Yöntemin amacı \"doğru zamanı yakalama\" baskısını azaltmaktır.",
          "Bu yöntem riski ortadan kaldırmaz: Varlığın değeri uzun vadede düşerse ortalama maliyet ne kadar düşük olursa olsun zarar oluşur. Yatırım kararlarınızı kendi risk durumunuza göre verin.",
        ],
      },
      {
        heading: "Kayıt tutmanın önemi",
        body: [
          "Her alım ve satımın tarihini, miktarını, fiyatını ve komisyonunu bir tabloda tutmak hem kâr/zarar takibini hem de ileride doğabilecek vergi beyanlarını kolaylaştırır. Platformların işlem geçmişi raporlarını düzenli olarak indirip saklayın.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kripto ortalama maliyete komisyon eklenir mi?",
        answer:
          "Evet. Alış sırasında ödenen komisyon, varlığı edinme maliyetinin parçasıdır ve ortalama maliyete eklenmelidir. Satış komisyonu ise satıştan elinize geçen tutardan düşülür.",
      },
      {
        question: "Ortalama maliyetin altında satarsam ne olur?",
        answer:
          "Satılan miktar için zarar gerçekleşir. Ortalama maliyet yöntemiyle kalan pozisyonunuzun birim maliyeti değişmez; yalnızca miktarı azalır.",
      },
    ],
    related: ["bilesik-faiz-nedir-nasil-hesaplanir", "enflasyon-ve-zam-farki-hesaplama"],
  },

  /* ======================== ETKİLEŞİM ======================== */
  {
    slug: "etkilesim-orani-nedir-nasil-hesaplanir",
    title: "Etkileşim Oranı Nedir, Nasıl Hesaplanır?",
    metaTitle: "Etkileşim Oranı (Engagement Rate) Nedir, Nasıl Hesaplanır?",
    description:
      "Instagram ve TikTok etkileşim oranı formülleri, takipçiye ve erişime göre hesaplama farkı, iyi oran aralıkları ve oranı yükseltmenin yolları.",
    category: "Günlük",
    icon: "📣",
    ...common,
    readingMinutes: 6,
    tool: { slug: "etkilesim-orani", label: "Etkileşim Oranı Hesaplama" },
    intro:
      "Etkileşim oranı (engagement rate), bir sosyal medya hesabının takipçileriyle ne kadar güçlü bir bağ kurduğunu gösteren en yaygın ölçüdür. Takipçi sayısı tek başına bir hesabın etkisini anlatmaz; 10.000 takipçili aktif bir hesap, 100.000 takipçili ama kimsenin etkileşime girmediği bir hesaptan daha değerli olabilir. Markalar iş birliği seçerken de bu orana bakar.",
    sections: [
      {
        heading: "Üç farklı hesaplama yöntemi",
        body: [
          "- <strong>Takipçiye göre:</strong> (beğeni + yorum + paylaşım + kaydetme) ÷ takipçi × 100. En yaygın ve hesaplar arası kıyas için en kullanışlı yöntemdir.",
          "- <strong>Erişime göre:</strong> toplam etkileşim ÷ erişim × 100. İçeriği gören kişilerin ne kadarının harekete geçtiğini gösterir; içerik kalitesini ölçmek için daha doğrudur.",
          "- <strong>Gösterime göre:</strong> toplam etkileşim ÷ gösterim × 100. Aynı kişinin içeriği birden çok kez görmesini de sayar, bu yüzden oran en düşük çıkan yöntemdir.",
          "Erişim ve gösterim verileri yalnızca hesap sahibinin istatistik ekranında görünür; dışarıdan bir hesabı incelerken takipçiye göre oran kullanılır.",
        ],
      },
      {
        heading: "Hesap büyüklüğü oranı nasıl etkiler?",
        body: [
          "Takipçi sayısı arttıkça etkileşim oranı genellikle düşer. Küçük hesaplarda takipçilerin çoğu hesap sahibini tanır veya içeriğe gerçekten ilgi duyar; büyük hesaplarda ise pasif takipçi oranı artar.",
          `Örneğin 8.000 takipçili bir hesabın 470 beğeni, 25 yorum, 10 paylaşım ve 15 kaydetme alan gönderisinin oranı <strong>${pc(smallAcc.byFollowers)}</strong> olur. 500.000 takipçili bir hesabın 10.000 etkileşim alan gönderisinin oranı ise <strong>${pc(bigAcc.byFollowers)}</strong>'dir; ancak ulaştığı mutlak kişi sayısı çok daha fazladır.`,
          "Bu nedenle bir hesabı değerlendirirken oranı, benzer büyüklükteki ve aynı alandaki hesaplarla karşılaştırmak gerekir.",
        ],
      },
      {
        heading: "Hangi etkileşim daha değerli?",
        body: [
          "Tüm etkileşimler aynı ağırlıkta değildir. Beğeni en kolay verilen tepkidir. Yorum, içeriğe zaman ayrıldığını gösterir. Kaydetme, içeriğin tekrar dönülecek kadar faydalı bulunduğunu; paylaşım ise başkalarına önerilecek kadar değerli görüldüğünü gösterir. Platformların içerik dağıtımında da kaydetme ve paylaşımın etkili olduğu bilinmektedir.",
        ],
      },
      {
        heading: "Oranı yükseltmenin yolları",
        body: [
          "- Kaydedilmeye değer içerik üretin: kontrol listeleri, kısa rehberler, karşılaştırmalar.",
          "- Gönderiden sonraki ilk saatlerde yorumlara yanıt verin.",
          "- İstatistiklerden takipçilerinizin en aktif olduğu saatleri bulun.",
          "- Soru soran, görüş isteyen açıklamalar yazın.",
          "- Takipçi veya beğeni satın almayın: Etkileşime girmeyen takipçiler oranı düşürür ve hesabın güvenilirliğine zarar verir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Etkileşim oranı için kaç gönderi kullanılmalı?",
        answer:
          "Tek bir gönderi yanıltıcı olabilir. Son 10–12 gönderinin etkileşimlerini toplayıp gönderi sayısına bölmek daha güvenilir bir ortalama verir. Hesaplama aracında gönderi sayısını girerek ortalamayı otomatik alabilirsiniz.",
      },
      {
        question: "Video izlenmeleri etkileşime dahil mi?",
        answer:
          "Genellikle hayır. İzlenme, erişim/gösterim türünden bir ölçüdür. Etkileşim; beğeni, yorum, paylaşım ve kaydetme gibi kullanıcının bilinçli bir eylemde bulunduğu tepkileri kapsar.",
      },
    ],
    related: ["youtube-ne-kadar-para-veriyor-rpm-cpm", "yuzde-hesaplama-nasil-yapilir"],
  },

  /* ======================== YOUTUBE ======================== */
  {
    slug: "youtube-ne-kadar-para-veriyor-rpm-cpm",
    title: "YouTube Ne Kadar Para Veriyor? RPM ve CPM Rehberi",
    metaTitle: "YouTube 1.000 İzlenmeye Ne Kadar Öder? RPM ve CPM Nedir?",
    description:
      "YouTube reklam gelirinin nasıl paylaşıldığı, RPM ile CPM farkı, geliri artıran etkenler ve izlenme başına kazancı hesaplama yöntemi.",
    category: "Finans",
    icon: "▶️",
    ...common,
    readingMinutes: 6,
    tool: { slug: "youtube-geliri", label: "YouTube Geliri Hesaplama" },
    intro:
      "\"YouTube 1.000 izlenmeye ne kadar veriyor?\" sorusunun tek bir cevabı yoktur. Kazanç; izleyicinin hangi ülkeden geldiğine, kanalın konusuna, videonun uzunluğuna ve yılın hangi döneminde olunduğuna göre birkaç kat değişebilir. Doğru tahmin için iki kavramı bilmek gerekir: CPM ve RPM.",
    sections: [
      {
        heading: "Reklam geliri nasıl paylaşılır?",
        body: [
          `YouTube İş Ortağı Programı'ndaki kanallarda, uzun videolarda gösterilen reklamlardan elde edilen net gelirin <strong>%${SHARE}'i</strong> içerik üreticisine, kalanı YouTube'a kalır. Shorts videolarında ise gelir farklı bir havuz modeliyle paylaştırılır.`,
          "Ödemeler AdSense hesabı üzerinden ve dolar cinsinden yapılır; bu nedenle TL karşılığı kura göre değişir.",
        ],
      },
      {
        heading: "CPM ve RPM farkı",
        body: [
          "<strong>CPM</strong>, reklamverenin 1.000 reklam gösterimi için ödediği bedeldir. Kanal sahibinin değil, reklamverenin bakış açısını yansıtır.",
          "<strong>RPM</strong>, kanalın her 1.000 izlenmeden eline geçen toplam gelirdir. Reklam gösterilmeyen izlenmeleri, YouTube'un payını ve kanal üyeliği gibi diğer gelirleri de içerir. Bu yüzden RPM, CPM'den belirgin şekilde düşüktür ve gerçek kazancı tahmin etmek için daha doğru göstergedir.",
          "Kendi RPM değerinizi YouTube Studio'da Analytics > Gelir sekmesinde görebilirsiniz.",
        ],
      },
      {
        heading: "Örnek: aynı izlenme, farklı RPM",
        body: [
          "Aylık 200.000 izlenme alan iki kanal düşünelim. Biri eğlence içerikli ve RPM'i 15 TL, diğeri finans içerikli ve RPM'i 45 TL olsun (örnek değerler):",
          `- Eğlence kanalı: aylık <strong>${tl(ytLow.monthly)}</strong>`,
          `- Finans kanalı: aylık <strong>${tl(ytHigh.monthly)}</strong>`,
          "Aynı izlenme sayısına rağmen gelir üç katı farklıdır. Bu nedenle kanallar arası kıyasta izlenme sayısından çok RPM'e bakmak gerekir.",
        ],
      },
      {
        heading: "Geliri artıran etkenler",
        body: [
          "- <strong>Konu:</strong> Finans, yazılım, eğitim ve sigorta gibi alanlarda reklamverenler daha yüksek ücret öder.",
          "- <strong>Video süresi:</strong> 8 dakikadan uzun videolara video ortası reklam eklenebilir.",
          "- <strong>İzleyici ülkesi:</strong> Reklam pazarının büyük olduğu ülkelerden gelen izlenmeler daha değerlidir.",
          "- <strong>Sezon:</strong> Yılın son çeyreğinde reklam bütçeleri arttığı için CPM'ler genellikle yükselir, yılın başında düşer.",
          "- <strong>Gelir çeşitliliği:</strong> Kanal üyeliği, Super Thanks ve sponsorluklar reklam gelirine ek kazanç sağlar.",
        ],
      },
      {
        heading: "Vergilendirme",
        body: [
          "YouTube'dan elde edilen kazanç gelir vergisine tabidir. Türkiye'de sosyal içerik üreticileri için, belirli şartlarla bankalar aracılığıyla stopaj yoluyla vergilendirilen bir kazanç istisnası düzenlemesi bulunur. İstisnanın sınırları ve şartları yıllara göre değişebildiği için beyan yükümlülüğünüzü bir mali müşavirle netleştirin.",
        ],
      },
    ],
    faqs: [
      {
        question: "YouTube'dan para kazanmak için kaç abone gerekir?",
        answer:
          "Reklam gelirine erişmek için YouTube İş Ortağı Programı'na kabul edilmek gerekir. Programın abone ve izlenme süresi şartlarını YouTube belirler ve zaman zaman günceller; güncel şartları YouTube yardım merkezinden kontrol edin.",
      },
      {
        question: "1 milyon izlenme kaç TL kazandırır?",
        answer:
          "1 milyon izlenme, RPM × 1.000 kadar gelir getirir. RPM'iniz 20 TL ise yaklaşık 20.000 TL, 40 TL ise yaklaşık 40.000 TL kazanırsınız. Kendi RPM'inizle hesaplamak için YouTube Geliri aracını kullanın.",
      },
    ],
    related: ["etkilesim-orani-nedir-nasil-hesaplanir", "serbest-meslek-makbuzu-nasil-kesilir"],
  },

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
    related: ["araba-alirken-toplam-maliyet-nasil-hesaplanir", `mtv-${MTV_YEAR}-nasil-hesaplanir`],
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
    related: ["araba-alirken-toplam-maliyet-nasil-hesaplanir", "yakit-maliyeti-nasil-hesaplanir"],
  },

  /* ======================== TOPLAM MALİYET ======================== */
  {
    slug: "araba-alirken-toplam-maliyet-nasil-hesaplanir",
    title: "Araba Alırken Toplam Maliyet Nasıl Hesaplanır?",
    metaTitle: "Araç Karşılaştırma: Araba Alırken Toplam Maliyet Nasıl Hesaplanır?",
    description:
      "İki aracı doğru karşılaştırmak için toplam sahip olma maliyeti: değer kaybı, yakıt, sigorta, MTV ve bakımın birlikte hesaplanması, örnek karşılaştırma.",
    category: "Günlük",
    icon: "🚗",
    ...common,
    readingMinutes: 6,
    tool: { slug: "arac-karsilastirma", label: "Araç Karşılaştırma" },
    intro:
      "Araç seçerken en sık yapılan hata, yalnızca etiket fiyatını karşılaştırmaktır. Oysa bir aracın size gerçek maliyeti, kullandığınız süre boyunca ödediğiniz her şeyin toplamıdır. Bu yaklaşıma <strong>toplam sahip olma maliyeti</strong> denir ve iki aracı adil biçimde karşılaştırmanın en sağlam yoludur.",
    sections: [
      {
        heading: "Toplam sahip olma maliyetinin kalemleri",
        body: [
          "- <strong>Değer kaybı:</strong> Alış fiyatı ile satarken alacağınız fiyat arasındaki fark. Çoğu araçta en büyük kalemdir.",
          "- <strong>Yakıt veya elektrik:</strong> Yıllık kilometre × 100 km tüketim × birim fiyat ÷ 100.",
          "- <strong>Sigorta ve kasko:</strong> Aracın değeri, modeli ve sürücü profiline göre değişir.",
          "- <strong>MTV:</strong> Motor hacmi (elektriklilerde motor gücü), yaş ve taşıt değerine göre belirlenir.",
          "- <strong>Bakım ve lastik:</strong> Periyodik bakım, fren, lastik ve beklenmeyen onarımlar.",
          "- <strong>Finansman:</strong> Krediyle alıyorsanız faiz ve vergiler de maliyete eklenir.",
        ],
      },
      {
        heading: "Örnek: ucuz ama çok yakan araç mı, pahalı ama tasarruflu araç mı?",
        body: [
          "Yılda 20.000 km ve 5 yıllık kullanım için iki araç (örnek rakamlar):",
          `- <strong>A aracı</strong>: 1.100.000 TL, 100 km'de 7,5 L, 5 yıl sonra %50 değer. Toplam maliyet <strong>${tl(tcoCheap.total)}</strong>, km başına ${tl(tcoCheap.perKm)}.`,
          `- <strong>B aracı</strong>: 1.350.000 TL, 100 km'de 5 L, 5 yıl sonra %60 değer. Toplam maliyet <strong>${tl(tcoPricey.total)}</strong>, km başına ${tl(tcoPricey.perKm)}.`,
          `Etiket fiyatı 250.000 TL yüksek olmasına rağmen ${tcoPricey.total < tcoCheap.total ? `B aracı 5 yılın sonunda ${tl(tcoCheap.total - tcoPricey.total)} daha ekonomik olur` : `A aracı yine de ${tl(tcoPricey.total - tcoCheap.total)} daha ekonomik kalır`}. Düşük tüketim ve daha iyi korunan ikinci el değeri, alış fiyatı farkını telafi edebilir.`,
        ],
      },
      {
        heading: "Doğru karşılaştırma için ipuçları",
        body: [
          "- Katalog tüketimi yerine gerçek kullanım verilerine (sürücü yorumları, kendi deneyiminiz) dayanın.",
          "- Kasko tekliflerini satın almadan önce her iki araç için alın; modeller arasında belirgin fark olabilir.",
          "- Satış değeri tahmini için ikinci el ilanlarında aynı modelin planladığınız yaştaki fiyatına bakın.",
          "- Aracı uzun süre kullanacaksanız işletme giderlerinin, kısa süre kullanacaksanız değer kaybının ağırlığı artar.",
        ],
      },
    ],
    faqs: [
      {
        question: "Araç alırken en önemli maliyet kalemi hangisi?",
        answer:
          "Çoğu araç için değer kaybıdır. Yüksek kilometre yapan sürücülerde ise yakıt gideri değer kaybına yaklaşabilir veya onu geçebilir.",
      },
      {
        question: "Araç kıyaslamada yakıt fiyatı artışı nasıl hesaba katılır?",
        answer:
          "Gelecekteki fiyatlar bilinemediği için karşılaştırma bugünkü fiyatlarla yapılır. Yakıt fiyatının artması, tüketimi düşük olan aracın avantajını büyütür; farklı fiyatlarla birkaç senaryo deneyebilirsiniz.",
      },
    ],
    related: ["araba-yilda-ne-kadar-deger-kaybeder", "elektrikli-arac-sarj-maliyeti-ev-mi-istasyon-mu"],
  },

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
