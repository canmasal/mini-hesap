"use client";

import { useState } from "react";

type Mode = "fark" | "ekle";

function parseLocalDate(value: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
}

function toInputValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/** Saat dilimi / yaz saati kaymasından etkilenmeyen gün farkı */
function diffDays(a: Date, b: Date) {
  return Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 86400000);
}

/** start ile end arasındaki (ikisi dahil) hafta içi gün sayısı */
function countWeekdays(start: Date, end: Date) {
  const total = diffDays(start, end) + 1;
  const fullWeeks = Math.floor(total / 7);
  let weekdays = fullWeeks * 5;
  const remainder = total % 7;
  for (let i = 0; i < remainder; i++) {
    const day = (start.getDay() + i) % 7;
    if (day !== 0 && day !== 6) weekdays++;
  }
  return weekdays;
}

/** Tarih farkını yıl-ay-gün olarak döndürür */
function ymd(start: Date, end: Date) {
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

const fmt = (n: number) => n.toLocaleString("tr-TR");
const formatDate = (d: Date) => d.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric", weekday: "long" });

export default function DayCountCalculator() {
  const today = new Date();
  const todayValue = toInputValue(today);

  const [mode, setMode] = useState<Mode>("fark");
  const [start, setStart] = useState(todayValue);
  const [end, setEnd] = useState("");
  const [includeEnd, setIncludeEnd] = useState(false);
  const [addDays, setAddDays] = useState("30");
  const [direction, setDirection] = useState<"ileri" | "geri">("ileri");
  const [onlyWeekdays, setOnlyWeekdays] = useState(false);

  const s = parseLocalDate(start);
  const e = parseLocalDate(end);

  let diffResult: null | { days: number; weeks: number; rest: number; weekdays: number; weekend: number; parts: { years: number; months: number; days: number }; reversed: boolean } = null;
  let diffError = "";
  if (mode === "fark" && s && e) {
    const reversed = e.getTime() < s.getTime();
    const a = reversed ? e : s;
    const b = reversed ? s : e;
    const days = diffDays(a, b) + (includeEnd ? 1 : 0);
    const weekdays = countWeekdays(a, b) - (!includeEnd && b.getDay() !== 0 && b.getDay() !== 6 ? 1 : 0);
    diffResult = {
      days,
      weeks: Math.floor(days / 7),
      rest: days % 7,
      weekdays: Math.max(0, weekdays),
      weekend: Math.max(0, days - Math.max(0, weekdays)),
      parts: ymd(a, b),
      reversed,
    };
  } else if (mode === "fark" && end && !e) {
    diffError = "Lütfen geçerli bir bitiş tarihi girin.";
  }

  let addResult: Date | null = null;
  const n = Math.floor(Number(addDays));
  if (mode === "ekle" && s && Number.isFinite(n) && n >= 0 && n <= 100000) {
    const step = direction === "ileri" ? 1 : -1;
    const d = new Date(s);
    if (onlyWeekdays) {
      let left = n;
      while (left > 0) {
        d.setDate(d.getDate() + step);
        if (d.getDay() !== 0 && d.getDay() !== 6) left--;
      }
    } else {
      d.setDate(d.getDate() + step * n);
    }
    addResult = d;
  }

  return (
    <div className="calc-box">
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        {([
          ["fark", "İki tarih arası kaç gün?"],
          ["ekle", "Tarihe gün ekle / çıkar"],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={mode === id ? "btn btn-green" : "btn btn-outline"}
            style={{ borderRadius: 14 }}
            onClick={() => setMode(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "fark" ? (
        <>
          <div className="form-grid">
            <label className="field">
              Başlangıç Tarihi
              <input type="date" value={start} onChange={(ev) => setStart(ev.target.value)} />
            </label>
            <label className="field">
              Bitiş Tarihi
              <input type="date" value={end} onChange={(ev) => setEnd(ev.target.value)} />
            </label>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: 14, color: "#617066" }}>
            <input type="checkbox" checked={includeEnd} onChange={(ev) => setIncludeEnd(ev.target.checked)} />
            Bitiş gününü de say (ör. izin, kiralama, konaklama süreleri)
          </label>

          {diffError && <ErrorBox text={diffError} />}

          {diffResult && (
            <>
              <div className="result" style={{ marginTop: 24 }}>
                <div className="result-label">İKİ TARİH ARASI</div>
                <div className="result-value" style={{ fontSize: 42 }}>{fmt(diffResult.days)} gün</div>
              </div>
              <div style={{ marginTop: 20, display: "grid", gap: 10 }}>
                <DetailRow label="Yıl / ay / gün" value={`${diffResult.parts.years} yıl ${diffResult.parts.months} ay ${diffResult.parts.days} gün`} />
                <DetailRow label="Hafta" value={`${fmt(diffResult.weeks)} hafta ${diffResult.rest} gün`} />
                <DetailRow label="İş günü (hafta içi)" value={`${fmt(diffResult.weekdays)} gün`} highlight />
                <DetailRow label="Hafta sonu günü" value={`${fmt(diffResult.weekend)} gün`} />
                <DetailRow label="Toplam saat" value={`${fmt(diffResult.days * 24)} saat`} />
              </div>
              {diffResult.reversed && <InfoBox text="Bitiş tarihi başlangıçtan önce olduğu için tarihler yer değiştirilerek hesaplandı." />}
              <InfoBox text="İş günü sayısına yalnızca cumartesi ve pazar dahil edilmez; resmî ve dini bayram tatilleri ayrıca düşülmelidir." />
            </>
          )}
        </>
      ) : (
        <>
          <div className="form-grid">
            <label className="field">
              Başlangıç Tarihi
              <input type="date" value={start} onChange={(ev) => setStart(ev.target.value)} />
            </label>
            <label className="field">
              Gün Sayısı
              <input type="number" min={0} max={100000} inputMode="numeric" value={addDays} onChange={(ev) => setAddDays(ev.target.value)} />
            </label>
            <label className="field">
              İşlem
              <select value={direction} onChange={(ev) => setDirection(ev.target.value as "ileri" | "geri")}>
                <option value="ileri">Gün ekle (ileri tarih)</option>
                <option value="geri">Gün çıkar (geri tarih)</option>
              </select>
            </label>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, fontSize: 14, color: "#617066" }}>
            <input type="checkbox" checked={onlyWeekdays} onChange={(ev) => setOnlyWeekdays(ev.target.checked)} />
            Sadece iş günlerini say (hafta sonlarını atla)
          </label>

          {addResult && (
            <>
              <div className="result" style={{ marginTop: 24 }}>
                <div className="result-label">SONUÇ TARİHİ</div>
                <div className="result-value" style={{ fontSize: 32 }}>{formatDate(addResult)}</div>
              </div>
              <div style={{ marginTop: 20, display: "grid", gap: 10 }}>
                <DetailRow label="Bugüne göre" value={(() => { const k = diffDays(today, addResult); return k === 0 ? "Bugün" : k > 0 ? `${fmt(k)} gün sonra` : `${fmt(-k)} gün önce`; })()} highlight />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function ErrorBox({ text }: { text: string }) {
  return (
    <div style={{ marginTop: 16, padding: 14, borderRadius: 14, background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontWeight: 700, fontSize: 14 }}>
      {text}
    </div>
  );
}

function InfoBox({ text }: { text: string }) {
  return (
    <div style={{ marginTop: 16, padding: 14, borderRadius: 14, background: "#fff7ed", border: "1px solid #fed7aa", color: "#9a3412", fontSize: 13, lineHeight: 1.7 }}>
      ℹ️ {text}
    </div>
  );
}

function DetailRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
        padding: "15px 17px",
        borderRadius: 15,
        background: highlight ? "#f0fdf4" : "#f8faf9",
        border: highlight ? "1px solid #bbf7d0" : "1px solid #e5eee8",
      }}
    >
      <span style={{ color: "#617066", fontSize: 14 }}>{label}</span>
      <strong style={{ color: highlight ? "#15803d" : "#10231a", textAlign: "right" }}>{value}</strong>
    </div>
  );
}
