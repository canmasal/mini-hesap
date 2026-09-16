"use client";

import { useMemo, useState } from "react";

import {
  AGE_GROUPS,
  MTV_YEAR,
  TARIFF_I,
  TARIFF_IA,
  TARIFF_MOTORCYCLE,
  ageIndex,
  mtvAge,
} from "@/data/mtv";
import ResultRow, { money } from "./ResultRow";

/**
 * Motorlu taşıtlar vergisi (MTV) hesaplama.
 *
 * Otomobillerde 1/1/2018 ve sonrası tescillerde (I) sayılı tarife uygulanır;
 * bu tarifede motor hacmi ve yaşın yanında taşıt değeri de dikkate alınır.
 * Daha eski tescillerde taşıt değeri aranmayan (I/A) sayılı tarife geçerlidir.
 */

export default function VehicleTaxCalculator() {
  const [kind, setKind] = useState<"otomobil" | "motosiklet">("otomobil");
  const [engine, setEngine] = useState("");
  const [modelYear, setModelYear] = useState("");
  const [registeredBefore2018, setRegisteredBefore2018] = useState("hayir");
  const [value, setValue] = useState("");

  const result = useMemo(() => {
    const cc = Number(engine) || 0;
    const year = Number(modelYear) || 0;
    if (cc <= 0 || year < 1950 || year > MTV_YEAR + 1) return null;

    const age = mtvAge(year);
    if (age < 1) return null;
    const column = ageIndex(age);

    if (kind === "motosiklet") {
      const row = TARIFF_MOTORCYCLE.find((r) => cc <= r.upTo);
      if (!row) return null;
      return { age, column, rowLabel: row.label, tariff: "(I) sayılı tarife – motosiklet", tax: row.amounts[column], valueNote: null };
    }

    if (registeredBefore2018 === "evet") {
      const row = TARIFF_IA.find((r) => cc <= r.upTo);
      if (!row) return null;
      return {
        age,
        column,
        rowLabel: row.label,
        tariff: "(I/A) sayılı tarife – 2018 öncesi tescil",
        tax: row.amounts[column],
        valueNote: "Bu tarifede taşıt değeri dikkate alınmaz.",
      };
    }

    const row = TARIFF_I.find((r) => cc <= r.upTo);
    if (!row) return null;
    const price = Number(value.replace(",", ".")) || 0;
    /* Taşıt değeri girilmediyse en düşük dilim varsayılır */
    const bracket = row.brackets.find((b) => price <= b.valueUpTo) ?? row.brackets[row.brackets.length - 1];

    return {
      age,
      column,
      rowLabel: row.label,
      tariff: "(I) sayılı tarife – 2018 ve sonrası tescil",
      tax: bracket.amounts[column],
      valueNote:
        price > 0
          ? null
          : "Taşıt değeri girilmediği için en düşük değer dilimi kullanıldı. Değeri girerseniz doğru dilim seçilir.",
    };
  }, [kind, engine, modelYear, registeredBefore2018, value]);

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Taşıt türü
          <select value={kind} onChange={(e) => setKind(e.target.value as "otomobil" | "motosiklet")}>
            <option value="otomobil">Otomobil, arazi taşıtı, kaptıkaçtı</option>
            <option value="motosiklet">Motosiklet</option>
          </select>
        </label>
        <label className="field">
          Motor silindir hacmi (cm³)
          <input type="number" inputMode="numeric" min="0" value={engine} onChange={(e) => setEngine(e.target.value)} placeholder="1598" />
          <span className="field-hint">Ruhsatta &quot;motor hacmi&quot; olarak yazar.</span>
        </label>
        <label className="field">
          Model yılı
          <input type="number" inputMode="numeric" min="1950" max={MTV_YEAR + 1} value={modelYear} onChange={(e) => setModelYear(e.target.value)} placeholder="2018" />
          <span className="field-hint">Taşıt, model yılında bir yaşında sayılır.</span>
        </label>
        {kind === "otomobil" && (
          <>
            <label className="field">
              31.12.2017 ve öncesinde mi tescil edildi?
              <select value={registeredBefore2018} onChange={(e) => setRegisteredBefore2018(e.target.value)}>
                <option value="hayir">Hayır (1.1.2018 ve sonrası)</option>
                <option value="evet">Evet (2017 ve öncesi)</option>
              </select>
              <span className="field-hint">Tescil tarihi hangi tarifenin uygulanacağını belirler.</span>
            </label>
            {registeredBefore2018 === "hayir" && (
              <label className="field">
                Taşıt değeri (₺)
                <input type="number" inputMode="decimal" min="0" value={value} onChange={(e) => setValue(e.target.value)} placeholder="900000" />
                <span className="field-hint">
                  İlk iktisaptaki matrah (kasko değil). 2018 sonrası tescillerde vergiyi
                  etkiler.
                </span>
              </label>
            )}
          </>
        )}
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow label={`${MTV_YEAR} yıllık MTV`} value={money(result.tax)} highlight />
          <ResultRow label="Ocak taksiti" value={money(result.tax / 2)} />
          <ResultRow label="Temmuz taksiti" value={money(result.tax / 2)} />
          <ResultRow
            label="Taşıtın MTV yaşı"
            value={`${result.age} (${AGE_GROUPS[result.column]})`}
            hint={`${result.rowLabel} · ${result.tariff}`}
          />
          {result.valueNote && <div className="notice notice-warn">{result.valueNote}</div>}
          <div className="notice">
            MTV her yıl <strong>ocak</strong> ve <strong>temmuz</strong> aylarında iki eşit
            taksitte ödenir. Bağlayıcı tutar için Dijital Vergi Dairesi&apos;ndeki MTV
            sorgulama ekranını esas alın.
          </div>
        </div>
      ) : (
        <div className="calc-hint">
          Motor hacmi ve model yılını girin; {MTV_YEAR} yılı için ödeyeceğiniz motorlu
          taşıtlar vergisini ve taksit tutarlarını hesaplayalım.
        </div>
      )}
    </div>
  );
}
