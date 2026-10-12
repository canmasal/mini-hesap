"use client";

import { useMemo, useState } from "react";

import { unitPrices, type UnitKind } from "@/lib/calculations/newTools";
import { money, percent } from "./ResultRow";

const n = (s: string) => Number(s.replace(",", ".")) || 0;

type Row = { name: string; price: string; amount: string; unit: UnitKind; packs: string };

const BASE_LABEL = { kg: "kg", l: "litre", adet: "adet" } as const;

const blank = (i: number): Row => ({ name: `Ürün ${i}`, price: "", amount: "", unit: "g", packs: "1" });

export default function UnitPriceCalculator() {
  const [rows, setRows] = useState<Row[]>([blank(1), blank(2)]);

  const update = (i: number, key: keyof Row, value: string) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));

  const result = useMemo(
    () =>
      unitPrices(
        rows.map((r) => ({ name: r.name, price: n(r.price), amount: n(r.amount), unit: r.unit, packs: n(r.packs) })),
      ),
    [rows],
  );

  return (
    <div className="calc-box">
      <div style={{ display: "grid", gap: 16 }}>
        {rows.map((row, i) => (
          <div key={i} className="form-grid" style={{ alignItems: "end", paddingBottom: 14, borderBottom: "1px solid var(--line-soft)" }}>
            <label className="field">
              Ürün adı
              <input type="text" value={row.name} maxLength={40} onChange={(e) => update(i, "name", e.target.value)} />
            </label>
            <label className="field">
              Raf fiyatı (₺)
              <input type="number" inputMode="decimal" min="0" value={row.price} onChange={(e) => update(i, "price", e.target.value)} placeholder="89.90" />
            </label>
            <label className="field">
              Miktar
              <input type="number" inputMode="decimal" min="0" value={row.amount} onChange={(e) => update(i, "amount", e.target.value)} placeholder="500" />
            </label>
            <label className="field">
              Birim
              <select value={row.unit} onChange={(e) => update(i, "unit", e.target.value)}>
                <option value="g">gram (g)</option>
                <option value="kg">kilogram (kg)</option>
                <option value="ml">mililitre (ml)</option>
                <option value="l">litre (L)</option>
                <option value="adet">adet</option>
              </select>
            </label>
            <label className="field">
              Paketteki adet
              <input type="number" inputMode="numeric" min="1" value={row.packs} onChange={(e) => update(i, "packs", e.target.value)} />
              <span className="field-hint">Örn. 6×1 L süt için 6</span>
            </label>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
        {rows.length < 6 && (
          <button type="button" className="btn btn-outline" style={{ padding: "9px 14px", fontSize: 14 }} onClick={() => setRows((p) => [...p, blank(p.length + 1)])}>
            + Ürün ekle
          </button>
        )}
        {rows.length > 2 && (
          <button type="button" className="btn btn-outline" style={{ padding: "9px 14px", fontSize: 14 }} onClick={() => setRows((p) => p.slice(0, -1))}>
            Son ürünü sil
          </button>
        )}
      </div>

      {result && result.rows.length > 0 ? (
        <div style={{ marginTop: 22, display: "grid", gap: 12 }}>
          {result.comparable && result.cheapestIndex !== null && result.rows.length > 1 ? (
            <div className="notice notice-ok">
              En ucuz: <strong>{rows[result.cheapestIndex].name}</strong>. En pahalıya göre birim
              fiyatta <strong>{percent(result.savingPercent ?? 0)}</strong> tasarruf sağlar.
            </div>
          ) : !result.comparable ? (
            <div className="notice notice-warn">
              Farklı ölçü türleri girildi (örneğin kilogram ile litre). Yalnızca aynı tür ölçüdeki
              ürünler birbiriyle kıyaslanabilir.
            </div>
          ) : null}
          <div className="rates-table-wrap">
            <table className="rates-table">
              <thead>
                <tr>
                  <th scope="col">Ürün</th>
                  <th scope="col">Birim fiyat</th>
                  <th scope="col">En ucuza göre</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((r) => (
                  <tr key={r.index} className={r.index === result.cheapestIndex ? "is-total" : undefined}>
                    <th scope="row">{r.name}</th>
                    <td>{money(r.unitPrice)} / {BASE_LABEL[r.base]}</td>
                    <td>{r.overCheapestPercent === null ? "—" : r.overCheapestPercent === 0 ? "En ucuz" : `+${percent(r.overCheapestPercent)}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="calc-hint">Ürünlerin raf fiyatını ve paket miktarını girin; kilogram, litre veya adet başına fiyatı karşılaştıralım.</div>
      )}
    </div>
  );
}
