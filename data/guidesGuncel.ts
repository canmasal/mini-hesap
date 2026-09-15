/**
 * Güncel rakam rehberleri (soru-cevap odaklı uzun kuyruk içerik).
 *
 * Bu rehberlerdeki TÜM rakamlar data/parameters.ts dosyasından üretilir.
 * Resmî bir rakam değiştiğinde yalnızca parametre dosyası güncellenir;
 * metinler, örnekler, SSS cevapları ve güncelleme tarihi kendiliğinden
 * yenilenir.
 */

import type { Guide } from "@/data/guides";
import {
  INCOME_TAX_BRACKETS_WAGE,
  LAST_VERIFIED,
  MINIMUM_WAGE,
  MINIMUM_WAGE_INCOME_TAX_EXEMPTION,
  MINIMUM_WAGE_STAMP_TAX_EXEMPTION,
  PARAMETERS_YEAR as Y,
  RATES,
  SEVERANCE_CEILINGS,
  SGK_LIMITS,
  UNEMPLOYMENT_BENEFIT,
  tl,
} from "@/data/parameters";

const pct = (rate: number) => `%${(rate * 100).toLocaleString("tr-TR")}`;
const round2 = (value: number) => Math.round(value * 100) / 100;

/* Yardımcı hesaplar ------------------------------------------------ */

const [currentCeiling, previousCeiling] = SEVERANCE_CEILINGS;
const dmy = (iso: string) => iso.split("-").reverse().join(".");

/** Asgari ücretle 1 yıllık kıdem tazminatı (yan hak olmadan) */
const minWageSeveranceStamp = round2(MINIMUM_WAGE.gross * RATES.stampTax);
const minWageSeveranceNet = round2(MINIMUM_WAGE.gross - minWageSeveranceStamp);

/** İşsizlik ödeneği üst sınırı ve neti */
const ubCap = UNEMPLOYMENT_BENEFIT.monthlyGrossCap;
const ubStamp = round2(ubCap * RATES.stampTax);
const ubNet = round2(ubCap - ubStamp);

/** Vergi dilimi örneği: 60.000 TL brüt maaşın aylık matrahı */
const exampleGross = 60000;
const exampleBase = round2(exampleGross * (1 - RATES.sgkEmployee - RATES.unemploymentEmployee));
const firstLimit = INCOME_TAX_BRACKETS_WAGE[0].limit;
const monthCrossesSecond = Math.ceil(firstLimit / exampleBase);
const MONTHS = [
  "ocak", "şubat", "mart", "nisan", "mayıs", "haziran",
  "temmuz", "ağustos", "eylül", "ekim", "kasım", "aralık",
];

const bracketLines = INCOME_TAX_BRACKETS_WAGE.map((bracket, index) => {
  const prev = index === 0 ? 0 : INCOME_TAX_BRACKETS_WAGE[index - 1].limit;
  const range =
    bracket.limit === Infinity
      ? `${tl(prev).replace(",00 TL", " TL")} üzeri`
      : index === 0
        ? `${tl(bracket.limit).replace(",00 TL", " TL")}'ye kadar`
        : `${tl(prev).replace(",00 TL", " TL")} – ${tl(bracket.limit).replace(",00 TL", " TL")}`;
  return `- ${range}: <strong>${pct(bracket.rate)}</strong>`;
});

const common = {
  published: LAST_VERIFIED,
  updated: LAST_VERIFIED,
} as const;

