/**
 * Uzun kuyruk (long-tail) hesaplama sayfaları.
 *
 * "50000 brüt ne kadar net", "100000 TL kredi taksiti" gibi çok spesifik
 * aramalar için önceden hesaplanmış sayfalar üretir. Hesaplayıcı siteleri
 * için en etkili SEO taktiğidir: tek şablondan yüzlerce sayfa doğar ve
 * her biri tek bir soruya doğrudan cevap verir.
 *
 * Sayfalar statik üretilir; sunucuda hesap yükü oluşturmaz.
 */

export type LongtailKind =
  | "net-maas"
  | "kdv"
  | "kredi"
  | "netten-brut"
  | "isveren-maliyeti"
  | "kidem"
  | "mevduat"
  | "konut-kredisi"
  | "kredi-karti"
  | "kira-artisi"
  | "kira-geliri"
  | "tapu-harci"
  | "yuzde"
  | "indirim";

export type LongtailPage = {
  /** URL parçası */
  slug: string;
  kind: LongtailKind;
  /** Sayfa başlığı — aramada görünen soru */
  question: string;
  metaTitle: string;
  description: string;
  /** Hesaplamaya giren değerler */
  input: Record<string, number>;
  /** İlgili tam hesaplayıcı */
  tool: string;
};

/* Net maaş için yaygın aranan brüt tutarlar */
const GROSS_SALARIES = [
  25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000,
  65000, 70000, 75000, 80000, 90000, 100000, 120000, 150000,
];

/* KDV için yaygın aranan tutarlar */
const KDV_AMOUNTS = [
  100, 250, 500, 1000, 1500, 2000, 2500, 5000,
  10000, 15000, 20000, 25000, 50000, 100000,
];

/* Kredi için yaygın tutar ve vade birleşimleri */
const LOAN_AMOUNTS = [50000, 100000, 150000, 200000, 250000, 300000, 500000];
const LOAN_TERMS = [12, 24, 36, 48];

/* Netten brüte için yaygın aranan net tutarlar */
const NET_SALARIES = [30000, 35000, 40000, 45000, 50000, 60000, 70000, 80000, 100000];

/* İşveren maliyeti için brüt tutarlar */
const EMPLOYER_SALARIES = [40000, 50000, 60000, 75000, 100000, 150000];

/* Kıdem tazminatı: brüt maaş × hizmet yılı */
const SEVERANCE_SALARIES = [40000, 50000, 60000, 75000, 100000];
const SEVERANCE_YEARS = [5, 10, 20];

/* Vadeli mevduat anaparaları (32 gün) */
const DEPOSIT_AMOUNTS = [50000, 100000, 250000, 500000, 1000000];

/* Konut kredisi tutarları (120 ay) */
const HOME_LOAN_AMOUNTS = [1000000, 2000000, 3000000, 5000000];

/* Kredi kartı dönem borçları */
const CARD_DEBTS = [10000, 25000, 50000, 100000, 200000];

/* Aylık kira tutarları */
const RENTS = [10000, 12500, 15000, 17500, 20000, 25000, 30000, 40000];

/* Aylık kira geliri (vergi) */
const RENTAL_INCOMES = [10000, 15000, 20000, 30000, 40000];

/* Konut satış bedelleri (tapu harcı) */
const DEED_PRICES = [1000000, 2000000, 3000000, 5000000, 7500000, 10000000];

/* Yüzde ve indirim tabloları */
const PERCENT_AMOUNTS = [100, 500, 1000, 5000, 10000];
const DISCOUNT_PRICES = [500, 1000, 2500, 5000];

/** Yuvarlak sayılar için Türkçe -in eki (100'ün, 1.000'in, 10.000'in). */
function genitive(value: number) {
  if (value % 1000000 === 0) return "'un";
  if (value % 1000 === 0) return "'in";
  if (value % 100 === 0) return "'ün";
  return "'in";
}

function trNumber(value: number) {
  return value.toLocaleString("tr-TR");
}

