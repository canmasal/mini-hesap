"use client";

import { useMemo, useState } from "react";

import { EMPLOYER_RATES, MINIMUM_WAGE, SGK_LIMITS } from "@/data/parameters";
import { calculateNetSalary } from "@/lib/calculations/netSalary";
import ResultRow, { money, percent } from "./ResultRow";

/**
 * İşverene maliyet hesaplama.
 *
 * İşveren yükü, SGK tavanına kadar olan prime esas kazanç üzerinden hesaplanır.
 * 5510 sayılı Kanunun 81/ı maddesindeki prim indirimi malullük-yaşlılık-ölüm
 * işveren hissesinden düşer; 2026'da imalat sektöründe 5, diğer sektörlerde
 * 2 puandır.
 */

const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

type Incentive = "yok" | "imalat" | "diger";

export default function EmployerCostCalculator() {
  const [gross, setGross] = useState("");
  const [incentive, setIncentive] = useState<Incentive>("diger");
  const [month, setMonth] = useState("1");
  const [extras, setExtras] = useState("");

  const result = useMemo(() => {
    const salary = Number(gross.replace(",", ".")) || 0;
    if (salary <= 0 || salary > 5_000_000) return null;

    const discount =
      incentive === "imalat"
        ? EMPLOYER_RATES.incentives.manufacturing
        : incentive === "diger"
          ? EMPLOYER_RATES.incentives.other
          : 0;

    /* İşveren primleri SGK tavanına kadar olan kazanç üzerinden hesaplanır */
    const sgkBase = Math.min(salary, SGK_LIMITS.monthlyCeiling);
    const sgkRate = EMPLOYER_RATES.sgkTotal - discount;
    const sgkEmployer = sgkBase * sgkRate;
    const unemploymentEmployer = sgkBase * EMPLOYER_RATES.unemployment;

    const side = Number(extras.replace(",", ".")) || 0;
    const net = calculateNetSalary({ grossSalary: salary, month: Number(month), previousCumulativeTaxBase: 0 });
    const total = salary + sgkEmployer + unemploymentEmployer + side;

    return {
      salary,
      sgkBase,
      capped: salary > SGK_LIMITS.monthlyCeiling,
      sgkRate,
      sgkEmployer,
      unemploymentEmployer,
      side,
      net: net.netSalary,
      total,
      yearly: total * 12,
      burden: (total - salary) / salary,
      netRatio: net.netSalary / total,
    };
  }, [gross, incentive, month, extras]);

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Brüt maaş (₺)
          <input type="number" inputMode="decimal" min="0" value={gross} onChange={(e) => setGross(e.target.value)} placeholder={String(MINIMUM_WAGE.gross)} />
          <span className="field-hint">Brüt asgari ücret: {money(MINIMUM_WAGE.gross)}</span>
        </label>
        <label className="field">
          Prim indirimi
          <select value={incentive} onChange={(e) => setIncentive(e.target.value as Incentive)}>
            <option value="diger">İmalat dışı sektör (2 puan)</option>
            <option value="imalat">İmalat sektörü (5 puan)</option>
            <option value="yok">İndirim yok</option>
          </select>
          <span className="field-hint">
            İndirim için bildirgelerin süresinde verilmesi ve prim borcu bulunmaması gerekir.
          </span>
        </label>
        <label className="field">
          Hesaplama ayı
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            {MONTHS.map((name, i) => (
              <option key={name} value={String(i + 1)}>{name}</option>
            ))}
          </select>
          <span className="field-hint">Çalışanın net maaşı vergi dilimi nedeniyle aya göre değişir.</span>
        </label>
        <label className="field">
          Aylık yan haklar (₺) — isteğe bağlı
          <input type="number" inputMode="decimal" min="0" value={extras} onChange={(e) => setExtras(e.target.value)} placeholder="0" />
          <span className="field-hint">Yemek kartı, servis, özel sağlık sigortası gibi ek maliyetler.</span>
        </label>
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow label="İşverene aylık toplam maliyet" value={money(result.total)} highlight />
          <ResultRow label="Brüt maaş" value={money(result.salary)} />
          <ResultRow
            label={`SGK işveren payı (${percent(result.sgkRate * 100)})`}
            value={money(result.sgkEmployer)}
            hint={result.capped ? `SGK tavanı olan ${money(SGK_LIMITS.monthlyCeiling)} üzerinden hesaplandı.` : undefined}
          />
          <ResultRow
            label={`İşsizlik işveren payı (${percent(EMPLOYER_RATES.unemployment * 100)})`}
            value={money(result.unemploymentEmployer)}
          />
          {result.side > 0 && <ResultRow label="Yan haklar" value={money(result.side)} />}
          <ResultRow label="Çalışanın eline geçen net" value={money(result.net)} tone="pos" />
          <ResultRow
            label="İşveren yükü (brütün üzerine)"
            value={percent(result.burden * 100)}
            hint={`Toplam maliyetin ${percent(result.netRatio * 100)} kadarı çalışanın eline geçiyor.`}
          />
          <ResultRow label="Yıllık toplam maliyet (12 ay)" value={money(result.yearly)} />
          <div className="notice">
            Hesap, aylık prim gün sayısının 30 olduğu tam ay çalışmasını varsayar. İş
            kazası riski yüksek sektörlerde kısa vadeli sigorta kolu primi, teşvik
            kapsamı ve engelli istihdamı gibi durumlar sonucu değiştirebilir.
          </div>
        </div>
      ) : (
        <div className="calc-hint">
          Brüt maaşı girin; SGK ve işsizlik primleriyle birlikte işverene aylık ve
          yıllık toplam maliyeti hesaplayalım.
        </div>
      )}
    </div>
  );
}
