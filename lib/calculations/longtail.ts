/**
 * Uzun kuyruk sayfalarının sunucu tarafı hesaplamaları.
 *
 * Sayfalar statik üretildiği için bu fonksiyonlar derleme anında çalışır;
 * ziyaretçiye hazır sonuç gider.
 */

import { RATES } from "@/data/parameters";
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

export type LoanRow = {
  rate: number;
  monthly: number;
  total: number;
  interest: number;
};

export function loanTableOf(amount: number, months: number): LoanRow[] {
  return [1.99, 2.49, 2.99, 3.49, 3.99].map((r) => {
    const rate = r / 100;

    const monthly =
      rate === 0
        ? amount / months
        : (amount * rate * Math.pow(1 + rate, months)) /
          (Math.pow(1 + rate, months) - 1);

    const total = monthly * months;

    return { rate: r, monthly, total, interest: total - amount };
  });
}

export const money = (v: number) =>
  v.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " ₺";
