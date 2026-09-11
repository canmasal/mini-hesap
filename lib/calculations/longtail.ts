/**
 * Uzun kuyruk sayfalarının sunucu tarafı hesaplamaları.
 *
 * Sayfalar statik üretildiği için bu fonksiyonlar derleme anında çalışır;
 * ziyaretçiye hazır sonuç gider.
 */

/* 2026 dönemi varsayılan parametreleri.
   Değiştiğinde yalnızca burası güncellenir. */
export const PARAMS = {
  sgkIsciOrani: 0.14,
  issizlikIsciOrani: 0.01,
  damgaOrani: 0.00759,
  /** Basitleştirilmiş: ilk dilim oranı */
  gelirVergisiOrani: 0.15,
  /** Aylık gelir vergisi istisnası (asgari ücret istisnası) */
  gelirVergisiIstisnasi: 3315.7,
  /** Aylık damga vergisi istisnası */
  damgaIstisnasi: 197.38,
  /** SGK tavanı (aylık) */
  sgkTavani: 195041.4,
};

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

export function netSalaryOf(gross: number): NetSalaryBreakdown {
  const base = Math.min(gross, PARAMS.sgkTavani);

  const sgk = base * PARAMS.sgkIsciOrani;
  const unemployment = base * PARAMS.issizlikIsciOrani;

  const taxBase = gross - sgk - unemployment;

  const incomeTax = Math.max(
    taxBase * PARAMS.gelirVergisiOrani - PARAMS.gelirVergisiIstisnasi,
    0
  );

  const stampTax = Math.max(
    gross * PARAMS.damgaOrani - PARAMS.damgaIstisnasi,
    0
  );

  const totalDeduction = sgk + unemployment + incomeTax + stampTax;

  return {
    gross,
    sgk,
    unemployment,
    taxBase,
    incomeTax,
    stampTax,
    totalDeduction,
    net: gross - totalDeduction,
    /* İşveren payları: SGK %20,5 + işsizlik %2 */
    employerCost: gross + base * 0.205 + base * 0.02,
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
