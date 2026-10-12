"use client";

import { useMemo, useState } from "react";

import { YOUTUBE_CREATOR_SHARE, youtubeRevenue } from "@/lib/calculations/newTools";
import ResultRow, { money } from "./ResultRow";

const n = (s: string) => Number(s.replace(",", ".")) || 0;

export default function YoutubeRevenueCalculator() {
  const [mode, setMode] = useState<"rpm" | "cpm">("rpm");
  const [views, setViews] = useState("");
  const [rpm, setRpm] = useState("");
  const [cpm, setCpm] = useState("");
  const [monetized, setMonetized] = useState("50");

  const result = useMemo(
    () =>
      mode === "rpm"
        ? youtubeRevenue({ mode, views: n(views), rpm: n(rpm) })
        : youtubeRevenue({ mode, views: n(views), cpm: n(cpm), monetizedRate: n(monetized) / 100 }),
    [mode, views, rpm, cpm, monetized],
  );

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Hesaplama yöntemi
          <select value={mode} onChange={(e) => setMode(e.target.value as "rpm" | "cpm")}>
            <option value="rpm">RPM ile (önerilen)</option>
            <option value="cpm">CPM ile</option>
          </select>
          <span className="field-hint">RPM, YouTube Studio &gt; Analytics &gt; Gelir sekmesinde yazar.</span>
        </label>
        <label className="field">
          Aylık izlenme
          <input type="number" inputMode="numeric" min="0" value={views} onChange={(e) => setViews(e.target.value)} placeholder="100000" />
        </label>
        {mode === "rpm" ? (
          <label className="field">
            RPM (1.000 izlenme başına gelir, ₺)
            <input type="number" inputMode="decimal" min="0" value={rpm} onChange={(e) => setRpm(e.target.value)} />
            <span className="field-hint">Kendi kanalınızın RPM değerini girin.</span>
          </label>
        ) : (
          <>
            <label className="field">
              CPM (1.000 reklam gösterimi, ₺)
              <input type="number" inputMode="decimal" min="0" value={cpm} onChange={(e) => setCpm(e.target.value)} />
            </label>
            <label className="field">
              Reklam gösterilen izlenme oranı (%)
              <input type="number" inputMode="decimal" min="0" max="100" value={monetized} onChange={(e) => setMonetized(e.target.value)} />
            </label>
          </>
        )}
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow label="Tahmini aylık gelir" value={money(result.monthly)} highlight />
          <ResultRow label="Günlük ortalama" value={money(result.daily)} />
          <ResultRow label="Yıllık (aynı izlenmeyle)" value={money(result.yearly)} />
          {mode === "cpm" && (
            <ResultRow label="Hesaplanan RPM" value={money(result.perThousand)} hint={`CPM × reklamlı izlenme oranı × %${Math.round(YOUTUBE_CREATOR_SHARE * 100)} içerik üreticisi payı`} />
          )}
          <div className="notice">
            Gelir; izleyicinin ülkesine, konu başlığına, sezona ve video süresine göre büyük
            farklılık gösterir. Hesap uzun videoların reklam geliri içindir; Shorts, kanal
            üyeliği, Super Thanks ve sponsorluk gelirleri dahil değildir. Ödemeler dolar
            üzerinden yapıldığından kur da tutarı etkiler.
          </div>
        </div>
      ) : (
        <div className="calc-hint">Aylık izlenme sayınızı ve RPM (veya CPM) değerinizi girin.</div>
      )}
    </div>
  );
}
