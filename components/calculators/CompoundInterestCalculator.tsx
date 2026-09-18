"use client";

import { useMemo, useState } from "react";

import ResultRow, { money, percent } from "./ResultRow";

/**
 * Bileşik faiz hesaplama.
 *
 * Faiz, seçilen sıklıkta anaparaya eklenir ve bir sonraki dönemde o da faiz
 * kazanır. Aylık düzenli ek yatırım varsa her ay sonunda eklenir; bunun için
 * yıllık oran seçilen sıklığa göre aylık efektif orana çevrilir.
 */

const FREQUENCIES = [
  { value: 1, label: "Yıllık" },
  { value: 4, label: "3 ayda bir" },
  { value: 12, label: "Aylık" },
  { value: 365, label: "Günlük" },
];

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("5");
  const [frequency, setFrequency] = useState(12);
  const [monthly, setMonthly] = useState("0");

  const result = useMemo(() => {
    const p = Number(principal.replace(",", ".")) || 0;
    const r = (Number(rate.replace(",", ".")) || 0) / 100;
    const y = Math.min(Number(years) || 0, 50);
    const m = Number(monthly.replace(",", ".")) || 0;
    if ((p <= 0 && m <= 0) || r < 0 || y <= 0) return null;

    const monthlyRate = Math.pow(1 + r / frequency, frequency / 12) - 1;
    const months = Math.round(y * 12);

    let balance = p;
    let deposited = p;
    const yearly: { year: number; balance: number; deposited: number }[] = [];
    for (let i = 1; i <= months; i += 1) {
      balance = balance * (1 + monthlyRate) + m;
      deposited += m;
      if (i % 12 === 0 || i === months) yearly.push({ year: Math.ceil(i / 12), balance, deposited });
    }

    const simple = p * (1 + r * y) + m * months;
    return {
      balance,
      deposited,
      interest: balance - deposited,
      effective: Math.pow(1 + r / frequency, frequency) - 1,
      simple,
      yearly,
    };
  }, [principal, rate, years, frequency, monthly]);

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Başlangıç tutarı (₺)
          <input type="number" inputMode="decimal" min="0" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="100000" />
        </label>
        <label className="field">
          Yıllık faiz / getiri oranı (%)
          <input type="number" inputMode="decimal" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="40" />
        </label>
        <label className="field">
          Süre (yıl)
          <input type="number" inputMode="numeric" min="1" max="50" value={years} onChange={(e) => setYears(e.target.value)} />
        </label>
        <label className="field">
          Faiz ne sıklıkla eklenir?
          <select value={frequency} onChange={(e) => setFrequency(Number(e.target.value))}>
            {FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Aylık ek yatırım (₺)
          <input type="number" inputMode="decimal" min="0" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
          <span className="field-hint">Her ay sonunda eklenir. Yoksa 0 bırakın.</span>
        </label>
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow label="Dönem sonu toplam" value={money(result.balance)} highlight />
          <ResultRow label="Yatırdığınız toplam" value={money(result.deposited)} />
          <ResultRow label="Kazanılan faiz" value={money(result.interest)} tone="pos" />
          <ResultRow
            label="Yıllık efektif oran"
            value={percent(result.effective * 100)}
            hint="Faiz sıklığı hesaba katılmış gerçek yıllık getiri"
          />
          <ResultRow
            label="Basit faize göre fazladan kazanç"
            value={money(result.balance - result.simple)}
            hint="Faizin faiz kazanmasının etkisi"
          />

          <div className="board-scroll" style={{ marginTop: 6 }}>
            <table className="board-table">
              <thead>
                <tr>
                  <th scope="col">Yıl</th>
                  <th scope="col">Yatırılan</th>
                  <th scope="col">Bakiye</th>
                </tr>
              </thead>
              <tbody>
                {result.yearly.map((row) => (
                  <tr key={row.year}>
                    <th scope="row">{row.year}. yıl</th>
                    <td>{money(row.deposited)}</td>
                    <td>{money(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="notice">
            Sonuç vergi ve kesinti öncesidir. Mevduatta faizden stopaj kesilir; net getiri için{" "}
            <a href="/hesaplamalar/mevduat">mevduat faizi hesaplama</a> aracını kullanın.
          </div>
        </div>
      ) : (
        <div className="calc-hint">
          Başlangıç tutarını ve yıllık oranı girin; paranızın yıllar içinde bileşik faizle
          nasıl büyüdüğünü gösterelim.
        </div>
      )}
    </div>
  );
}
