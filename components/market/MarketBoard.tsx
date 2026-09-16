"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  MARKET_STALE_MINUTES,
  formatPrice,
  type MarketData,
  type Parity,
  type Quote,
} from "@/lib/market";

/**
 * Canlı piyasa panosu: akan şerit, öne çıkan kartlar, döviz/altın/parite
 * tabloları ve saat.
 *
 * Sunucudan gelen ilk veriyle çizilir (arama motoru fiyatları HTML'de görür),
 * sonra sekme açıkken dakikada bir /api/piyasa'dan yenilenir. Değişen fiyat
 * yönüne göre kısa süre yeşil/kırmızı yanar.
 */

const REFRESH_MS = 60_000;

/** Şeritte ve kartlarda öne çıkan kalemler */
const TICKER = ["USD", "EUR", "GRA", "CEYREKALTIN", "GBP", "CUMHURIYETALTINI", "CHF", "GUMUS", "SAR"];

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", {
    timeZone: "Europe/Istanbul",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function changeClass(change: number) {
  return change > 0 ? "chg-up" : change < 0 ? "chg-down" : "chg-flat";
}

function ChangeTag({ change }: { change: number }) {
  return (
    <span className={changeClass(change)}>
      {change > 0 ? "▲" : change < 0 ? "▼" : "•"} %
      {Math.abs(change).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );
}

type Flash = Record<string, "up" | "down">;

function diffFlash(prev: MarketData, next: MarketData): Flash {
  const before = new Map([...prev.gold, ...prev.currencies].map((q) => [q.code, q.selling]));
  const flash: Flash = {};
  for (const q of [...next.gold, ...next.currencies]) {
    const old = before.get(q.code);
    if (old !== undefined && old !== q.selling) flash[q.code] = q.selling > old ? "up" : "down";
  }
  return flash;
}

function Ticker({ data }: { data: MarketData }) {
  const all = [...data.gold, ...data.currencies];
  const items = TICKER.map((code) => all.find((q) => q.code === code)).filter(Boolean) as Quote[];
  if (!items.length) return null;

  /* Kesintisiz akış için liste iki kez basılır; ikincisi ekran okuyucudan gizli */
  const strip = (hidden: boolean) => (
    <div className="ticker-run" aria-hidden={hidden || undefined}>
      {items.map((q) => (
        <span className="ticker-item" key={`${hidden ? "b" : "a"}-${q.code}`}>
          <b>{q.name}</b>
          <span>₺{formatPrice(q.selling)}</span>
          <ChangeTag change={q.change} />
        </span>
      ))}
    </div>
  );

  return (
    <div className="ticker">
      {strip(false)}
      {strip(true)}
    </div>
  );
}

function Highlights({ data, codes }: { data: MarketData; codes: string[] }) {
  const all = [...data.gold, ...data.currencies];
  return (
    <div className="hi-grid">
      {codes.map((code) => {
        const q = all.find((item) => item.code === code);
        if (!q) return null;
        return (
          <div className="hi-card" key={code}>
            <span className="hi-name">{q.name}</span>
            <b className="hi-value">₺{formatPrice(q.selling)}</b>
            <span className="hi-foot">
              <ChangeTag change={q.change} />
              {q.buying !== null && <span className="hi-buy">Alış ₺{formatPrice(q.buying)}</span>}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function QuoteTable({ quotes, flash, caption }: { quotes: Quote[]; flash: Flash; caption?: string }) {
  return (
    <div className="board-scroll">
      <table className="board-table">
        {caption && <caption className="board-caption">{caption}</caption>}
        <thead>
          <tr>
            <th scope="col">Birim</th>
            <th scope="col">Alış</th>
            <th scope="col">Satış</th>
            <th scope="col">Değişim</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((q) => (
            <tr key={q.code} className={flash[q.code] ? `flash-${flash[q.code]}` : undefined}>
              <th scope="row">
                <span className="board-name">{q.name}</span>
                <span className="board-code">{q.code}</span>
              </th>
              <td>{q.buying === null ? "—" : `₺${formatPrice(q.buying)}`}</td>
              <td className="board-sell">₺{formatPrice(q.selling)}</td>
              <td className={changeClass(q.change)}>
                <ChangeTag change={q.change} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ParityTable({ rows, unit }: { rows: Parity[]; unit?: string }) {
  if (!rows.length) return null;
  return (
    <div className="board-scroll">
      <table className="board-table">
        <thead>
          <tr>
            <th scope="col">Gösterge</th>
            <th scope="col">Değer</th>
            <th scope="col">Değişim</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.code}>
              <th scope="row">
                <span className="board-name">{row.name}</span>
                <span className="board-code">{row.code}</span>
              </th>
              <td className="board-sell">
                {unit === "try" ? "₺" : ""}
                {formatPrice(row.value)}
              </td>
              <td className={changeClass(row.change)}>
                <ChangeTag change={row.change} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MarketBoard({
  initial,
  view = "all",
}: {
  initial: MarketData | null;
  view?: "all" | "gold" | "currency";
}) {
  const [data, setData] = useState(initial);
  const [flash, setFlash] = useState<Flash>({});
  const [failed, setFailed] = useState(false);
  const [now, setNow] = useState<number | null>(null);
  const [tab, setTab] = useState<"gold" | "currency">(view === "currency" ? "currency" : "gold");
  const dataRef = useRef(initial);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    async function load() {
      if (document.visibilityState === "visible") {
        try {
          const res = await fetch("/api/piyasa", { cache: "no-store" });
          if (!res.ok) throw new Error(String(res.status));
          const next = (await res.json()) as MarketData;
          if (cancelled) return;
          if (dataRef.current) setFlash(diffFlash(dataRef.current, next));
          dataRef.current = next;
          setData(next);
          setFailed(false);
        } catch {
          if (!cancelled) setFailed(true);
        }
      }
      if (!cancelled) timer = setTimeout(load, REFRESH_MS);
    }

    /* Saat ve "veri eskidi mi" kontrolü için saniyelik sayaç */
    setNow(Date.now());
    const clock = setInterval(() => setNow(Date.now()), 1000);
    /* Sayfa önbellekten geldiyse ilk veriyi hemen tazele */
    timer = setTimeout(load, initial ? 1500 : 0);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        clearTimeout(timer);
        load();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearInterval(clock);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [initial]);

  useEffect(() => {
    if (!Object.keys(flash).length) return;
    const t = setTimeout(() => setFlash({}), 2400);
    return () => clearTimeout(t);
  }, [flash]);

  const stale = useMemo(() => {
    if (!data || now === null) return false;
    return now - new Date(data.updatedAt).getTime() > MARKET_STALE_MINUTES * 60_000;
  }, [data, now]);

  const clock =
    now === null
      ? null
      : new Date(now).toLocaleTimeString("tr-TR", {
          timeZone: "Europe/Istanbul",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

  if (!data) {
    return (
      <div className="board">
        <p className="board-empty">
          Piyasa verisi şu an alınamıyor. Sayfa dakikada bir yeniden deniyor.
        </p>
      </div>
    );
  }

  const isGold = view === "gold";
  const highlights = isGold
    ? ["GRA", "CEYREKALTIN", "TAMALTIN", "USD"]
    : ["USD", "EUR", "GBP", "GRA"];

  const showTabs = view === "all";
  const active = showTabs ? tab : view;

  return (
    <div className="market" aria-live="polite">
      <Ticker data={data} />

      <div className="board-head">
        <div>
          <span className="board-live">
            <i aria-hidden="true" /> CANLI
          </span>
          <span className="board-time">Son güncelleme: {formatTime(data.updatedAt)}</span>
        </div>
        <span className="board-clock" suppressHydrationWarning>
          {clock ?? "--:--:--"}
        </span>
      </div>

      {(stale || failed) && (
        <p className="board-warn">
          {failed
            ? "Bağlantı kurulamadı; son alınan fiyatlar gösteriliyor."
            : "Fiyatlar bir süredir değişmedi. Piyasa kapalı olabilir (hafta sonu, gece)."}
        </p>
      )}

      <Highlights data={data} codes={highlights} />

      <div className="market-grid">
        <section className="market-panel">
          <h3>{isGold ? "Altın fiyatları" : "Döviz kurları"}</h3>
          <QuoteTable quotes={isGold ? data.gold : data.currencies} flash={flash} />
        </section>

        <div className="market-col">
          <section className="market-panel">
            <h3>Piyasa özeti</h3>
            <ParityTable rows={data.summary} />
          </section>
          <section className="market-panel">
            <h3>Pariteler</h3>
            <ParityTable rows={data.parities} />
          </section>
          <section className="market-panel">
            <h3>{isGold ? "Döviz kurları" : "Altın fiyatları"}</h3>
            {showTabs && (
              <div className="board-tabs" role="tablist">
                <button type="button" role="tab" aria-selected={tab === "gold"} onClick={() => setTab("gold")}>
                  Altın
                </button>
                <button type="button" role="tab" aria-selected={tab === "currency"} onClick={() => setTab("currency")}>
                  Döviz
                </button>
              </div>
            )}
            <QuoteTable
              quotes={showTabs ? (active === "gold" ? data.gold : data.currencies) : isGold ? data.currencies : data.gold}
              flash={flash}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
