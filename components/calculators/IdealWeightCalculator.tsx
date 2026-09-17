"use client";

import { useMemo, useState } from "react";

import ResultRow from "./ResultRow";

/**
 * İdeal kilo hesaplama.
 *
 * Tek bir "doğru" ideal kilo yoktur; klinikte kullanılan formüller birbirinden
 * birkaç kilo farklı sonuç verir. Bu yüzden dört klasik formül (Devine,
 * Robinson, Miller, Hamwi) ayrı ayrı gösterilir ve VKİ'nin 18,5 – 24,9
 * arasında kaldığı sağlıklı kilo aralığı da verilir.
 */

const kg = (value: number) =>
  `${value.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`;

/** Formüller 152,4 cm (5 ft) üzerindeki her inç için sabit bir ek kilo verir */
const INCH = 2.54;
const BASE_CM = 152.4;

type Sex = "kadin" | "erkek";

const FORMULAS: Array<{ name: string; base: Record<Sex, number>; perInch: Record<Sex, number> }> = [
  { name: "Devine", base: { erkek: 50, kadin: 45.5 }, perInch: { erkek: 2.3, kadin: 2.3 } },
  { name: "Robinson", base: { erkek: 52, kadin: 49 }, perInch: { erkek: 1.9, kadin: 1.7 } },
  { name: "Miller", base: { erkek: 56.2, kadin: 53.1 }, perInch: { erkek: 1.41, kadin: 1.36 } },
  { name: "Hamwi", base: { erkek: 48, kadin: 45.5 }, perInch: { erkek: 2.7, kadin: 2.2 } },
];

export default function IdealWeightCalculator() {
  const [height, setHeight] = useState("");
  const [sex, setSex] = useState<Sex>("kadin");
  const [weight, setWeight] = useState("");

  const result = useMemo(() => {
    const cm = Number(height.replace(",", ".")) || 0;
    if (cm < 120 || cm > 230) return null;

    const inches = Math.max(0, (cm - BASE_CM) / INCH);
    const rows = FORMULAS.map((f) => ({
      name: f.name,
      value: f.base[sex] + f.perInch[sex] * inches,
    }));

    const metres = cm / 100;
    const healthyLow = 18.5 * metres * metres;
    const healthyHigh = 24.9 * metres * metres;
    const average = rows.reduce((sum, r) => sum + r.value, 0) / rows.length;

    const current = Number(weight.replace(",", ".")) || 0;
    const diff = current > 0 ? current - average : null;

    return { rows, healthyLow, healthyHigh, average, current, diff };
  }, [height, sex, weight]);

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Boy (cm)
          <input type="number" inputMode="decimal" min="0" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="170" />
        </label>
        <label className="field">
          Cinsiyet
          <select value={sex} onChange={(e) => setSex(e.target.value as Sex)}>
            <option value="kadin">Kadın</option>
            <option value="erkek">Erkek</option>
          </select>
        </label>
        <label className="field">
          Mevcut kilonuz (kg) — isteğe bağlı
          <input type="number" inputMode="decimal" min="0" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" />
          <span className="field-hint">Girerseniz hedefe kaç kilo kaldığını da gösteririz.</span>
        </label>
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow
            label="Sağlıklı kilo aralığı (VKİ 18,5 – 24,9)"
            value={`${kg(result.healthyLow)} – ${kg(result.healthyHigh)}`}
            highlight
          />
          <ResultRow label="Formüllerin ortalaması" value={kg(result.average)} />
          {result.rows.map((row) => (
            <ResultRow key={row.name} label={`${row.name} formülü`} value={kg(row.value)} />
          ))}
          {result.diff !== null && (
            <ResultRow
              label={result.diff > 0 ? "Ortalamaya göre fazla" : "Ortalamaya göre eksik"}
              value={kg(Math.abs(result.diff))}
              tone={Math.abs(result.diff) <= 3 ? "pos" : "neg"}
              hint={
                Math.abs(result.diff) <= 3
                  ? "İdeal kilo aralığına çok yakınsınız."
                  : undefined
              }
            />
          )}
          <div className="notice">
            İdeal kilo formülleri kas kütlesini, yaşı ve vücut yapısını hesaba katmaz.
            Sporcularda ve yaşlılarda sonuç yanıltıcı olabilir; beslenme değişikliği
            öncesinde hekiminize danışın.
          </div>
        </div>
      ) : (
        <div className="calc-hint">
          Boyunuzu girin; sağlıklı kilo aralığınızı ve yaygın formüllere göre ideal
          kilonuzu hesaplayalım.
        </div>
      )}
    </div>
  );
}
