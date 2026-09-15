"use client";

import { useMemo, useState } from "react";

import ResultRow from "./ResultRow";

/**
 * Gebelik haftası ve tahmini doğum tarihi (Naegele kuralı).
 *
 * Tahmini doğum tarihi = son adet tarihi (SAT) + 280 gün, adet döngüsü 28
 * günden farklıysa aradaki fark kadar kaydırılır. Gebelik haftası SAT'tan
 * itibaren sayılır.
 */

const DAY = 86400000;

function parseLocalDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.getMonth() === m - 1 ? date : null;
}

const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const diffDays = (a: Date, b: Date) =>
  Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / DAY);
const fmt = (date: Date) => date.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });

export default function PregnancyCalculator() {
  const [lmp, setLmp] = useState("");
  const [cycle, setCycle] = useState("28");

  const result = useMemo(() => {
    const start = parseLocalDate(lmp);
    const c = Number(cycle);
    if (!start || !Number.isFinite(c) || c < 21 || c > 45) return null;

    const today = new Date();
    const shift = c - 28;
    const due = addDays(start, 280 + shift);
    const conception = addDays(start, 14 + shift);
    /* Gebelik yaşı döngü farkı kadar düzeltilir */
    const elapsed = diffDays(start, today) - shift;

    if (elapsed < 0 || elapsed > 310) return { invalid: true as const };

    const weeks = Math.floor(elapsed / 7);
    const days = elapsed % 7;
    const trimester = weeks < 14 ? 1 : weeks < 28 ? 2 : 3;
    const remaining = diffDays(today, due);

    return {
      invalid: false as const,
      weeks,
      days,
      trimester,
      due,
      conception,
      remaining,
      percent: Math.min(100, Math.round((elapsed / 280) * 100)),
      secondTrimester: addDays(start, 14 * 7 + shift),
      thirdTrimester: addDays(start, 28 * 7 + shift),
    };
  }, [lmp, cycle]);

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Son adet tarihinin ilk günü
          <input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} />
        </label>

        <label className="field">
          Ortalama adet döngüsü (gün)
          <input
            type="number"
            inputMode="numeric"
            min="21"
            max="45"
            value={cycle}
            onChange={(e) => setCycle(e.target.value)}
          />
          <span className="field-hint">Bilmiyorsanız 28 gün bırakın.</span>
        </label>
      </div>

      {result && !result.invalid ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow
            label="Gebelik haftası"
            value={`${result.weeks} hafta ${result.days} gün`}
            hint={`${result.trimester}. trimester · gebeliğin yaklaşık %${result.percent}'i tamamlandı`}
            highlight
          />
          <ResultRow label="Tahmini doğum tarihi" value={fmt(result.due)} highlight />
          <ResultRow
            label="Doğuma kalan süre"
            value={result.remaining > 0 ? `${result.remaining} gün` : "Tahmini tarih geçti"}
          />
          <ResultRow label="Tahmini döllenme tarihi" value={fmt(result.conception)} />
          <ResultRow label="2. trimester başlangıcı (14. hafta)" value={fmt(result.secondTrimester)} />
          <ResultRow label="3. trimester başlangıcı (28. hafta)" value={fmt(result.thirdTrimester)} />
          <div className="notice">
            Bebeklerin yalnızca küçük bir kısmı tam tahmini tarihte doğar; 38–42.
            haftalar arasındaki doğumlar zamanında kabul edilir. Kesin gebelik
            haftası ultrason ölçümüyle belirlenir; takibiniz için doktorunuza danışın.
          </div>
        </div>
      ) : result?.invalid ? (
        <div className="notice notice-warn">
          Girdiğiniz tarih bugünden sonra veya çok eski görünüyor. Son adet
          tarihinizin ilk gününü kontrol edin.
        </div>
      ) : (
        <div className="calc-hint">
          Son adet tarihinizin ilk gününü seçin. Kaçıncı haftada olduğunuzu,
          tahmini doğum tarihinizi ve trimester tarihlerinizi hesaplayalım.
        </div>
      )}
    </div>
  );
}