export const guncelGuides: Guide[] = [
  /* =======================================================
     ASGARİ ÜCRET
  ======================================================= */
  {
    slug: `asgari-ucret-${Y}-net-brut-ne-kadar`,
    title: `${Y} Asgari Ücret Net Ne Kadar? Brüt, Kesintiler ve İşveren Maliyeti`,
    metaTitle: `${Y} Asgari Ücret: Net ${tl(MINIMUM_WAGE.net)}`,
    description: `${Y} asgari ücret net ${tl(MINIMUM_WAGE.net)}, brüt ${tl(MINIMUM_WAGE.gross)}. SGK ve işsizlik kesintileri, vergi istisnaları ve işverene toplam maliyet.`,
    category: "Çalışan Hakları",
    icon: "💵",
    ...common,
    readingMinutes: 4,
    tool: { slug: "net-maas", label: "Net Maaş Hesaplama" },
    intro: `${MINIMUM_WAGE.period} döneminde geçerli asgari ücret <strong>brüt ${tl(MINIMUM_WAGE.gross)}</strong>, <strong>net ${tl(MINIMUM_WAGE.net)}</strong>'dir. Asgari ücretten gelir vergisi ve damga vergisi kesilmez; ele geçen tutar, brütten yalnızca SGK ve işsizlik sigortası primlerinin düşülmesiyle bulunur.`,
    sections: [
      {
        heading: `${Y} asgari ücret kesinti tablosu`,
        body: [
          `- Brüt asgari ücret: <strong>${tl(MINIMUM_WAGE.gross)}</strong>`,
          `- SGK primi işçi payı (${pct(RATES.sgkEmployee)}): ${tl(MINIMUM_WAGE.sgkEmployee)}`,
          `- İşsizlik sigortası işçi payı (${pct(RATES.unemploymentEmployee)}): ${tl(MINIMUM_WAGE.unemploymentEmployee)}`,
          "- Gelir vergisi: 0 TL (asgari ücret istisnası)",
          "- Damga vergisi: 0 TL (asgari ücret istisnası)",
          `- <strong>Net asgari ücret: ${tl(MINIMUM_WAGE.net)}</strong>`,
          `Günlük brüt asgari ücret ${tl(MINIMUM_WAGE.dailyGross)}'dir.`,
        ],
      },
      {
        heading: "Asgari ücretin işverene maliyeti",
        body: [
          "İşverenin ödediği toplam tutar, yararlandığı SGK prim indirimine göre değişir:",
          `- Prim indirimi olmadan: <strong>${tl(MINIMUM_WAGE.employerCost.noIncentive)}</strong>`,
          `- 2 puanlık prim indirimiyle (diğer sektörler): <strong>${tl(MINIMUM_WAGE.employerCost.twoPointIncentive)}</strong>`,
          `- 5 puanlık prim indirimiyle (imalat sektörü): <strong>${tl(MINIMUM_WAGE.employerCost.manufacturingFivePoint)}</strong>`,
        ],
      },
      {
        heading: "Asgari ücretin üzerinde kazananlar da istisnadan yararlanır",
        body: [
          `Asgari ücret istisnası yalnızca asgari ücretlilere değil, tüm ücretlilere uygulanır. Her çalışanın gelir vergisinden asgari ücrete isabet eden vergi (ocak ayında ${tl(MINIMUM_WAGE_INCOME_TAX_EXEMPTION)}), damga vergisinden de ${tl(MINIMUM_WAGE_STAMP_TAX_EXEMPTION)} düşülür.`,
          "Bu yüzden brüt maaşınızdan net maaşınızı hesaplarken istisnaları mutlaka hesaba katan bir araç kullanın.",
        ],
      },
    ],
    faqs: [
      {
        question: `${Y} asgari ücret net ne kadar?`,
        answer: `${MINIMUM_WAGE.period} döneminde net asgari ücret ${tl(MINIMUM_WAGE.net)}, brüt asgari ücret ${tl(MINIMUM_WAGE.gross)}'dir.`,
      },
      {
        question: "Asgari ücretten vergi kesilir mi?",
        answer:
          "Hayır. Asgari ücrete isabet eden gelir vergisi ve damga vergisi istisna edilir. Yalnızca SGK primi ve işsizlik sigortası primi kesilir.",
      },
      {
        question: `Asgari ücretin işverene maliyeti ${Y}'da ne kadar?`,
        answer: `Prim indirimi olmadan ${tl(MINIMUM_WAGE.employerCost.noIncentive)}; 2 puanlık prim indirimiyle ${tl(MINIMUM_WAGE.employerCost.twoPointIncentive)}'dir.`,
      },
    ],
    related: [`gelir-vergisi-dilimleri-${Y}`, `sgk-tavan-taban-${Y}`],
  },

  /* =======================================================
     KIDEM TAVANI
  ======================================================= */
  {
    slug: `kidem-tazminati-tavani-${Y}`,
    title: `Kıdem Tazminatı Tavanı ${Y} Ne Kadar?`,
    metaTitle: `Kıdem Tazminatı Tavanı ${Y}: ${tl(currentCeiling.amount)}`,
    description: `${dmy(currentCeiling.from)} – ${dmy(currentCeiling.to)} döneminde kıdem tazminatı tavanı ${tl(currentCeiling.amount)}. Önceki dönemler, tavanın hesaba etkisi ve örnek.`,
    category: "Çalışan Hakları",
    icon: "📈",
    ...common,
    readingMinutes: 4,
    tool: { slug: "kidem", label: "Kıdem Tazminatı Hesaplama" },
    intro: `<strong>${dmy(currentCeiling.from)} – ${dmy(currentCeiling.to)}</strong> döneminde kıdem tazminatı tavanı <strong>${tl(currentCeiling.amount)}</strong>'dir. Bir önceki dönemde (${dmy(previousCeiling.from)} – ${dmy(previousCeiling.to)}) bu tutar ${tl(previousCeiling.amount)} idi. Tavan, her çalışma yılı için ödenebilecek en yüksek kıdem tazminatını belirler.`,
    sections: [
      {
        heading: "Dönemlere göre kıdem tazminatı tavanı",
        body: [
          ...SEVERANCE_CEILINGS.map(
            (period) => `- ${dmy(period.from)} – ${dmy(period.to)}: <strong>${tl(period.amount)}</strong>`
          ),
          "Tavan her yıl ocak ve temmuz aylarında, en yüksek devlet memuruna ödenen emeklilik ikramiyesine göre güncellenir.",
        ],
      },
      {
        heading: "Hangi tavan kullanılır?",
        body: [
          "Hesaplamada <strong>işten ayrıldığınız tarihte geçerli olan</strong> tavan kullanılır; işe girdiğiniz yıl veya çalıştığınız yılların tavanı dikkate alınmaz.",
          `Örnek: Giydirilmiş brüt ücreti 90.000 TL olan ve ${dmy(currentCeiling.from)} sonrasında işten ayrılan bir çalışanın her yılı için ${tl(currentCeiling.amount)} esas alınır; aradaki fark ödenmez.`,
        ],
      },
      {
        heading: "Kıdem tazminatından hangi kesinti yapılır?",
        body: [
          `Kıdem tazminatından yalnızca damga vergisi (binde ${(RATES.stampTax * 1000).toLocaleString("tr-TR")}) kesilir. Tavandaki tutar için 1 yıllık damga vergisi ${tl(round2(currentCeiling.amount * RATES.stampTax))}, net tutar ${tl(round2(currentCeiling.amount * (1 - RATES.stampTax)))}'dir.`,
        ],
      },
    ],
    faqs: [
      {
        question: `Kıdem tazminatı tavanı ${Y} temmuz ne kadar?`,
        answer: `${dmy(currentCeiling.from)} – ${dmy(currentCeiling.to)} döneminde tavan ${tl(currentCeiling.amount)}'dir.`,
      },
      {
        question: "Maaşım tavandan yüksekse ne olur?",
        answer:
          "Giydirilmiş brüt ücretiniz tavanı aşıyorsa, her çalışma yılı için kendi ücretiniz değil tavan tutarı esas alınır.",
      },
      {
        question: "Tavan ne zaman değişir?",
        answer: "Kıdem tazminatı tavanı yılda iki kez, ocak ve temmuz aylarında güncellenir.",
      },
    ],
    related: [`asgari-ucretli-kidem-tazminati-${Y}`, "kidem-tazminati-nasil-hesaplanir"],
  },

  /* =======================================================
     ASGARİ ÜCRETLİ KIDEM
  ======================================================= */
  {
    slug: `asgari-ucretli-kidem-tazminati-${Y}`,
    title: `Asgari Ücretli Kıdem Tazminatı ${Y}: Yıllık Ne Kadar Alır?`,
    metaTitle: `Asgari Ücretli Kıdem Tazminatı ${Y}`,
    description: `Asgari ücretle çalışanın 1 yıllık kıdem tazminatı brüt ${tl(MINIMUM_WAGE.gross)}, net ${tl(minWageSeveranceNet)}. Yıllara göre tablo ve yan hakların etkisi.`,
    category: "Çalışan Hakları",
    icon: "🧮",
    ...common,
    readingMinutes: 4,
    tool: { slug: "kidem", label: "Kıdem Tazminatı Hesaplama" },
    intro: `Asgari ücretle çalışan ve kıdem tazminatına hak kazanan bir işçi, yan hakları yoksa her tam çalışma yılı için <strong>brüt ${tl(MINIMUM_WAGE.gross)}</strong> alır. Kıdem tazminatından yalnızca damga vergisi kesildiği için bir yılın neti <strong>${tl(minWageSeveranceNet)}</strong>'dir.`,
    sections: [
      {
        heading: "Çalışma süresine göre asgari ücretli kıdem tazminatı",
        body: [
          ...[1, 2, 3, 5, 10, 15].map((years) => {
            const gross = MINIMUM_WAGE.gross * years;
            return `- ${years} yıl: brüt ${tl(gross)} · net ${tl(round2(gross * (1 - RATES.stampTax)))}`;
          }),
          "Tablo yan hak içermeyen asgari ücret üzerinden hazırlanmıştır. Kısmi yıllar (ay ve gün) orantılı olarak eklenir.",
        ],
      },
      {
        heading: "Yan haklar tazminatı artırır",
        body: [
          "Kıdem tazminatı <strong>giydirilmiş brüt ücret</strong> üzerinden hesaplanır. Düzenli yemek, yol, ikramiye gibi ödemeler asgari ücrete eklenir.",
          "Örnek: Asgari ücretin üzerine aylık 3.000 TL yemek ve 2.000 TL yol yardımı alan bir çalışanın 1 yıllık brüt kıdem tazminatı, " +
            `${tl(MINIMUM_WAGE.gross + 5000)} olur.`,
        ],
      },
    ],
    faqs: [
      {
        question: `Asgari ücretli 1 yıllık kıdem tazminatı ${Y}'da ne kadar?`,
        answer: `Yan hak yoksa brüt ${tl(MINIMUM_WAGE.gross)}, damga vergisi düşüldükten sonra net ${tl(minWageSeveranceNet)}'dir.`,
      },
      {
        question: "Asgari ücretliye kıdem tavanı uygulanır mı?",
        answer: `Hayır. Asgari ücret (${tl(MINIMUM_WAGE.gross)}) kıdem tavanının (${tl(currentCeiling.amount)}) altında olduğu için tavan sınırı etkilemez.`,
      },
    ],
    related: [`kidem-tazminati-tavani-${Y}`, `asgari-ucret-${Y}-net-brut-ne-kadar`],
  },

  /* =======================================================
     GELİR VERGİSİ DİLİMLERİ
  ======================================================= */
  {
    slug: `gelir-vergisi-dilimleri-${Y}`,
    title: `${Y} Gelir Vergisi Dilimleri: Maaşım Hangi Dilime Girer?`,
    metaTitle: `${Y} Gelir Vergisi Dilimleri ve Oranları`,
    description: `${Y} ücret gelirleri vergi dilimleri %15'ten %40'a. Kümülatif matrah, dilime hangi ay geçilir ve net maaşa etkisi örnekle anlatılıyor.`,
    category: "Vergi",
    icon: "🏛️",
    ...common,
    readingMinutes: 5,
    tool: { slug: "net-maas", label: "Net Maaş Hesaplama" },
    intro: `Türkiye'de ücret gelirleri artan oranlı tarifeyle vergilendirilir. ${Y} yılında ücretliler için oranlar <strong>%15, %20, %27, %35 ve %40</strong>'tır. Vergi dilimi aylık maaşa göre değil, yıl başından itibaren biriken <strong>kümülatif matraha</strong> göre belirlenir.`,
    sections: [
      {
        heading: `${Y} ücret gelirleri vergi tarifesi`,
        body: [
          ...bracketLines,
          "Ücret dışı gelirlerde (kira, serbest meslek vb.) 3. dilimin üst sınırı 1.000.000 TL'dir.",
        ],
      },
      {
        heading: "Hangi ay üst dilime geçerim?",
        body: [
          `Örnek: ${tl(exampleGross)} brüt maaş alan bir çalışanın aylık vergi matrahı SGK ve işsizlik primleri düşüldükten sonra yaklaşık ${tl(exampleBase)}'dir.`,
          `Kümülatif matrah ${tl(firstLimit).replace(",00 TL", " TL")}'yi <strong>${MONTHS[monthCrossesSecond - 1]}</strong> ayında aşar. Bu aydan itibaren matrahın aşan kısmı %20 ile vergilendirilir ve net maaş düşer.`,
          "Brüt maaşınız değişmediği hâlde yılın ikinci yarısında net maaşınızın azalmasının sebebi budur.",
        ],
      },
      {
        heading: "Asgari ücret istisnası dilimi nasıl etkiler?",
        body: [
          "Her çalışanın gelir vergisinden, asgari ücrete isabet eden vergi tutarı düşülür. İstisna da kümülatif hesaplanır; böylece asgari ücret kadar kazanç, dilim artışından da korunmuş olur.",
        ],
      },
    ],
    faqs: [
      {
        question: `${Y} gelir vergisi dilimleri nedir?`,
        answer: `Ücretliler için 190.000 TL'ye kadar %15, 400.000 TL'ye kadar %20, 1.500.000 TL'ye kadar %27, 5.300.000 TL'ye kadar %35, üzeri %40'tır.`,
      },
      {
        question: "Vergi dilimi aylık maaşa göre mi belirlenir?",
        answer:
          "Hayır. Ocaktan itibaren biriken kümülatif vergi matrahına göre belirlenir. Bu nedenle aynı maaşla yıl içinde üst dilime geçilebilir.",
      },
    ],
    related: [`asgari-ucret-${Y}-net-brut-ne-kadar`, "brutten-nete-maas-hesaplama"],
  },

  /* =======================================================
     SGK TAVAN / TABAN
  ======================================================= */
  {
    slug: `sgk-tavan-taban-${Y}`,
    title: `SGK Tavanı ve Tabanı ${Y} Ne Kadar?`,
    metaTitle: `SGK Tavan ve Taban Ücreti ${Y}`,
    description: `${Y} SGK prime esas kazanç tabanı ${tl(SGK_LIMITS.monthlyFloor)}, tavanı ${tl(SGK_LIMITS.monthlyCeiling)}. Tavanın yüksek maaşlarda net maaşa etkisi.`,
    category: "Çalışan Hakları",
    icon: "🛡️",
    ...common,
    readingMinutes: 3,
    tool: { slug: "net-maas", label: "Net Maaş Hesaplama" },
    intro: `${Y} yılında SGK prime esas kazanç <strong>tabanı ${tl(SGK_LIMITS.monthlyFloor)}</strong> (brüt asgari ücret), <strong>tavanı ${tl(SGK_LIMITS.monthlyCeiling)}</strong>'dir. Tavan, brüt asgari ücretin <strong>${SGK_LIMITS.ceilingMultiplier} katı</strong> olarak belirlenmiştir.`,
    sections: [
      {
        heading: "Tavan yüksek maaşları nasıl etkiler?",
        body: [
          `Aylık brüt ücreti ${tl(SGK_LIMITS.monthlyCeiling)}'yi aşan çalışanlardan SGK ve işsizlik primi yalnızca tavan tutarı üzerinden kesilir.`,
          `Örnek: 400.000 TL brüt maaşta SGK işçi payı 400.000 × %14 = 56.000 TL değil, ${tl(SGK_LIMITS.monthlyCeiling)} × %14 = <strong>${tl(round2(SGK_LIMITS.monthlyCeiling * RATES.sgkEmployee))}</strong>'dir.`,
          "Tavan aynı zamanda emekli aylığı ve rapor parası gibi ödeneklerin hesaplandığı kazancın da üst sınırıdır.",
        ],
      },
      {
        heading: "Taban ne anlama gelir?",
        body: [
          "Tam ay çalışan bir sigortalı için SGK'ya bildirilecek kazanç, brüt asgari ücretten düşük olamaz. Kısmi çalışmalarda bildirim çalışılan gün sayısına göre yapılır.",
        ],
      },
    ],
    faqs: [
      {
        question: `SGK tavanı ${Y} ne kadar?`,
        answer: `${Y} yılında aylık SGK prime esas kazanç tavanı ${tl(SGK_LIMITS.monthlyCeiling)}'dir (brüt asgari ücretin ${SGK_LIMITS.ceilingMultiplier} katı).`,
      },
      {
        question: `SGK tabanı ${Y} ne kadar?`,
        answer: `Aylık taban, brüt asgari ücrete eşittir: ${tl(SGK_LIMITS.monthlyFloor)}.`,
      },
    ],
    related: [`asgari-ucret-${Y}-net-brut-ne-kadar`, `gelir-vergisi-dilimleri-${Y}`],
  },

  /* =======================================================
     İŞSİZLİK MAAŞI EN FAZLA
  ======================================================= */
  {
    slug: `issizlik-maasi-${Y}-en-fazla-ne-kadar`,
    title: `İşsizlik Maaşı ${Y} En Fazla Ne Kadar?`,
    metaTitle: `İşsizlik Maaşı ${Y}: En Fazla ${tl(ubNet)}`,
    description: `${Y} işsizlik maaşı üst sınırı brüt ${tl(ubCap)}, net ${tl(ubNet)}. Tutarın hesaplanması, süreler ve başvuru şartları.`,
    category: "Çalışan Hakları",
    icon: "🛟",
    ...common,
    readingMinutes: 3,
    tool: { slug: "issizlik-maasi", label: "İşsizlik Maaşı Hesaplama" },
    intro: `İşsizlik maaşı, son 4 aylık brüt kazanç ortalamasının %40'ıdır; ancak brüt asgari ücretin %80'ini geçemez. ${Y} yılında bu üst sınır <strong>brüt ${tl(ubCap)}</strong>, damga vergisi düşüldükten sonra <strong>net ${tl(ubNet)}</strong>'dir.`,
    sections: [
      {
        heading: "Üst sınır nasıl hesaplanır?",
        body: [
          `- Brüt asgari ücret: ${tl(MINIMUM_WAGE.gross)}`,
          `- Üst sınır (%80): <strong>${tl(ubCap)}</strong>`,
          `- Damga vergisi (binde ${(RATES.stampTax * 1000).toLocaleString("tr-TR")}): ${tl(ubStamp)}`,
          `- Net en yüksek işsizlik maaşı: <strong>${tl(ubNet)}</strong>`,
          `Son 4 aylık brüt kazanç ortalaması ${tl(round2(ubCap / 0.4))} ve üzerinde olanlar üst sınırdan alır.`,
        ],
      },
      {
        heading: "Kaç ay ödenir?",
        body: [
          "- Son 3 yılda 600 gün prim: 180 gün",
          "- 900 gün prim: 240 gün",
          "- 1.080 gün prim: 300 gün",
        ],
      },
    ],
    faqs: [
      {
        question: `İşsizlik maaşı ${Y} en fazla ne kadar?`,
        answer: `Brüt ${tl(ubCap)}, net ${tl(ubNet)}'dir. Bu tutar brüt asgari ücretin %80'idir.`,
      },
      {
        question: "İşsizlik maaşından vergi kesilir mi?",
        answer: "Yalnızca damga vergisi kesilir; gelir vergisi ve SGK primi kesilmez.",
      },
    ],
    related: ["issizlik-maasi-sartlari-ve-hesaplama", `asgari-ucret-${Y}-net-brut-ne-kadar`],
  },
];
