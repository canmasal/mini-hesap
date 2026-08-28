"use client";

import { useMemo, useState } from "react";

const FIRST_HALF_2026_CEILING = 64948.77;
const SECOND_HALF_2026_CEILING = 73729.87;

const STAMP_TAX_RATE = 0.00759;

const LEAVING_REASONS = [
  "İşveren tarafından fesih",
  "İşçinin haklı nedenle feshi",
  "Emeklilik",
  "Askerlik",
  "Kadın işçinin evlilik nedeniyle ayrılması",
  "Diğer",
];

type CalculationResult = {
  startDate: string;
  endDate: string;

  duration: {
    years: number;
    months: number;
    days: number;
  };

  totalDays: number;

  gross: number;

  food: number;
  transport: number;
  other: number;

  regularBenefits: number;
  dressedGross: number;

  ceiling: number;
  severanceBasis: number;

  grossSeverance: number;
  severanceStampTax: number;
  netSeverance: number;

  noticeWeeks: number;
  noticeDays: number;
  dailyGross: number;
  grossNotice: number;

  incomeTax: number;
  noticeStampTax: number;
  netNotice: number;

  totalGross: number;
  totalTax: number;
  totalNet: number;

  previousTax: number;
  leavingReason: string;
};

function parseDate(value: string): Date | null {
  if (!value) {
    return null;
  }

  const parts = value.split("-").map(Number);

  if (parts.length !== 3) {
    return null;
  }

  const [year, month, day] = parts;

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return null;
  }

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatDate(value: string): string {
  const date = parseDate(value);

  if (!date) {
    return "-";
  }

  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getTotalDays(startDate: Date, endDate: Date): number {
  const start = Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );

  const end = Date.UTC(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );

  return Math.floor((end - start) / 86400000) + 1;
}

function calculateDuration(startDate: Date, endDate: Date) {
  let years =
    endDate.getFullYear() -
    startDate.getFullYear();

  let months =
    endDate.getMonth() -
    startDate.getMonth();

  let days =
    endDate.getDate() -
    startDate.getDate();

  if (days < 0) {
    months -= 1;

    const previousMonth = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      0
    );

    days += previousMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years: Math.max(years, 0),
    months: Math.max(months, 0),
    days: Math.max(days, 0),
  };
}

function getNoticeWeeks(totalDays: number): number {
  const totalYears = totalDays / 365;

  if (totalYears < 0.5) {
    return 2;
  }

  if (totalYears < 1.5) {
    return 4;
  }

  if (totalYears < 3) {
    return 6;
  }

  return 8;
}

function getSeveranceCeiling(endDate: Date): number {
  const year = endDate.getFullYear();
  const month = endDate.getMonth() + 1;

  if (year > 2026) {
    return SECOND_HALF_2026_CEILING;
  }

  if (year === 2026 && month >= 7) {
    return SECOND_HALF_2026_CEILING;
  }

  return FIRST_HALF_2026_CEILING;
}

function calculateIncomeTax(taxBase: number): number {
  if (taxBase <= 0) {
    return 0;
  }

  const brackets = [
    { limit: 190000, rate: 0.15 },
    { limit: 400000, rate: 0.2 },
    { limit: 1500000, rate: 0.27 },
    { limit: 5300000, rate: 0.35 },
    { limit: Infinity, rate: 0.4 },
  ];

  let tax = 0;
  let previousLimit = 0;

  for (const bracket of brackets) {
    const taxableAmount =
      Math.min(taxBase, bracket.limit) -
      previousLimit;

    if (taxableAmount > 0) {
      tax += taxableAmount * bracket.rate;
    }

    if (taxBase <= bracket.limit) {
      break;
    }

    previousLimit = bracket.limit;
  }

  return tax;
}

