"use client";

import { useMemo, useState } from "react";

import { LATE_PAYMENT } from "@/data/parameters";
import ResultRow, { money, percent } from "./ResultRow";

/**
 * Gecikme zammı hesaplama (6183 sayılı Kanun md. 51).
 *
 * Vadesinde ödenmeyen amme alacağına her ay için aylık oran, aydan artan
 * günler için aylık oranın otuzda biri uygulanır. Sürede vade günü sayılmaz,
 * ödeme günü sayılır.
 */

const DAY = 86_400_000;
const dmy = (iso: string) => iso.split("-").reverse().join(".");

/**
 * Vade tarihine ay ekler; kısa aylarda taşmayı engeller.
 *
 * Ay sayısı her zaman vade tarihinden itibaren hesaplanır: 31 ocak + 1 ay
 * 3 mart değil 28 şubat, + 2 ay ise 31 marttır. Adım adım eklemek şubatta
 * kırpılan günü sonraki aylara taşıyıp süreyi yanlış uzatırdı.
 */
function addMonths(date: Date, count: number) {
  const next = new Date(date);
  const day = next.getDate();
  next.setDate(1);
  next.setMonth(next.getMonth() + count);
  const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(day, lastDay));
  return next;
}

export default function LatePaymentCalculator() {
  const [amount, setAmount] = useState("");
  const [due, setDue] = useState("");
  const [payment, setPayment] = useState(() => new Date().toISOString().slice(0, 10));

  const result = useMemo(() => {
    const principal = Number(amount.replace(",", ".")) || 0;
    if (principal <= 0 || !due || !payment) return null;

    const dueDate = new Date(`${due}T12:00:00`);
    const payDate = new Date(`${payment}T12:00:00`);
    if (Number.isNaN(dueDate.getTime()) || Number.isNaN(payDate.getTime())) return null;

    /* Vade günü sayılmaz, ödeme günü sayılır */
    const days = Math.round((payDate.getTime() - dueDate.getTime()) / DAY);
    if (days <= 0) {
      return { principal, days: 0, months: 0, restDays: 0, interest: 0, total: principal, rate: 0, onTime: true };
    }

    /* Ay sayısı takvim ayı olarak bulunur, kalan günler otuzda bir oranla işler */
    let months = 0;
    const cursor = new Date(dueDate);
    while (months < 600) {
      const next = addMonths(dueDate, months + 1);
      if (next.getTime() > payDate.getTime()) break;
      cursor.setTime(next.getTime());
      months += 1;
    }
    const restDays = Math.round((payDate.getTime() - cursor.getTime()) / DAY);

    const monthlyPart = months * LATE_PAYMENT.monthly;
    const dailyPart = restDays * (LATE_PAYMENT.monthly / 30);
    const interest = principal * (monthlyPart + dailyPart);

    return {
      principal,
      days,
      months,
      restDays,
      interest,
      total: principal + interest,
      rate: monthlyPart + dailyPart,
      onTime: false,
    };
  }, [amount, due, payment]);

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Borç tutarı (₺)
          <input type="number" inputMode="decimal" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="15000" />
          <span className="field-hint">Vergi, SGK primi, trafik cezası gibi kamu alacağının aslı.</span>
        </label>
        <label className="field">
          Vade (son ödeme) tarihi
          <input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        </label>
        <label className="field">
          Ödeme tarihi
          <input type="date" value={payment} onChange={(e) => setPayment(e.target.value)} />
          <span className="field-hint">Bugünü bırakabilir ya da planladığınız tarihi seçebilirsiniz.</span>
        </label>
      </div>

      {result ? (
        result.onTime ? (
          <div className="notice notice-ok" style={{ marginTop: 22 }}>
            Ödeme tarihi vadeyi geçmiyor; gecikme zammı doğmaz.
          </div>
        ) : (
          <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
            <ResultRow label="Ödenecek toplam" value={money(result.total)} highlight />
            <ResultRow label="Borç aslı" value={money(result.principal)} />
            <ResultRow label="Gecikme zammı" value={money(result.interest)} tone="neg" />
            <ResultRow
              label="Gecikme süresi"
              value={`${result.months} ay ${result.restDays} gün`}
              hint={`Toplam ${result.days} gün · uygulanan oran ${percent(result.rate * 100)}`}
            />
            <div className="notice">
              Aylık gecikme zammı oranı <strong>{percent(LATE_PAYMENT.monthly * 100)}</strong>
              {" "}({dmy(LATE_PAYMENT.validFrom)} tarihinden itibaren). Aydan artan günler için
              aylık oranın otuzda biri uygulanır; vade günü süreye dâhil edilmez, ödeme günü
              dâhil edilir. Vergi dairesinin tahakkuk ettireceği kesin tutar birkaç kuruş
              farklı olabilir.
            </div>
          </div>
        )
      ) : (
        <div className="calc-hint">
          Borç tutarını ve vade tarihini girin; gecikme zammıyla birlikte ödemeniz
          gereken toplam tutarı hesaplayalım.
        </div>
      )}
    </div>
  );
}
