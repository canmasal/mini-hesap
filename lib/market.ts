/**
 * Canlı altın ve döviz verisi.
 *
 * Fiyat kaynağı: Truncgil Finans açık JSON beslemesi (ücretsiz, anahtarsız).
 * Günlük değişim kaynağı: Yahoo Finance. Truncgil'in "Change" alanı kalemden
 * kaleme farklı bazlara göre hesaplanıyor (gram altın +%0,8 iken aynı anda
 * bütün ziynet altınlar -%0,1 gibi); bu yüzden değişimler tek bir ortak baza,
 * bir önceki günün kapanışına göre Yahoo'dan alınır. Yahoo'ya ulaşılamazsa
 * Truncgil'in kendi değişimine düşülür.
 *
 * Veri sunucuda çekilir ve 60 saniye önbelleğe alınır; ziyaretçi sayısı ne
 * olursa olsun kaynağa dakikada en fazla bir istek gider. Kaynak yanıt
 * vermezse null döner, sayfa son başarılı veriyi göstermeye devam eder.
 */

import { fetchOne, type Stock } from "./stocks";

export const MARKET_SOURCE = {
  label: "Truncgil Finans",
  url: "https://finans.truncgil.com/",
  feed: "https://finans.truncgil.com/v4/today.json",
};

/** Verinin eskimiş sayılacağı süre (piyasa kapalıyken de uyarı gösterilir) */
export const MARKET_STALE_MINUTES = 30;

export type Quote = {
  code: string;
  name: string;
  buying: number | null;
  selling: number;
  change: number;
};

export type Parity = {
  code: string;
  name: string;
  value: number;
  change: number;
};

export type MarketData = {
  /** Kaynağın bildirdiği güncelleme zamanı, ISO (İstanbul saati +03:00) */
  updatedAt: string;
  gold: Quote[];
  currencies: Quote[];
  /** Kurlardan türetilen pariteler (EUR/USD gibi) */
  parities: Parity[];
  /** Ons altın, sepet kur, BIST 100 gibi özet göstergeler */
  summary: Parity[];
};

/* Kuyumcu panosundaki sırayla altın türleri */
const GOLD: Array<[string, string]> = [
  ["GRA", "Gram Altın"],
  ["HAS", "Has Altın (24 ayar)"],
  ["CEYREKALTIN", "Çeyrek Altın"],
  ["YARIMALTIN", "Yarım Altın"],
  ["TAMALTIN", "Tam Altın"],
  ["CUMHURIYETALTINI", "Cumhuriyet Altını"],
  ["ATAALTIN", "Ata Altın"],
  ["RESATALTIN", "Reşat Altın"],
  ["IKIBUCUKALTIN", "İkibuçuk Altın"],
  ["BESLIALTIN", "Beşli Altın"],
  ["GREMSEALTIN", "Gremse Altın"],
  ["YIA", "22 Ayar Bilezik (gram)"],
  ["18AYARALTIN", "18 Ayar Altın (gram)"],
  ["14AYARALTIN", "14 Ayar Altın (gram)"],
  /* GUMUS, GPL ve PAL da kaynakta gram ve TL cinsinden geliyor, tıpkı GRA gibi */
  ["GUMUS", "Gram Gümüş"],
  ["GPL", "Gram Platin"],
  ["PAL", "Gram Paladyum"],
];

const CURRENCIES: Array<[string, string]> = [
  ["USD", "Amerikan Doları"],
  ["EUR", "Euro"],
  ["GBP", "İngiliz Sterlini"],
  ["CHF", "İsviçre Frangı"],
  ["CAD", "Kanada Doları"],
  ["AUD", "Avustralya Doları"],
  ["SAR", "Suudi Arabistan Riyali"],
  ["AED", "BAE Dirhemi"],
  ["KWD", "Kuveyt Dinarı"],
  ["RUB", "Rus Rublesi"],
  ["JPY", "Japon Yeni"],
  ["DKK", "Danimarka Kronu"],
  ["SEK", "İsveç Kronu"],
  ["NOK", "Norveç Kronu"],
];

type RawQuote = { Buying?: number; Selling?: number; Change?: number };

/**
 * Kaynak Japon yenini 100 kat düşük veriyor (1 yen için 0,0031 TL gibi).
 * Bağımsız kurlarla karşılaştırılıp 100 ile çarpılarak düzeltilir.
 */
const SCALE_FIX: Record<string, number> = { JPY: 100 };

/** Bölünerek türetilen göstergede (a / b) yüzde değişim */
const ratioChange = (a: number, b: number) => ((1 + a / 100) / (1 + b / 100) - 1) * 100;

/** 1 troy ons = 31,1034768 gram */
const OUNCE_GRAMS = 31.1034768;

