/**
 * Yıllık resmî parametreler — sitenin TEK güncel rakam kaynağı.
 *
 * Hesaplayıcılar, long-tail sayfalar, rehberler ve /guncel-rakamlar sayfası
 * bu dosyayı okur. Bir rakam değiştiğinde yalnızca burası güncellenir ve
 * `lastVerified` tarihi ile kaynak bağlantısı birlikte değiştirilir.
 *
 * Kural: Buraya yalnızca birincil kaynaktan (Resmî Gazete, ÇSGB, GİB, SGK)
 * teyit edilmiş rakam girilir.
 */

export const PARAMETERS_YEAR = 2026;

/** Rakamların resmî kaynaklardan en son kontrol edildiği tarih (ISO). */
export const LAST_VERIFIED = "2026-09-15";

export type Source = { label: string; url: string };

/* ------------------------------------------------------------------ */
/* Asgari ücret                                                        */
/* ------------------------------------------------------------------ */

export const MINIMUM_WAGE = {
  period: "01.01.2026 – 31.12.2026",
  gross: 33030,
  dailyGross: 1101,
  sgkEmployee: 4624.2,
  unemploymentEmployee: 330.3,
  net: 28075.5,
  /** İşverene toplam maliyet (TL/ay), prim indirimine göre */
  employerCost: {
    noIncentive: 40874.63,
    twoPointIncentive: 40214.03,
    manufacturingFivePoint: 39223.13,
  },
  source: {
    label: "ÇSGB – Asgari ücretin net hesabı ve işverene maliyeti (2026)",
    url: "https://www.csgb.gov.tr/Media/gm2fekds/asgari-%C3%BCcret-2026.pdf",
  } satisfies Source,
} as const;

/* ------------------------------------------------------------------ */
/* Kesinti oranları                                                    */
/* ------------------------------------------------------------------ */

export const RATES = {
  sgkEmployee: 0.14,
  unemploymentEmployee: 0.01,
  /** İşveren SGK payı, 2 puanlık prim indirimi uygulanmış (diğer sektörler) */
  sgkEmployerWithIncentive: 0.1975,
  unemploymentEmployer: 0.02,
  stampTax: 0.00759,
} as const;

/** Asgari ücrete isabet eden aylık gelir vergisi istisnası (ocak ayı, %15 dilim) */
export const MINIMUM_WAGE_INCOME_TAX_EXEMPTION =
  Math.round(
    (MINIMUM_WAGE.gross - MINIMUM_WAGE.sgkEmployee - MINIMUM_WAGE.unemploymentEmployee) *
      0.15 *
      100
  ) / 100;

/** Asgari ücrete isabet eden aylık damga vergisi istisnası */
export const MINIMUM_WAGE_STAMP_TAX_EXEMPTION =
  Math.round(MINIMUM_WAGE.gross * RATES.stampTax * 100) / 100;

/* ------------------------------------------------------------------ */
/* SGK prime esas kazanç sınırları                                     */
/* ------------------------------------------------------------------ */

export const SGK_LIMITS = {
  /** Aylık taban: brüt asgari ücret */
  monthlyFloor: MINIMUM_WAGE.gross,
  /** Tavan çarpanı (2026'da 9 kat) */
  ceilingMultiplier: 9,
  /** Aylık tavan */
  monthlyCeiling: MINIMUM_WAGE.gross * 9,
  source: {
    label: "SGK – Prime Esas Kazanç Miktarları (2026)",
    url: "https://www.sgk.gov.tr/Content/Post/2e0c9e1a-2cfe-4456-af10-49d3de0c58ba/Prime-Esas-Kazanc-Miktarlari-2026-01-14-10-35-39",
  } satisfies Source,
} as const;

/* ------------------------------------------------------------------ */
/* Gelir vergisi tarifesi (ücret gelirleri)                            */
/* ------------------------------------------------------------------ */

export const INCOME_TAX_BRACKETS_WAGE = [
  { limit: 190000, rate: 0.15 },
  { limit: 400000, rate: 0.2 },
  { limit: 1500000, rate: 0.27 },
  { limit: 5300000, rate: 0.35 },
  { limit: Infinity, rate: 0.4 },
] as const;

/** Ücret dışı gelirlerde 3. dilim sınırı farklıdır */
export const INCOME_TAX_BRACKETS_NON_WAGE = [
  { limit: 190000, rate: 0.15 },
  { limit: 400000, rate: 0.2 },
  { limit: 1000000, rate: 0.27 },
  { limit: 5300000, rate: 0.35 },
  { limit: Infinity, rate: 0.4 },
] as const;

export const INCOME_TAX_SOURCE: Source = {
  label: "GİB – Gelir Vergisi Tarifesi 2026",
  url: "https://cdn.gib.gov.tr/api/gibportal-file/file/getFileResources?objectKey=arsiv%2Fyardim-kaynaklar%2Fyararli-bilgiler%2Fgelir-vergisi-tarifeleri%2Fgelir-vergisi-tarifesi-2026.pdf",
};

/* ------------------------------------------------------------------ */
/* Kıdem tazminatı tavanı                                              */
/* ------------------------------------------------------------------ */

export type SeveranceCeiling = { from: string; to: string; amount: number };

/** Yeniden eskiye sıralı; ilk kayıt en güncel dönemdir. */
export const SEVERANCE_CEILINGS: SeveranceCeiling[] = [
  { from: "2026-07-01", to: "2026-12-31", amount: 73729.87 },
  { from: "2026-01-01", to: "2026-06-30", amount: 64948.77 },
  { from: "2025-07-01", to: "2025-12-31", amount: 53919.68 },
  { from: "2025-01-01", to: "2025-06-30", amount: 46655.43 },
  { from: "2024-07-01", to: "2024-12-31", amount: 41828.42 },
  { from: "2024-01-01", to: "2024-06-30", amount: 35058.58 },
];

export const SEVERANCE_CEILING_SOURCE: Source = {
  label: "ÇSGB – Kıdem Tazminatı Tavan Miktarları (1980–2026)",
  url: "https://www.csgb.gov.tr/%C4%B1statistikler/calisma-hayati-%C4%B1statistikleri/kidem-tazminati-tavan-miktari/",
};

/** Verilen tarihte (YYYY-AA-GG) geçerli kıdem tavanı; bulunamazsa en güncel. */
export function severanceCeilingOn(isoDate: string): number {
  const match = SEVERANCE_CEILINGS.find(
    (period) => isoDate >= period.from && isoDate <= period.to
  );
  return (match ?? SEVERANCE_CEILINGS[0]).amount;
}

/* ------------------------------------------------------------------ */
/* İşsizlik ödeneği                                                    */
/* ------------------------------------------------------------------ */

export const UNEMPLOYMENT_BENEFIT = {
  /** Aylık brüt üst sınır: brüt asgari ücretin %80'i */
  monthlyGrossCap: Math.round(MINIMUM_WAGE.gross * 0.8 * 100) / 100,
} as const;

/* ------------------------------------------------------------------ */
/* Yardımcılar                                                         */
/* ------------------------------------------------------------------ */

export const tl = (value: number) =>
  `${value.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} TL`;

export const lastVerifiedText = () =>
  new Date(`${LAST_VERIFIED}T12:00:00`).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
