"use client";

import { useMemo, useState } from "react";

const STAMP_TAX_RATE = 0.00759;

const TAX_BRACKETS = [
  { limit: 190000, rate: 0.15 },
  { limit: 400000, rate: 0.20 },
  { limit: 1500000, rate: 0.27 },
  { limit: 5300000, rate: 0.35 },
  { limit: Infinity, rate: 0.40 },
];

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

function totalDaysBetween(
  startDate: Date,
  endDate: Date
): number {
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

  return Math.floor(
    (end - start) / 86400000
  ) + 1;
}

function calculateDuration(
  startDate: Date,
  endDate: Date
) {
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

    const previousMonth =
      new Date(
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
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
  };
}

function getNoticeWeeks(
  totalDays: number
): number {
  const totalYears =
    totalDays / 365;

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

/**
 * 2026 ücret gelirleri için kümülatif
 * gelir vergisi hesabı.
 */
function calculateIncomeTax(
  taxableIncome: number
): number {
  if (taxableIncome <= 0) {
    return 0;
  }

  let tax = 0;
  let previousLimit = 0;

  for (const bracket of TAX_BRACKETS) {
    const amount =
      Math.min(
        taxableIncome,
        bracket.limit
      ) - previousLimit;

    if (amount > 0) {
      tax +=
        amount * bracket.rate;
    }

    if (
      taxableIncome <=
      bracket.limit
    ) {
      break;
    }

    previousLimit =
      bracket.limit;
  }

  return tax;
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

function formatDate(
  value: string
): string {
  const date = parseDate(value);

  if (!date) {
    return "-";
  }

  return date.toLocaleDateString(
    "tr-TR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
}

export default function NoticeCalculator() {
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

  const [calculated, setCalculated] =
    useState(false);

  const [error, setError] =
    useState("");

  const result = useMemo(() => {
    if (!calculated) {
      return null;
    }

    const gross =
      Number(grossSalary);

    const food =
      Number(foodAllowance || 0);

    const transport =
      Number(transportAllowance || 0);

    const other =
      Number(otherBenefits || 0);

    const previous =
      Number(previousTaxBase || 0);

    const start =
      parseDate(startDate);

    const end =
      parseDate(endDate);

    if (
      !Number.isFinite(gross) ||
      gross <= 0
    ) {
      return null;
    }

    if (!start || !end) {
      return null;
    }

    if (
      end.getTime() <
      start.getTime()
    ) {
      return null;
    }

    if (
      food < 0 ||
      transport < 0 ||
      other < 0 ||
      previous < 0
    ) {
      return null;
    }

    const totalDays =
      totalDaysBetween(
        start,
        end
      );

    const duration =
      calculateDuration(
        start,
        end
      );

    const noticeWeeks =
      getNoticeWeeks(
        totalDays
      );

    const noticeDays =
      noticeWeeks * 7;

    /*
     * İhbar hesabında ücret ve düzenli
     * para/para ile ölçülebilen menfaatler
     * dikkate alınabilir.
     */
    const regularBenefits =
      food +
      transport +
      other;

    const dressedMonthlyGross =
      gross +
      regularBenefits;

    const dailyGross =
      dressedMonthlyGross / 30;

    const grossNotice =
      dailyGross *
      noticeDays;

    /*
     * İhbar tazminatı ücret niteliğinde
     * olduğundan gelir vergisi ve damga
     * vergisi ayrıca gösterilir.
     *
     * Burada önceki kümülatif matrah
     * kullanıcı tarafından girilir.
     */
    const noticeTaxableBase =
      Math.max(
        0,
        previous +
          grossNotice
      );

    const previousTax =
      calculateIncomeTax(
        previous
      );

    const afterNoticeTax =
      calculateIncomeTax(
        noticeTaxableBase
      );

    const calculatedIncomeTax =
      Math.max(
        0,
        afterNoticeTax -
          previousTax
      );

    const stampTax =
      grossNotice *
      STAMP_TAX_RATE;

    const netNotice =
      grossNotice -
      calculatedIncomeTax -
      stampTax;

    return {
      grossSalary: gross,
      foodAllowance: food,
      transportAllowance: transport,
      otherBenefits: other,

      regularBenefits,

      dressedMonthlyGross,

      startDate,
      endDate,

      totalDays,
      duration,

      noticeWeeks,
      noticeDays,

      dailyGross,

      grossNotice,

      previousTaxBase: previous,

      noticeTaxableBase,

      calculatedIncomeTax,

      stampTax,

      netNotice,
    };
  }, [
    calculated,
    grossSalary,
    foodAllowance,
    transportAllowance,
    otherBenefits,
    startDate,
    endDate,
    previousTaxBase,
  ]);

  function handleCalculate() {
    setError("");
    setCalculated(true);
  }

  function handleClear() {
    setGrossSalary("");
    setFoodAllowance("");
    setTransportAllowance("");
    setOtherBenefits("");
    setStartDate("");
    setEndDate("");
    setPreviousTaxBase("");
    setCalculated(false);
    setError("");
  }

  /*
   * Form alanları doldurulmamışsa
   * kullanıcıya anlaşılır hata gösteriyoruz.
   */
  const showError =
    calculated && !result;

  return (
    <div className="calc-box">

      {/* =====================
          ÜCRET BİLGİLERİ
      ====================== */}

      <div className="form-grid">

        <label className="field">
          İşten Çıkış Tarihindeki Brüt Ücret

          <input
            type="number"
            min="0"
            step="0.01"
            value={grossSalary}
            onChange={(event) => {
              setGrossSalary(
                event.target.value
              );
              setCalculated(false);
            }}
            placeholder="76000"
          />
        </label>

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
              setCalculated(false);
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
              setCalculated(false);
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
              setCalculated(false);
            }}
            placeholder="0"
          />
        </label>

      </div>

      {/* =====================
          TARİHLER
      ====================== */}

      <div
        className="form-grid"
        style={{
          marginTop: 18,
        }}
      >

        <label className="field">
          İşe Giriş Tarihi

          <input
            type="date"
            value={startDate}
            onChange={(event) => {
              setStartDate(
                event.target.value
              );
              setCalculated(false);
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
              setCalculated(false);
            }}
          />
        </label>

      </div>

      {/* =====================
          VERGİ
      ====================== */}

      <label
        className="field"
        style={{
          marginTop: 18,
        }}
      >
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
            setCalculated(false);
          }}
          placeholder="0"
        />
      </label>

      {/* =====================
          BİLGİ
      ====================== */}

      <div
        style={{
          marginTop: 18,
          padding: 17,
          borderRadius: 16,
          background: "#f8faf9",
          border:
            "1px solid #e5eee8",
          color: "#617066",
          fontSize: 14,
          lineHeight: 1.7,
        }}
      >
        <strong>
          İhbar süresi otomatik belirlenir
        </strong>

        <p
          style={{
            margin: "7px 0 0",
          }}
        >
          Hizmet sürenize göre kanuni ihbar
          süresi sistem tarafından belirlenir:
          2 hafta, 4 hafta, 6 hafta veya 8 hafta.
        </p>

        <p
          style={{
            margin: "7px 0 0",
          }}
        >
          Düzenli yemek, yol/servis ve diğer
          para veya para ile ölçülebilen
          menfaatlerinizi ayrıca girebilirsiniz.
        </p>
      </div>

      {/* =====================
          HATA
      ====================== */}

      {showError && (
        <div
          style={{
            marginTop: 18,
            padding: 15,
            borderRadius: 14,
            background: "#fef2f2",
            border:
              "1px solid #fecaca",
            color: "#b91c1c",
            fontWeight: 700,
            lineHeight: 1.6,
          }}
        >
          Lütfen brüt ücreti, işe giriş ve
          işten çıkış tarihlerini doğru şekilde
          girin.
        </div>
      )}

      {/* =====================
          BUTONLAR
      ====================== */}

      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 20,
          flexWrap: "wrap",
        }}
      >

        <button
          type="button"
          className="btn btn-green"
          style={{
            flex: 1,
            minWidth: 220,
            borderRadius: 14,
          }}
          onClick={
            handleCalculate
          }
        >
          İhbarımı Hesapla
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

      {/* =====================
          SONUÇ
      ====================== */}

      {result && (
        <>

          {/* ANA SONUÇ */}

          <div
            className="result"
            style={{
              marginTop: 25,
            }}
          >

            <div className="result-label">
              NET İHBAR TAZMİNATI
            </div>

            <div
              className="result-value"
              style={{
                fontSize: 40,
              }}
            >
              {money(
                result.netNotice
              )}{" "}
              ₺
            </div>

          </div>

          {/* DETAYLAR */}

          <div
            style={{
              marginTop: 22,
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
              label="Kanuni İhbar Süresi"
              value={`${result.noticeWeeks} hafta / ${result.noticeDays} gün`}
              highlight
            />

            <ResultRow
              label="Brüt Ücret"
              value={`${money(
                result.grossSalary
              )} ₺`}
            />

            <ResultRow
              label="Yemek Yardımı"
              value={`${money(
                result.foodAllowance
              )} ₺`}
            />

            <ResultRow
              label="Yol / Servis Yardımı"
              value={`${money(
                result.transportAllowance
              )} ₺`}
            />

            <ResultRow
              label="Diğer Düzenli Yan Haklar"
              value={`${money(
                result.otherBenefits
              )} ₺`}
            />

            <ResultRow
              label="Toplam Düzenli Yan Haklar"
              value={`${money(
                result.regularBenefits
              )} ₺`}
            />

            <ResultRow
              label="Giydirilmiş Aylık Brüt"
              value={`${money(
                result.dressedMonthlyGross
              )} ₺`}
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
              highlight
            />

            <ResultRow
              label="Gelir Vergisi"
              value={`- ${money(
                result.calculatedIncomeTax
              )} ₺`}
            />

            <ResultRow
              label="Damga Vergisi (%0,759)"
              value={`- ${money(
                result.stampTax
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

          {/* HESAPLAMA BİLGİSİ */}

          <div
            style={{
              marginTop: 22,
              padding: 17,
              borderRadius: 16,
              background: "#f8faf9",
              border:
                "1px solid #e5eee8",
              color: "#617066",
              fontSize: 13,
              lineHeight: 1.7,
            }}
          >
            <strong>
              Hesaplama özeti
            </strong>

            <p
              style={{
                margin: "7px 0 0",
              }}
            >
              İhbar süresi hizmet süresine göre
              belirlenir. Brüt ihbar tazminatı,
              giydirilmiş aylık brüt ücretin
              günlük karşılığı üzerinden ilgili
              bildirim süresi ile hesaplanır.
            </p>

            <p
              style={{
                margin: "7px 0 0",
              }}
            >
              İhbar tazminatı ücret niteliğinde
              değerlendirildiği için gelir vergisi
              ve damga vergisi kalemleri ayrıca
              gösterilmektedir.
            </p>
          </div>

          {/* UYARI */}

          <div
            style={{
              marginTop: 18,
              padding: 16,
              borderRadius: 16,
              background: "#fff7ed",
              border:
                "1px solid #fed7aa",
              color: "#9a3412",
              fontSize: 13,
              lineHeight: 1.7,
            }}
          >
            ⚠️ Bu araç bilgilendirme ve tahmini
            hesaplama amaçlıdır. İş sözleşmesinin
            türü, fesih nedeni, sözleşmede artırılmış
            ihbar süresi bulunması, vergi matrahı ve
            özel bordro koşulları sonucu değiştirebilir.
          </div>

        </>
      )}

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
        justifyContent: "space-between",
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