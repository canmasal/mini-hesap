"use client";

import { useMemo, useState } from "react";

import ResultRow, { money, percent } from "./ResultRow";

/**
 * Konut alımının gerçek maliyeti.
 *
 * Kredi taksitinin yanında çoğu alıcının hesaba katmadığı masraflar vardır:
 * tapu harcı, döner sermaye, ekspertiz, DASK, konut sigortası, kredi tahsis
 * ücreti ve ipotek masrafı. Bu araç hepsini tek toplamda gösterir.
 */
export default function HomeLoanCostCalculator() {
  const [price, setPrice] = useState("");
  const [down, setDown] = useState("");
  const [rate, setRate] = useState("2.79");
  const [term, setTerm] = useState("120");

  const [deedRate, setDeedRate] = useState("2");
  const [revolving, setRevolving] = useState("6000");
  const [appraisal, setAppraisal] = useState("6500");
  const [dask, setDask] = useState("2500");
  const [insurance, setInsurance] = useState("4000");
  const [allocationRate, setAllocationRate] = useState("0.5");
  const [mortgageFee, setMortgageFee] = useState("2000");

  const result = useMemo(() => {
    const p = Number(price);
    const d = Number(down);
    const r = Number(rate) / 100;
    const n = Number(term);

    if (
      !price ||
      !Number.isFinite(p) ||
      p <= 0 ||
      !Number.isFinite(d) ||
      d < 0 ||
      d > p ||
      !Number.isFinite(r) ||
      r < 0 ||
      !Number.isFinite(n) ||
      n < 1
    ) {
      return null;
    }

    const loan = p - d;

    /* Anüite taksit formülü; faiz 0 ise düz bölme */
    const monthly =
      r === 0 ? loan / n : (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const totalPayment = monthly * n;
    const totalInterest = totalPayment - loan;

    const deed = p * (Number(deedRate) / 100);
    const allocation = loan * (Number(allocationRate) / 100);

    const costs = [
      { label: `Tapu Harcı (%${deedRate})`, value: deed },
      { label: "Tapu Döner Sermaye", value: Number(revolving) || 0 },
      { label: "Ekspertiz (Değerleme)", value: Number(appraisal) || 0 },
      { label: "DASK (zorunlu deprem sigortası)", value: Number(dask) || 0 },
      { label: "Konut Sigortası (yıllık)", value: Number(insurance) || 0 },
      { label: `Kredi Tahsis Ücreti (%${allocationRate})`, value: allocation },
      { label: "İpotek / Ekspertiz Masrafı", value: Number(mortgageFee) || 0 },
    ];

    const totalCosts = costs.reduce((s, c) => s + c.value, 0);

    /* Peşinat + masraflar = kapanışta cebinizden çıkacak nakit */
    const cashNeeded = d + totalCosts;

    /* Evin toplam maliyeti: ödenen her şey */
    const grandTotal = d + totalPayment + totalCosts;

    return {
      loan,
      monthly,
      totalPayment,
      totalInterest,
      costs,
      totalCosts,
      cashNeeded,
      grandTotal,
      overPrice: ((grandTotal - p) / p) * 100,
    };
  }, [
    price, down, rate, term,
    deedRate, revolving, appraisal, dask, insurance, allocationRate, mortgageFee,
  ]);

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Konut Fiyatı (₺)
          <input
            type="number" min="0" step="1000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="4500000"
          />
        </label>

        <label className="field">
          Peşinat (₺)
          <input
            type="number" min="0" step="1000"
            value={down}
            onChange={(e) => setDown(e.target.value)}
            placeholder="1500000"
          />
        </label>

        <label className="field">
          Aylık Faiz Oranı (%)
          <input
            type="number" min="0" step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </label>

        <label className="field">
          Vade (ay)
          <input
            type="number" min="1" max="360" step="1"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </label>
      </div>

      <details style={{ marginTop: 18 }}>
        <summary style={{ cursor: "pointer", fontWeight: 800 }}>
          Masraf kalemlerini düzenle
        </summary>

        <div className="form-grid" style={{ marginTop: 16 }}>
          <label className="field">
            Tapu Harcı Oranı (%)
            <input type="number" step="0.1" value={deedRate}
              onChange={(e) => setDeedRate(e.target.value)} />
            <span className="field-hint">
              Yasal oran toplam %4; genelde alıcı ve satıcı %2&apos;şer öder.
            </span>
          </label>

          <label className="field">
            Tapu Döner Sermaye (₺)
            <input type="number" step="100" value={revolving}
              onChange={(e) => setRevolving(e.target.value)} />
          </label>

          <label className="field">
            Ekspertiz Ücreti (₺)
            <input type="number" step="100" value={appraisal}
              onChange={(e) => setAppraisal(e.target.value)} />
          </label>

          <label className="field">
            DASK (₺)
            <input type="number" step="100" value={dask}
              onChange={(e) => setDask(e.target.value)} />
          </label>

          <label className="field">
            Konut Sigortası (₺)
            <input type="number" step="100" value={insurance}
              onChange={(e) => setInsurance(e.target.value)} />
          </label>

          <label className="field">
            Kredi Tahsis Ücreti (%)
            <input type="number" step="0.1" value={allocationRate}
              onChange={(e) => setAllocationRate(e.target.value)} />
            <span className="field-hint">
              Yasal üst sınır kredi tutarının binde 5&apos;idir.
            </span>
          </label>

          <label className="field">
            İpotek / Diğer Masraf (₺)
            <input type="number" step="100" value={mortgageFee}
              onChange={(e) => setMortgageFee(e.target.value)} />
          </label>
        </div>
      </details>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow label="Kredi Tutarı" value={money(result.loan)} />
          <ResultRow label="Aylık Taksit" value={money(result.monthly)} highlight />
          <ResultRow
            label="Toplam Geri Ödeme"
            value={money(result.totalPayment)}
            hint={`Toplam faiz ${money(result.totalInterest)}`}
          />

          <div style={{ marginTop: 10, fontWeight: 900, color: "var(--ink)" }}>
            Alım Masrafları
          </div>

          {result.costs.map((c) => (
            <ResultRow key={c.label} label={c.label} value={money(c.value)} />
          ))}

          <ResultRow
            label="Toplam Masraf"
            value={money(result.totalCosts)}
            tone="neg"
            highlight
          />

          <ResultRow
            label="Tapuda Hazır Olması Gereken Nakit"
            value={money(result.cashNeeded)}
            hint="Peşinat + tüm masraflar"
            highlight
          />

          <ResultRow
            label="Evin Size Toplam Maliyeti"
            value={money(result.grandTotal)}
            hint={`İlan fiyatının ${percent(result.overPrice)} üzerinde`}
            tone="neg"
            highlight
          />

          <div className="notice notice-warn">
            Masraf tutarları bankaya, ile ve konutun değerine göre değişir.
            Buradaki değerler varsayılan tahminlerdir; kesin tutarlar için
            bankanızdan <strong>tahsis öncesi masraf listesi</strong> isteyin.
          </div>
        </div>
      ) : (
        <div className="notice">
          Konut fiyatını ve peşinatı girin. Taksitinizi, tapu harcından
          sigortaya kadar tüm masrafları ve evin size gerçek maliyetini
          hesaplayalım.
        </div>
      )}
    </div>
  );
}
