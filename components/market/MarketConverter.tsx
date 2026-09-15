"use client";

import { useMemo, useState } from "react";

import { formatPrice, type MarketData } from "@/lib/market";
import ResultRow from "@/components/calculators/ResultRow";

/**
 * Altın / döviz çevirici: seçilen birimden belirtilen miktarın TL karşılığı.
 * Alış (bozdurma) ve satış (satın alma) ayrı gösterilir; kuyumcu ve banka
 * farkı kullanıcıya açıkça söylenir.
 */
export default function MarketConverter({ initial }: { initial: MarketData | null }) {
  const quotes = useMemo(() => (initial ? [...initial.gold, ...initial.currencies] : []), [initial]);
  const [code, setCode] = useState(quotes[0]?.code ?? "GRA");
  const [amount, setAmount] = useState("1");

  const quote = quotes.find((q) => q.code === code);
  const qty = Number(amount.replace(",", "."));

  if (!quotes.length) return null;

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Birim
          <select value={code} onChange={(e) => setCode(e.target.value)}>
            <optgroup label="Altın ve değerli metal">
              {initial!.gold.map((q) => (
                <option key={q.code} value={q.code}>{q.name}</option>
              ))}
            </optgroup>
            <optgroup label="Döviz">
              {initial!.currencies.map((q) => (
                <option key={q.code} value={q.code}>{q.name} ({q.code})</option>
              ))}
            </optgroup>
          </select>
        </label>
        <label className="field">
          Miktar (adet / gram / birim)
          <input type="number" inputMode="decimal" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
      </div>

      {quote && qty > 0 ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow label="Satın alma tutarı (satış fiyatıyla)" value={`₺${formatPrice(quote.selling * qty)}`} highlight />
          {quote.buying !== null && (
            <ResultRow label="Bozdurma tutarı (alış fiyatıyla)" value={`₺${formatPrice(quote.buying * qty)}`} />
          )}
          <p className="field-hint">
            Tutarlar piyasa ortalamasıdır. Kuyumcu işçilik farkı, banka makası ve
            komisyon nedeniyle gerçek işlem fiyatı farklı olabilir.
          </p>
        </div>
      ) : (
        <div className="calc-hint">Birim ve miktar seçin, güncel TL karşılığını görün.</div>
      )}
    </div>
  );
}
