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

export type LongtailKind = "net-maas" | "kdv" | "kredi";

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
];

export function findLongtail(slug: string) {
  return longtailPages.find((p) => p.slug === slug);
}

/** Aynı türden komşu sayfalar (iç linkleme için) */
export function neighbours(page: LongtailPage, limit = 6) {
  return longtailPages
    .filter((p) => p.kind === page.kind && p.slug !== page.slug)
    .slice(0, limit);
}
