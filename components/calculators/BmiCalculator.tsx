"use client";

import { useMemo, useState } from "react";

import ResultRow from "./ResultRow";

/**
 * Vücut kitle indeksi (VKİ / BMI) ve ideal kilo aralığı.
 *
 * VKİ = kilo (kg) ÷ boy² (m). Sınıflar Dünya Sağlık Örgütü (WHO)
 * yetişkin kategorilerine göredir. 18 yaş altı, gebeler ve sporcular için
 * yorum farklıdır.
 */

const CATEGORIES = [
  { max: 18.5, label: "Zayıf", tone: "neg" as const },
  { max: 25, label: "Normal kilolu", tone: "pos" as const },
  { max: 30, label: "Fazla kilolu", tone: "neg" as const },
  { max: 35, label: "Obez (1. derece)", tone: "neg" as const },
  { max: 40, label: "Obez (2. derece)", tone: "neg" as const },
  { max: Infinity, label: "Obez (3. derece)", tone: "neg" as const },
];

const num = (value: number, digits = 1) =>
  value.toLocaleString("tr-TR", { minimumFractionDigits: digits, maximumFractionDigits: digits });

export default function BmiCalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const result = useMemo(() => {
    const h = Number(height.replace(",", ".")) / 100;
    const w = Number(weight.replace(",", "."));
    if (!h || !w || h < 0.8 || h > 2.5 || w < 20 || w > 350) return null;

    const bmi = w / (h * h);
    const category = CATEGORIES.find((c) => bmi < c.max)!;
    const idealMin = 18.5 * h * h;
    const idealMax = 24.9 * h * h;
    const toIdeal = w < idealMin ? idealMin - w : w > idealMax ? w - idealMax : 0;

    return { bmi, category, idealMin, idealMax, toIdeal, above: w > idealMax };
  }, [height, weight]);

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Boy (cm)
          <input
            type="number"
            inputMode="decimal"
            min="80"
            max="250"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="170"
          />
        </label>

        <label className="field">
          Kilo (kg)
          <input
            type="number"
            inputMode="decimal"
            min="20"
            max="350"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="70"
          />
        </label>
      </div>

      <button
        type="button"
        className="btn"
        style={{ marginTop: 18 }}
        onClick={() => {
          setHeight("");
          setWeight("");
        }}
      >
        Temizle
      </button>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow label="Vücut kitle indeksi (VKİ)" value={num(result.bmi)} highlight />
          <ResultRow label="Sınıflandırma" value={result.category.label} tone={result.category.tone} />
          <ResultRow
            label="İdeal kilo aralığı"
            hint="VKİ 18,5 – 24,9 aralığına denk gelen kilo"
            value={`${num(result.idealMin)} – ${num(result.idealMax)} kg`}
          />
          {result.toIdeal > 0 && (
            <ResultRow
              label={result.above ? "Normal aralığa inmek için" : "Normal aralığa çıkmak için"}
              value={`${result.above ? "−" : "+"}${num(result.toIdeal)} kg`}
            />
          )}

          <div className="bmi-scale" aria-hidden="true">
            {CATEGORIES.slice(0, 5).map((c) => (
              <span key={c.label} className={result.category.label === c.label ? "is-active" : undefined}>
                {c.label.replace(" (1. derece)", "")}
              </span>
            ))}
          </div>

          <div className="notice">
            VKİ; kas kütlesi, yaş ve cinsiyet farkını hesaba katmaz. 18 yaş altı,
            gebeler ve sporcular için geçerli bir ölçüt değildir. Sağlıkla ilgili
            kararlar için doktorunuza danışın.
          </div>
        </div>
      ) : (
        <div className="calc-hint">
          Boyunuzu santimetre, kilonuzu kilogram olarak girin. VKİ değeriniz,
          sınıfınız ve ideal kilo aralığınız anında hesaplanır.
        </div>
      )}
    </div>
  );
}
