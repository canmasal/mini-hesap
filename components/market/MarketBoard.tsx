"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { MARKET_STALE_MINUTES, formatPrice, type MarketData, type Quote } from "@/lib/market";

/**
 * Kuyumcu fiyat panosu tarzında canlı altın ve döviz tablosu.
 *
 * Sunucudan gelen ilk veriyle çizilir (arama motoru fiyatları HTML'de görür),
 * sonra sekme açıkken dakikada bir /api/piyasa'dan yenilenir. Değişen fiyat
 * yönüne göre kısa süre yeşil/kırmızı yanar.
 */

const REFRESH_MS = 60_000;

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

function Rows({ quotes, flash }: { quotes: Quote[]; flash: Flash }) {
  return (
    <div className="board-scroll">
      <table className="board-table">
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
              <td className={q.change > 0 ? "chg-up" : q.change < 0 ? "chg-down" : "chg-flat"}>
                {q.change > 0 ? "▲" : q.change < 0 ? "▼" : "•"} %
                {Math.abs(q.change).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
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
      if (!cancelled) {
        setNow(Date.now());
        timer = setTimeout(load, REFRESH_MS);
      }
    }

    setNow(Date.now());
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
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [initial]);

  /* Yanıp sönme efekti bir sonraki yenilemeden önce sönsün */
  useEffect(() => {
    if (!Object.keys(flash).length) return;
    const t = setTimeout(() => setFlash({}), 2400);
    return () => clearTimeout(t);
  }, [flash]);

  const stale = useMemo(() => {
    if (!data || now === null) return false;
    return now - new Date(data.updatedAt).getTime() > MARKET_STALE_MINUTES * 60_000;
  }, [data, now]);

  if (!data) {
    return (
      <div className="board">
        <p className="board-empty">
          Piyasa verisi şu an alınamıyor. Sayfa dakikada bir yeniden deniyor.
        </p>
      </div>
    );
  }

  const showTabs = view === "all";
  const active = showTabs ? tab : view;

  return (
    <div className="board" aria-live="polite">
      <div className="board-head">
        <div>
          <span className="board-live">
            <i aria-hidden="true" /> CANLI
          </span>
          <span className="board-time">Son güncelleme: {formatTime(data.updatedAt)}</span>
        </div>
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
      </div>

      {(stale || failed) && (
        <p className="board-warn">
          {failed
            ? "Bağlantı kurulamadı; son alınan fiyatlar gösteriliyor."
            : "Fiyatlar bir süredir değişmedi. Piyasa kapalı olabilir (hafta sonu, gece)."}
        </p>
      )}

      <Rows quotes={active === "gold" ? data.gold : data.currencies} flash={flash} />
    </div>
  );
}
