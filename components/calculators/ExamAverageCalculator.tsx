"use client";

import { useMemo, useState } from "react";

import ResultRow from "./ResultRow";

/**
 * Vize – final ortalaması ve geçmek için gereken final notu.
 *
 * Ortalama = Vize × vize ağırlığı + Final × (1 − vize ağırlığı)
 * Gereken final = (Geçme notu − Vize × ağırlık) ÷ (1 − ağırlık)
 * Birçok üniversite ayrıca finalden en az bir alt sınır (ör. 50) ister.
 */

const num = (value: number) => value.toLocaleString("tr-TR", { maximumFractionDigits: 2 });

export default function ExamAverageCalculator() {
  const [midterm, setMidterm] = useState("");
  const [final, setFinal] = useState("");
  const [weight, setWeight] = useState("40");
  const [passGrade, setPassGrade] = useState("50");
  const [finalMin, setFinalMin] = useState("50");

  const result = useMemo(() => {
    const v = Number(midterm);
    const w = Number(weight) / 100;
    const pass = Number(passGrade);
    const fMin = Number(finalMin) || 0;
    if (midterm === "" || v < 0 || v > 100 || !(w > 0 && w < 1) || !pass) return null;

    const neededRaw = (pass - v * w) / (1 - w);
    const needed = Math.max(neededRaw, fMin);

    const hasFinal = final !== "" && Number(final) >= 0 && Number(final) <= 100;
    const f = Number(final);
    const average = hasFinal ? v * w + f * (1 - w) : null;
    const passed = hasFinal ? average! >= pass && f >= fMin : null;

    return { needed, impossible: needed > 100, hasFinal, average, passed, f, fMin };
  }, [midterm, final, weight, passGrade, finalMin]);

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Vize notu
          <input type="number" inputMode="decimal" min="0" max="100" value={midterm} onChange={(e) => setMidterm(e.target.value)} placeholder="45" />
        </label>
        <label className="field">
          Final notu (isteğe bağlı)
          <input type="number" inputMode="decimal" min="0" max="100" value={final} onChange={(e) => setFinal(e.target.value)} placeholder="Boş bırakırsanız gereken final hesaplanır" />
        </label>
        <label className="field">
          Vize ağırlığı (%)
          <input type="number" inputMode="numeric" min="1" max="99" value={weight} onChange={(e) => setWeight(e.target.value)} />
          <span className="field-hint">Genellikle %30 veya %40; ders izlencesinde yazar.</span>
        </label>
        <label className="field">
          Geçme ortalaması
          <input type="number" inputMode="numeric" min="1" max="100" value={passGrade} onChange={(e) => setPassGrade(e.target.value)} />
        </label>
        <label className="field">
          Finalden alınması gereken en düşük not
          <input type="number" inputMode="numeric" min="0" max="100" value={finalMin} onChange={(e) => setFinalMin(e.target.value)} />
          <span className="field-hint">Şart yoksa 0 yazın.</span>
        </label>
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          {result.hasFinal && result.average !== null && (
            <>
              <ResultRow label="Dönem sonu ortalaması" value={num(result.average)} highlight />
              <ResultRow
                label="Durum"
                value={result.passed ? "Geçti" : "Kaldı"}
                tone={result.passed ? "pos" : "neg"}
                hint={
                  !result.passed && result.f < result.fMin
                    ? `Final notu en düşük sınırın (${num(result.fMin)}) altında`
                    : undefined
                }
              />
            </>
          )}
          <ResultRow
            label="Geçmek için gereken final notu"
            value={result.impossible ? "100'ün üzerinde" : num(Math.max(0, result.needed))}
            tone={result.impossible ? "neg" : undefined}
            hint={result.impossible ? "Bu vize notuyla finalde geçmek mümkün değil; bütünlemeye kalabilirsiniz" : undefined}
            highlight={!result.hasFinal}
          />
        </div>
      ) : (
        <div className="calc-hint">
          Vize notunuzu girin. Final notunu da girerseniz ortalamanız ve
          geçip geçmediğiniz, boş bırakırsanız finalden kaç almanız gerektiği
          hesaplanır.
        </div>
      )}
    </div>
  );
}
