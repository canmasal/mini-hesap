/**
 * Üçüncü araç grubunun SEO içerikleri: ideal kilo, adet takvimi,
 * işveren maliyeti, kredi kartı asgari ödeme, gecikme zammı.
 */

import type { ToolSeo } from "@/data/calculatorSeo";
import {
  CREDIT_CARD,
  EMPLOYER_RATES,
  LATE_PAYMENT,
  MINIMUM_WAGE,
  PARAMETERS_YEAR as Y,
  SGK_LIMITS,
  tl,
} from "@/data/parameters";

const pct = (rate: number, digits = 2) =>
  `%${(rate * 100).toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: digits })}`;
const dmy = (iso: string) => iso.split("-").reverse().join(".");

export const toolSeoBatch3: Record<string, ToolSeo> = {
  /* ==================== İDEAL KİLO ==================== */
  "ideal-kilo": {
    title: "İdeal Kilo Hesaplama | Boya Göre Kaç Kilo Olmalı",
    description:
      "İdeal kilo hesaplama: boy ve cinsiyetinize göre ideal kilonuzu 4 formülle ve VKİ 18,5–24,9 sağlıklı kilo aralığınızı öğrenin.",
    intro:
      "İdeal kilo, boyunuza göre sağlıklı kabul edilen kilo aralığıdır. Tek bir doğru rakam yoktur: klinikte kullanılan formüller birbirinden birkaç kilo farklı sonuç verir. Hesaplayıcı dört yaygın formülü ve vücut kitle indeksine dayanan sağlıklı kilo aralığını birlikte gösterir.",
    howItWorks: [
      "Boyunuzu santimetre olarak girin.",
      "Cinsiyetinizi seçin; formüller kadın ve erkek için farklı katsayı kullanır.",
      "İsterseniz mevcut kilonuzu girin, hedefe kaç kilo kaldığını gösterelim.",
    ],
    sections: [
      {
        heading: "İdeal kilo formülleri",
        body: [
          "Klasik formüller 152,4 cm (5 ft) taban kabul eder ve bu boyun üzerindeki her inç (2,54 cm) için sabit bir kilo ekler:",
          "- <strong>Devine:</strong> Erkek 50 kg + 2,3 kg/inç · Kadın 45,5 kg + 2,3 kg/inç",
          "- <strong>Robinson:</strong> Erkek 52 kg + 1,9 kg/inç · Kadın 49 kg + 1,7 kg/inç",
          "- <strong>Miller:</strong> Erkek 56,2 kg + 1,41 kg/inç · Kadın 53,1 kg + 1,36 kg/inç",
          "- <strong>Hamwi:</strong> Erkek 48 kg + 2,7 kg/inç · Kadın 45,5 kg + 2,2 kg/inç",
          "Devine formülü ilaç dozu hesaplarında yaygın kullanıldığı için en çok bilinenidir; Robinson ve Miller daha yeni ve genellikle biraz daha yüksek sonuç verir.",
        ],
      },
      {
        heading: "Sağlıklı kilo aralığı formülden daha kullanışlıdır",
        body: [
          "Dünya Sağlık Örgütü, sağlıklı kiloyu tek bir sayı yerine <strong>VKİ 18,5 – 24,9</strong> aralığıyla tanımlar.",
          "Aralık = <strong>18,5 × Boy² (m)</strong> ile <strong>24,9 × Boy² (m)</strong> arasıdır.",
          "Örnek: 1,70 m boyundaki biri için sağlıklı aralık 53,5 kg – 72,0 kg'dır. Bu aralığın herhangi bir yerinde olmak sağlıklı kabul edilir.",
        ],
      },
      {
        heading: "Formüllerin sınırları",
        body: [
          "İdeal kilo formülleri yalnızca boyu ve cinsiyeti dikkate alır; <strong>kas kütlesini, yaşı, kemik yapısını ve yağ oranını hesaba katmaz</strong>.",
          "Düzenli spor yapan biri kaslı olduğu için formülün üzerinde çıkabilir ve bu bir sorun değildir. Yaşlılarda ise kas kaybı nedeniyle formül olduğundan iyimser görünebilir.",
          "Bel çevresi de en az kilo kadar önemlidir: kadınlarda 88 cm, erkeklerde 102 cm üzeri metabolik risk artışıyla ilişkilendirilir.",
        ],
      },
    ],
    faqs: [
      {
        question: "1,70 boyunda ideal kilo kaçtır?",
        answer:
          "1,70 m boy için sağlıklı kilo aralığı yaklaşık 53,5 – 72 kg'dır. Klasik formüller kadınlar için yaklaşık 59 – 63 kg, erkekler için 66 – 70 kg aralığında bir değer verir.",
      },
      {
        question: "İdeal kilo formülleri yaşa göre değişir mi?",
        answer:
          "Bu formüller yaşı dikkate almaz. Yaş ilerledikçe kas kütlesi azalıp yağ oranı arttığı için aynı kiloda bile vücut bileşimi değişir; bu nedenle yaşlılarda kilo tek başına yeterli ölçüt değildir.",
      },
      {
        question: "İdeal kilo ile VKİ arasındaki fark nedir?",
        answer:
          "VKİ mevcut kilonuzun boyunuza göre hangi sınıfa girdiğini gösterir; ideal kilo ise hedef bir ağırlık önerir. İkisi birlikte kullanıldığında daha anlamlı olur.",
      },
      {
        question: "Kaç kilo vermeliyim?",
        answer:
          "Sağlıklı kilo aralığının üzerindeyseniz, aralığın üst sınırına inmek için gereken fark hedef olarak alınabilir. Haftada 0,5 – 1 kg'lık kayıp güvenli kabul edilir; hızlı kilo kaybı kas kaybına yol açar.",
      },
    ],
  },

  /* ==================== ADET TAKVİMİ ==================== */
  "adet-takvimi": {
    title: "Adet Günü Hesaplama | Regl ve Yumurtlama Takvimi",
    description:
      "Adet günü hesaplama: son adet tarihinize göre sonraki regl gününüzü, yumurtlama gününüzü ve doğurgan dönemi öğrenin. Üç döngülük takvim.",
    intro:
      "Adet takvimi, son adetinizin ilk günü ve döngü uzunluğunuzdan yola çıkarak bir sonraki regl tarihinizi, yumurtlama gününüzü ve gebelik ihtimalinin yüksek olduğu doğurgan dönemi tahmin eder.",
    howItWorks: [
      "Son adetinizin ilk gününü (kanamanın başladığı gün) seçin.",
      "Döngü uzunluğunuzu girin; ortalama 28 gündür.",
      "Adet süresini yazın.",
      "Sonraki adet, yumurtlama ve doğurgan dönem tarihleri hesaplanır.",
    ],
    sections: [
      {
        heading: "Döngü nasıl hesaplanır?",
        body: [
          "Döngü uzunluğu, bir adetin <strong>ilk gününden</strong> bir sonraki adetin ilk gününe kadar geçen gün sayısıdır. Adetin bittiği gün değil, başladığı gün esas alınır.",
          "Normal döngü 21 – 35 gün arasında değişir; 28 gün yalnızca ortalamadır. Kendi ortalamanızı bulmak için son üç ayın döngü uzunluklarının ortalamasını alabilirsiniz.",
          "Sonraki adet = <strong>Son adetin ilk günü + Döngü uzunluğu</strong>",
        ],
      },
      {
        heading: "Yumurtlama ve doğurgan dönem",
        body: [
          "Yumurtlamadan sonraki dönem (luteal faz) kişiden kişiye pek değişmez ve yaklaşık 14 gündür. Bu nedenle yumurtlama, <strong>bir sonraki adetten 14 gün önce</strong> kabul edilir.",
          "Sperm kadın vücudunda 5 güne kadar canlı kalabildiği için doğurgan pencere yumurtlamadan <strong>5 gün önce başlar</strong> ve yumurtlama gününde sona erer.",
          "Örnek: 28 günlük döngüde son adet 1 Mart'ta başladıysa sonraki adet 29 Mart, yumurtlama 15 Mart, doğurgan dönem 10 – 15 Mart olarak tahmin edilir.",
        ],
      },
      {
        heading: "Tahminleri ne bozar?",
        body: [
          "Stres, ağır egzersiz, hızlı kilo değişimi, hastalık, seyahat ve uyku düzenindeki bozulmalar yumurtlamayı öteleyerek döngüyü uzatabilir.",
          "Doğum kontrol hapı kullananlarda yumurtlama baskılandığı için doğurgan dönem hesabı geçerli değildir.",
          "Bu takvim bir <strong>korunma yöntemi değildir</strong>. Takvim yöntemi, düzenli döngüsü olanlarda bile yüksek başarısızlık oranına sahiptir.",
        ],
      },
      {
        heading: "Ne zaman hekime başvurmalı?",
        body: [
          "- Döngü sürekli 21 günden kısa veya 35 günden uzunsa",
          "- Adet 7 günden uzun sürüyor ya da çok yoğun kanama varsa",
          "- Üç ay üst üste adet görülmüyorsa",
          "- Adet arası kanama veya şiddetli ağrı varsa",
          "Adet gecikmesi durumunda gebelik ihtimali için testin, beklenen adet tarihinden birkaç gün sonra yapılması daha güvenilir sonuç verir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Adetim kaç gün gecikirse normal?",
        answer:
          "Düzenli döngüsü olanlarda birkaç günlük sapma normaldir. Bir haftadan uzun gecikmelerde, cinsel aktivite varsa gebelik testi yapılması; gecikme tekrarlıyorsa hekime başvurulması önerilir.",
      },
      {
        question: "Yumurtlama günü nasıl anlaşılır?",
        answer:
          "Takvim tahmininin yanında vücut belirtileri de yardımcı olur: yumurta akı kıvamında akıntı, hafif kasık ağrısı ve bazal vücut sıcaklığında yumurtlamadan sonra görülen hafif artış.",
      },
      {
        question: "Düzensiz döngüde takvim işe yarar mı?",
        answer:
          "Döngü uzunluğu her ay değişiyorsa tahminler güvenilirliğini kaybeder. Bu durumda son altı ayın en kısa ve en uzun döngüsüne göre bir aralık düşünmek daha gerçekçidir.",
      },
      {
        question: "Adet döngüsünün kaçıncı günündeyim?",
        answer:
          "Son adetinizin ilk günü döngünün 1. günüdür. Hesaplayıcı, girdiğiniz tarihe göre bugün kaçıncı günde olduğunuzu da gösterir.",
      },
    ],
  },
  /* ==================== İŞVEREN MALİYETİ ==================== */
  "isveren-maliyeti": {
    title: `İşveren Maliyeti Hesaplama ${Y} | SGK Primi`,
    description: `${Y} işveren maliyeti hesaplama: brüt maaşa SGK işveren payı ${pct(
      EMPLOYER_RATES.sgkTotal,
    )} ve işsizlik ${pct(
      EMPLOYER_RATES.unemployment,
    )} eklenerek bir çalışanın işverene aylık ve yıllık toplam maliyeti bulunur.`,
    intro: `Bir çalışanın işverene maliyeti brüt maaştan yüksektir: brütün üzerine SGK ve işsizlik sigortası işveren payları eklenir. ${Y} yılında teşviksiz toplam işveren yükü brüt ücretin ${pct(
      EMPLOYER_RATES.total,
    )} kadarıdır. Hesaplayıcı prim indirimlerini de dikkate alarak aylık ve yıllık maliyeti gösterir.`,
    howItWorks: [
      "Çalışanın brüt maaşını girin.",
      "Prim indirimi durumunu seçin: imalat (5 puan), imalat dışı (2 puan) veya indirim yok.",
      "İsterseniz yemek, servis gibi yan hakları ekleyin.",
      "Aylık ve yıllık toplam maliyet ile çalışanın eline geçen net tutar hesaplanır.",
    ],
    sections: [
      {
        heading: `${Y} işveren prim oranları`,
        body: [
          "İşveren yükü üç SGK kaleminden ve işsizlik priminden oluşur:",
          `- Kısa vadeli sigorta kolları: <strong>${pct(EMPLOYER_RATES.shortTerm)}</strong>`,
          `- Malullük, yaşlılık ve ölüm: <strong>${pct(EMPLOYER_RATES.pension)}</strong>`,
          `- Genel sağlık sigortası: <strong>${pct(EMPLOYER_RATES.health)}</strong>`,
          `- İşsizlik sigortası işveren payı: <strong>${pct(EMPLOYER_RATES.unemployment)}</strong>`,
          `Toplam: <strong>${pct(EMPLOYER_RATES.total)}</strong>. ${Y} yılında malullük-yaşlılık-ölüm işveren payı %11'den %12'ye, kısa vadeli sigorta kolları %2'den %2,25'e çıktığı için toplam yük bir önceki yıla göre 1 puan arttı.`,
        ],
      },
      {
        heading: "Prim indirimi maliyeti nasıl düşürür?",
        body: [
          "5510 sayılı Kanunun 81/ı maddesindeki indirim, malullük-yaşlılık-ölüm işveren hissesinden düşülür:",
          `- <strong>İmalat sektörü:</strong> 5 puan indirim → SGK işveren payı ${pct(
            EMPLOYER_RATES.sgkTotal - EMPLOYER_RATES.incentives.manufacturing,
          )}`,
          `- <strong>İmalat dışı sektörler:</strong> 2 puan indirim → SGK işveren payı ${pct(
            EMPLOYER_RATES.sgkTotal - EMPLOYER_RATES.incentives.other,
          )}`,
          "İndirimden yararlanmak için bildirgelerin yasal süresinde verilmesi, primlerin süresinde ödenmesi, Türkiye genelinde prim borcunun bulunmaması ve kayıt dışı çalıştırma tespitinin olmaması gerekir.",
        ],
      },
      {
        heading: "Asgari ücretin işverene maliyeti",
        body: [
          `Brüt asgari ücret ${tl(MINIMUM_WAGE.gross)} iken işverene maliyeti, prim indirimi yoksa <strong>${tl(
            MINIMUM_WAGE.employerCost.noIncentive,
          )}</strong>, iki puanlık indirimle <strong>${tl(
            MINIMUM_WAGE.employerCost.twoPointIncentive,
          )}</strong>, imalatta beş puanlık indirimle <strong>${tl(
            MINIMUM_WAGE.employerCost.manufacturingFivePoint,
          )}</strong> olur.`,
          `Aynı çalışanın eline geçen net ücret ise ${tl(
            MINIMUM_WAGE.net,
          )}'dir. Yani işverenin ödediği her 100 liranın yaklaşık 69 lirası çalışanın cebine girer.`,
        ],
      },
      {
        heading: "SGK tavanı maliyeti sınırlar",
        body: [
          `İşveren primleri, prime esas kazancın tavanına kadar hesaplanır. ${Y} yılında aylık SGK tavanı <strong>${tl(
            SGK_LIMITS.monthlyCeiling,
          )}</strong>'dir.`,
          "Bu tutarın üzerindeki maaşlarda prim, tavan üzerinden hesaplandığı için maliyet artışı yavaşlar; brüt arttıkça işveren yükünün oranı düşer.",
        ],
      },
    ],
    faqs: [
      {
        question: `${Y} yılında işveren maliyeti brütün yüzde kaçı?`,
        answer: `Teşvik yoksa brüt ücretin ${pct(
          EMPLOYER_RATES.total,
        )} kadarı işveren yükü olarak brütün üzerine eklenir. İmalatta beş puanlık indirimle bu oran ${pct(
          EMPLOYER_RATES.total - EMPLOYER_RATES.incentives.manufacturing,
        )}, imalat dışında iki puanlık indirimle ${pct(
          EMPLOYER_RATES.total - EMPLOYER_RATES.incentives.other,
        )} olur.`,
      },
      {
        question: "Kıdem ve ihbar tazminatı maliyete dâhil mi?",
        answer:
          "Bu hesaplayıcı aylık düzenli maliyeti gösterir. Kıdem tazminatı için her yıl bir aylık brüt ücret kadar karşılık ayrılması, gerçek maliyeti görmek açısından doğru yaklaşımdır.",
      },
      {
        question: "Yan haklar işveren maliyetine nasıl yansır?",
        answer:
          "Yemek, yol ve özel sağlık sigortası gibi haklar doğrudan maliyete eklenir. Bunların bir kısmı kanunda belirlenen sınırlar içinde SGK priminden ve gelir vergisinden istisnadır; istisna sınırı aşılırsa prime esas kazanca dâhil olur.",
      },
      {
        question: "Stajyer ve çırakların maliyeti aynı mı?",
        answer:
          "Hayır. Stajyer ve çıraklarda genel sağlık sigortası ile iş kazası primi devlet katkısıyla ödenir ve prim yükü çok daha düşüktür; bu araç normal 4/a sigortalısı içindir.",
      },
    ],
  },

  /* ==================== KREDİ KARTI ASGARİ ÖDEME ==================== */
  "kredi-karti-asgari-odeme": {
    title: `Kredi Kartı Asgari Ödeme Hesaplama ${Y}`,
    description: `Kredi kartı asgari ödeme tutarı ve faizi: limite göre ${pct(
      CREDIT_CARD.minimumPayment.belowThreshold,
      0,
    )} veya ${pct(
      CREDIT_CARD.minimumPayment.aboveThreshold,
      0,
    )} asgari oran, TCMB azami faizleri ve yalnızca asgari ödenirse borcun kaç ayda biteceği.`,
    intro:
      "Kredi kartı ekstresinde iki tutar yazar: dönem borcu ve asgari ödeme. Asgari tutarı ödemek borcu kapatmaz, yalnızca gecikmeye düşmenizi önler; kalan borca her ay faiz işler. Hesaplayıcı asgari ödemeyi, işleyecek faizi ve sadece asgari ödendiğinde borcun nasıl seyrettiğini gösterir.",
    howItWorks: [
      "Ekstrenizdeki dönem borcunu girin.",
      "Kart limitinizi yazın; asgari ödeme oranı limite göre değişir.",
      "Kartınız son bir yıl içinde alındıysa işaretleyin.",
      "Asgari tutar, işleyecek faiz ve borcun seyri hesaplanır.",
    ],
    sections: [
      {
        heading: "Asgari ödeme oranı limite göre belirlenir",
        body: [
          `- Kart limiti ${tl(CREDIT_CARD.minimumPayment.limitThreshold)} ve altındaysa: dönem borcunun <strong>${pct(
            CREDIT_CARD.minimumPayment.belowThreshold,
            0,
          )}</strong>'si`,
          `- Limit ${tl(CREDIT_CARD.minimumPayment.limitThreshold)} üzerindeyse: dönem borcunun <strong>${pct(
            CREDIT_CARD.minimumPayment.aboveThreshold,
            0,
          )}</strong>'ı`,
          `- Yeni tahsis edilen kartlarda ilk bir yıl boyunca asgari tutar dönem borcunun <strong>${pct(
            CREDIT_CARD.minimumPayment.newCardFirstYear,
            0,
          )}</strong>'ından az olamaz`,
          "Oran, dönem borcuna değil kartın limitine bakılarak bulunur. Bu oranlar BDDK tarafından belirlenir.",
        ],
      },
      {
        heading: "Faiz oranı dönem borcuna göre kademelidir",
        body: [
          `${dmy(CREDIT_CARD.validFrom)} tarihinden itibaren geçerli aylık azami akdi faiz oranları:`,
          `- Dönem borcu ${tl(30000)} altında: <strong>${pct(CREDIT_CARD.tiers[0].contractual)}</strong>`,
          `- ${tl(30000)} – ${tl(180000)} arası: <strong>${pct(CREDIT_CARD.tiers[1].contractual)}</strong>`,
          `- ${tl(180000)} üzerinde: <strong>${pct(CREDIT_CARD.tiers[2].contractual)}</strong>`,
          `Gecikme faizi her kademede akdi faizden 0,30 puan yüksektir. Nakit çekimlerde dönem borcuna bakılmaksızın en üst kademe (${pct(
            CREDIT_CARD.cashAdvance.contractual,
          )}) uygulanır.`,
          "Bunlar TCMB'nin ilan ettiği <strong>azami</strong> oranlardır; bankanız daha düşük oran uygulayabilir ve oranlar her ay yeniden ilan edilir.",
        ],
      },
      {
        heading: "Asgari ödeme tuzağı",
        body: [
          "Yalnızca asgari ödeme yapıldığında kalan borca aylık faiz işler. Faiz, ödediğiniz tutara yaklaştığında borç neredeyse hiç erimez ve ödeme yıllarca sürebilir.",
          "Örnek: 25.000 TL dönem borcunda asgari %20 ile 5.000 TL ödenir; kalan 20.000 TL'ye ilk ay yaklaşık 650 TL faiz işler. Ertesi ay borç 20.650 TL'den başlar.",
          "Çıkış yolu: asgari tutarın üzerinde ödeme yapmak, borcu daha düşük faizli ihtiyaç kredisiyle kapatmak veya bankadan yapılandırma talep etmek.",
        ],
      },
      {
        heading: "Asgari ödemeyi de yapmazsanız",
        body: [
          "Asgari tutar ödenmezse kart gecikmeye düşer: kalan borca gecikme faizi işler, kart kullanıma kapatılabilir ve gecikme kredi siciline (Findeks) yansır.",
          "Üst üste üç dönem asgari ödeme yapılmazsa kart iptal edilir ve borç yasal takibe geçebilir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Asgari ödeme yaparsam faiz işler mi?",
        answer:
          "Evet. Asgari ödeme yalnızca gecikmeye düşmenizi engeller; ödenmeyen kalan borca akdi faiz işlemeye devam eder.",
      },
      {
        question: "Asgari ödeme oranı neden %40 çıkıyor?",
        answer: `Kart limitiniz ${tl(
          CREDIT_CARD.minimumPayment.limitThreshold,
        )} üzerindeyse ya da kartınız son bir yıl içinde verildiyse asgari oran %40 olarak uygulanır.`,
      },
      {
        question: "Nakit avans neden daha pahalı?",
        answer:
          "Nakit çekimlerde faiz, dönem borcunun büyüklüğüne bakılmaksızın en yüksek kademeden işler ve faiz çekim gününden itibaren başlar. Ayrıca bankalar nakit avans ücreti alır.",
      },
      {
        question: "Kredi kartı borcumu yapılandırabilir miyim?",
        answer:
          "Bankanızla anlaşarak borcu taksitlendirebilirsiniz. Yapılandırmada uygulanacak aylık akdi faiz, TCMB'nin ilan ettiği referans oranı aşamaz.",
      },
    ],
  },

  /* ==================== GECİKME ZAMMI ==================== */
  "gecikme-zammi": {
    title: "Gecikme Zammı Hesaplama | Vergi ve SGK Borcu",
    description: `Vadesinde ödenmeyen vergi, SGK primi ve kamu borçları için aylık ${pct(
      LATE_PAYMENT.monthly,
    )} gecikme zammı hesaplama. Ay kesirleri günlük hesaplanır.`,
    intro: `Vadesinde ödenmeyen kamu alacaklarına 6183 sayılı Kanun uyarınca gecikme zammı uygulanır. Aylık oran ${dmy(
      LATE_PAYMENT.validFrom,
    )} tarihinden itibaren <strong>${pct(
      LATE_PAYMENT.monthly,
    )}</strong>'dir. Hesaplayıcı vade ve ödeme tarihine göre zammı ve ödenecek toplam tutarı bulur.`,
    howItWorks: [
      "Borcun aslını (vergi, prim, ceza tutarı) girin.",
      "Vade (son ödeme) tarihini seçin.",
      "Ödemeyi yapacağınız tarihi seçin.",
      "Gecikme zammı ve toplam ödenecek tutar hesaplanır.",
    ],
    sections: [
      {
        heading: "Gecikme zammı nasıl hesaplanır?",
        body: [
          `Gecikme zammı = <strong>Borç × [(${pct(
            LATE_PAYMENT.monthly,
          )} × tam ay sayısı) + (aylık oran ÷ 30 × kalan gün)]</strong>`,
          "Aydan artan günler için aylık oranın otuzda biri uygulanır. Süre hesabında <strong>vade günü sayılmaz, ödeme günü sayılır</strong>.",
          `Örnek: 15.000 TL'lik borç, vadesinden 2 ay 10 gün sonra ödenirse: 15.000 × [(${pct(
            LATE_PAYMENT.monthly,
          )} × 2) + (${pct(LATE_PAYMENT.monthly / 30, 4)} × 10)] ≈ <strong>${tl(
            15000 * (LATE_PAYMENT.monthly * 2 + (LATE_PAYMENT.monthly / 30) * 10),
          )}</strong> gecikme zammı doğar.`,
        ],
      },
      {
        heading: "Gecikme zammı, gecikme faizi, pişmanlık zammı",
        body: [
          "<strong>Gecikme zammı:</strong> Vadesinde ödenmeyen kamu alacağına uygulanır (6183 md. 51).",
          "<strong>Gecikme faizi:</strong> İkmalen, re'sen veya idarece yapılan tarhiyatlarda, verginin normal vade tarihinden tahakkuk tarihine kadar geçen süre için uygulanır (VUK md. 112).",
          "<strong>Pişmanlık zammı:</strong> Pişmanlıkla verilen beyannamelerde uygulanır (VUK md. 371).",
          `Üçünün oranı da aynıdır: aylık ${pct(LATE_PAYMENT.monthly)}.`,
        ],
      },
      {
        heading: "Borcu taksitlendirmek: tecil faizi",
        body: [
          `Borcunu ödeyemeyecek durumda olanlar tecil (taksitlendirme) talep edebilir. Tecil edilen borca yıllık <strong>${pct(
            LATE_PAYMENT.deferralAnnual,
          )}</strong> tecil faizi uygulanır.`,
          `Yıllık ${pct(
            LATE_PAYMENT.deferralAnnual,
          )} tecil faizi, aylık ${pct(LATE_PAYMENT.monthly)} gecikme zammına göre daha düşük bir maliyettir; ödeme güçlüğü varsa tecil başvurusu genellikle avantajlıdır.`,
          "Tecil için çok zor durum beyanı ve genellikle teminat gerekir; taksitler aksarsa tecil bozulur ve gecikme zammı baştan işler.",
        ],
      },
      {
        heading: "Hangi borçlara uygulanır?",
        body: [
          "- Gelir, kurumlar, KDV, ÖTV gibi vergiler",
          "- MTV ve emlak vergisi",
          "- SGK primleri ve idari para cezaları",
          "- Trafik para cezaları ve diğer kamu alacakları",
          "Özel kişiler arasındaki borçlarda gecikme zammı değil, sözleşmedeki temerrüt faizi veya kanuni faiz uygulanır.",
        ],
      },
    ],
    faqs: [
      {
        question: "Gecikme zammı oranı kaç?",
        answer: `Aylık gecikme zammı oranı ${dmy(LATE_PAYMENT.validFrom)} tarihinden itibaren ${pct(
          LATE_PAYMENT.monthly,
        )}'dir. Bu oran 10556 sayılı Cumhurbaşkanı Kararı ile belirlenmiştir.`,
      },
      {
        question: "Bir gün geç ödersem ne kadar zam işler?",
        answer: `Bir günlük gecikmede aylık oranın otuzda biri, yani yaklaşık ${pct(
          LATE_PAYMENT.monthly / 30,
          4,
        )} oranında zam uygulanır.`,
      },
      {
        question: "Gecikme zammı bileşik mi işler?",
        answer:
          "Hayır. Gecikme zammı borç aslı üzerinden hesaplanır; zam üzerine zam işlemez. Ancak borç ödenmedikçe süre uzadığı için toplam tutar sürekli artar.",
      },
      {
        question: "Vergi affı çıkarsa gecikme zammı siliniyor mu?",
        answer:
          "Yapılandırma kanunlarında genellikle gecikme zammı ve faizi silinip yerine Yİ-ÜFE oranında bir tutar hesaplanır. Bu, borçlu açısından önemli bir indirim sağlar; böyle bir kanun yürürlükteyse başvuru süresine dikkat edin.",
      },
    ],
  },
};
