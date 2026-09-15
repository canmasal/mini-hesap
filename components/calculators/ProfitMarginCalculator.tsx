"use client";

import { useMemo, useState } from "react";

import ResultRow, { money, percent } from "./ResultRow";

/**
 * Kâr marjı, kâr oranı (markup) ve hedef marja göre satış fiyatı.
 *
 * Kâr = Satış − Maliyet
 * Kâr marjı = Kâr ÷ Satış × 100
 * Kâr oranı (markup) = Kâr ÷ Maliyet × 100
 * Hedef marj için satış fiyatı = Maliyet ÷ (1 − marj)
 */

type Mode = "fiyat" | "hedef";

const parse = (value: string) => Number(value.replace(",", "."));

export default function ProfitMarginCalculator() {
  const [mode, setMode] = useState<Mode>("fiyat");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [target, setTarget] = useState("30");
  const [vat, setVat] = useState("20");

  const result = useMemo(() => {
    const c = parse(cost);
    const v = Number(vat) / 100;
    if (!c || c <= 0) return null;

    if (mode === "fiyat") {
      const p = parse(price);
      if (!p || p <= 0) return null;
      const profit = p - c;
      return { mode, price: p, profit, margin: (profit / p) * 100, markup: (profit / c) * 100, priceWithVat: p * (1 + v) };
    }

    const m = Number(target) / 100;
    if (!(m > -1 && m < 1)) return null;
    const p = c / (1 - m);
    const profit = p - c;
    return { mode, price: p, profit, margin: m * 100, markup: (profit / c) * 100, priceWithVat: p * (1 + v) };
  }, [mode, cost, price, target, vat]);

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Hesaplama türü
          <select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
            <option value="fiyat">Satış fiyatından kâr marjı bul</option>
            <option value="hedef">Hedef kâr marjına göre satış fiyatı bul</option>
          </select>
        </label>
        <label className="field">
          Birim maliyet (KDV hariç, ₺)
          <input type="number" inputMode="decimal" min="0" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="700" />
        </label>
        {mode === "fiyat" ? (
          <label className="field">
            Satış fiyatı (KDV hariç, ₺)
            <input type="number" inputMode="decimal" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="1000" />
          </label>
        ) : (
          <label className="field">
            Hedef kâr marjı (%)
            <input type="number" inputMode="decimal" min="0" max="99" value={target} onChange={(e) => setTarget(e.target.value)} />
          </label>
        )}
        <label className="field">
          KDV oranı (%)
          <select value={vat} onChange={(e) => setVat(e.target.value)}>
            <option value="20">%20</option>
            <option value="10">%10</option>
            <option value="1">%1</option>
            <option value="0">KDV yok</option>
          </select>
        </label>
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          {result.mode === "hedef" && (
            <ResultRow label="Olması gereken satış fiyatı (KDV hariç)" value={money(result.price)} highlight />
          )}
          <ResultRow label="Birim kâr" value={money(result.profit)} tone={result.profit >= 0 ? "pos" : "neg"} highlight={result.mode === "fiyat"} />
          <ResultRow label="Kâr marjı" hint="Kâr ÷ satış fiyatı" value={percent(result.margin)} />
          <ResultRow label="Kâr oranı (markup)" hint="Kâr ÷ maliyet" value={percent(result.markup)} />
          <ResultRow label="KDV dahil satış fiyatı" value={money(result.priceWithVat)} />
        </div>
      ) : (
        <div className="calc-hint">
          Maliyetinizi ve satış fiyatınızı girin; kâr marjınızı ve kâr oranınızı
          görün. Hedef marjınız varsa satış fiyatınızı da hesaplayabilirsiniz.
        </div>
      )}
    </div>
  );
}