function calculateEverything({
  gross,
  food,
  transport,
  other,
  startDate,
  endDate,
  previousTax,
  leavingReason,
}: {
  gross: number;
  food: number;
  transport: number;
  other: number;
  startDate: string;
  endDate: string;
  previousTax: number;
  leavingReason: string;
}): CalculationResult {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  if (!start || !end) {
    throw new Error(
      "İşe giriş ve işten çıkış tarihlerini girin."
    );
  }

  if (end.getTime() < start.getTime()) {
    throw new Error(
      "İşten çıkış tarihi işe giriş tarihinden önce olamaz."
    );
  }

  if (gross <= 0) {
    throw new Error(
      "Brüt maaş 0'dan büyük olmalıdır."
    );
  }

  if (
    food < 0 ||
    transport < 0 ||
    other < 0 ||
    previousTax < 0
  ) {
    throw new Error(
      "Tutarlar negatif olamaz."
    );
  }

  const totalDays = getTotalDays(
    start,
    end
  );

  const duration = calculateDuration(
    start,
    end
  );

  /*
   * Giydirilmiş brüt ücret
   */
  const regularBenefits =
    food +
    transport +
    other;

  const dressedGross =
    gross +
    regularBenefits;

  /*
   * ============================
   * KIDEM HESABI
   * ============================
   */

  const ceiling =
    getSeveranceCeiling(end);

  const severanceBasis =
    Math.min(
      dressedGross,
      ceiling
    );

  let grossSeverance = 0;

  if (totalDays >= 365) {
    grossSeverance =
      severanceBasis *
      (totalDays / 365);
  }

  const severanceStampTax =
    grossSeverance *
    STAMP_TAX_RATE;

  const netSeverance =
    grossSeverance -
    severanceStampTax;

  /*
   * ============================
   * İHBAR HESABI
   * ============================
   */

  const noticeWeeks =
    getNoticeWeeks(totalDays);

  const noticeDays =
    noticeWeeks * 7;

  const dailyGross =
    dressedGross / 30;

  const grossNotice =
    dailyGross *
    noticeDays;

  /*
   * İhbar tazminatının ücret niteliğinde
   * vergilendirilmesi için temel hesap.
   */

  const previousTaxAmount =
    calculateIncomeTax(
      previousTax
    );

  const newTaxBase =
    previousTax +
    grossNotice;

  const newTaxAmount =
    calculateIncomeTax(
      newTaxBase
    );

  const incomeTax =
    Math.max(
      0,
      newTaxAmount -
        previousTaxAmount
    );

  const noticeStampTax =
    grossNotice *
    STAMP_TAX_RATE;

  const netNotice =
    grossNotice -
    incomeTax -
    noticeStampTax;

  /*
   * ============================
   * GENEL TOPLAM
   * ============================
   */

  const totalGross =
    grossSeverance +
    grossNotice;

  const totalTax =
    severanceStampTax +
    incomeTax +
    noticeStampTax;

  const totalNet =
    netSeverance +
    netNotice;

  return {
    startDate,
    endDate,

    duration,
    totalDays,

    gross,

    food,
    transport,
    other,

    regularBenefits,
    dressedGross,

    ceiling,
    severanceBasis,

    grossSeverance,
    severanceStampTax,
    netSeverance,

    noticeWeeks,
    noticeDays,
    dailyGross,
    grossNotice,

    incomeTax,
    noticeStampTax,
    netNotice,

    totalGross,
    totalTax,
    totalNet,

    previousTax,

    leavingReason,
  };
}

