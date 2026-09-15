/**
 * Uzun kuyruk sayfalarının sunucu tarafı hesaplamaları.
 *
 * Sayfalar statik üretildiği için bu fonksiyonlar derleme anında çalışır;
 * ziyaretçiye hazır sonuç gider.
 */

import {
  CONSUMER_LOAN_TAXES,
  INCOME_TAX_BRACKETS_WAGE,
  RATES,
} from "@/data/parameters";
import { calculateNetSalary } from "@/lib/calculations/netSalary";

export type NetSalaryBreakdown = {
  gross: number;
  sgk: number;
  unemployment: number;
  taxBase: number;
  incomeTax: number;
  stampTax: number;
  totalDeduction: number;
  net: number;
  employerCost: number;
};

/**
 * Ocak ayı net maaş dökümü. Asıl Net Maaş hesaplayıcısıyla aynı motoru
 * (2026 vergi dilimleri, asgari ücret istisnaları, SGK tavanı) kullanır;
 * böylece long-tail sayfa ile araç aynı sonucu verir.
 */
export function netSalaryOf(gross: number): NetSalaryBreakdown {
  const r = calculateNetSalary({
    grossSalary: gross,
    month: 1,
    previousCumulativeTaxBase: 0,
  });

  const totalDeduction =
    r.sgkEmployee + r.unemploymentEmployee + r.incomeTax + r.stampTax;

  return {
    gross,
    sgk: r.sgkEmployee,
    unemployment: r.unemploymentEmployee,
    taxBase: r.incomeTaxBase,
    incomeTax: r.incomeTax,
    stampTax: r.stampTax,
    totalDeduction,
    net: r.netSalary,
    /* İşveren payları: SGK (2 puan indirimli) + işsizlik, SGK tavanına kadar */
    employerCost:
      gross +
      r.sgkBase * RATES.sgkEmployerWithIncentive +
      r.sgkBase * RATES.unemploymentEmployer,
  };
}

export type KdvRow = {
  rate: number;
  /** Tutar KDV hariç kabul edilirse */
  excluded: { base: number; kdv: number; total: number };
  /** Tutar KDV dahil kabul edilirse */
  included: { base: number; kdv: number; total: number };
};

export function kdvTableOf(amount: number): KdvRow[] {
  return [1, 10, 20].map((r) => {
    const rate = r / 100;

    const exKdv = amount * rate;
    const inBase = amount / (1 + rate);

    return {
      rate: r,
      excluded: { base: amount, kdv: exKdv, total: amount + exKdv },
      included: { base: inBase, kdv: amount - inBase, total: amount },
    };
  });
}

/** Yıl boyunca ay ay net maaş (kümülatif vergi matrahıyla). */
export type MonthlyNetRow = {
  month: number;
  net: number;
  incomeTax: number;
  cumulativeTaxBase: number;
  /** O ay uygulanan en yüksek gelir vergisi dilimi oranı */
  topRate: number;
};

export function yearlyNetOf(gross: number): MonthlyNetRow[] {
  const rows: MonthlyNetRow[] = [];
  let cumulative = 0;

  for (let month = 1; month <= 12; month += 1) {
    const r = calculateNetSalary({
      grossSalary: gross,
      month,
      previousCumulativeTaxBase: cumulative,
    });
    cumulative = r.cumulativeTaxBase;
    const bracket = INCOME_TAX_BRACKETS_WAGE.find((b) => cumulative <= b.limit);
    rows.push({
      month,
      net: r.netSalary,
      incomeTax: r.incomeTax,
      cumulativeTaxBase: cumulative,
      topRate: bracket?.rate ?? 0.4,
    });
  }

  return rows;
}

/* ---------------- Kredi ---------------- */

/** Long-tail kredi tablosunda gösterilen aylık akdi faiz oranları (%). */
export const LOAN_RATES = [2.49, 2.99, 3.49, 3.99, 4.49];

/** Ödeme planı ve özet için örnek alınan orta oran (%). */
export const LOAN_REFERENCE_RATE = 3.49;

export type LoanRow = {
  /** Aylık akdi faiz (%) */
  rate: number;
  /** KKDF + BSMV dahil aylık maliyet oranı (%) */
  effectiveRate: number;
  monthly: number;
  total: number;
  /** Faiz + KKDF + BSMV toplamı */
  interest: number;
};

const annuity = (amount: number, rate: number, months: number) =>
  rate === 0
    ? amount / months
    : (amount * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);

/** İhtiyaç kredisinde faize eklenen vergi ve fon çarpanı (1 + KKDF + BSMV). */
const TAX_FACTOR = 1 + CONSUMER_LOAN_TAXES.kkdf + CONSUMER_LOAN_TAXES.bsmv;

export function loanRowOf(amount: number, months: number, ratePct: number): LoanRow {
  const effective = (ratePct / 100) * TAX_FACTOR;
  const monthly = annuity(amount, effective, months);
  const total = monthly * months;
  return {
    rate: ratePct,
    effectiveRate: effective * 100,
    monthly,
    total,
    interest: total - amount,
  };
}

export function loanTableOf(amount: number, months: number): LoanRow[] {
  return LOAN_RATES.map((rate) => loanRowOf(amount, months, rate));
}

export type ScheduleRow = {
  month: number;
  installment: number;
  interest: number;
  kkdf: number;
  bsmv: number;
  principal: number;
  remaining: number;
};

/** Eşit taksitli ödeme planı; faiz, KKDF ve BSMV ayrı gösterilir. */
export function loanScheduleOf(amount: number, months: number, ratePct: number): ScheduleRow[] {
  const rate = ratePct / 100;
  const installment = annuity(amount, rate * TAX_FACTOR, months);
  const rows: ScheduleRow[] = [];
  let remaining = amount;

  for (let month = 1; month <= months; month += 1) {
    const interest = remaining * rate;
    const kkdf = interest * CONSUMER_LOAN_TAXES.kkdf;
    const bsmv = interest * CONSUMER_LOAN_TAXES.bsmv;
    const principal = installment - interest - kkdf - bsmv;
    remaining = Math.max(0, remaining - principal);
    rows.push({ month, installment, interest, kkdf, bsmv, principal, remaining });
  }

  return rows;
}

export const money = (v: number) =>
  v.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " ₺";
