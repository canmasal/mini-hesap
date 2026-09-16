"use client";

import { useMemo, useState } from "react";

import { INCOME_TAX_BRACKETS_NON_WAGE, RENTAL_INCOME } from "@/data/parameters";
import ResultRow, { money } from "./ResultRow";

/**
 * Kira geliri (GMSİ) vergisi hesaplama.
 *
 * Mesken kirasında yıllık istisna düşülür, ardından götürü veya gerçek gider
 * indirilir; kalan matraha gelir vergisi tarifesi uygulanır. İşyeri kirasında
 * istisna yoktur, stopaj hesaplanan vergiden mahsup edilir.
 */

const num = (value: string) => Number(value.replace(",", ".")) || 0;

function taxOf(base: number) {
  let remaining = base;
  let previous = 0;
  let tax = 0;
  for (const bracket of INCOME_TAX_BRACKETS_NON_WAGE) {
    if (remaining <= 0) break;
    const slice = Math.min(remaining, bracket.limit - previous);
    tax += slice * bracket.rate;
    remaining -= slice;
    previous = bracket.limit;
  }
  return tax;
}

export default function RentalIncomeTaxCalculator() {
  const [type, setType] = useState<"mesken" | "isyeri">("mesken");
  const [monthly, setMonthly] = useState("");
  const [months, setMonths] = useState("12");
  const [method, setMethod] = useState<"goturu" | "gercek">("goturu");
  const [expenses, setExpenses] = useState("");
  const [otherIncome, setOtherIncome] = useState("");

  const result = useMemo(() => {
    const rent = num(monthly) * (Number(months) || 0);
    if (rent <= 0) return null;

    const isHome = type === "mesken";
    /* İstisnadan yararlanma şartı: toplam brüt gelir 3. dilim ücret tutarını aşmamalı */
    const totalIncome = rent + num(otherIncome);
    const exemptionBlocked = totalIncome > RENTAL_INCOME.exemptionIncomeLimit;
    const exemption = isHome && !exemptionBlocked ? Math.min(RENTAL_INCOME.exemption, rent) : 0;

    const afterExemption = rent - exemption;
    const expense =
      method === "goturu"
        ? afterExemption * RENTAL_INCOME.lumpSumExpenseRate
        : Math.min(num(expenses), afterExemption);

    const base = Math.max(0, afterExemption - expense);
    const tax = taxOf(base);
    const withholding = isHome ? 0 : rent * RENTAL_INCOME.workplaceWithholding;
    const payable = Math.max(0, tax - withholding);

    /* Beyan gerekip gerekmediği */
    const mustDeclare = isHome
      ? rent > exemption
      : rent > RENTAL_INCOME.workplaceDeclarationLimit;

    return {
      rent,
      exemption,
      exemptionBlocked: isHome && exemptionBlocked,
      expense,
      base,
      tax,
      withholding,
      payable,
      mustDeclare,
      net: rent - (isHome ? tax : withholding + payable),
    };
  }, [type, monthly, months, method, expenses, otherIncome]);

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Kira türü
          <select value={type} onChange={(e) => setType(e.target.value as "mesken" | "isyeri")}>
            <option value="mesken">Konut (mesken) kirası</option>
            <option value="isyeri">İşyeri kirası</option>
          </select>
        </label>
        <label className="field">
          Aylık kira (₺)
          <input type="number" inputMode="decimal" min="0" value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder="25000" />
          <span className="field-hint">
            {type === "isyeri" ? "Brüt kira (stopaj düşülmeden önceki tutar)." : "Kiracıdan tahsil ettiğiniz aylık tutar."}
          </span>
        </label>
        <label className="field">
          Kaç ay kira aldınız?
          <input type="number" inputMode="numeric" min="1" max="12" value={months} onChange={(e) => setMonths(e.target.value)} />
        </label>
        <label className="field">
          Gider yöntemi
          <select value={method} onChange={(e) => setMethod(e.target.value as "goturu" | "gercek")}>
            <option value="goturu">Götürü gider (%15)</option>
            <option value="gercek">Gerçek gider</option>
          </select>
          <span className="field-hint">Götürü yöntemi seçen 2 yıl geçmeden gerçek gidere dönemez.</span>
        </label>
        {method === "gercek" && (
          <label className="field">
            Belgeli giderleriniz (₺)
            <input type="number" inputMode="decimal" min="0" value={expenses} onChange={(e) => setExpenses(e.target.value)} placeholder="0" />
            <span className="field-hint">Aidat, sigorta, bakım, emlak vergisi, amortisman gibi belgeli giderler.</span>
          </label>
        )}
        {type === "mesken" && (
          <label className="field">
            Diğer yıllık brüt gelirleriniz (₺)
            <input type="number" inputMode="decimal" min="0" value={otherIncome} onChange={(e) => setOtherIncome(e.target.value)} placeholder="0" />
            <span className="field-hint">Ücret, faiz, temettü gibi gelirler. İstisna sınırının aşılıp aşılmadığı için gerekir.</span>
          </label>
        )}
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow label="Yıllık brüt kira geliri" value={money(result.rent)} highlight />
          {type === "mesken" && (
            <ResultRow
              label="Mesken istisnası"
              value={`− ${money(result.exemption)}`}
              hint={
                result.exemptionBlocked
                  ? "Toplam geliriniz sınırı aştığı için istisnadan yararlanılamıyor."
                  : undefined
              }
            />
          )}
          <ResultRow
            label={method === "goturu" ? "Götürü gider (%15)" : "Gerçek gider"}
            value={`− ${money(result.expense)}`}
          />
          <ResultRow label="Vergi matrahı" value={money(result.base)} />
          <ResultRow label="Hesaplanan gelir vergisi" value={money(result.tax)} />
          {type === "isyeri" && (
            <>
              <ResultRow label="Yıl içinde kesilen stopaj (%20)" value={`− ${money(result.withholding)}`} />
              <ResultRow label="Beyanname ile ödenecek vergi" value={money(result.payable)} tone="neg" />
            </>
          )}
          {type === "mesken" && (
            <ResultRow label="Ödenecek gelir vergisi" value={money(result.tax)} tone="neg" />
          )}
          <ResultRow label="Vergi sonrası kalan" value={money(result.net)} tone="pos" />

          {!result.mustDeclare && (
            <div className="notice notice-ok">
              Bu tutar için beyanname vermeniz gerekmiyor.{" "}
              {type === "mesken"
                ? "Yıllık kira geliriniz mesken istisnasının altında."
                : "Stopaja tabi işyeri kiranız beyan sınırının altında."}
            </div>
          )}
          <div className="notice">
            Beyanname mart ayında verilir; vergi <strong>mart</strong> ve <strong>temmuz</strong> olmak üzere
            iki eşit taksitte ödenir.
          </div>
        </div>
      ) : (
        <div className="calc-hint">
          Aylık kira tutarını girin; istisna, gider ve vergi dilimleri düşüldükten sonra
          ödeyeceğiniz gelir vergisini hesaplayalım.
        </div>
      )}
    </div>
  );
}
