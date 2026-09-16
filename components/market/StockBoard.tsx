"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  STOCK_STALE_MINUTES,
  formatVolume,
  sessionState,
  type Stock,
  type StockData,
} from "@/lib/stocks";

/**
 * Canlı BIST panosu: endeks kartları, artan/azalan listeleri ve sıralanabilir
 * hisse tablosu. Sunucudan gelen ilk veriyle çizilir, sekme açıkken dakikada
 * bir /api/borsa'dan yenilenir.
 */

const REFRESH_MS = 60_000;

const price = (value: number) =>
  value.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const changeClass = (change: number) => (change > 0 ? "chg-up" : change < 0 ? "chg-down" : "chg-flat");

function ChangeTag({ change }: { change: number }) {
  return (
    <span className={changeClass(change)}>
      {change > 0 ? "▲" : change < 0 ? "▼" : "•"} %
      {Math.abs(change).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );
}

type Flash = Record<string, "up" | "down">;
type SortKey = "name" | "price" | "change" | "volume";

function diffFlash(prev: StockData, next: StockData): Flash {
  const before = new Map([...prev.indices, ...prev.stocks].map((s) => [s.code, s.price]));
  const flash: Flash = {};
  for (const s of [...next.indices, ...next.stocks]) {
    const old = before.get(s.code);
    if (old !== undefined && old !== s.price) flash[s.code] = s.price > old ? "up" : "down";
  }
  return flash;
}

function Movers({ title, rows }: { title: string; rows: Stock[] }) {
  if (!rows.length) return null;
  return (
    <section className="market-panel">
      <h3>{title}</h3>
      <ul className="mover-list">
        {rows.map((s) => (
          <li key={s.code}>
            <span className="mover-code">{s.code}</span>
            <span className="mover-name">{s.name}</span>
            <span className="mover-price">₺{price(s.price)}</span>
            <ChangeTag change={s.change} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function StockBoard({ initial }: { initial: StockData | null }) {
  const [data, setData] = useState(initial);
  const [flash, setFlash] = useState<Flash>({});
  const [failed, setFailed] = useState(false);
  const [now, setNow] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("change");
  const dataRef = useRef(initial);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    async function load() {
      if (document.visibilityState === "visible") {
        try {
          const res = await fetch("/api/borsa", { cache: "no-store" });
          if (!res.ok) throw new Error(String(res.status));
          const next = (await res.json()) as StockData;
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

    setNow(Date.now());
    const clock = setInterval(() => setNow(Date.now()), 1000);
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

  const rows = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLocaleLowerCase("tr-TR");
    const list = q
      ? data.stocks.filter(
          (s) =>
            s.code.toLocaleLowerCase("tr-TR").includes(q) || s.name.toLocaleLowerCase("tr-TR").includes(q),
        )
      : [...data.stocks];

    return list.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "tr-TR");
      if (sort === "price") return b.price - a.price;
      if (sort === "volume") return (b.volume ?? 0) - (a.volume ?? 0);
      return b.change - a.change;
    });
  }, [data, query, sort]);

  const session = useMemo(() => sessionState(), []);

  if (!data) {
    return (
      <div className="board">
        <p className="board-empty">Borsa verisi şu an alınamıyor. Sayfa dakikada bir yeniden deniyor.</p>
      </div>
    );
  }

  const stale =
    now !== null &&
    data.marketTime !== null &&
    now - new Date(data.marketTime).getTime() > STOCK_STALE_MINUTES * 60_000;

  const clock =
    now === null
      ? null
      : new Date(now).toLocaleTimeString("tr-TR", {
          timeZone: "Europe/Istanbul",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

  const sorted = [...data.stocks].sort((a, b) => b.change - a.change);
  const gainers = sorted.filter((s) => s.change > 0).slice(0, 5);
  const losers = sorted.filter((s) => s.change < 0).reverse().slice(0, 5);

  return (
    <div className="market" aria-live="polite">
      <div className="board-head">
        <div>
          <span className={session.open ? "board-live" : "board-live is-closed"}>
            <i aria-hidden="true" /> {session.open ? "SEANS AÇIK" : "SEANS KAPALI"}
          </span>
          <span className="board-time">
            {data.marketTime
              ? `Son işlem: ${new Date(data.marketTime).toLocaleString("tr-TR", {
                  timeZone: "Europe/Istanbul",
                  day: "2-digit",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "İşlem saati alınamadı"}
          </span>
        </div>
        <span className="board-clock" suppressHydrationWarning>
          {clock ?? "--:--:--"}
        </span>
      </div>

      {(failed || (stale && session.open)) && (
        <p className="board-warn">
          {failed
            ? "Bağlantı kurulamadı; son alınan fiyatlar gösteriliyor."
            : "Fiyatlar bir süredir güncellenmedi."}
        </p>
      )}

      <div className="hi-grid">
        {data.indices.map((index) => (
          <div className="hi-card" key={index.code}>
            <span className="hi-name">{index.name}</span>
            <b className="hi-value">{price(index.price)}</b>
            <span className="hi-foot">
              <ChangeTag change={index.change} />
              {index.previousClose !== null && (
                <span className="hi-buy">Önceki kapanış {price(index.previousClose)}</span>
              )}
            </span>
          </div>
        ))}
      </div>

      <div className="market-grid">
        <Movers title="Yükselenler" rows={gainers} />
        <Movers title="Düşenler" rows={losers} />
      </div>

      <section className="market-panel">
        <h3>Hisse fiyatları</h3>
        <div className="stock-tools">
          <label className="sr-only" htmlFor="hisse-ara">
            Hisse ara
          </label>
          <input
            id="hisse-ara"
            type="search"
            placeholder="Hisse ara (THYAO, Garanti…)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <label className="sr-only" htmlFor="hisse-sirala">
            Sıralama
          </label>
          <select id="hisse-sirala" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="change">Değişime göre</option>
            <option value="volume">İşlem hacmine göre</option>
            <option value="price">Fiyata göre</option>
            <option value="name">İsme göre</option>
          </select>
        </div>

        <div className="board-scroll">
          <table className="board-table">
            <thead>
              <tr>
                <th scope="col">Hisse</th>
                <th scope="col">Fiyat</th>
                <th scope="col">Günlük aralık</th>
                <th scope="col">Hacim (lot)</th>
                <th scope="col">Değişim</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.code} className={flash[s.code] ? `flash-${flash[s.code]}` : undefined}>
                  <th scope="row">
                    <span className="board-name">{s.name}</span>
                    <span className="board-code">{s.code}</span>
                  </th>
                  <td className="board-sell">₺{price(s.price)}</td>
                  <td>{s.low !== null && s.high !== null ? `${price(s.low)} – ${price(s.high)}` : "—"}</td>
                  <td>{s.volume !== null ? formatVolume(s.volume) : "—"}</td>
                  <td className={changeClass(s.change)}>
                    <ChangeTag change={s.change} />
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    Aramanıza uyan hisse bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
