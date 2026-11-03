/**
 * Ek hazır hesap (long-tail) sayfalarının sunucu tarafı hesaplamaları.
 *
 * Her fonksiyon ilgili hesaplayıcı bileşenindeki formülün aynısıdır; böylece
 * hazır sayfa ile araç aynı sonucu verir. Bir araçtaki formül değişirse
 * buradaki karşılığı da birlikte güncellenmelidir:
 *
 * - grossForNetOf        → components/calculators/NetToGrossCalculator.tsx
 * - employerCostOf       → components/calculators/EmployerCostCalculator.tsx
 * - severanceOf          → components/calculators/KidemIhbarCalculator.tsx
 * - depositOf            → components/calculators/DepositCalculator.tsx
 * - homeLoanOf           → components/calculators/HomeLoanCostCalculator.tsx
 * - creditCardOf         → components/calculators/CreditCardMinimumCalculator.tsx
 * - rentIncreaseOf       → components/calculators/RentIncreaseCalculator.tsx
 * - rentalIncomeTaxOf    → components/calculators/RentalIncomeTaxCalculator.tsx
 * - deedFeeOf            → components/calculators/TitleDeedFeeCalculator.tsx
 * - percentOf/discountOf → PercentCalculator.tsx / DiscountCalculator.tsx
 */

import {
  CREDIT_CARD,
  EMPLOYER_RATES,
  INCOME_TAX_BRACKETS_NON_WAGE,
  RATES,
  RENTAL_INCOME,
  RENT_INCREASE,
  SEVERANCE_CEILINGS,
  SGK_LIMITS,
  depositWithholdingRate,
  incomeTaxOn,
} from "@/data/parameters";
import { calculateNetSalary, type NetSalaryResult } from "@/lib/calculations/netSalary";

/* ---------------- Netten brüte ---------------- */

/** İstenen neti veren brüt (ikili arama, kuruşa yuvarlanmış). */
export function grossForNetOf(net: number, month = 1, previous = 0): NetSalaryResult {
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

  let gross = Math.round(high * 100) / 100;
  if (netOf(gross) < net) gross = Math.round((gross + 0.01) * 100) / 100;

  const whole = Math.round(gross);
  if (Math.abs(whole - gross) <= 0.05 && Math.abs(netOf(whole) - netOf(gross)) < 0.005) gross = whole;
  return calculateNetSalary({ grossSalary: gross, month, previousCumulativeTaxBase: previous });
}

/** Aynı net maaşı yıl boyunca almak için her ay gereken brüt. */
export function yearlyGrossForNetOf(net: number) {
  const rows: { month: number; gross: number; incomeTax: number; cumulative: number }[] = [];
  let previous = 0;
  for (let month = 1; month <= 12; month += 1) {
    const r = grossForNetOf(net, month, previous);
    previous = r.cumulativeTaxBase;
    rows.push({ month, gross: r.grossSalary, incomeTax: r.incomeTax, cumulative: r.cumulativeTaxBase });
  }
  return rows;
}

/* ---------------- İşveren maliyeti ---------------- */

export type Incentive = "yok" | "diger" | "imalat";

export function employerCostOf(salary: number, incentive: Incentive) {
  const discount =
    incentive === "imalat"
      ? EMPLOYER_RATES.incentives.manufacturing
      : incentive === "diger"
        ? EMPLOYER_RATES.incentives.other
        : 0;

  const sgkBase = Math.min(salary, SGK_LIMITS.monthlyCeiling);
  const sgkRate = EMPLOYER_RATES.sgkTotal - discount;
  const sgkEmployer = sgkBase * sgkRate;
  const unemploymentEmployer = sgkBase * EMPLOYER_RATES.unemployment;
  const net = calculateNetSalary({ grossSalary: salary, month: 1, previousCumulativeTaxBase: 0 }).netSalary;
  const total = salary + sgkEmployer + unemploymentEmployer;

  return {
    salary,
    sgkBase,
    capped: salary > SGK_LIMITS.monthlyCeiling,
    sgkRate,
    sgkEmployer,
    unemploymentEmployer,
    net,
    total,
    yearly: total * 12,
    burden: (total - salary) / salary,
    netRatio: net / total,
  };
}

/* ---------------- Kıdem ve ihbar ---------------- */

/** Sayfalarda kullanılan güncel kıdem tavanı dönemi (en yeni kayıt). */
export const CURRENT_SEVERANCE_CEILING = SEVERANCE_CEILINGS[0];

/** Hizmet süresine göre ihbar süresi (hafta), araçtaki eşiklerle aynı. */
export function noticeWeeksFor(years: number) {
  if (years < 0.5) return 2;
  if (years < 1.5) return 4;
  if (years < 3) return 6;
  return 8;
}

/**
 * Tam yıl hizmet için kıdem ve ihbar tazminatı. Giydirilmiş ücret = brüt
 * maaş kabul edilir (yan hak yok), önceki kümülatif vergi matrahı 0'dır.
 */
export function severanceOf(salary: number, years: number) {
  const ceiling = CURRENT_SEVERANCE_CEILING.amount;
  const basis = Math.min(salary, ceiling);
  const grossSeverance = years >= 1 ? basis * years : 0;
  const severanceStamp = grossSeverance * RATES.stampTax;
  const netSeverance = grossSeverance - severanceStamp;

  const noticeWeeks = noticeWeeksFor(years);
  const grossNotice = (salary / 30) * noticeWeeks * 7;
  const noticeIncomeTax = incomeTaxOn(grossNotice).total;
  const noticeStamp = grossNotice * RATES.stampTax;
  const netNotice = grossNotice - noticeIncomeTax - noticeStamp;

  return {
    ceiling,
    capped: salary > ceiling,
    basis,
    grossSeverance,
    severanceStamp,
    netSeverance,
    noticeWeeks,
    grossNotice,
    noticeIncomeTax,
    noticeStamp,
    netNotice,
    totalNet: netSeverance + netNotice,
  };
}