function money(value: number): string {
  return value.toLocaleString(
    "tr-TR",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
}

export default function KidemIhbarCalculator() {
  const [grossSalary, setGrossSalary] =
    useState("");

  const [foodAllowance, setFoodAllowance] =
    useState("");

  const [transportAllowance, setTransportAllowance] =
    useState("");

  const [otherBenefits, setOtherBenefits] =
    useState("");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [previousTaxBase, setPreviousTaxBase] =
    useState("");

  const [leavingReason, setLeavingReason] =
    useState(
      LEAVING_REASONS[0]
    );

  const [result, setResult] =
    useState<CalculationResult | null>(
      null
    );

  const [error, setError] =
    useState("");

  function handleCalculate() {
    setError("");
    setResult(null);

    try {
      const calculation =
        calculateEverything({
          gross: Number(grossSalary),
          food: Number(foodAllowance || 0),
          transport: Number(
            transportAllowance || 0
          ),
          other: Number(
            otherBenefits || 0
          ),
          startDate,
          endDate,
          previousTax: Number(
            previousTaxBase || 0
          ),
          leavingReason,
        });

      setResult(calculation);
    } catch (calculationError) {
      if (
        calculationError instanceof Error
      ) {
        setError(
          calculationError.message
        );
      } else {
        setError(
          "Hesaplama sırasında bir hata oluştu."
        );
      }
    }
  }

  function handleClear() {
    setGrossSalary("");
    setFoodAllowance("");
    setTransportAllowance("");
    setOtherBenefits("");
    setStartDate("");
    setEndDate("");
    setPreviousTaxBase("");
    setLeavingReason(
      LEAVING_REASONS[0]
    );

    setResult(null);
    setError("");
  }

  return (
    <div className="calc-box">

      {/* =========================
          GENEL BİLGİLER
      ========================= */}

      <div className="form-grid">

        <label className="field">
          Son Brüt Maaş

          <input
            type="number"
            min="0"
            step="0.01"
            value={grossSalary}
            onChange={(event) => {
              setGrossSalary(
                event.target.value
              );
              setResult(null);
            }}
            placeholder="76000"
          />
        </label>

        <label className="field">
          İşe Giriş Tarihi

          <input
            type="date"
            value={startDate}
            onChange={(event) => {
              setStartDate(
                event.target.value
              );
              setResult(null);
            }}
          />
        </label>

        <label className="field">
          İşten Çıkış Tarihi

          <input
            type="date"
            value={endDate}
            onChange={(event) => {
              setEndDate(
                event.target.value
              );
              setResult(null);
            }}
          />
        </label>

        <label className="field">
          İşten Ayrılma Nedeni

          <select
            value={leavingReason}
            onChange={(event) => {
              setLeavingReason(
                event.target.value
              );
              setResult(null);
            }}
          >
            {LEAVING_REASONS.map(
              (reason) => (
                <option
                  key={reason}
                  value={reason}
                >
                  {reason}
                </option>
              )
            )}
          </select>
        </label>

      </div>

      {/* =========================
          GİYDİRİLMİŞ ÜCRET
      ========================= */}

      <div
        style={{
          marginTop: 20,
          padding: 18,
          borderRadius: 18,
          background: "#f8faf9",
          border:
            "1px solid #e5eee8",
        }}
      >
        <strong>
          Giydirilmiş Brüt Ücret
        </strong>

        <p
          style={{
            margin:
              "7px 0 15px",
            color: "#617066",
            fontSize: 13,
          }}
        >
          Düzenli yan haklarınızı girerek
          daha ayrıntılı bir hesaplama
          yapabilirsiniz.
        </p>

        <div className="form-grid">

          <label className="field">
            Aylık Yemek Yardımı

            <input
              type="number"
              min="0"
              step="0.01"
              value={foodAllowance}
              onChange={(event) => {
                setFoodAllowance(
                  event.target.value
                );
                setResult(null);
              }}
              placeholder="0"
            />
          </label>

          <label className="field">
            Aylık Yol / Servis Yardımı

            <input
              type="number"
              min="0"
              step="0.01"
              value={transportAllowance}
              onChange={(event) => {
                setTransportAllowance(
                  event.target.value
                );
                setResult(null);
              }}
              placeholder="0"
            />
          </label>

          <label className="field">
            Diğer Düzenli Yan Haklar

            <input
              type="number"
              min="0"
              step="0.01"
              value={otherBenefits}
              onChange={(event) => {
                setOtherBenefits(
                  event.target.value
                );
                setResult(null);
              }}
              placeholder="0"
            />
          </label>

          <label className="field">
            Önceki Kümülatif Vergi Matrahı

            <input
              type="number"
              min="0"
              step="0.01"
              value={previousTaxBase}
              onChange={(event) => {
                setPreviousTaxBase(
                  event.target.value
                );
                setResult(null);
              }}
              placeholder="0"
            />
          </label>

        </div>
      </div>

      {/* =========================
          HATA
      ========================= */}

      {error && (
        <div
          style={{
            marginTop: 18,
            padding: 16,
            borderRadius: 16,
            background: "#fef2f2",
            border:
              "1px solid #fecaca",
            color: "#b91c1c",
            fontWeight: 700,
            lineHeight: 1.6,
          }}
        >
          {error}
        </div>
      )}

      {/* =========================
          BUTONLAR
      ========================= */}

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginTop: 20,
        }}
      >

        <button
          type="button"
          className="btn btn-green"
          style={{
            flex: 1,
            minWidth: 230,
            borderRadius: 14,
          }}
          onClick={
            handleCalculate
          }
        >
          Kıdem + İhbar Hesapla
        </button>

        <button
          type="button"
          className="btn btn-outline"
          style={{
            borderRadius: 14,
          }}
          onClick={handleClear}
        >
          Temizle
        </button>

      </div>

      {/* =========================
          SONUÇ
      ========================= */}

      {result && (
        <div
          style={{
            marginTop: 28,
          }}
        >

          {/* ANA TOPLAM */}

          <div
            className="result"
            style={{
              marginTop: 0,
            }}
          >
            <div className="result-label">
              TOPLAM NET KIDEM + İHBAR
            </div>

            <div
              className="result-value"
              style={{
                fontSize: 42,
              }}
            >
              {money(
                result.totalNet
              )}{" "}
              ₺
            </div>
          </div>

          {/* GENEL BİLGİ */}

          <SectionTitle
            title="📅 Çalışma Bilgileri"
          />

          <div
            style={{
              display: "grid",
              gap: 10,
            }}
          >
            <ResultRow
              label="İşe Giriş Tarihi"
              value={formatDate(
                result.startDate
              )}
            />

            <ResultRow
              label="İşten Çıkış Tarihi"
              value={formatDate(
                result.endDate
              )}
            />

            <ResultRow
              label="Çalışma Süresi"
              value={`${result.duration.years} yıl ${result.duration.months} ay ${result.duration.days} gün`}
              highlight
            />

            <ResultRow
              label="Toplam Hizmet Günü"
              value={`${result.totalDays} gün`}
            />

            <ResultRow
              label="Ayrılma Nedeni"
              value={result.leavingReason}
            />
          </div>

          {/* KIDEM */}

          <SectionTitle
            title="💼 Kıdem Tazminatı"
          />

          <div
            style={{
              display: "grid",
              gap: 10,
            }}
          >
            <ResultRow
              label="Son Brüt Maaş"
              value={`${money(
                result.gross
              )} ₺`}
            />

            <ResultRow
              label="Yemek Yardımı"
              value={`${money(
                result.food
              )} ₺`}
            />

            <ResultRow
              label="Yol / Servis Yardımı"
              value={`${money(
                result.transport
              )} ₺`}
            />

            <ResultRow
              label="Diğer Düzenli Yan Haklar"
              value={`${money(
                result.other
              )} ₺`}
            />

            <ResultRow
              label="Toplam Yan Haklar"
              value={`${money(
                result.regularBenefits
              )} ₺`}
            />

            <ResultRow
              label="Giydirilmiş Brüt Ücret"
              value={`${money(
                result.dressedGross
              )} ₺`}
              highlight
            />

            <ResultRow
              label="2026 Kıdem Tazminatı Tavanı"
              value={`${money(
                result.ceiling
              )} ₺`}
            />

            <ResultRow
              label="Kıdeme Esas Ücret"
              value={`${money(
                result.severanceBasis
              )} ₺`}
              highlight
            />

            <ResultRow
              label="Brüt Kıdem Tazminatı"
              value={`${money(
                result.grossSeverance
              )} ₺`}
            />

            <ResultRow
              label="Kıdem Damga Vergisi"
              value={`- ${money(
                result.severanceStampTax
              )} ₺`}
            />

            <ResultRow
              label="NET KIDEM TAZMİNATI"
              value={`${money(
                result.netSeverance
              )} ₺`}
              highlight
            />
          </div>

          {/* İHBAR */}

          <SectionTitle
            title="📋 İhbar Tazminatı"
          />

          <div
            style={{
              display: "grid",
              gap: 10,
            }}
          >
            <ResultRow
              label="Kanuni İhbar Süresi"
              value={`${result.noticeWeeks} hafta / ${result.noticeDays} gün`}
              highlight
            />

            <ResultRow
              label="Günlük Brüt Ücret"
              value={`${money(
                result.dailyGross
              )} ₺`}
            />

            <ResultRow
              label="Brüt İhbar Tazminatı"
              value={`${money(
                result.grossNotice
              )} ₺`}
            />

            <ResultRow
              label="İhbar Gelir Vergisi"
              value={`- ${money(
                result.incomeTax
              )} ₺`}
            />

            <ResultRow
              label="İhbar Damga Vergisi"
              value={`- ${money(
                result.noticeStampTax
              )} ₺`}
            />

            <ResultRow
              label="NET İHBAR TAZMİNATI"
              value={`${money(
                result.netNotice
              )} ₺`}
              highlight
            />
          </div>

          {/* GENEL TOPLAM */}

          <SectionTitle
            title="📊 Genel Toplam"
          />

          <div
            style={{
              display: "grid",
              gap: 10,
            }}
          >
            <ResultRow
              label="Toplam Brüt Tazminat"
              value={`${money(
                result.totalGross
              )} ₺`}
            />

            <ResultRow
              label="Toplam Vergi / Kesinti"
              value={`- ${money(
                result.totalTax
              )} ₺`}
            />

            <ResultRow
              label="TOPLAM NET TAZMİNAT"
              value={`${money(
                result.totalNet
              )} ₺`}
              highlight
            />
          </div>

          {/* UYARI */}

          <div
            style={{
              marginTop: 22,
              padding: 17,
              borderRadius: 16,
              background: "#fff7ed",
              border:
                "1px solid #fed7aa",
              color: "#9a3412",
              fontSize: 13,
              lineHeight: 1.7,
            }}
          >
            ⚠️ Bu araç bilgilendirme ve
            tahmini hesaplama amacıyla
            hazırlanmıştır. Kıdem hakkının
            doğup doğmadığı, ihbar hakkı,
            sözleşme hükümleri, yan hakların
            niteliği ve özel bordro koşulları
            ayrıca değerlendirilmelidir.
          </div>

        </div>
      )}

    </div>
  );
}

function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <div
      style={{
        marginTop: 32,
        marginBottom: 14,
        paddingBottom: 10,
        borderBottom:
          "2px solid #e5eee8",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: 24,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function ResultRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        alignItems: "center",
        gap: 20,
        padding: "15px 17px",
        borderRadius: 15,
        background: highlight
          ? "#f0fdf4"
          : "#f8faf9",
        border: highlight
          ? "1px solid #bbf7d0"
          : "1px solid #e5eee8",
      }}
    >
      <span
        style={{
          color: "#617066",
          fontSize: 14,
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color: highlight
            ? "#15803d"
            : "#10231a",
          fontSize: 16,
          textAlign: "right",
        }}
      >
        {value}
      </strong>
    </div>
  );
}