"use client";

import { useMemo, useState } from "react";

import ResultRow, { money, percent } from "./ResultRow";

/**
 * Vadeli mevduat getirisi.
 *
 * Brüt faiz = anapara x yıllık oran x (vade günü / 365)
 * Stopaj brüt faiz üzerinden kesilir; anaparadan kesinti yapılmaz.
 */
export default function DepositCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("45");
  const [days, setDays] = useState("32");
  const [withholding, setWithholding] = useState("15");

  const result = useMemo(() => {
    const p = Number(principal);
    const r = Number(rate);
    const d = Number(days);
    const w = Number(withholding);

    if (
      !principal ||
      !Number.isFinite(p) ||
      p <= 0 ||
      !Number.isFinite(r) ||
      r < 0 ||
      !Number.isFinite(d) ||
      d <= 0 ||
      !Number.isFinite(w) ||
      w < 0 ||
      w > 100
    ) {
      return null;
    }

    const grossInterest = p * (r / 100) * (d / 365);
    const tax = grossInterest * (w / 100);
    const netInterest = grossInterest - tax;
    const total = p + netInterest;

    /* Vade sonu net getirinin yıllık bileşik karşılığı */
    const netAnnual =
      (Math.pow(total / p, 365 / d) - 1) * 100;

    return {
      grossInterest,
      tax,
      netInterest,
      total,
      netAnnual,
      netSimple: (netInterest / p) * 100,
    };
  }, [principal, rate, days, withholding]);

  function handleClear() {
    setPrincipal("");
    setRate("45");
    setDays("32");
    setWithholding("15");
  }

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Anapara (₺)
          <input
            type="number"
            min="0"
            step="0.01"
            value={principal}
            onChange={(event) => setPrincipal(event.target.value)}
            placeholder="100000"
          />
        </label>

        <label className="field">
          Yıllık Brüt Faiz Oranı (%)
          <input
            type="number"
            min="0"
            step="0.01"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
            placeholder="45"
          />
          <span className="field-hint">
            Bankanın ilan ettiği yıllık brüt oran.
          </span>
        </label>

        <label className="field">
          Vade (gün)
          <input
            type="number"
            min="1"
            step="1"
            value={days}
            onChange={(event) => setDays(event.target.value)}
            placeholder="32"
          />
          <span className="field-hint">
            32 gün, 92 gün, 180 gün gibi.
          </span>
        </label>

        <label className="field">
          Stopaj Oranı (%)
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={withholding}
            onChange={(event) => setWithholding(event.target.value)}
          />
          <span className="field-hint">
            Vade süresine göre değişir; bankanızdan teyit edin.
          </span>
        </label>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button
          type="button"
          className="btn btn-outline"
          style={{ borderRadius: 14 }}
          onClick={handleClear}
        >
          Temizle
        </button>
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow
            label="Brüt Faiz Getirisi"
            value={money(result.grossInterest)}
          />

          <ResultRow
            label={`Stopaj Kesintisi (%${withholding})`}
            value={`- ${money(result.tax)}`}
            tone="neg"
          />

          <ResultRow
            label="Net Faiz Getirisi"
            value={money(result.netInterest)}
            highlight
          />

          <ResultRow
            label="Vade Sonu Toplam"
            value={money(result.total)}
            hint="Anapara + net faiz"
            highlight
          />

          <ResultRow
            label="Vade Dönemi Net Getiri"
            value={percent(result.netSimple)}
            hint={`${days} günlük dönem için`}
          />

          <ResultRow
            label="Yıllık Net Bileşik Getiri"
            value={percent(result.netAnnual)}
            hint="Aynı oranla vade boyunca yenilendiği varsayımıyla"
          />
        </div>
      ) : (
        <div className="notice">
          Anapara, yıllık faiz oranı ve vade gününü girin. Stopaj düşülmüş net
          getiriniz ve vade sonu toplamınız otomatik hesaplanır.
        </div>
      )}
    </div>
  );
}
