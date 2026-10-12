"use client";

import { useMemo, useState } from "react";

import { cryptoPosition } from "@/lib/calculations/newTools";
import ResultRow, { money, percent } from "./ResultRow";

const n = (s: string) => Number(s.replace(",", ".")) || 0;

/** Kripto fiyatları kuruşun altına inebildiği için birim fiyatta daha fazla hane gösterilir */
const price = (v: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: v < 1 ? 8 : 4,
  }).format(v);

type Row = { quantity: string; price: string };

export default function CryptoProfitCalculator() {
  const [rows, setRows] = useState<Row[]>([
    { quantity: "", price: "" },
    { quantity: "", price: "" },
  ]);
  const [current, setCurrent] = useState("");
  const [fee, setFee] = useState("0.1");
  const [target, setTarget] = useState("");

  const result = useMemo(
    () =>
      cryptoPosition({
        buys: rows.map((r) => ({ quantity: n(r.quantity), price: n(r.price) })),
        currentPrice: n(current),
        feeRate: n(fee) / 100,
        targetPrice: n(target),
      }),
    [rows, current, fee, target],
  );

  const update = (i: number, key: keyof Row, value: string) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));

  return (
    <div className="calc-box">
      <p className="field-hint" style={{ marginTop: 0 }}>
        Her alımınızı ayrı satıra yazın. Fiyatları aynı para biriminde (örneğin TL) girin.
      </p>
      <div style={{ display: "grid", gap: 12, marginTop: 10 }}>
        {rows.map((row, i) => (
          <div key={i} className="form-grid" style={{ alignItems: "end" }}>
            <label className="field">
              {i + 1}. alım – miktar (adet)
              <input type="number" inputMode="decimal" min="0" value={row.quantity} onChange={(e) => update(i, "quantity", e.target.value)} placeholder="0.05" />
            </label>
            <label className="field">
              {i + 1}. alım – birim fiyat (₺)
              <input type="number" inputMode="decimal" min="0" value={row.price} onChange={(e) => update(i, "price", e.target.value)} placeholder="2500000" />
            </label>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
        <button type="button" className="btn btn-outline" style={{ padding: "9px 14px", fontSize: 14 }} onClick={() => setRows((p) => [...p, { quantity: "", price: "" }])}>
          + Alım ekle
        </button>
        {rows.length > 1 && (
          <button type="button" className="btn btn-outline" style={{ padding: "9px 14px", fontSize: 14 }} onClick={() => setRows((p) => p.slice(0, -1))}>
            Son satırı sil
          </button>
        )}
      </div>

      <div className="form-grid" style={{ marginTop: 18 }}>
        <label className="field">
          Güncel fiyat (₺)
          <input type="number" inputMode="decimal" min="0" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="2800000" />
        </label>
        <label className="field">
          İşlem komisyonu (%)
          <input type="number" inputMode="decimal" min="0" step="0.01" value={fee} onChange={(e) => setFee(e.target.value)} />
          <span className="field-hint">Alışta ve satışta ayrı ayrı uygulanır.</span>
        </label>
        <label className="field">
          Hedef satış fiyatı (₺, isteğe bağlı)
          <input type="number" inputMode="decimal" min="0" value={target} onChange={(e) => setTarget(e.target.value)} />
        </label>
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow label="Ortalama maliyet (komisyon dahil)" value={price(result.averageCost)} highlight />
          <ResultRow label="Toplam miktar" value={result.quantity.toLocaleString("tr-TR", { maximumFractionDigits: 8 })} />
          <ResultRow label="Toplam maliyet" value={money(result.totalCost)} hint={`Alış komisyonu: ${money(result.buyFees)}`} />
          <ResultRow label="Başa baş satış fiyatı" value={price(result.breakEven)} hint="Satış komisyonu düşüldüğünde zarar etmeyeceğiniz en düşük fiyat" />
          {result.current && (
            <>
              <ResultRow label="Güncel değer (satış komisyonu düşülmüş)" value={money(result.current.net)} />
              <ResultRow
                label={result.current.profit >= 0 ? "Kâr" : "Zarar"}
                value={`${money(result.current.profit)} (${percent(result.current.profitPercent)})`}
                tone={result.current.profit >= 0 ? "pos" : "neg"}
                highlight
              />
            </>
          )}
          {result.target && (
            <ResultRow
              label="Hedef fiyatta kâr/zarar"
              value={`${money(result.target.profit)} (${percent(result.target.profitPercent)})`}
              tone={result.target.profit >= 0 ? "pos" : "neg"}
            />
          )}
          <div className="notice">
            Sonuç, kripto varlık platformunun komisyonu dışındaki transfer ve ağ ücretlerini
            içermez. Kripto varlık kazançlarının vergilendirilmesine ilişkin düzenlemeler
            değişebilir; beyan ve vergi konusunda mali müşavirinize danışın.
          </div>
        </div>
      ) : (
        <div className="calc-hint">En az bir alımın miktarını ve fiyatını girin; ortalama maliyetinizi ve kâr/zararınızı hesaplayalım.</div>
      )}
    </div>
  );
}
