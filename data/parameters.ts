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

/** Artan oranlı tarifeyle yıllık gelir vergisi; dilim dökümüyle birlikte. */
export function incomeTaxOn(
  base: number,
  brackets: ReadonlyArray<{ limit: number; rate: number }> = INCOME_TAX_BRACKETS_WAGE,
) {
  const rows: { from: number; to: number; rate: number; tax: number }[] = [];
  let lower = 0;
  let total = 0;
  for (const { limit, rate } of brackets) {
    if (base <= lower) break;
    const to = Math.min(base, limit);
    const tax = (to - lower) * rate;
    rows.push({ from: lower, to, rate, tax });
    total += tax;
    lower = limit;
  }
  return { rows, total, marginal: rows.length ? rows[rows.length - 1].rate : 0 };
}

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
/* Doğum (analık) ve babalık izni                                      */
/* ------------------------------------------------------------------ */

export const MATERNITY_LEAVE = {
  /** 7578 sayılı Kanun ile 01.05.2026'dan itibaren */
  effectiveFrom: "2026-05-01",
  preBirthWeeks: 8,
  postBirthWeeks: 16,
  /** Çoğul gebelikte doğum öncesine eklenen hafta */
  multipleExtraWeeks: 2,
  /** Doktor onayıyla doğumdan önceki bu kadar haftaya kadar çalışılabilir */
  minPreBirthRestWeeks: 2,
  paternityLeaveDays: 10,
  /** Süt izni: çocuk 1 yaşına gelene kadar günlük toplam */
  nursingHoursPerDay: 1.5,
  source: {
    label: "7578 sayılı Kanun (RG 01.05.2026) – Paksoy hukuk notu",
    url: "https://paksoy.av.tr/2026/05/is-kanununda-dogum-izni-ve-babalik-izni-sureleri-yeniden-duzenlendi/",
  } satisfies Source,
} as const;

/* ------------------------------------------------------------------ */
/* Bireysel emeklilik (BES) devlet katkısı                             */
/* ------------------------------------------------------------------ */

export const PENSION_STATE_CONTRIBUTION = {
  /** TL katkı paylarına devlet katkısı oranı (01.01.2026'dan itibaren) */
  rate: 0.2,
  effectiveFrom: "2026-01-01",
  /** Yıllık devlet katkısı üst sınırı: brüt asgari ücretin yıllık toplamının katkı oranı kadarı */
  annualContributionBase: MINIMUM_WAGE.gross * 12,
  annualStateCap: Math.round(MINIMUM_WAGE.gross * 12 * 0.2 * 100) / 100,
  /** Sistemde kalma süresine göre hak ediş */
  vesting: [
    { years: 10, rate: 0.6 },
    { years: 6, rate: 0.35 },
    { years: 3, rate: 0.15 },
  ],
  source: {
    label: "10811 sayılı Cumhurbaşkanı Kararı (RG 07.01.2026) – AA haberi",
    url: "https://www.aa.com.tr/tr/ekonomi/bireysel-emeklilik-sisteminde-devlet-katkisi-orani-yuzde-20-oldu/3791853",
  } satisfies Source,
} as const;

/* ------------------------------------------------------------------ */
/* TL mevduat stopaj oranları                                          */
/* ------------------------------------------------------------------ */

export const DEPOSIT_WITHHOLDING = {
  /** Vadesiz ve 6 aya kadar vadeli */
  upTo6Months: 0.175,
  /** 1 yıla kadar vadeli */
  upTo1Year: 0.15,
  /** 1 yıldan uzun vadeli */
  over1Year: 0.1,
  validUntil: "2026-12-31",
  source: {
    label: "11444 sayılı Cumhurbaşkanı Kararı (RG 20.06.2026) – YMM sirküleri",
    url: "https://www.yontemymm.com.tr/mali-aciklamalar/2026-041-tl-mevduat-hesaplarinda-uygulanan-stopaj-oranlarinin-suresi-uzatildi",
  } satisfies Source,
} as const;

/** Vade gün sayısına göre TL mevduat stopaj oranı (yüzde değil, oran). */
export function depositWithholdingRate(days: number): number {
  if (days <= 182) return DEPOSIT_WITHHOLDING.upTo6Months;
  if (days <= 365) return DEPOSIT_WITHHOLDING.upTo1Year;
  return DEPOSIT_WITHHOLDING.over1Year;
}

/* ------------------------------------------------------------------ */
/* Tüketici kredisi vergi ve fonları                                   */
/* ------------------------------------------------------------------ */

export const CONSUMER_LOAN_TAXES = {
  /** İhtiyaç ve taşıt kredisi faizine uygulanan KKDF */
  kkdf: 0.15,
  /** Tüketici kredisi faizine uygulanan BSMV (7345 sayılı CK, 07.07.2023) */
  bsmv: 0.15,
  source: {
    label: "TÜRMOB – Tüketici kredilerinde BSMV oranı yükseltildi (7345 sayılı CK)",
    url: "https://www.turmob.org.tr/ekutuphane/Read/7fea8441-b31e-46fa-91e7-cf9f96b4248c",
  } satisfies Source,
} as const;

