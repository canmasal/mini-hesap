"use client";

import { useMemo, useState } from "react";

import { MINIMUM_WAGE } from "@/data/parameters";
import { calculateNetSalary } from "@/lib/calculations/netSalary";
import ResultRow, { money } from "./ResultRow";

/**
 * Netten brüte maaş hesaplama.
 *
 * Net maaş motoru tersine çözülür: istenen neti veren brüt tutar ikili arama
 * ile bulunur. Böylece vergi dilimleri, asgari ücret istisnaları ve SGK
 * tavanı brütten nete hesapla birebir aynı kalır.
 */

const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

function grossForNet(net: number, month: number, previous: number) {
  let low = net;
  let high = net * 2.5 + 10000;

  for (let i = 0; i < 80; i += 1) {
    const mid = (low + high) / 2;
    const r = calculateNetSalary({ grossSalary: mid, month, previousCumulativeTaxBase: previous });
    if (r.netSalary < net) low = mid;
    else high = mid;
  }

  const netOf = (g: number) =>
    calculateNetSalary({ grossSalary: g, month, previousCumulativeTaxBase: previous }).netSalary;

  /* Bordrodaki gibi kuruşa yuvarla; yuvarlama neti düşürürse 1 kuruş artır */
  let gross = Math.round(high * 100) / 100;
  if (netOf(gross) < net) gross = Math.round((gross + 0.01) * 100) / 100;

  /* Birkaç kuruş içinde tam lira aynı neti veriyorsa yuvarlak tutarı göster */
  const whole = Math.round(gross);
  if (Math.abs(whole - gross) <= 0.05 && Math.abs(netOf(whole) - netOf(gross)) < 0.005) gross = whole;
  return calculateNetSalary({ grossSalary: gross, month, previousCumulativeTaxBase: previous });
}

export default function NetToGrossCalculator() {
  const [net, setNet] = useState("");
  const [month, setMonth] = useState("1");
  const [previous, setPrevious] = useState("");

  const result = useMemo(() => {
    const n = Number(net.replace(",", "."));
    const m = Number(month);
    const p = Number(previous.replace(",", ".")) || 0;
    if (!n || n <= 0 || n > 5_000_000) return null;
    return grossForNet(n, m, p);
  }, [net, month, previous]);

  const belowMinimum = result && result.grossSalary < MINIMUM_WAGE.gross - 0.5;

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Ele geçecek net maaş (₺)
          <input type="number" inputMode="decimal" min="0" value={net} onChange={(e) => setNet(e.target.value)} placeholder="50000" />
        </label>
        <label className="field">
          Hesaplama ayı
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            {MONTHS.map((name, i) => (
              <option key={name} value={String(i + 1)}>{name}</option>
            ))}
          </select>
          <span className="field-hint">Vergi dilimi yıl içinde değiştiği için ay önemlidir.</span>
        </label>
        <label className="field">
          Önceki ayların kümülatif vergi matrahı (₺)
          <input type="number" inputMode="decimal" min="0" value={previous} onChange={(e) => setPrevious(e.target.value)} placeholder="0" />
          <span className="field-hint">Ocak için boş bırakın; bordronuzda yazar.</span>
        </label>
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow label="Gereken brüt maaş" value={money(result.grossSalary)} highlight />
          <ResultRow label="SGK işçi payı (%14)" value={`− ${money(result.sgkEmployee)}`} />
          <ResultRow label="İşsizlik sigortası (%1)" value={`− ${money(result.unemploymentEmployee)}`} />
          <ResultRow label="Gelir vergisi (istisna sonrası)" value={`− ${money(result.incomeTax)}`} />
          <ResultRow label="Damga vergisi (istisna sonrası)" value={`− ${money(result.stampTax)}`} />
          <ResultRow label="Net maaş" value={money(result.netSalary)} tone="pos" />
          {belowMinimum && (
            <div className="notice notice-warn">
              Tam ay çalışan biri için brüt ücret, brüt asgari ücretten ({money(MINIMUM_WAGE.gross)})
              düşük olamaz. Girdiğiniz net, net asgari ücretin ({money(MINIMUM_WAGE.net)}) altında.
            </div>
          )}
        </div>
      ) : (
        <div className="calc-hint">
          Anlaştığınız veya almak istediğiniz net maaşı girin; işverenin
          bordroya yazması gereken brüt tutarı ve kesintileri hesaplayalım.
        </div>
      )}
    </div>
  );
}
