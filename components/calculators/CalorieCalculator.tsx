"use client";

import { useMemo, useState } from "react";

import ResultRow from "./ResultRow";

/**
 * Günlük kalori ihtiyacı ve makro dağılımı.
 *
 * Bazal metabolizma hızı (BMH) Mifflin–St Jeor denklemiyle hesaplanır:
 *   Erkek: 10 × kg + 6,25 × cm − 5 × yaş + 5
 *   Kadın: 10 × kg + 6,25 × cm − 5 × yaş − 161
 * Günlük ihtiyaç = BMH × aktivite katsayısı. Hedefe göre ±kalori uygulanır.
 */

const ACTIVITY = [
  { value: "1.2", label: "Hareketsiz (masa başı, spor yok)" },
  { value: "1.375", label: "Az hareketli (haftada 1–3 gün spor)" },
  { value: "1.55", label: "Orta hareketli (haftada 3–5 gün spor)" },
  { value: "1.725", label: "Çok hareketli (haftada 6–7 gün spor)" },
  { value: "1.9", label: "Aşırı hareketli (ağır iş veya günde 2 antrenman)" },
];

const GOALS = [
  { value: "-500", label: "Kilo vermek (haftada ~0,5 kg)" },
  { value: "-250", label: "Yavaş kilo vermek (haftada ~0,25 kg)" },
  { value: "0", label: "Kilomu korumak" },
  { value: "300", label: "Kilo almak / kas kazanmak" },
];

const kcal = (value: number) => `${Math.round(value).toLocaleString("tr-TR")} kcal`;
const gram = (value: number) => `${Math.round(value).toLocaleString("tr-TR")} g`;

export default function CalorieCalculator() {
  const [gender, setGender] = useState<"kadin" | "erkek">("kadin");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("1.375");
  const [goal, setGoal] = useState("0");

  const result = useMemo(() => {
    const a = Number(age);
    const h = Number(height);
    const w = Number(weight.replace(",", "."));
    if (!a || !h || !w || a < 15 || a > 90 || h < 120 || h > 230 || w < 30 || w > 300) return null;

    const bmr = 10 * w + 6.25 * h - 5 * a + (gender === "erkek" ? 5 : -161);
    const maintenance = bmr * Number(activity);
    const floor = gender === "erkek" ? 1500 : 1200;
    const rawTarget = maintenance + Number(goal);
    const target = Math.max(rawTarget, floor);

    /* Makrolar: protein kilo başına 1,8 g, yağ kalorinin %25'i, kalan karbonhidrat */
    const protein = w * 1.8;
    const fat = (target * 0.25) / 9;
    const carbs = Math.max(0, (target - protein * 4 - fat * 9) / 4);

    return { bmr, maintenance, target, floored: rawTarget < floor, protein, fat, carbs, water: w * 0.033 };
  }, [gender, age, height, weight, activity, goal]);

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Cinsiyet
          <select value={gender} onChange={(e) => setGender(e.target.value as "kadin" | "erkek")}>
            <option value="kadin">Kadın</option>
            <option value="erkek">Erkek</option>
          </select>
        </label>
        <label className="field">
          Yaş
          <input type="number" inputMode="numeric" min="15" max="90" value={age} onChange={(e) => setAge(e.target.value)} placeholder="30" />
        </label>
        <label className="field">
          Boy (cm)
          <input type="number" inputMode="numeric" min="120" max="230" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="170" />
        </label>
        <label className="field">
          Kilo (kg)
          <input type="number" inputMode="decimal" min="30" max="300" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" />
        </label>
        <label className="field">
          Aktivite düzeyi
          <select value={activity} onChange={(e) => setActivity(e.target.value)}>
            {ACTIVITY.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Hedef
          <select value={goal} onChange={(e) => setGoal(e.target.value)}>
            {GOALS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow label="Hedefinize göre günlük kalori" value={kcal(result.target)} highlight />
          <ResultRow label="Kilo korumak için günlük ihtiyaç" value={kcal(result.maintenance)} />
          <ResultRow label="Bazal metabolizma hızı (BMH)" hint="Hiç hareket etmeden harcanan enerji" value={kcal(result.bmr)} />
          <ResultRow label="Protein" hint="Kilo başına 1,8 g" value={gram(result.protein)} />
          <ResultRow label="Yağ" hint="Kalorinin %25'i" value={gram(result.fat)} />
          <ResultRow label="Karbonhidrat" hint="Kalan kalori" value={gram(result.carbs)} />
          <ResultRow label="Günlük su" hint="Kilo başına ~33 ml" value={`${result.water.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} litre`} />
          {result.floored && (
            <div className="notice notice-warn">
              Hesaplanan hedef çok düşük çıktığı için güvenli alt sınıra ({kcal(result.target)})
              yükseltildi. Çok düşük kalorili diyetleri yalnızca uzman kontrolünde uygulayın.
            </div>
          )}
          <div className="notice">
            Sonuçlar ortalama değerlerdir. Hastalık, gebelik ve emzirme gibi
            durumlarda ihtiyaç farklıdır; beslenme planınız için diyetisyene danışın.
          </div>
        </div>
      ) : (
        <div className="calc-hint">
          Yaş, boy, kilo ve aktivite düzeyinizi girin. Günlük kalori ihtiyacınız,
          bazal metabolizma hızınız ve protein-yağ-karbonhidrat dağılımınız hesaplanır.
        </div>
      )}
    </div>
  );
}
