/**
 * Ek rehberler: işveren maliyeti, kredi kartı asgari ödeme, gecikme zammı.
 * Oranlar data/parameters.ts dosyasından gelir.
 */

import type { Guide } from "@/data/guides";
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

export const ekGuides: Guide[] = [
  /* =======================================================
     İŞVEREN MALİYETİ
  ======================================================= */
  {
    slug: `isveren-maliyeti-${Y}-nasil-hesaplanir`,
    title: "Bir Çalışanın İşverene Maliyeti Nasıl Hesaplanır?",
    metaTitle: `İşveren Maliyeti Hesaplama ${Y} | Prim Oranları`,
    description: `${Y} işveren prim oranları, 2 ve 5 puanlık indirimler, SGK tavanının etkisi ve asgari ücretin işverene maliyeti. Örnek hesaplamalarla.`,
    category: "Çalışan Hakları",
    icon: "🏢",
    published: "2026-09-16",
    updated: "2026-09-16",
    readingMinutes: 6,
    tool: { slug: "isveren-maliyeti", label: "İşveren Maliyeti Hesaplama" },
    intro: `İşveren için bir çalışanın maliyeti, bordroda yazan brüt ücretten fazladır: brütün üzerine SGK ve işsizlik sigortası işveren payları eklenir. ${Y} yılında bu yük, prim indirimi yoksa brüt ücretin ${pct(
      EMPLOYER_RATES.total,
    )} kadarıdır.`,
    sections: [
      {
        heading: `${Y} işveren prim oranları`,
        body: [
          `- Kısa vadeli sigorta kolları: <strong>${pct(EMPLOYER_RATES.shortTerm)}</strong>`,
          `- Malullük, yaşlılık ve ölüm: <strong>${pct(EMPLOYER_RATES.pension)}</strong>`,
          `- Genel sağlık sigortası: <strong>${pct(EMPLOYER_RATES.health)}</strong>`,
          `- SGK işveren payı toplamı: <strong>${pct(EMPLOYER_RATES.sgkTotal)}</strong>`,
          `- İşsizlik sigortası işveren payı: <strong>${pct(EMPLOYER_RATES.unemployment)}</strong>`,
          `- <strong>Toplam işveren yükü: ${pct(EMPLOYER_RATES.total)}</strong>`,
          `${Y} yılında iki oran değişti: malullük-yaşlılık-ölüm işveren payı %11'den %12'ye (7566 sayılı Kanun), kısa vadeli sigorta kolları %2'den %2,25'e çıktı. Bu nedenle önceki yıllarda bilinen %22,75'lik toplam yük artık ${pct(
            EMPLOYER_RATES.total,
          )}'tir.`,
        ],
      },
      {
        heading: "Örnek: 60.000 TL brüt maaş",
        body: [
          "İmalat dışı bir işyerinde, iki puanlık indirimle:",
          `- SGK işveren payı: 60.000 × ${pct(
            EMPLOYER_RATES.sgkTotal - EMPLOYER_RATES.incentives.other,
          )} = ${tl(60000 * (EMPLOYER_RATES.sgkTotal - EMPLOYER_RATES.incentives.other))}`,
          `- İşsizlik işveren payı: 60.000 × ${pct(EMPLOYER_RATES.unemployment)} = ${tl(
            60000 * EMPLOYER_RATES.unemployment,
          )}`,
          `- <strong>İşverene toplam maliyet: ${tl(
            60000 * (1 + EMPLOYER_RATES.sgkTotal - EMPLOYER_RATES.incentives.other + EMPLOYER_RATES.unemployment),
          )}</strong>`,
          "Aynı çalışanın eline geçen net ücret ise bunun belirgin biçimde altındadır; aradaki fark vergi ve primlerdir.",
        ],
      },
      {
        heading: "Prim indirimleri",
        body: [
          "5510 sayılı Kanunun 81/ı maddesindeki indirim, malullük-yaşlılık-ölüm işveren hissesinden düşülür:",
          `- <strong>İmalat sektörü:</strong> 5 puan → toplam yük ${pct(
            EMPLOYER_RATES.total - EMPLOYER_RATES.incentives.manufacturing,
          )}`,
          `- <strong>İmalat dışı sektörler:</strong> 2 puan → toplam yük ${pct(
            EMPLOYER_RATES.total - EMPLOYER_RATES.incentives.other,
          )}`,
          "Yararlanma şartları: bildirgelerin yasal süresinde verilmesi, primlerin süresinde ödenmesi, Türkiye genelinde prim ve idari para cezası borcunun bulunmaması, kayıt dışı sigortalı çalıştırılmaması.",
          "Şartlar bir ay sağlanmazsa o ay için indirim uygulanmaz; bu, maliyeti beklenmedik şekilde artırır.",
        ],
      },
      {
        heading: "SGK tavanı maliyeti sınırlar",
        body: [
          `Primler, prime esas kazancın tavanına kadar hesaplanır. ${Y} yılında aylık tavan <strong>${tl(
            SGK_LIMITS.monthlyCeiling,
          )}</strong>'dir.`,
          "Tavanın üzerindeki maaşlarda prim sabitlenir; brüt arttıkça işveren yükünün brüte oranı düşer. Yüksek maaşlı pozisyonlarda bu, maliyet planlamasında önemli bir kalemdir.",
        ],
      },
      {
        heading: "Bordro dışı maliyetler",
        body: [
          "Toplam işgücü maliyetini görmek için şunları da hesaba katmak gerekir:",
          "- Yemek, yol, özel sağlık sigortası gibi yan haklar",
          "- Kıdem tazminatı karşılığı (her yıl için bir aylık brüt ücret)",
          "- Yıllık izin karşılığı",
          "- İşe alım, eğitim ve ekipman giderleri",
          `Asgari ücretli bir çalışanda bile brüt ${tl(MINIMUM_WAGE.gross)} iken işverene maliyet ${tl(
            MINIMUM_WAGE.employerCost.twoPointIncentive,
          )} seviyesindedir.`,
        ],
      },
    ],
    faqs: [
      {
        question: "Asgari ücretin işverene maliyeti ne kadar?",
        answer: `${Y} yılında brüt asgari ücret ${tl(
          MINIMUM_WAGE.gross,
        )} iken işverene maliyeti prim indirimi yoksa ${tl(
          MINIMUM_WAGE.employerCost.noIncentive,
        )}, iki puanlık indirimle ${tl(MINIMUM_WAGE.employerCost.twoPointIncentive)} olur.`,
      },
      {
        question: "İşveren payı neden arttı?",
        answer: `7566 sayılı Kanunla malullük-yaşlılık-ölüm sigortası işveren payı 1 puan artırıldı; ayrıca kısa vadeli sigorta kolları primi %2,25'e çıktı. Toplam işveren yükü böylece ${pct(
          EMPLOYER_RATES.total,
        )} oldu.`,
      },
      {
        question: "Net maaştan işveren maliyetine nasıl gidilir?",
        answer:
          "Önce netten brüte hesaplama yapılır, sonra brütün üzerine işveren primleri eklenir. Sitemizdeki netten brüte maaş hesaplama aracıyla brütü bulup bu araca girebilirsiniz.",
      },
    ],
    related: ["brutten-nete-maas-hesaplama", "kidem-tazminati-nasil-hesaplanir"],
  },

  /* =======================================================
     KREDİ KARTI ASGARİ ÖDEME
  ======================================================= */
  {
    slug: "kredi-karti-asgari-odeme-ve-faiz",
    title: "Kredi Kartında Asgari Ödeme ve Faiz Nasıl İşler?",
    metaTitle: "Kredi Kartı Asgari Ödeme | Oranlar ve Faiz",
    description: `Asgari ödeme oranları (${pct(
      CREDIT_CARD.minimumPayment.belowThreshold,
      0,
    )} / ${pct(
      CREDIT_CARD.minimumPayment.aboveThreshold,
      0,
    )}), TCMB azami faiz kademeleri, asgari ödeme tuzağı ve borçtan çıkış yolları.`,
    category: "Finans",
    icon: "💳",
    published: "2026-09-16",
    updated: "2026-09-16",
    readingMinutes: 6,
    tool: { slug: "kredi-karti-asgari-odeme", label: "Kredi Kartı Asgari Ödeme Hesaplama" },
    intro:
      "Ekstrede yazan asgari ödeme tutarı, borcun kapanması için değil gecikmeye düşmemeniz için gereken en düşük tutardır. Ödenmeyen kısma her ay faiz işler ve borç sandığınızdan çok daha uzun sürede kapanır.",
    sections: [
      {
        heading: "Asgari ödeme oranı nasıl belirlenir?",
        body: [
          "Oran, dönem borcuna değil <strong>kartın limitine</strong> bakılarak bulunur:",
          `- Limit ${tl(CREDIT_CARD.minimumPayment.limitThreshold)} ve altında: dönem borcunun ${pct(
            CREDIT_CARD.minimumPayment.belowThreshold,
            0,
          )}'si`,
          `- Limit ${tl(CREDIT_CARD.minimumPayment.limitThreshold)} üzerinde: dönem borcunun ${pct(
            CREDIT_CARD.minimumPayment.aboveThreshold,
            0,
          )}'ı`,
          `- Yeni alınan kartlarda ilk bir yıl: en az ${pct(
            CREDIT_CARD.minimumPayment.newCardFirstYear,
            0,
          )}`,
          "Bu oranlar BDDK tarafından belirlenir ve tüm bankalar için aynıdır.",
        ],
      },
      {
        heading: "Faiz kademeleri",
        body: [
          `${dmy(CREDIT_CARD.validFrom)} tarihinden itibaren geçerli aylık azami akdi faiz:`,
          `- Dönem borcu ${tl(30000)} altında: ${pct(CREDIT_CARD.tiers[0].contractual)}`,
          `- ${tl(30000)} – ${tl(180000)} arası: ${pct(CREDIT_CARD.tiers[1].contractual)}`,
          `- ${tl(180000)} üzerinde: ${pct(CREDIT_CARD.tiers[2].contractual)}`,
          "Gecikme faizi her kademede akdi faizden 0,30 puan yüksektir.",
          `Nakit avansta dönem borcu ne olursa olsun en üst kademe (${pct(
            CREDIT_CARD.cashAdvance.contractual,
          )}) uygulanır ve faiz çekim gününden itibaren işlemeye başlar.`,
          "TCMB bu oranları her ay yeniden ilan eder; bankanız azami oranın altında bir oran uygulayabilir.",
        ],
      },
      {
        heading: "Asgari ödeme tuzağı",
        body: [
          "25.000 TL dönem borcunda %20 asgari oranla 5.000 TL ödenir. Kalan 20.000 TL'ye ilk ay yaklaşık 650 TL faiz işler ve ertesi ay borç 20.650 TL'den başlar.",
          "Bu döngüde her ay ödediğiniz paranın önemli bir kısmı faize gider; anapara çok yavaş erir. Yüksek faiz kademesindeki büyük borçlarda, sadece asgari ödemek borcu neredeyse hiç azaltmaz.",
          "Hesaplayıcı, sizin rakamlarınızla borcun kaç ayda biteceğini ve toplam ne kadar faiz ödeyeceğinizi gösterir.",
        ],
      },
      {
        heading: "Borçtan çıkış yolları",
        body: [
          "- <strong>Asgarinin üzerinde ödeme:</strong> Küçük bir fazladan ödeme bile süreyi belirgin biçimde kısaltır.",
          "- <strong>Daha düşük faizli krediyle kapatma:</strong> İhtiyaç kredisi faizi genellikle kart faizinin altındadır.",
          "- <strong>Yapılandırma:</strong> Bankadan borcun taksitlendirilmesini isteyebilirsiniz; uygulanacak faiz TCMB referans oranını aşamaz.",
          "- <strong>Nakit avanstan kaçınmak:</strong> En yüksek faiz kademesi ve ek ücret nedeniyle en pahalı kullanım biçimidir.",
        ],
      },
      {
        heading: "Asgari ödeme yapılmazsa",
        body: [
          "Kart gecikmeye düşer ve kalan borca gecikme faizi işler. Gecikme kredi siciline yansır; bu, sonraki kredi başvurularınızı etkiler.",
          "Üst üste üç dönem asgari ödeme yapılmazsa kart iptal edilir ve borç yasal takibe geçebilir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Asgari ödeme yaptım, borcum neden artıyor?",
        answer:
          "Asgari ödeme sonrası kalan borca akdi faiz işler. Ödediğiniz tutar işleyen faizden düşükse borç büyümeye devam eder.",
      },
      {
        question: "Asgari ödemeyi erken yapmak faizi azaltır mı?",
        answer:
          "Son ödeme tarihinden önce yapılan ödemeler hesap kesim dönemine göre değerlendirilir; erken ödeme gecikme faizini önler ancak dönem borcunun tamamı ödenmedikçe akdi faiz işlemeye devam eder.",
      },
      {
        question: "Kart limitim düşükse asgari oranım da mı düşük?",
        answer: `Evet. Limiti ${tl(
          CREDIT_CARD.minimumPayment.limitThreshold,
        )} ve altında olan kartlarda asgari oran %20, üzerinde olanlarda %40'tır.`,
      },
      {
        question: "Taksitli harcamalar asgari ödemeye nasıl yansır?",
        answer:
          "Taksitlerin o döneme düşen kısmı dönem borcuna dâhil olur ve asgari oran bu toplam üzerinden hesaplanır. Taksitli borçlarda gecikme, kalan taksitlerin muaccel hâle gelmesine yol açabilir.",
      },
    ],
    related: ["kredi-taksiti-nasil-hesaplanir", "taksitli-alisveris-gercek-maliyeti"],
  },

  /* =======================================================
     GECİKME ZAMMI
  ======================================================= */
  {
    slug: "gecikme-zammi-nasil-hesaplanir",
    title: "Gecikme Zammı Nasıl Hesaplanır?",
    metaTitle: "Gecikme Zammı Hesaplama | Oran ve Formül",
    description: `Aylık ${pct(
      LATE_PAYMENT.monthly,
    )} gecikme zammı, ay kesirlerinin günlük hesabı, gecikme faizi ve pişmanlık zammı farkı, tecil faizi ve yapılandırma.`,
    category: "Vergi",
    icon: "⏰",
    published: "2026-09-16",
    updated: "2026-09-16",
    readingMinutes: 5,
    tool: { slug: "gecikme-zammi", label: "Gecikme Zammı Hesaplama" },
    intro: `Vergi, SGK primi ve trafik cezası gibi kamu alacakları vadesinde ödenmezse 6183 sayılı Kanun uyarınca gecikme zammı işler. Aylık oran ${dmy(
      LATE_PAYMENT.validFrom,
    )} tarihinden itibaren ${pct(LATE_PAYMENT.monthly)}'dir.`,
    sections: [
      {
        heading: "Formül",
        body: [
          `Gecikme zammı = <strong>Borç × [(${pct(
            LATE_PAYMENT.monthly,
          )} × tam ay) + (aylık oran ÷ 30 × kalan gün)]</strong>`,
          "Tam aylar için aylık oran, aydan artan günler için aylık oranın otuzda biri uygulanır.",
          "Süre hesabında <strong>vade günü sayılmaz, ödeme günü sayılır</strong>.",
        ],
      },
      {
        heading: "Örnek hesap",
        body: [
          "15.000 TL'lik bir vergi borcu, vadesinden 2 ay 10 gün sonra ödenirse:",
          `- Tam aylar: ${pct(LATE_PAYMENT.monthly)} × 2 = ${pct(LATE_PAYMENT.monthly * 2)}`,
          `- Kalan günler: (${pct(LATE_PAYMENT.monthly)} ÷ 30) × 10 = ${pct(
            (LATE_PAYMENT.monthly / 30) * 10,
            3,
          )}`,
          `- Gecikme zammı: 15.000 × ${pct(
            LATE_PAYMENT.monthly * 2 + (LATE_PAYMENT.monthly / 30) * 10,
            3,
          )} ≈ <strong>${tl(15000 * (LATE_PAYMENT.monthly * 2 + (LATE_PAYMENT.monthly / 30) * 10))}</strong>`,
          `- Ödenecek toplam: <strong>${tl(
            15000 * (1 + LATE_PAYMENT.monthly * 2 + (LATE_PAYMENT.monthly / 30) * 10),
          )}</strong>`,
        ],
      },
      {
        heading: "Gecikme zammı, gecikme faizi ve pişmanlık zammı",
        body: [
          "<strong>Gecikme zammı:</strong> Vadesinde ödenmeyen kamu alacağına uygulanır (6183 md. 51).",
          "<strong>Gecikme faizi:</strong> Sonradan yapılan tarhiyatlarda normal vade tarihinden tahakkuk tarihine kadar işler (VUK md. 112).",
          "<strong>Pişmanlık zammı:</strong> Beyan edilmemiş bir vergiyi pişmanlıkla beyan edenlere uygulanır (VUK md. 371) ve vergi ziyaı cezasını ortadan kaldırır.",
          `Üçünün oranı da aynıdır: aylık ${pct(LATE_PAYMENT.monthly)}.`,
        ],
      },
      {
        heading: "Ödeyemiyorsanız: tecil",
        body: [
          `Çok zor durumda olanlar borcun taksitlendirilmesini (tecil) isteyebilir. Tecil edilen borca yıllık ${pct(
            LATE_PAYMENT.deferralAnnual,
          )} tecil faizi uygulanır ve bu, aylık ${pct(
            LATE_PAYMENT.monthly,
          )} işleyen gecikme zammından daha düşük bir maliyettir.`,
          "Başvuru vergi dairesine yapılır; çok zor durum halinin belgelenmesi ve çoğu durumda teminat gösterilmesi gerekir.",
          "Taksitler aksarsa tecil bozulur ve gecikme zammı baştan işlemeye başlar.",
        ],
      },
      {
        heading: "Yapılandırma kanunları",
        body: [
          "Çıkarılan yapılandırma kanunlarında gecikme zammı ve faizi silinip yerine Yİ-ÜFE oranında daha düşük bir tutar hesaplanır.",
          "Bu düzenlemeler süreli olduğu için başvuru tarihini kaçırmamak gerekir. Yürürlükte bir yapılandırma varsa, borcu ödemeden önce kapsamda olup olmadığınızı kontrol edin.",
        ],
      },
    ],
    faqs: [
      {
        question: "Gecikme zammı ne kadar?",
        answer: `Aylık oran ${dmy(LATE_PAYMENT.validFrom)} tarihinden itibaren ${pct(
          LATE_PAYMENT.monthly,
        )}'dir. Daha önce %4,5 olan oran 10556 sayılı Cumhurbaşkanı Kararı ile düşürülmüştür.`,
      },
      {
        question: "Gecikme zammına ayrıca faiz işler mi?",
        answer:
          "Hayır. Gecikme zammı yalnızca borç aslı üzerinden hesaplanır, zammın üzerine zam işlemez.",
      },
      {
        question: "Trafik cezasına gecikme zammı uygulanır mı?",
        answer:
          "Evet. Süresinde ödenmeyen trafik idari para cezaları da 6183 sayılı Kanun kapsamındadır ve gecikme zammına tabidir. Cezayı ilk 15 gün içinde ödemek ise %25 indirim sağlar.",
      },
      {
        question: "SGK prim borcunda oran farklı mı?",
        answer:
          "Hayır, aynı orandır. SGK prim borçlarında da 6183 sayılı Kanuna göre gecikme cezası ve gecikme zammı uygulanır.",
      },
    ],
    related: ["emlak-vergisi-nasil-hesaplanir", `mtv-2026-nasil-hesaplanir`],
  },
];
