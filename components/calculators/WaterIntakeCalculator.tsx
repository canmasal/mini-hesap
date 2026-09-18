"use client";

import { useMemo, useState } from "react";

import ResultRow from "./ResultRow";

/**
 * Günlük su ihtiyacı hesaplama.
 *
 * Temel ihtiyaç kilogram başına 33 ml alınır; her 30 dakikalık egzersiz için
 * 350 ml, sıcak havada 500 ml eklenir. Avrupa Gıda Güvenliği Otoritesi (EFSA)
 * toplam sıvı alımı için kadında 2,0 L, erkekte 2,5 L önerir; bunun yaklaşık
 * %20'si yiyeceklerden gelir. Sonuç bu referansın altına düşürülmez.
 */

const ML_PER_KG = 33;
const EXERCISE_ML_PER_30MIN = 350;
const HOT_WEATHER_ML = 500;
const EFSA_TOTAL = { kadin: 2000, erkek: 2500 };
const FROM_DRINKS = 0.8;
const GLASS_ML = 200;

const litre = (ml: number) =>
  `${(ml / 1000).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} L`;

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState<"kadin" | "erkek">("kadin");
  const [exercise, setExercise] = useState("0");
  const [hot, setHot] = useState(false);

  const result = useMemo(() => {
    const kg = Number(weight.replace(",", ".")) || 0;
    if (kg < 20 || kg > 300) return null;
    const minutes = Math.max(Number(exercise) || 0, 0);

    const base = kg * ML_PER_KG;
    const extra = (minutes / 30) * EXERCISE_ML_PER_30MIN + (hot ? HOT_WEATHER_ML : 0);
    const reference = EFSA_TOTAL[gender] * FROM_DRINKS;
    const total = Math.max(base, reference) + extra;

    return { total, base, extra, reference, glasses: Math.ceil(total / GLASS_ML) };
  }, [weight, gender, exercise, hot]);

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Kilonuz (kg)
          <input type="number" inputMode="decimal" min="20" max="300" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" />
        </label>
        <label className="field">
          Cinsiyet
          <select value={gender} onChange={(e) => setGender(e.target.value as "kadin" | "erkek")}>
            <option value="kadin">Kadın</option>
            <option value="erkek">Erkek</option>
          </select>
        </label>
        <label className="field">
          Günlük egzersiz (dakika)
          <input type="number" inputMode="numeric" min="0" value={exercise} onChange={(e) => setExercise(e.target.value)} />
        </label>
        <label className="field">
          Hava durumu
          <select value={hot ? "sicak" : "normal"} onChange={(e) => setHot(e.target.value === "sicak")}>
            <option value="normal">Normal</option>
            <option value="sicak">Sıcak / çok terletici</option>
          </select>
        </label>
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow label="Günlük içmeniz gereken su" value={litre(result.total)} highlight />
          <ResultRow label="Su bardağı (200 ml)" value={`${result.glasses} bardak`} />
          <ResultRow label="Kiloya göre temel ihtiyaç" value={litre(result.base)} hint={`${ML_PER_KG} ml × kilo`} />
          {result.extra > 0 && (
            <ResultRow label="Egzersiz ve sıcak hava eki" value={litre(result.extra)} />
          )}
          <div className="notice">
            Öneri içeceklerden alınacak sıvı içindir; yiyecekler günlük sıvının yaklaşık beşte
            birini karşılar. Böbrek, kalp hastalığı veya ödem sorunu olanlar sıvı miktarını
            hekimiyle belirlemelidir.
          </div>
        </div>
      ) : (
        <div className="calc-hint">Kilonuzu girin; günlük su ihtiyacınızı litre ve bardak olarak gösterelim.</div>
      )}
    </div>
  );
}
