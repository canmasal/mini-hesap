"use client";

import { useMemo, useState } from "react";

import {
  INCOME_TAX_BRACKETS_NON_WAGE,
  INCOME_TAX_BRACKETS_WAGE,
  PARAMETERS_YEAR,
  incomeTaxOn,
} from "@/data/parameters";
import ResultRow, { money, percent } from "./ResultRow";

/**
 * Yıllık gelir vergisi hesaplama (GVK md. 103).
 *
 * Artan oranlı tarife: matrahın her dilime düşen kısmı o dilimin oranıyla
 * vergilendirilir. Ücret gelirlerinde 3. dilim sınırı ücret dışı gelirlerden
 * yüksektir; tür seçimi bu yüzden sonucu değiştirir.
 */

type Kind = "ucret" | "diger";

const incomeTax = (base: number, kind: Kind) =>
  incomeTaxOn(base, kind === "ucret" ? INCOME_TAX_BRACKETS_WAGE : INCOME_TAX_BRACKETS_NON_WAGE);

export default function IncomeTaxCalculator() {
  const [amount, setAmount] = useState("");
  const [kind, setKind] = useState<Kind>("ucret");

  const result = useMemo(() => {
    const base = Number(amount.replace(",", ".")) || 0;
    if (base <= 0) return null;
    const { rows, total, marginal } = incomeTax(base, kind);
    return { base, rows, total, marginal, net: base - total, effective: total / base };
  }, [amount, kind]);

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Yıllık vergi matrahı (₺)
          <input type="number" inputMode="decimal" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="750000" />
          <span className="field-hint">İstisna ve indirimler düşüldükten sonra kalan yıllık tutar.</span>
        </label>
        <label className="field">
          Gelir türü
          <select value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
            <option value="ucret">Ücret geliri (maaş, bordro)</option>
            <option value="diger">Ücret dışı gelir (kira, serbest meslek, ticari)</option>
          </select>
          <span className="field-hint">İki tarifede 3. dilimin sınırı farklıdır.</span>
        </label>
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow label={`${PARAMETERS_YEAR} gelir vergisi`} value={money(result.total)} highlight />
          <ResultRow label="Vergi sonrası kalan" value={money(result.net)} tone="pos" />
          <ResultRow
            label="Ortalama (efektif) vergi oranı"
            value={percent(result.effective * 100)}
            hint="Ödenen verginin matraha oranı"
          />
          <ResultRow
            label="Girdiğiniz son dilim (marjinal oran)"
            value={percent(result.marginal * 100, 0)}
            hint="Bir sonraki 1 TL'nin vergilendiği oran"
          />

          <div className="board-scroll" style={{ marginTop: 6 }}>
            <table className="board-table">
              <thead>
                <tr>
                  <th scope="col">Dilim</th>
                  <th scope="col">Oran</th>
                  <th scope="col">Vergi</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <tr key={row.from}>
                    <th scope="row">
                      {money(row.from)} – {money(row.to)}
                    </th>
                    <td>{percent(row.rate * 100, 0)}</td>
                    <td>{money(row.tax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="notice">
            Hesap {PARAMETERS_YEAR} gelir vergisi tarifesiyle yapılır. Ücretlilerde asgari ücrete
            isabet eden kısım vergiden istisnadır; bordrodaki aylık kesintiyi görmek için{" "}
            <a href="/hesaplamalar/net-maas">net maaş hesaplama</a> aracını kullanın.
          </div>
        </div>
      ) : (
        <div className="calc-hint">
          Yıllık matrahınızı girin; dilim dilim gelir verginizi, efektif ve marjinal
          oranınızı gösterelim.
        </div>
      )}
    </div>
  );
}