export const longtailPages: LongtailPage[] = [
  ...GROSS_SALARIES.map<LongtailPage>((gross) => ({
    slug: `${gross}-tl-brut-ne-kadar-net`,
    kind: "net-maas",
    question: `${trNumber(gross)} TL brüt maaş ne kadar net?`,
    metaTitle: `${trNumber(gross)} TL Brüt Ne Kadar Net? 2026 Hesaplama`,
    description: `${trNumber(
      gross
    )} TL brüt maaşın net tutarı, SGK primi, işsizlik sigortası, gelir vergisi ve damga vergisi kesintileriyle birlikte hesaplandı.`,
    input: { gross },
    tool: "net-maas",
  })),

  ...KDV_AMOUNTS.map<LongtailPage>((amount) => ({
    slug: `${amount}-tl-kdv-hesaplama`,
    kind: "kdv",
    question: `${trNumber(amount)} TL'nin KDV'si ne kadar?`,
    metaTitle: `${trNumber(amount)} TL KDV Hesaplama | %1, %10, %20`,
    description: `${trNumber(
      amount
    )} TL için %1, %10 ve %20 KDV tutarları, KDV dahil ve KDV hariç karşılıkları tek tabloda.`,
    input: { amount },
    tool: "kdv",
  })),

  ...LOAN_AMOUNTS.flatMap<LongtailPage>((amount) =>
    LOAN_TERMS.map<LongtailPage>((months) => ({
      slug: `${amount}-tl-kredi-${months}-ay-taksit`,
      kind: "kredi",
      question: `${trNumber(amount)} TL kredi ${months} ay taksiti ne kadar?`,
      metaTitle: `${trNumber(
        amount
      )} TL Kredi ${months} Ay Taksit Hesaplama 2026`,
      description: `${trNumber(
        amount
      )} TL tutarındaki kredinin ${months} ay vadeli aylık taksiti, toplam faizi ve toplam geri ödemesi farklı faiz oranlarına göre hesaplandı.`,
      input: { amount, months },
      tool: "kredi-borc",
    }))
  ),

  ...NET_SALARIES.map<LongtailPage>((net) => ({
    slug: `${net}-tl-net-kac-brut`,
    kind: "netten-brut",
    question: `${trNumber(net)} TL net maaş kaç TL brüt?`,
    metaTitle: `${trNumber(net)} TL Net Kaç Brüt? 2026 Hesaplama`,
    description: `${trNumber(net)} TL net maaş için gereken brüt tutar, kesinti dökümü ve yıl içinde aynı neti korumak için ay ay brüt tablosu.`,
    input: { amount: net },
    tool: "netten-brute-maas",
  })),

  ...EMPLOYER_SALARIES.map<LongtailPage>((gross) => ({
    slug: `${gross}-tl-brut-maas-isveren-maliyeti`,
    kind: "isveren-maliyeti",
    question: `${trNumber(gross)} TL brüt maaşın işverene maliyeti ne kadar?`,
    metaTitle: `${trNumber(gross)} TL Brüt Maaş İşveren Maliyeti 2026`,
    description: `${trNumber(gross)} TL brüt maaşın SGK ve işsizlik işveren payları, teşvik seçeneklerine göre aylık ve yıllık toplam maliyeti.`,
    input: { amount: gross },
    tool: "isveren-maliyeti",
  })),

  ...SEVERANCE_SALARIES.flatMap<LongtailPage>((salary) =>
    SEVERANCE_YEARS.map<LongtailPage>((years) => ({
      slug: `${salary}-tl-maas-${years}-yil-kidem-tazminati`,
      kind: "kidem",
      question: `${trNumber(salary)} TL maaşla ${years} yıllık kıdem tazminatı ne kadar?`,
      metaTitle: `${trNumber(salary)} TL Maaş ${years} Yıl Kıdem Tazminatı 2026`,
      description: `${trNumber(salary)} TL brüt maaş ve ${years} yıl çalışma için kıdem tazminatı, damga vergisi kesintisi ve ihbar tazminatı tutarı.`,
      input: { amount: salary, years },
      tool: "kidem-ihbar",
    }))
  ),

  ...DEPOSIT_AMOUNTS.map<LongtailPage>((amount) => ({
    slug: `${amount}-tl-32-gunluk-mevduat-getirisi`,
    kind: "mevduat",
    question: `${trNumber(amount)} TL 32 günlük vadeli mevduat ne kadar getirir?`,
    metaTitle: `${trNumber(amount)} TL 32 Gün Faiz Getirisi 2026`,
    description: `${trNumber(amount)} TL'nin 32 günlük vadede farklı faiz oranlarına göre stopaj sonrası net getirisi ve vade karşılaştırması.`,
    input: { amount, days: 32 },
    tool: "mevduat",
  })),

  ...HOME_LOAN_AMOUNTS.map<LongtailPage>((amount) => ({
    slug: `${amount}-tl-konut-kredisi-120-ay-taksit`,
    kind: "konut-kredisi",
    question: `${trNumber(amount)} TL konut kredisi 120 ay taksiti ne kadar?`,
    metaTitle: `${trNumber(amount)} TL Konut Kredisi 120 Ay Taksit 2026`,
    description: `${trNumber(amount)} TL konut kredisinin 120 ay vadeli aylık taksiti, toplam faizi ve 60, 120, 180 ay vade karşılaştırması.`,
    input: { amount, months: 120 },
    tool: "konut-kredisi",
  })),

  ...CARD_DEBTS.map<LongtailPage>((amount) => ({
    slug: `${amount}-tl-kredi-karti-asgari-odeme`,
    kind: "kredi-karti",
    question: `${trNumber(amount)} TL kredi kartı borcunun asgari ödemesi ne kadar?`,
    metaTitle: `${trNumber(amount)} TL Kredi Kartı Asgari Ödeme ve Faiz`,
    description: `${trNumber(amount)} TL kredi kartı borcunda asgari ödeme tutarı, aylık faiz ve yalnızca asgari ödenirse borcun kaç ayda biteceği.`,
    input: { amount },
    tool: "kredi-karti-asgari-odeme",
  })),

  ...RENTS.map<LongtailPage>((amount) => ({
    slug: `${amount}-tl-kira-artisi`,
    kind: "kira-artisi",
    question: `${trNumber(amount)} TL kira zamla ne kadar olur?`,
    metaTitle: `${trNumber(amount)} TL Kira Artışı Hesaplama 2026`,
    description: `${trNumber(amount)} TL kiranın yasal azami artış oranıyla yeni tutarı, aylık ve yıllık fark.`,
    input: { amount },
    tool: "kira-artisi",
  })),

  ...RENTAL_INCOMES.map<LongtailPage>((amount) => ({
    slug: `aylik-${amount}-tl-kira-geliri-vergisi`,
    kind: "kira-geliri",
    question: `Aylık ${trNumber(amount)} TL kira gelirinin vergisi ne kadar?`,
    metaTitle: `Aylık ${trNumber(amount)} TL Kira Geliri Vergisi 2026`,
    description: `Aylık ${trNumber(amount)} TL konut ve işyeri kira gelirinde istisna, götürü gider, vergi matrahı ve ödenecek gelir vergisi.`,
    input: { amount },
    tool: "kira-geliri-vergisi",
  })),

  ...DEED_PRICES.map<LongtailPage>((amount) => ({
    slug: `${amount}-tl-ev-tapu-harci`,
    kind: "tapu-harci",
    question: `${trNumber(amount)} TL evin tapu harcı ne kadar?`,
    metaTitle: `${trNumber(amount)} TL Ev Tapu Harcı 2026`,
    description: `${trNumber(amount)} TL satış bedelli konutta alıcı ve satıcının ödeyeceği %2'şer tapu harcı ve toplam harç.`,
    input: { amount },
    tool: "tapu-harci",
  })),

  ...PERCENT_AMOUNTS.map<LongtailPage>((amount) => ({
    slug: `${amount}-yuzde-hesaplama`,
    kind: "yuzde",
    question: `${trNumber(amount)} sayısının yüzdeleri ne kadar?`,
    metaTitle: `${trNumber(amount)}${genitive(amount)} Yüzdesi: %1 – %100 Tablosu`,
    description: `${trNumber(amount)} sayısının %1'den %100'e yüzdeleri, yüzde artış ve azalış sonuçları tek tabloda.`,
    input: { amount },
    tool: "yuzde",
  })),

  ...DISCOUNT_PRICES.map<LongtailPage>((amount) => ({
    slug: `${amount}-tl-indirim-hesaplama`,
    kind: "indirim",
    question: `${trNumber(amount)} TL'de indirimli fiyat ne kadar?`,
    metaTitle: `${trNumber(amount)} TL İndirim Hesaplama: %5 – %70`,
    description: `${trNumber(amount)} TL fiyatın %5'ten %70'e indirim tutarları ve indirimli fiyatları tek tabloda.`,
    input: { amount },
    tool: "indirim",
  })),
];

export function findLongtail(slug: string) {
  return longtailPages.find((p) => p.slug === slug);
}

/** Sayfanın ana tutarı (kredide tutar, diğerlerinde tek değer) */
const magnitude = (p: LongtailPage) => p.input.gross ?? p.input.amount ?? 0;

/**
 * Aynı türden en yakın tutarlı sayfalar (iç linkleme için).
 * Her sayfa kendi çevresindeki tutarlara bağlanır; böylece tüm sayfalarda
 * aynı bağlantı listesi tekrar etmez.
 */
export function neighbours(page: LongtailPage, limit = 6) {
  const base = magnitude(page);
  return longtailPages
    .filter((p) => p.kind === page.kind && p.slug !== page.slug)
    .map((p) => ({
      p,
      distance:
        Math.abs(Math.log(magnitude(p) / base)) +
        (p.input.months !== undefined ? Math.abs((p.input.months - page.input.months) / 48) : 0) +
        (p.input.years !== undefined ? Math.abs((p.input.years - page.input.years) / 20) : 0),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map(({ p }) => p);
}