function pick(raw: Record<string, unknown>, list: Array<[string, string]>): Quote[] {
  const out: Quote[] = [];
  for (const [code, name] of list) {
    const q = raw[code] as RawQuote | undefined;
    const selling = Number(q?.Selling);
    /* Kaynak bazı kalemler için 0 döndürebiliyor; boş satır göstermeyelim */
    if (!q || !Number.isFinite(selling) || selling <= 0) continue;
    const buying = Number(q.Buying);
    const factor = SCALE_FIX[code] ?? 1;
    out.push({
      code,
      name,
      buying: Number.isFinite(buying) && buying > 0 ? buying * factor : null,
      selling: selling * factor,
      change: Number(q.Change) || 0,
    });
  }
  return out;
}

export function normalizeMarket(raw: Record<string, unknown>): MarketData | null {
  const date = typeof raw.Update_Date === "string" ? raw.Update_Date : "";
  const gold = pick(raw, GOLD);
  const currencies = pick(raw, CURRENCIES);
  if (!gold.length && !currencies.length) return null;

  const at = (list: Quote[], code: string) => list.find((q) => q.code === code) ?? null;
  const usd = at(currencies, "USD");
  const eur = at(currencies, "EUR");
  const gbp = at(currencies, "GBP");
  const jpy = at(currencies, "JPY");
  const has = at(gold, "HAS");
  const silver = at(gold, "GUMUS");

  const parities: Parity[] = [];
  const addParity = (code: string, name: string, a: Quote | null, b: Quote | null, ratio = 1) => {
    if (!a || !b) return;
    parities.push({
      code,
      name,
      value: (a.selling / b.selling) * ratio,
      change: ratioChange(a.change, b.change),
    });
  };
  addParity("EUR/USD", "Euro / Dolar", eur, usd);
  addParity("GBP/USD", "Sterlin / Dolar", gbp, usd);
  addParity("EUR/GBP", "Euro / Sterlin", eur, gbp);
  addParity("USD/JPY", "Dolar / Japon Yeni", usd, jpy);

  const summary: Parity[] = [];
  if (has && usd) {
    summary.push({
      code: "ONS",
      name: "Ons altın (dolar)",
      value: (has.selling * OUNCE_GRAMS) / usd.selling,
      change: ratioChange(has.change, usd.change),
    });
  }
  /* Gümüş de gram/TL geldiği için ons/dolar karşılığı altınla aynı formülle çıkar */
  if (silver && usd) {
    summary.push({
      code: "ONSGUMUS",
      name: "Ons gümüş (dolar)",
      value: (silver.selling * OUNCE_GRAMS) / usd.selling,
      change: ratioChange(silver.change, usd.change),
    });
  }
  if (usd && eur) {
    summary.push({
      code: "SEPET",
      name: "Sepet kur (½ dolar + ½ euro)",
      value: (usd.selling + eur.selling) / 2,
      change: (usd.change + eur.change) / 2,
    });
  }
  const index = raw.XU100 as RawQuote | undefined;
  if (index && Number(index.Selling) > 0) {
    summary.push({
      code: "XU100",
      name: "BIST 100 endeksi",
      value: Number(index.Selling),
      change: Number(index.Change) || 0,
    });
  }

  return {
    updatedAt: date ? `${date.replace(" ", "T")}+03:00` : new Date().toISOString(),
    gold,
    currencies,
    parities,
    summary,
  };
}

/**
 * Kaynak, tarayıcı gibi davranmayan isteklere kapalı olabiliyor; bu yüzden
 * User-Agent ve Accept başlıkları açıkça gönderiliyor.
 */
const FEED_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; MiniHesapBot/1.0; +https://minihesap.net)",
  Accept: "application/json, text/plain, */*",
};

/** Son hata sebebi; /api/piyasa geliştirme modunda bunu geri veriyor */
let lastError: string | null = null;
export const marketLastError = () => lastError;

export async function fetchMarket(): Promise<MarketData | null> {
  try {
    const res = await fetch(MARKET_SOURCE.feed, {
      next: { revalidate: 60 },
      headers: FEED_HEADERS,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      lastError = `kaynak ${res.status} döndü`;
      return null;
    }
    const data = normalizeMarket((await res.json()) as Record<string, unknown>);
    lastError = data ? null : "yanıt beklenen alanları taşımıyor";
    return data;
  } catch (err) {
    lastError = err instanceof Error ? `${err.name}: ${err.message}` : "bilinmeyen hata";
    return null;
  }
}

export function findQuote(data: MarketData | null, code: string) {
  return data ? [...data.gold, ...data.currencies].find((q) => q.code === code) ?? null : null;
}

/**
 * Gösterge biçimi (özet ve parite satırları).
 *
 * Fiyat tablolarından ayrı tutuluyor: orada 48,7865 gibi kurlar için dört hane
 * gerekiyor, burada ise ons gümüş 66,8272 diye basılıyordu. İki haneli ve üstü
 * göstergelerde 2, paritelerde 4 hane yeterli.
 */
export function formatIndicator(value: number) {
  const digits = value >= 10 ? 2 : 4;
  return value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: digits });
}

/** Fiyat biçimi: üç haneli ve üstü tutarlarda 2, kurlarda 4, kuruşun altında 6 hane */
export function formatPrice(value: number) {
  const digits = value >= 100 ? 2 : value >= 0.01 ? 4 : 6;
  return value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: digits });
}
