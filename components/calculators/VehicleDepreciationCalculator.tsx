"use client";

import { useMemo, useState } from "react";

import { vehicleDepreciation } from "@/lib/calculations/newTools";
import ResultRow, { money, percent } from "./ResultRow";

const n = (s: string) => Number(s.replace(",", ".")) || 0;

export default function VehicleDepreciationCalculator() {
  const [price, setPrice] = useState("");
  const [first, setFirst] = useState("15");
  const [yearly, setYearly] = useState("10");
  const [years, setYears] = useState("5");

  const result = useMemo(
    () =>
      vehicleDepreciation({
        price: n(price),
        firstYearRate: n(first) / 100,
        yearlyRate: n(yearly) / 100,
        years: n(years),
      }),
    [price, first, yearly, years],
  );

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Aracın bugünkü fiyatı (₺)
          <input type="number" inputMode="decimal" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="1500000" />
        </label>
        <label className="field">
          İlk yıl değer kaybı (%)
          <input type="number" inputMode="decimal" min="0" max="90" value={first} onChange={(e) => setFirst(e.target.value)} />
          <span className="field-hint">Sıfır araçta ilk yıl kayıp daha yüksektir; ikinci elde sonraki yıllarla aynı girilebilir.</span>
        </label>
        <label className="field">
          Sonraki yıllarda yıllık kayıp (%)
          <input type="number" inputMode="decimal" min="0" max="90" value={yearly} onChange={(e) => setYearly(e.target.value)} />
        </label>
        <label className="field">
          Süre (yıl)
          <input type="number" inputMode="numeric" min="1" max="30" value={years} onChange={(e) => setYears(e.target.value)} />
        </label>
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow label={`${result.rows.length} yıl sonra tahmini değer`} value={money(result.finalValue)} highlight />
          <ResultRow label="Toplam değer kaybı" value={`${money(result.totalLoss)} (${percent(result.totalLossPercent)})`} tone="neg" />
          <ResultRow label="Yıllık ortalama kayıp" value={money(result.averageYearlyLoss)} />
          <div className="rates-table-wrap">
            <table className="rates-table">
              <thead>
                <tr>
                  <th scope="col">Yıl</th>
                  <th scope="col">Değer kaybı</th>
                  <th scope="col">Yıl sonu değeri</th>
                  <th scope="col">Toplam kayıp</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((r) => (
                  <tr key={r.year}>
                    <th scope="row">{r.year}. yıl</th>
                    <td>{money(r.loss)}</td>
                    <td>{money(r.value)}</td>
                    <td>{percent(r.totalLossPercent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="notice">
            Hesap, bugünkü fiyat üzerinden reel (enflasyondan arındırılmış) değer kaybını
            gösterir. Yüksek enflasyon dönemlerinde ikinci el fiyatları TL olarak artabilir;
            aracın gerçek değer kaybını görmek için aynı modelin sıfır fiyatıyla kıyaslayın.
          </div>
        </div>
      ) : (
        <div className="calc-hint">Aracın fiyatını girin; yıllara göre değer kaybını tablo hâlinde gösterelim.</div>
      )}
    </div>
  );
}