/* ------------------------------------------------------------------ */
/* İşveren prim oranları                                               */
/* ------------------------------------------------------------------ */

/**
 * 2026'da işveren payı iki kalemde arttı: malullük-yaşlılık-ölüm %11'den
 * %12'ye (7566 sayılı Kanun), kısa vadeli sigorta kolları %2'den %2,25'e.
 * Toplam işveren yükü bu nedenle %22,75 değil %23,75'tir; ÇSGB'nin asgari
 * ücret işveren maliyeti tablosu da bu oranla tutmaktadır.
 */
export const EMPLOYER_RATES = {
  /** Kısa vadeli sigorta kolları */
  shortTerm: 0.0225,
  /** Malullük, yaşlılık ve ölüm (işveren payı) */
  pension: 0.12,
  /** Genel sağlık sigortası (işveren payı) */
  health: 0.075,
  /** SGK işveren payı toplamı */
  sgkTotal: 0.2175,
  /** İşsizlik sigortası işveren payı */
  unemployment: 0.02,
  /** SGK + işsizlik toplam işveren yükü (teşviksiz) */
  total: 0.2375,
  /** 5510 sayılı Kanun md. 81/ı indirimleri (MYÖ işveren hissesinden düşer) */
  incentives: {
    /** İmalat sektörü: 5 puan */
    manufacturing: 0.05,
    /** İmalat dışı sektörler: 2 puan (01.01.2026'dan itibaren) */
    other: 0.02,
  },
  source: {
    label: "SGK – İşveren Prim Oranları (2026)",
    url: "https://www.sgk.gov.tr/Content/Post/c7812ea8-5087-413f-aeb5-d3c1d153e11a/Isveren-Prim-Oranlari-2026-01-13-04-52-38",
  } satisfies Source,
} as const;

/* ------------------------------------------------------------------ */
/* Kredi kartı faiz ve asgari ödeme                                    */
/* ------------------------------------------------------------------ */

/**
 * TCMB azami kredi kartı faiz oranlarını her ay yeniden ilan eder; oranlar
 * dönem borcuna göre kademelidir. Tarih bilgisi sayfada gösterilir ki
 * ziyaretçi güncelliği görebilsin.
 */
export const CREDIT_CARD = {
  validFrom: "2026-09-01",
  /** Dönem borcuna göre aylık azami akdi ve gecikme faizi */
  tiers: [
    { upTo: 30000, contractual: 0.0325, late: 0.0355 },
    { upTo: 180000, contractual: 0.0375, late: 0.0405 },
    { upTo: Infinity, contractual: 0.0425, late: 0.0455 },
  ],
  /** Nakit çekimde dönem borcuna bakılmaksızın en üst kademe uygulanır */
  cashAdvance: { contractual: 0.0425, late: 0.0455 },
  /** BDDK asgari ödeme oranları (kart limitine göre) */
  minimumPayment: {
    limitThreshold: 50000,
    belowThreshold: 0.2,
    aboveThreshold: 0.4,
    /** Yeni tahsis edilen kartlarda ilk bir yıl */
    newCardFirstYear: 0.4,
  },
  source: {
    label: "TCMB – Kredi kartı işlemlerinde azami faiz oranları",
    url: "https://www.tcmb.gov.tr/wps/wcm/connect/TR/TCMB+TR/Main+Menu/Istatistikler/Bankacilik+Verileri/Kredi_Karti_Islemlerinde_Uygulanacak_Azami_Faiz_Oranlari",
  } satisfies Source,
  minimumSource: {
    label: "BDDK – 10970 sayılı Kurul Kararı (26.09.2024)",
    url: "https://www.bddk.org.tr/Mevzuat/DokumanGetir/1255",
  } satisfies Source,
} as const;

/* ------------------------------------------------------------------ */
/* Gecikme zammı ve tecil faizi                                        */
/* ------------------------------------------------------------------ */

export const LATE_PAYMENT = {
  /** Aylık gecikme zammı (6183 md. 51); gecikme faizi ve pişmanlık zammı da aynı */
  monthly: 0.037,
  /** Yıllık tecil faizi (6183 md. 48) */
  deferralAnnual: 0.39,
  validFrom: "2025-11-13",
  source: {
    label: "10556 sayılı Cumhurbaşkanı Kararı (RG 13.11.2025/33076)",
    url: "https://www.resmigazete.gov.tr/eskiler/2025/11/20251113-2.pdf",
  } satisfies Source,
} as const;

/* ------------------------------------------------------------------ */
/* Kira geliri (GMSİ)                                                  */
/* ------------------------------------------------------------------ */

