/**
 * Canlı BIST hisse verisi.
 *
 * Kaynak: Yahoo Finance açık grafik ucu (anahtar gerektirmez). Her sembol için
 * ayrı istek gider; veri sunucuda 60 saniye önbelleğe alındığı için ziyaretçi
 * sayısı ne olursa olsun kaynağa dakikada bir tur atılır. Ulaşılamayan sembol
 * sessizce atlanır, tüm liste boşsa sayfa son başarılı veriyi göstermeye
 * devam eder.
 */

export const STOCK_SOURCE = { label: "Yahoo Finance", url: "https://finance.yahoo.com/" };

/** Borsa verisinin eskimiş sayılacağı süre (seans kapalıyken de uyarı çıkar) */
export const STOCK_STALE_MINUTES = 30;

export type Stock = {
  code: string;
  name: string;
  price: number;
  change: number;
  changeAmount: number;
  low: number | null;
  high: number | null;
  previousClose: number | null;
  volume: number | null;
};

export type StockData = {
  fetchedAt: string;
  /** Piyasa zamanı; sembollerin en güncel işlem saati */
  marketTime: string | null;
  indices: Stock[];
  stocks: Stock[];
};

/* BIST 30 ağırlıklı, en çok aranan hisseler */
const STOCKS: Array<[string, string]> = [
  ["THYAO", "Türk Hava Yolları"],
  ["GARAN", "Garanti BBVA"],
  ["AKBNK", "Akbank"],
  ["ISCTR", "İş Bankası (C)"],
  ["YKBNK", "Yapı Kredi"],
  ["VAKBN", "VakıfBank"],
  ["HALKB", "Halkbank"],
  ["KCHOL", "Koç Holding"],
  ["SAHOL", "Sabancı Holding"],
  ["ASELS", "Aselsan"],
  ["TUPRS", "Tüpraş"],
  ["EREGL", "Ereğli Demir Çelik"],
  ["BIMAS", "BİM Mağazalar"],
  ["MGROS", "Migros"],
  ["SASA", "Sasa Polyester"],
  ["FROTO", "Ford Otosan"],
  ["TOASO", "Tofaş"],
  ["DOAS", "Doğuş Otomotiv"],
  ["TCELL", "Turkcell"],
  ["TTKOM", "Türk Telekom"],
  ["PGSUS", "Pegasus"],
  ["TAVHL", "TAV Havalimanları"],
  ["SISE", "Şişecam"],
  ["PETKM", "Petkim"],
  ["KOZAL", "Koza Altın"],
  ["ENKAI", "Enka İnşaat"],
  ["ARCLK", "Arçelik"],
  ["ALARK", "Alarko Holding"],
  ["GUBRF", "Gübre Fabrikaları"],
  ["HEKTS", "Hektaş"],
];

const INDICES: Array<[string, string]> = [
  ["XU100", "BIST 100"],
  ["XU030", "BIST 30"],
  ["XBANK", "BIST Bankacılık"],
];

type Meta = {
  symbol?: string;
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
  regularMarketDayLow?: number;
  regularMarketDayHigh?: number;
  regularMarketVolume?: number;
  regularMarketTime?: number;
  chartPreviousClose?: number;
  previousClose?: number;
};

async function fetchOne(code: string, name: string): Promise<{ stock: Stock; time: number | null } | null> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${code}.IS?range=1d&interval=1d`,
      {
        next: { revalidate: 60 },
        headers: { "User-Agent": "Mozilla/5.0 (compatible; MiniHesapBot/1.0; +https://minihesap.net)" },
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!res.ok) return null;

    const json = (await res.json()) as { chart?: { result?: Array<{ meta?: Meta }> } };
    const meta = json.chart?.result?.[0]?.meta;
    const price = Number(meta?.regularMarketPrice);
    if (!meta || !Number.isFinite(price) || price <= 0) return null;

    const previousClose = Number(meta.chartPreviousClose ?? meta.previousClose);
    const change = Number(meta.regularMarketChangePercent) || 0;
    const prev = Number.isFinite(previousClose) && previousClose > 0 ? previousClose : null;

    return {
      stock: {
        code,
        name,
        price,
        change,
        changeAmount: prev !== null ? price - prev : 0,
        low: Number(meta.regularMarketDayLow) || null,
        high: Number(meta.regularMarketDayHigh) || null,
        previousClose: prev,
        volume: Number(meta.regularMarketVolume) || null,
      },
      time: Number(meta.regularMarketTime) || null,
    };
  } catch {
    return null;
  }
}

async function fetchList(list: Array<[string, string]>) {
  const results = await Promise.all(list.map(([code, name]) => fetchOne(code, name)));
  return results.filter(Boolean) as Array<{ stock: Stock; time: number | null }>;
}

export async function fetchStocks(): Promise<StockData | null> {
  const [indexRows, stockRows] = await Promise.all([fetchList(INDICES), fetchList(STOCKS)]);
  if (!indexRows.length && !stockRows.length) return null;

  const times = [...indexRows, ...stockRows].map((r) => r.time).filter((t): t is number => t !== null);
  const latest = times.length ? Math.max(...times) : null;

  return {
    fetchedAt: new Date().toISOString(),
    marketTime: latest ? new Date(latest * 1000).toISOString() : null,
    indices: indexRows.map((r) => r.stock),
    stocks: stockRows.map((r) => r.stock),
  };
}

/** Borsa İstanbul seansı: hafta içi 10.00–18.10 (İstanbul saati) */
export function sessionState(nowIso?: string) {
  const now = nowIso ? new Date(nowIso) : new Date();
  const parts = new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekday = get("weekday");
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  const weekend = weekday.startsWith("Cmt") || weekday.startsWith("Paz");
  const open = !weekend && minutes >= 600 && minutes <= 1090;
  return { open, weekend };
}

export const formatVolume = (value: number) => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toLocaleString("tr-TR", { maximumFractionDigits: 1 })} mlr`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toLocaleString("tr-TR", { maximumFractionDigits: 1 })} mn`;
  if (value >= 1_000) return `${(value / 1_000).toLocaleString("tr-TR", { maximumFractionDigits: 0 })} bin`;
  return value.toLocaleString("tr-TR");
};
