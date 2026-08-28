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

const MINIMUM_WAGE_GROSS = 33030;

const SGK_EMPLOYEE_RATE = 0.14;
const UNEMPLOYMENT_EMPLOYEE_RATE = 0.01;

const STAMP_TAX_RATE = 0.00759;

/**
 * 2026 ücret gelirleri gelir vergisi tarifesi.
 *
 * 190.000 TL'ye kadar                         %15
 * 400.000 TL'nin 190.000 TL'si için ...      %20
 * Ücret gelirlerinde 1.500.000 TL'ye kadar   %27
 * 5.300.000 TL'ye kadar                      %35
 * 5.300.000 TL üzeri                         %40
 */
const TAX_BRACKETS = [
  {
    limit: 190000,
    rate: 0.15,
  },
  {
    limit: 400000,
    rate: 0.20,
  },
  {
    limit: 1500000,
    rate: 0.27,
  },
  {
    limit: 5300000,
    rate: 0.35,
  },
  {
    limit: Infinity,
    rate: 0.40,
  },
] as const;

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
   * Kullanıcının brüt maaşı esas alınır.
   *
   * Tam ay normal çalışan için brütün asgari ücret
   * altında olmaması beklenir. Ancak algoritmayı daha
   * esnek tutmak için burada doğrudan brütü kullanıyoruz.
   */
  const sgkBase = grossSalary;

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