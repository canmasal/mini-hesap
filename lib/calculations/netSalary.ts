export type NetSalaryInput = {
  grossSalary: number;
  month: number;
  previousCumulativeTaxBase: number;
};

export type NetSalaryResult = {
  grossSalary: number;
  month: number;

  sgkBase: number;
  sgkEmployee: number;
  unemploymentEmployee: number;

  incomeTaxBase: number;
  cumulativeTaxBase: number;

  incomeTaxBeforeExemption: number;
  minimumWageIncomeTaxExemption: number;
  incomeTax: number;

  stampTaxBeforeExemption: number;
  minimumWageStampTaxExemption: number;
  stampTax: number;

  netSalary: number;
};

import {
  INCOME_TAX_BRACKETS_WAGE,
  MINIMUM_WAGE,
  RATES,
  SGK_LIMITS,
} from "@/data/parameters";

/* Tüm yıllık rakamlar data/parameters.ts dosyasından gelir. */
const MINIMUM_WAGE_GROSS = MINIMUM_WAGE.gross;

const SGK_EMPLOYEE_RATE = RATES.sgkEmployee;
const UNEMPLOYMENT_EMPLOYEE_RATE = RATES.unemploymentEmployee;

const STAMP_TAX_RATE = RATES.stampTax;

/** Ücret gelirleri gelir vergisi tarifesi (190 bin %15 … 5,3 milyon üzeri %40) */
const TAX_BRACKETS = INCOME_TAX_BRACKETS_WAGE;

const MINIMUM_WAGE_INCOME_TAX_BASE =
  MINIMUM_WAGE_GROSS -
  MINIMUM_WAGE_GROSS * SGK_EMPLOYEE_RATE -
  MINIMUM_WAGE_GROSS * UNEMPLOYMENT_EMPLOYEE_RATE;

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Kümülatif gelir vergisini hesaplar.
 */
function calculateCumulativeIncomeTax(
  taxBase: number
): number {
  if (taxBase <= 0) {
    return 0;
  }

  let tax = 0;
  let previousLimit = 0;

  for (const bracket of TAX_BRACKETS) {
    const amountInBracket =
      Math.min(taxBase, bracket.limit) - previousLimit;

    if (amountInBracket > 0) {
      tax += amountInBracket * bracket.rate;
    }

    if (taxBase <= bracket.limit) {
      break;
    }

    previousLimit = bracket.limit;
  }

  return tax;
}

/**
 * Belirli aya kadar asgari ücretin kümülatif
 * gelir vergisi matrahını hesaplar.
 */
function calculateMinimumWageCumulativeTaxBase(
  month: number
): number {
  return MINIMUM_WAGE_INCOME_TAX_BASE * month;
}

export function calculateNetSalary(
  input: NetSalaryInput
): NetSalaryResult {
  const grossSalary = Math.max(0, input.grossSalary);

  const month = Math.min(
    12,
    Math.max(1, Math.trunc(input.month))
  );

  const previousCumulativeTaxBase = Math.max(
    0,
    input.previousCumulativeTaxBase
  );

  /**
   * Prime esas kazanç:
   * Brüt maaş esas alınır, ancak SGK tavanını aşan kısım
   * için prim kesilmez (2026'da asgari ücretin 9 katı).
   */
  const sgkBase = Math.min(grossSalary, SGK_LIMITS.monthlyCeiling);

  const sgkEmployee =
    sgkBase * SGK_EMPLOYEE_RATE;

  const unemploymentEmployee =
    sgkBase * UNEMPLOYMENT_EMPLOYEE_RATE;

  /**
   * Gelir vergisi matrahı.
   */
  const incomeTaxBase = Math.max(
    0,
    grossSalary -
      sgkEmployee -
      unemploymentEmployee
  );

  const cumulativeTaxBase =
    previousCumulativeTaxBase +
    incomeTaxBase;

  /**
   * İçinde bulunulan aya kadar toplam gelir vergisi.
   */
  const currentCumulativeIncomeTax =
    calculateCumulativeIncomeTax(
      cumulativeTaxBase
    );

  /**
   * Önceki aya kadar hesaplanmış vergi.
   */
  const previousCumulativeIncomeTax =
    calculateCumulativeIncomeTax(
      previousCumulativeTaxBase
    );

  /**
   * Bu aya ait gelir vergisi,
   * kümülatif vergi farkıdır.
   */
  const incomeTaxBeforeExemption = Math.max(
    0,
    currentCumulativeIncomeTax -
      previousCumulativeIncomeTax
  );

  /**
   * Asgari ücretin kümülatif matrahı.
   *
   * Örneğin:
   * Ocak    -> 1 x asgari ücret matrahı
   * Şubat   -> 2 x
   * Mart    -> 3 x
   * ...
   */
  const previousMinimumWageTaxBase =
    calculateMinimumWageCumulativeTaxBase(
      month - 1
    );

  const currentMinimumWageTaxBase =
    calculateMinimumWageCumulativeTaxBase(
      month
    );

  /**
   * Asgari ücretin kümülatif vergi karşılığı.
   */
  const previousMinimumWageTax =
    calculateCumulativeIncomeTax(
      previousMinimumWageTaxBase
    );

  const currentMinimumWageTax =
    calculateCumulativeIncomeTax(
      currentMinimumWageTaxBase
    );

  /**
   * Bu ay asgari ücrete isabet eden vergi.
   */
  const monthlyMinimumWageTax =
    Math.max(
      0,
      currentMinimumWageTax -
        previousMinimumWageTax
    );

  /**
   * İstisna, o ay hesaplanan gelir vergisini
   * aşamaz.
   */
  const minimumWageIncomeTaxExemption =
    Math.min(
      incomeTaxBeforeExemption,
      monthlyMinimumWageTax
    );

  const incomeTax = Math.max(
    0,
    incomeTaxBeforeExemption -
      minimumWageIncomeTaxExemption
  );

  /**
   * Damga vergisi.
   *
   * Brüt asgari ücrete isabet eden bölüm
   * istisna edilir.
   */
  const stampTaxBeforeExemption =
    grossSalary * STAMP_TAX_RATE;

  const minimumWageStampTaxExemption =
    Math.min(
      stampTaxBeforeExemption,
      MINIMUM_WAGE_GROSS * STAMP_TAX_RATE
    );

  const stampTax = Math.max(
    0,
    stampTaxBeforeExemption -
      minimumWageStampTaxExemption
  );

  /**
   * Sonuç.
   */
  const netSalary =
    grossSalary -
    sgkEmployee -
    unemploymentEmployee -
    incomeTax -
    stampTax;

  return {
    grossSalary: roundMoney(grossSalary),
    month,

    sgkBase: roundMoney(sgkBase),
    sgkEmployee: roundMoney(sgkEmployee),
    unemploymentEmployee: roundMoney(
      unemploymentEmployee
    ),

    incomeTaxBase: roundMoney(
      incomeTaxBase
    ),

    cumulativeTaxBase: roundMoney(
      cumulativeTaxBase
    ),

    incomeTaxBeforeExemption: roundMoney(
      incomeTaxBeforeExemption
    ),

    minimumWageIncomeTaxExemption:
      roundMoney(
        minimumWageIncomeTaxExemption
      ),

    incomeTax: roundMoney(incomeTax),

    stampTaxBeforeExemption: roundMoney(
      stampTaxBeforeExemption
    ),

    minimumWageStampTaxExemption:
      roundMoney(
        minimumWageStampTaxExemption
      ),

    stampTax: roundMoney(stampTax),

    netSalary: roundMoney(netSalary),
  };
}