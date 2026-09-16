"use client";

import { useMemo, useState } from "react";

import { STAMP_TAX } from "@/data/parameters";
import ResultRow, { money } from "./ResultRow";

/**
 * Damga vergisi hesaplama.
 *
 * Belli parayı ihtiva eden kâğıtlarda vergi, kâğıdın türüne göre belirlenen
 * nispi oranla hesaplanır ve her bir kâğıt için azami tutarı aşamaz. Kira
 * sözleşmelerinde matrah, sözleşme süresi boyunca ödenecek toplam kiradır.
 */

const PAPERS = [
  { id: "sozlesme", label: "Sözleşme / taahhütname (belli parayı içeren)", rate: STAMP_TAX.contract },
  { id: "kira", label: "Kira sözleşmesi (kefilsiz)", rate: STAMP_TAX.rentContract },
  { id: "kira-adi", label: "Kira sözleşmesi – adi kefilli", rate: STAMP_TAX.rentWithSurety },
  { id: "kira-mutesels", label: "Kira sözleşmesi – müteselsil kefilli", rate: STAMP_TAX.rentWithJointSurety },
  { id: "ucret", label: "Ücret ödemesi (bordro)", rate: STAMP_TAX.payroll },
] as const;

type PaperId = (typeof PAPERS)[number]["id"];

export default function StampTaxCalculator() {
  const [paper, setPaper] = useState<PaperId>("sozlesme");
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("12");
  const [parties, setParties] = useState("2");

  const isRent = paper.startsWith("kira");
  const selected = PAPERS.find((p) => p.id === paper)!;

  const result = useMemo(() => {
    const value = Number(amount.replace(",", ".")) || 0;
    if (value <= 0) return null;

    /* Kira sözleşmesinde matrah, süre boyunca ödenecek toplam kiradır */
    const base = isRent ? value * (Number(months) || 0) : value;
    if (base <= 0) return null;

    const raw = base * selected.rate;
    const tax = Math.min(raw, STAMP_TAX.maximum);
    const count = Math.max(1, Number(parties) || 1);

    return { base, tax, capped: raw > STAMP_TAX.maximum, perParty: tax / count, count };
  }, [amount, months, parties, isRent, selected]);

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Kâğıt türü
          <select value={paper} onChange={(e) => setPaper(e.target.value as PaperId)}>
            {PAPERS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <span className="field-hint">
            Oran: binde {(selected.rate * 1000).toLocaleString("tr-TR")}
          </span>
        </label>
        <label className="field">
          {isRent ? "Aylık kira bedeli (₺)" : "Sözleşme bedeli (₺)"}
          <input type="number" inputMode="decimal" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={isRent ? "25000" : "500000"} />
        </label>
        {isRent && (
          <label className="field">
            Sözleşme süresi (ay)
            <input type="number" inputMode="numeric" min="1" value={months} onChange={(e) => setMonths(e.target.value)} />
            <span className="field-hint">Damga vergisi, süre boyunca ödenecek toplam kira üzerinden alınır.</span>
          </label>
        )}
        <label className="field">
          Vergiyi kaç taraf paylaşıyor?
          <input type="number" inputMode="numeric" min="1" max="10" value={parties} onChange={(e) => setParties(e.target.value)} />
          <span className="field-hint">Taraflar aksini kararlaştırmadıysa vergiden müteselsilen sorumludur.</span>
        </label>
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow label="Damga vergisi matrahı" value={money(result.base)} highlight />
          <ResultRow
            label={`Damga vergisi (binde ${(selected.rate * 1000).toLocaleString("tr-TR")})`}
            value={money(result.tax)}
            tone="neg"
            hint={result.capped ? "Azami tutar sınırı uygulandı." : undefined}
          />
          {result.count > 1 && (
            <ResultRow label={`Taraf başına (${result.count} taraf)`} value={money(result.perParty)} />
          )}
          <div className="notice">
            Her bir kâğıttan alınacak damga vergisi {money(STAMP_TAX.maximum)} tutarını aşamaz.
            Nüsha sayısı arttıkça vergi de nüsha başına doğar; tek nüsha düzenlenmesi
            maliyeti düşürür.
          </div>
        </div>
      ) : (
        <div className="calc-hint">
          Sözleşme bedelini girin; kâğıt türüne göre ödenecek damga vergisini hesaplayalım.
        </div>
      )}
    </div>
  );
}
