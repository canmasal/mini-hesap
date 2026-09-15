"use client";

import { useState } from "react";

type Level = "lise" | "universite";
type Row = { id: number; name: string; grade: string; weight: string };

/** Üniversitelerde yaygın kullanılan 4'lük sistem harf notu katsayıları */
const LETTERS: [string, number][] = [
  ["AA", 4],
  ["BA", 3.5],
  ["BB", 3],
  ["CB", 2.5],
  ["CC", 2],
  ["DC", 1.5],
  ["DD", 1],
  ["FD", 0.5],
  ["FF", 0],
];

const LISE_DERSLER = ["Türk Dili ve Edebiyatı", "Matematik", "Fizik", "Kimya", "Biyoloji", "Tarih", "Coğrafya", "İngilizce"];

let nextId = 1;
const newRow = (name = ""): Row => ({ id: nextId++, name, grade: "", weight: "" });

function liseBelge(avg: number) {
  if (avg >= 85) return "Takdir belgesi (davranış puanı tam olmak şartıyla)";
  if (avg >= 70) return "Teşekkür belgesi (davranış puanı tam olmak şartıyla)";
  return "Belge sınırının altında (teşekkür için en az 70)";
}

const fmt = (n: number, d = 2) => n.toLocaleString("tr-TR", { minimumFractionDigits: d, maximumFractionDigits: d });

export default function GpaCalculator() {
  const [level, setLevel] = useState<Level>("lise");
  const [rows, setRows] = useState<Row[]>(() => LISE_DERSLER.map((n) => newRow(n)));

  function switchLevel(l: Level) {
    setLevel(l);
    setRows(l === "lise" ? LISE_DERSLER.map((n) => newRow(n)) : [newRow(), newRow(), newRow(), newRow(), newRow()]);
  }

  const update = (id: number, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const valid = rows
    .map((r) => {
      const weight = Number(r.weight.replace(",", "."));
      const grade = level === "lise" ? Number(r.grade.replace(",", ".")) : LETTERS.find(([l]) => l === r.grade)?.[1];
      if (grade === undefined || r.grade === "" || !Number.isFinite(grade) || !(weight > 0)) return null;
      if (level === "lise" && (grade < 0 || grade > 100)) return null;
      return { grade, weight, name: r.name };
    })
    .filter((x): x is { grade: number; weight: number; name: string } => x !== null);

  const totalWeight = valid.reduce((a, r) => a + r.weight, 0);
  const weightedSum = valid.reduce((a, r) => a + r.grade * r.weight, 0);
  const avg = totalWeight ? weightedSum / totalWeight : null;

  return (
    <div className="calc-box">
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        <button type="button" className={level === "lise" ? "btn btn-green" : "btn btn-outline"} style={{ borderRadius: 14 }} onClick={() => switchLevel("lise")}>
          Lise / Ortaokul (100'lük)
        </button>
        <button type="button" className={level === "universite" ? "btn btn-green" : "btn btn-outline"} style={{ borderRadius: 14 }} onClick={() => switchLevel("universite")}>
          Üniversite (4'lük, harf notu)
        </button>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr) minmax(0,1fr) 36px", gap: 8, fontSize: 12, fontWeight: 700, color: "#617066" }}>
          <span>Ders</span>
          <span>{level === "lise" ? "Dönem notu (0–100)" : "Harf notu"}</span>
          <span>{level === "lise" ? "Haftalık ders saati" : "Kredi / AKTS"}</span>
          <span />
        </div>
        {rows.map((r) => (
          <div key={r.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr) minmax(0,1fr) 36px", gap: 8, alignItems: "center" }}>
            <input className="input" aria-label="Ders adı" placeholder="Ders adı" value={r.name} onChange={(e) => update(r.id, { name: e.target.value })} style={inputStyle} />
            {level === "lise" ? (
              <input aria-label="Not" inputMode="decimal" placeholder="85" value={r.grade} onChange={(e) => update(r.id, { grade: e.target.value })} style={inputStyle} />
            ) : (
              <select aria-label="Harf notu" value={r.grade} onChange={(e) => update(r.id, { grade: e.target.value })} style={inputStyle}>
                <option value="">Seç</option>
                {LETTERS.map(([l, v]) => (
                  <option key={l} value={l}>{l} ({v})</option>
                ))}
              </select>
            )}
            <input aria-label="Ağırlık" inputMode="decimal" placeholder={level === "lise" ? "4" : "5"} value={r.weight} onChange={(e) => update(r.id, { weight: e.target.value })} style={inputStyle} />
            <button type="button" aria-label="Dersi sil" onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} style={{ height: 40, borderRadius: 10, border: "1px solid #e5eee8", background: "#fff", color: "#9aa7a0", cursor: "pointer" }}>
              ✕
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
        <button type="button" className="btn btn-outline" style={{ borderRadius: 14 }} onClick={() => setRows((rs) => [...rs, newRow()])}>
          + Ders ekle
        </button>
        <button type="button" className="btn btn-outline" style={{ borderRadius: 14 }} onClick={() => switchLevel(level)}>
          Temizle
        </button>
      </div>

      {avg !== null && (
        <>
          <div className="result" style={{ marginTop: 24 }}>
            <div className="result-label">{level === "lise" ? "AĞIRLIKLI NOT ORTALAMASI" : "AĞIRLIKLI NOT ORTALAMASI (YANO / GANO)"}</div>
            <div className="result-value" style={{ fontSize: 42 }}>{fmt(avg)}</div>
          </div>
          <div style={{ marginTop: 20, display: "grid", gap: 10 }}>
            <DetailRow label="Hesaba katılan ders" value={`${valid.length} ders`} />
            <DetailRow label={level === "lise" ? "Toplam ders saati" : "Toplam kredi"} value={fmt(totalWeight, 1).replace(/,0$/, "")} />
            {level === "lise" ? (
              <DetailRow label="Belge durumu" value={liseBelge(avg)} highlight />
            ) : (
              <DetailRow label="Toplam ağırlıklı puan" value={fmt(weightedSum)} highlight />
            )}
          </div>
          <div style={{ marginTop: 16, padding: 14, borderRadius: 14, background: "#fff7ed", border: "1px solid #fed7aa", color: "#9a3412", fontSize: 13, lineHeight: 1.7 }}>
            ℹ️ {level === "lise"
              ? "Ortalama, her dersin notu haftalık ders saatiyle çarpılıp toplam ders saatine bölünerek bulunur. Belge için davranış notu ve e-Okul'daki resmî hesap esas alınır."
              : "Ortalama, her dersin harf notu katsayısı kredisiyle çarpılıp toplam krediye bölünerek bulunur. Harf notu katsayıları üniversiteden üniversiteye farklılık gösterebilir; 100'lük sisteme dönüşüm için YÖK'ün resmî dönüşüm tablosunu kullanın."}
          </div>
        </>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 40,
  padding: "0 10px",
  borderRadius: 10,
  border: "1px solid #dce7df",
  background: "#fff",
  fontSize: 14,
};

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