export const RENTAL_INCOME = {
  /** Mesken kira geliri istisnası (yıllık, TL) */
  exemption: 58000,
  /** Götürü gider oranı (GVK 74); hak kiraya verenler yararlanamaz */
  lumpSumExpenseRate: 0.15,
  /** İşyeri kirasında stopaj oranı (GVK 94/5-a) */
  workplaceWithholding: 0.2,
  /** Stopaja tabi işyeri kirasında beyan sınırı (tarifenin 2. dilimi) */
  workplaceDeclarationLimit: 400000,
  /** Stopajsız işyeri kirasında beyan sınırı (GVK 86/1-d) */
  workplaceNoWithholdingLimit: 22000,
  /**
   * İstisnadan yararlanamama sınırı: beyanı gerekmeyenler hariç toplam brüt
   * geliri ücret tarifesinin 3. dilimini aşanlar mesken istisnası alamaz.
   */
  exemptionIncomeLimit: 1500000,
  source: {
    label: "GVK Genel Tebliği Seri No: 332 (RG 31.12.2025) – KPMG özeti",
    url: "https://kpmgvergi.com/yayinlar/mali-bultenler/vergi/2026-yili-gelir-vergisi-dilimleri-ile-dikkate-alinacak-bazi-had-ve-tutarlar-belirlendi/3351",
  } satisfies Source,
} as const;

/* ------------------------------------------------------------------ */
/* Damga vergisi                                                       */
/* ------------------------------------------------------------------ */

export const STAMP_TAX = {
  /** Belli parayı ihtiva eden sözleşme, taahhütname, temlikname */
  contract: 0.00948,
  /** Kira sözleşmesi (sözleşme süresi boyunca toplam kira bedeli üzerinden) */
  rentContract: 0.00189,
  /** Adi kefilli kira sözleşmesi */
  rentWithSurety: 0.01137,
  /** Müteselsil kefilli kira sözleşmesi */
  rentWithJointSurety: 0.00948,
  /** Ücret bordrosu */
  payroll: 0.00759,
  /** Her bir kâğıttan alınacak azami damga vergisi (2026) */
  maximum: 29115961.1,
  source: {
    label: "Damga Vergisi Kanunu Genel Tebliği Seri No: 71 (RG 31.12.2025)",
    url: "https://www.alomaliye.com/2025/12/31/damga-vergisi-kanunu-genel-tebligi-seri-no-71-2026-yili-1-sayili-tabloda-yer-alan-maktu-vergiler/",
  } satisfies Source,
} as const;

/* ------------------------------------------------------------------ */
/* Emlak vergisi                                                       */
/* ------------------------------------------------------------------ */

export const PROPERTY_TAX = {
  /** Bina, arsa ve arazi vergisi oranları (1319 sayılı Kanun md. 8 ve 18) */
  rates: {
    mesken: { normal: 0.001, metropolitan: 0.002 },
    isyeri: { normal: 0.002, metropolitan: 0.004 },
    arsa: { normal: 0.003, metropolitan: 0.006 },
    arazi: { normal: 0.001, metropolitan: 0.002 },
  },
  /** Taşınmaz kültür varlıklarının korunmasına katkı payı (verginin %10'u) */
  culturalContribution: 0.1,
  /** İndirimli (sıfır) orandan yararlanmada tek mesken yüzölçümü sınırı (m²) */
  reducedRateMaxArea: 200,
  installments: "1. taksit mart–mayıs, 2. taksit kasım ayında ödenir.",
  source: {
    label: "TÜRMOB – 2026 Yılında Emlak Vergisi Uygulaması (89 Seri No'lu Tebliğ)",
    url: "https://www.turmob.org.tr/ekutuphane/Read/dcca5a10-3d55-40d7-b531-1244690fea66",
  } satisfies Source,
} as const;

/* ------------------------------------------------------------------ */
/* Serbest meslek makbuzu                                              */
/* ------------------------------------------------------------------ */

export const FREELANCE_RECEIPT = {
  /** Vergi sorumlusuna kesilen makbuzda gelir vergisi stopajı (GVK 94/2-b) */
  withholding: 0.2,
  /** Genel KDV oranı (10.07.2023'ten itibaren) */
  vat: 0.2,
  source: {
    label: "GİB – Serbest Meslek Kazançlarında Vergilendirme Rehberi",
    url: "https://www.gib.gov.tr/sites/default/files/fileadmin/yayinlar/serbest_meslek_kazanci_rehberi.pdf",
  } satisfies Source,
} as const;

/* ------------------------------------------------------------------ */
/* Kredi erken kapatma                                                 */
/* ------------------------------------------------------------------ */

/**
 * Sabit faizli konut kredisinde erken ödeme tazminatı (6502 sayılı Kanun
 * md. 37). İhtiyaç ve taşıt kredilerinde ve değişken faizli konut
 * kredilerinde erken ödeme tazminatı alınamaz.
 */
export const EARLY_REPAYMENT = {
  /** Kalan vade bu kadar ay veya daha kısaysa düşük oran uygulanır */
  thresholdMonths: 36,
  shortRate: 0.01,
  longRate: 0.02,
  source: {
    label: "6502 sayılı Tüketicinin Korunması Hakkında Kanun, md. 30 ve 37",
    url: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6502&MevzuatTur=1&MevzuatTertip=5",
  } satisfies Source,
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
