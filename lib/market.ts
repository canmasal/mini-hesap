/**
 * Canlı altın ve döviz verisi.
 *
 * Kaynak: Truncgil Finans açık JSON beslemesi (ücretsiz, anahtarsız).
 * Veri sunucuda çekilir ve 60 saniye önbelleğe alınır; ziyaretçi sayısı ne
 * olursa olsun kaynağa dakikada en fazla bir istek gider. Kaynak yanıt
 * vermezse null döner, sayfa son başarılı veriyi göstermeye devam eder.
 */

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

export type MarketData = {
  /** Kaynağın bildirdiği güncelleme zamanı, ISO (İstanbul saati +03:00) */
  updatedAt: string;
  gold: Quote[];
  currencies: Quote[];
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
  ["GUMUS", "Gram Gümüş"],
  ["GPL", "Gram Platin"],
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

function pick(raw: Record<string, unknown>, list: Array<[string, string]>): Quote[] {
  const out: Quote[] = [];
  for (const [code, name] of list) {
    const q = raw[code] as RawQuote | undefined;
    const selling = Number(q?.Selling);
    /* Kaynak bazı kalemler için 0 döndürebiliyor; boş satır göstermeyelim */
    if (!q || !Number.isFinite(selling) || selling <= 0) continue;
    const buying = Number(q.Buying);
    out.push({
      code,
      name,
      buying: Number.isFinite(buying) && buying > 0 ? buying : null,
      selling,
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

  return {
    updatedAt: date ? `${date.replace(" ", "T")}+03:00` : new Date().toISOString(),
    gold,
    currencies,
  };
}

export async function fetchMarket(): Promise<MarketData | null> {
  try {
    const res = await fetch(MARKET_SOURCE.feed, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return normalizeMarket((await res.json()) as Record<string, unknown>);
  } catch {
    return null;
  }
}

export function findQuote(data: MarketData | null, code: string) {
  return data ? [...data.gold, ...data.currencies].find((q) => q.code === code) ?? null : null;
}

/** Fiyat biçimi: büyük tutarlarda 2, kurlarda 4, çok küçük birimlerde 6 hane */
export function formatPrice(value: number) {
  const digits = value >= 1000 ? 2 : value >= 1 ? 4 : 6;
  return value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: digits });
}
