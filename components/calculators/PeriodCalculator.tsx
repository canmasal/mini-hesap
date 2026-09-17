"use client";

import { useMemo, useState } from "react";

import ResultRow from "./ResultRow";

/**
 * Adet (regl) ve yumurtlama takvimi.
 *
 * Bir sonraki adet, döngü uzunluğu kadar sonra beklenir. Yumurtlama, luteal
 * faz yaklaşık sabit olduğu için bir sonraki adetten ~14 gün önce gerçekleşir;
 * doğurgan pencere yumurtlamadan 5 gün önce başlar ve yumurtlama gününde biter.
 */

const DAY = 86_400_000;

const fmt = (date: Date) =>
  date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", weekday: "long" });

const shortFmt = (date: Date) =>
  date.toLocaleDateString("tr-TR", { day: "numeric", month: "long" });

const addDays = (date: Date, days: number) => new Date(date.getTime() + days * DAY);

export default function PeriodCalculator() {
  const [last, setLast] = useState("");
  const [cycle, setCycle] = useState("28");
  const [duration, setDuration] = useState("5");

  const result = useMemo(() => {
    if (!last) return null;
    const start = new Date(`${last}T12:00:00`);
    if (Number.isNaN(start.getTime())) return null;

    const cycleDays = Number(cycle) || 0;
    const periodDays = Number(duration) || 0;
    if (cycleDays < 20 || cycleDays > 45) return null;

    const next = addDays(start, cycleDays);
    const ovulation = addDays(next, -14);
    const fertileStart = addDays(ovulation, -5);
    const periodEnd = addDays(start, Math.max(1, periodDays) - 1);

    /* Sonraki üç döngünün adet başlangıçları */
    const upcoming = [1, 2, 3].map((i) => addDays(start, cycleDays * i));

    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const daysToNext = Math.round((next.getTime() - today.getTime()) / DAY);
    const dayOfCycle = Math.floor((today.getTime() - start.getTime()) / DAY) + 1;

    return {
      next,
      ovulation,
      fertileStart,
      periodEnd,
      upcoming,
      daysToNext,
      dayOfCycle: dayOfCycle >= 1 && dayOfCycle <= cycleDays + 14 ? dayOfCycle : null,
      late: daysToNext < 0,
    };
  }, [last, cycle, duration]);

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Son adetin ilk günü
          <input type="date" value={last} onChange={(e) => setLast(e.target.value)} />
          <span className="field-hint">Kanamanın başladığı gün (lekelenme değil).</span>
        </label>
        <label className="field">
          Döngü uzunluğu (gün)
          <input type="number" inputMode="numeric" min="20" max="45" value={cycle} onChange={(e) => setCycle(e.target.value)} />
          <span className="field-hint">Bir adetin ilk gününden sonrakinin ilk gününe kadar. Ortalama 28 gündür.</span>
        </label>
        <label className="field">
          Adet süresi (gün)
          <input type="number" inputMode="numeric" min="1" max="10" value={duration} onChange={(e) => setDuration(e.target.value)} />
        </label>
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow
            label="Beklenen sonraki adet"
            value={fmt(result.next)}
            highlight
            hint={
              result.late
                ? `Beklenen tarih ${Math.abs(result.daysToNext)} gün geçti.`
                : `${result.daysToNext} gün kaldı.`
            }
          />
          <ResultRow
            label="Bu adetin bitişi (tahmini)"
            value={shortFmt(result.periodEnd)}
          />
          <ResultRow
            label="Yumurtlama günü (tahmini)"
            value={fmt(result.ovulation)}
            tone="pos"
          />
          <ResultRow
            label="Doğurgan dönem"
            value={`${shortFmt(result.fertileStart)} – ${shortFmt(result.ovulation)}`}
            hint="Gebelik ihtimalinin en yüksek olduğu günler."
          />
          {result.dayOfCycle !== null && (
            <ResultRow label="Döngünüzün kaçıncı günündesiniz?" value={`${result.dayOfCycle}. gün`} />
          )}
          <ResultRow
            label="Sonraki üç adet"
            value={result.upcoming.map(shortFmt).join(" · ")}
          />
          <div className="notice">
            Tahminler düzenli döngü varsayımına dayanır. Stres, hastalık, kilo
            değişimi ve doğum kontrol yöntemleri tarihleri kaydırabilir. Bu takvim
            korunma yöntemi olarak kullanılamaz; adet gecikmesi veya düzensizliği
            sürüyorsa hekiminize başvurun.
          </div>
        </div>
      ) : (
        <div className="calc-hint">
          Son adetinizin ilk gününü seçin; sonraki adet tarihinizi, yumurtlama
          gününüzü ve doğurgan dönemi hesaplayalım.
        </div>
      )}
    </div>
  );
}
