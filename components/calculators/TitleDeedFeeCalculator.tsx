"use client";

import { useMemo, useState } from "react";

import ResultRow, { money } from "./ResultRow";

/**
 * Tapu harcı hesaplama.
 *
 * Konut ve işyeri satışında alıcı ve satıcıdan ayrı ayrı binde 20 (%2)
 * tapu harcı alınır. Harç, beyan edilen satış bedeli üzerinden hesaplanır.
 * Döner sermaye ücreti il ve işlem türüne göre değiştiği için kullanıcı
 * tarafından girilir.
 */

const DEED_RATE = 0.02;

export default function TitleDeedFeeCalculator() {
  const [price, setPrice] = useState("");
  const [payer, setPayer] = useState<"ayri" | "alici">("ayri");
  const [revolving, setRevolving] = useState("6500");

  const result = useMemo(() => {
    const p = Number(price.replace(",", "."));
    if (!p || p <= 0) return null;

    const eachSide = p * DEED_RATE;
    const total = eachSide * 2;
    const fee = Number(revolving) || 0;
    const buyer = payer === "alici" ? total + fee : eachSide + fee;
    const seller = payer === "alici" ? 0 : eachSide;

    return { eachSide, total, fee, buyer, seller, grand: total + fee };
  }, [price, payer, revolving]);

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Satış bedeli (₺)
          <input type="number" inputMode="decimal" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="3000000" />
          <span className="field-hint">Tapuda beyan edilecek gerçek satış bedeli.</span>
        </label>
        <label className="field">
          Harcı kim ödeyecek?
          <select value={payer} onChange={(e) => setPayer(e.target.value as "ayri" | "alici")}>
            <option value="ayri">Yasal paylaşım (alıcı %2 + satıcı %2)</option>
            <option value="alici">Tamamını alıcı öder (%4)</option>
          </select>
        </label>
        <label className="field">
          Döner sermaye ücreti (₺)
          <input type="number" inputMode="numeric" min="0" step="100" value={revolving} onChange={(e) => setRevolving(e.target.value)} />
          <span className="field-hint">İle göre değişir; tapu randevusunda kesin tutar görünür.</span>
        </label>
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow label="Toplam tapu harcı (%4)" value={money(result.total)} highlight />
          <ResultRow label="Alıcının ödeyeceği" hint={payer === "alici" ? "Harcın tamamı + döner sermaye" : "%2 harç + döner sermaye"} value={money(result.buyer)} />
          <ResultRow label="Satıcının ödeyeceği" hint={payer === "alici" ? "Harç alıcıya bırakıldı" : "%2 harç"} value={money(result.seller)} />
          <ResultRow label="Döner sermaye ücreti" value={money(result.fee)} />
          <ResultRow label="Tapu işlemi toplam maliyet" value={money(result.grand)} tone="neg" />
          <div className="notice">
            Tapuda gerçek satış bedelinden düşük değer beyan etmek, farkın
            vergi ve cezalarla tahsil edilmesine yol açar. Emlakçı komisyonu,
            ekspertiz ve DASK bu hesaba dahil değildir.
          </div>
        </div>
      ) : (
        <div className="calc-hint">
          Satış bedelini girin; alıcı ve satıcının ödeyeceği tapu harcını ve
          toplam tapu masrafını hesaplayalım.
        </div>
      )}
    </div>
  );
}