/* ---------------- Vadeli mevduat ---------------- */

/** Hazır mevduat sayfalarında gösterilen örnek yıllık brüt faiz oranları (%). */
export const DEPOSIT_RATES = [35, 40, 45, 50];
/** Özet cümlede kullanılan oran: hesaplayıcının varsayılanı (%). */
export const DEPOSIT_REFERENCE_RATE = 45;
/** Vade karşılaştırması için gün sayıları. */
export const DEPOSIT_TERMS = [32, 92, 181, 365];

export function depositOf(principal: number, ratePct: number, days: number) {
  const withholding = depositWithholdingRate(days);
  const grossInterest = principal * (ratePct / 100) * (days / 365);
  const tax = grossInterest * withholding;
  const netInterest = grossInterest - tax;
  const total = principal + netInterest;
  return {
    withholding,
    grossInterest,
    tax,
    netInterest,
    total,
    netAnnual: (Math.pow(total / principal, 365 / days) - 1) * 100,
  };
}

/* ---------------- Konut kredisi ---------------- */

/** Hazır konut kredisi sayfalarındaki örnek aylık faiz oranları (%). */
export const HOME_LOAN_RATES = [2.29, 2.49, 2.79, 2.99, 3.29];
/** Hesaplayıcının varsayılan oranı (%). */
export const HOME_LOAN_REFERENCE_RATE = 2.79;
export const HOME_LOAN_TERMS = [60, 120, 180];

export function homeLoanOf(loan: number, ratePct: number, months: number) {
  const r = ratePct / 100;
  const monthly =
    r === 0 ? loan / months : (loan * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalPayment = monthly * months;
  return { rate: ratePct, monthly, totalPayment, totalInterest: totalPayment - loan };
}

/* ---------------- Kredi kartı asgari ödeme ---------------- */

const MAX_CARD_MONTHS = 360;

const cardTierFor = (debt: number) =>
  CREDIT_CARD.tiers.find((t) => debt <= t.upTo) ?? CREDIT_CARD.tiers[CREDIT_CARD.tiers.length - 1];

/** Yalnızca asgari ödeme yapılırsa borcun seyri (araçtaki döngüyle aynı). */
export function creditCardOf(amount: number, minRate: number) {
  const tier = cardTierFor(amount);
  const minimum = amount * minRate;

  let remaining = amount;
  let paid = 0;
  let months = 0;
  let interestTotal = 0;
  const firstMonths: { month: number; payment: number; interest: number; remaining: number }[] = [];

  while (remaining > 1 && months < MAX_CARD_MONTHS) {
    const payment = Math.min(remaining, Math.max(remaining * minRate, 1));
    const afterPayment = remaining - payment;
    const interest = afterPayment * cardTierFor(afterPayment).contractual;
    paid += payment;
    interestTotal += interest;
    remaining = afterPayment + interest;
    months += 1;
    if (months <= 6) firstMonths.push({ month: months, payment, interest, remaining });
    if (months > 3 && remaining >= amount) break;
  }

  return {
    amount,
    minRate,
    minimum,
    contractual: tier.contractual,
    late: tier.late,
    firstInterest: (amount - minimum) * cardTierFor(amount - minimum).contractual,
    months,
    paid,
    interestTotal,
    neverEnds: remaining >= amount || months >= MAX_CARD_MONTHS,
    firstMonths,
  };
}

/* ---------------- Kira artışı ---------------- */

export function rentIncreaseOf(rent: number, ratePct: number = RENT_INCREASE.maxRatePercent) {
  const increase = rent * (ratePct / 100);
  return { rate: ratePct, increase, newRent: rent + increase, yearlyDifference: increase * 12 };
}

/* ---------------- Kira geliri vergisi ---------------- */

/** 12 ay kira, götürü gider, başka gelir yok varsayımıyla. */
export function rentalIncomeTaxOf(monthly: number, type: "mesken" | "isyeri") {
  const rent = monthly * 12;
  const isHome = type === "mesken";
  const exemptionBlocked = rent > RENTAL_INCOME.exemptionIncomeLimit;
  const exemption = isHome && !exemptionBlocked ? Math.min(RENTAL_INCOME.exemption, rent) : 0;
  const afterExemption = rent - exemption;
  const expense = afterExemption * RENTAL_INCOME.lumpSumExpenseRate;
  const base = Math.max(0, afterExemption - expense);
  const tax = incomeTaxOn(base, INCOME_TAX_BRACKETS_NON_WAGE).total;
  const withholding = isHome ? 0 : rent * RENTAL_INCOME.workplaceWithholding;
  const payable = Math.max(0, tax - withholding);
  const mustDeclare = isHome ? rent > exemption : rent > RENTAL_INCOME.workplaceDeclarationLimit;

  return {
    rent,
    exemption,
    expense,
    base,
    tax,
    withholding,
    payable,
    mustDeclare,
    net: rent - (isHome ? tax : withholding + payable),
  };
}

/* ---------------- Tapu harcı ---------------- */

export const DEED_RATE = 0.02;

/** Döner sermaye il ve işleme göre değiştiği için dahil edilmez. */
export function deedFeeOf(price: number) {
  const eachSide = price * DEED_RATE;
  return { eachSide, total: eachSide * 2 };
}

/* ---------------- Yüzde ve indirim ---------------- */

export function percentOf(amount: number, pct: number) {
  const value = (amount * pct) / 100;
  return { value, increased: amount + value, decreased: amount - value };
}

export function discountOf(price: number, pct: number) {
  const discount = (price * pct) / 100;
  return { discount, final: price - discount };
}
