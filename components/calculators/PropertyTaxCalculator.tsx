"use client";

import { useMemo, useState } from "react";

import { PROPERTY_TAX } from "@/data/parameters";
import ResultRow, { money } from "./ResultRow";

/**
 * Emlak vergisi hesaplama.
 *
 * Vergi, belediyenin belirlediği emlak vergi değeri üzerinden hesaplanır.
 * Oran taşınmaz türüne ve büyükşehir belediyesi sınırları içinde olup
 * olmamasına göre değişir. Tahakkuk eden verginin %10'u kadar taşınmaz
 * kültür varlıklarının korunmasına katkı payı ayrıca alınır.
 */

const TYPES = [
  { id: "mesken", label: "Konut (mesken)" },
  { id: "isyeri", label: "İşyeri" },
  { id: "arsa", label: "Arsa" },
  { id: "arazi", label: "Arazi" },
] as const;

type TypeId = (typeof TYPES)[number]["id"];

export default function PropertyTaxCalculator() {
  const [value, setValue] = useState("");
  const [type, setType] = useState<TypeId>("mesken");
  const [metropolitan, setMetropolitan] = useState("evet");

  const result = useMemo(() => {
    const base = Number(value.replace(",", ".")) || 0;
    if (base <= 0) return null;

    const rate = PROPERTY_TAX.rates[type][metropolitan === "evet" ? "metropolitan" : "normal"];
    const tax = base * rate;
    const cultural = tax * PROPERTY_TAX.culturalContribution;

    return { base, rate, tax, cultural, total: tax + cultural };
  }, [value, type, metropolitan]);

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Emlak vergi değeri (₺)
          <input type="number" inputMode="decimal" min="0" value={value} onChange={(e) => setValue(e.target.value)} placeholder="3500000" />
          <span className="field-hint">
            Belediyenin bildirdiği vergi değeri; satış fiyatı değil. Belediyenin
            e-belediye sayfasından öğrenebilirsiniz.
          </span>
        </label>
        <label className="field">
          Taşınmaz türü
          <select value={type} onChange={(e) => setType(e.target.value as TypeId)}>
            {TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Büyükşehir belediyesi sınırları içinde mi?
          <select value={metropolitan} onChange={(e) => setMetropolitan(e.target.value)}>
            <option value="evet">Evet</option>
            <option value="hayir">Hayır</option>
          </select>
          <span className="field-hint">Büyükşehirde oranlar iki kat uygulanır.</span>
        </label>
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow
            label="Uygulanan oran"
            value={`binde ${(result.rate * 1000).toLocaleString("tr-TR")}`}
            highlight
          />
          <ResultRow label="Emlak vergisi" value={money(result.tax)} />
          <ResultRow label="Kültür varlıkları katkı payı (%10)" value={money(result.cultural)} />
          <ResultRow label="Yıllık toplam ödeme" value={money(result.total)} tone="neg" />
          <ResultRow label="Taksit başına (2 taksit)" value={money(result.total / 2)} />
          <div className="notice">
            {PROPERTY_TAX.installments} Engelliler, geliri yalnızca SGK aylığından
            ibaret emekliler, geliri olmayanlar, gaziler ile şehit dul ve yetimleri;
            Türkiye&apos;de brüt {PROPERTY_TAX.reducedRateMaxArea} m²&apos;yi geçmeyen tek konutu
            varsa indirimli (sıfır) orandan yararlanabilir.
          </div>
        </div>
      ) : (
        <div className="calc-hint">
          Belediyenin bildirdiği emlak vergi değerini girin; yıllık emlak verginizi
          ve taksit tutarını hesaplayalım.
        </div>
      )}
    </div>
  );
}
