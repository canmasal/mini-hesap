"use client";

import { useState } from "react";

type LeaveResult = {
  years: number;
  months: number;
  days: number;
  totalCompletedYears: number;
  eligible: boolean;
  annualLeaveDays: number;
  usedLeaveDays: number;
  remainingLeaveDays: number;
  nextEntitlementDate: Date | null;
  daysUntilNextEntitlement: number;
};

function parseDate(value: string): Date | null {
  if (!value) return null;

  const [year, month, day] = value
    .split("-")
    .map(Number);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return null;
  }

  const date = new Date(
    year,
    month - 1,
    day
  );

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function startOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function differenceInDays(
  start: Date,
  end: Date
): number {
  const startUtc = Date.UTC(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );

  const endUtc = Date.UTC(
    end.getFullYear(),
    end.getMonth(),
    end.getDate()
  );

  return Math.floor(
    (endUtc - startUtc) / 86400000
  );
}

function calculateServiceDuration(
  start: Date,
  end: Date
) {
  let years =
    end.getFullYear() -
    start.getFullYear();

  let months =
    end.getMonth() -
    start.getMonth();

  let days =
    end.getDate() -
    start.getDate();

  if (days < 0) {
    months -= 1;

    const previousMonthDays =
      new Date(
        end.getFullYear(),
        end.getMonth(),
        0
      ).getDate();

    days += previousMonthDays;
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

function calculateAge(
  birthDate: Date,
  date: Date
): number {
  let age =
    date.getFullYear() -
    birthDate.getFullYear();

  const birthdayNotReached =
    date.getMonth() <
      birthDate.getMonth() ||
    (
      date.getMonth() ===
        birthDate.getMonth() &&
      date.getDate() <
        birthDate.getDate()
    );

  if (birthdayNotReached) {
    age -= 1;
  }

  return Math.max(0, age);
}

function getAnnualLeaveDays(
  completedYears: number,
  age: number
): number {
  /*
   * 4857 sayılı İş Kanunu temel süreleri:
   *
   * 1 - 5 yıl       : 14 gün
   * 6 - 14 yıl      : 20 gün
   * 15 yıl ve üzeri : 26 gün
   *
   * 18 yaş ve altı ile
   * 50 yaş ve üzeri:
   * en az 20 gün.
   */

  if (age <= 18 || age >= 50) {
    return Math.max(
      20,
      completedYears <= 5
        ? 14
        : completedYears < 15
          ? 20
          : 26
    );
  }

  if (completedYears <= 5) {
    return 14;
  }

  if (completedYears < 15) {
    return 20;
  }

  return 26;
}

function calculateLeave(
  startDate: Date,
  calculationDate: Date,
  birthDate: Date,
  usedLeaveDays: number
): LeaveResult {
  const service =
    calculateServiceDuration(
      startDate,
      calculationDate
    );

  const totalCompletedYears =
    service.years;

  const eligible =
    totalCompletedYears >= 1;

  const age = calculateAge(
    birthDate,
    calculationDate
  );

  /*
   * Yıllık ücretli izne hak kazanmak
   * için en az 1 tam yıl gerekir.
   */
  const annualLeaveDays = eligible
    ? getAnnualLeaveDays(
        totalCompletedYears,
        age
      )
    : 0;

  const used =
    Math.max(
      0,
      Math.min(
        usedLeaveDays,
        annualLeaveDays
      )
    );

  const remaining =
    Math.max(
      0,
      annualLeaveDays - used
    );

  let nextEntitlementDate:
    Date | null = null;

  let daysUntilNextEntitlement = 0;

  if (!eligible) {
    nextEntitlementDate =
      new Date(
        startDate.getFullYear() + 1,
        startDate.getMonth(),
        startDate.getDate()
      );

    daysUntilNextEntitlement =
      Math.max(
        0,
        differenceInDays(
          calculationDate,
          nextEntitlementDate
        )
      );
  } else {
    nextEntitlementDate =
      new Date(
        startDate.getFullYear() +
          totalCompletedYears +
          1,
        startDate.getMonth(),
        startDate.getDate()
      );

    daysUntilNextEntitlement =
      Math.max(
        0,
        differenceInDays(
          calculationDate,
          nextEntitlementDate
        )
      );
  }

  return {
    years: service.years,
    months: service.months,
    days: service.days,
    totalCompletedYears,
    eligible,
    annualLeaveDays,
    usedLeaveDays: used,
    remainingLeaveDays: remaining,
    nextEntitlementDate,
    daysUntilNextEntitlement,
  };
}

function formatDate(
  date: Date | null
): string {
  if (!date) return "-";

  return date.toLocaleDateString(
    "tr-TR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
}

export default function AnnualLeaveCalculator() {
  const today = startOfDay(
    new Date()
  );

  const defaultDate =
    `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`;

  const [startDate, setStartDate] =
    useState("");

  const [
    calculationDate,
    setCalculationDate,
  ] = useState(defaultDate);

  const [birthDate, setBirthDate] =
    useState("");

  const [usedLeaveDays, setUsedLeaveDays] =
    useState("0");

  const [result, setResult] =
    useState<LeaveResult | null>(null);

  const [error, setError] =
    useState("");

  function handleCalculate() {
    setError("");
    setResult(null);

    const start =
      parseDate(startDate);

    const calculation =
      parseDate(calculationDate);

    const birth =
      parseDate(birthDate);

    const used = Number(
      usedLeaveDays || 0
    );

    if (!start) {
      setError(
        "Lütfen işe giriş tarihinizi girin."
      );
      return;
    }

    if (!calculation) {
      setError(
        "Lütfen geçerli bir hesaplama tarihi girin."
      );
      return;
    }

    if (!birth) {
      setError(
        "Lütfen doğum tarihinizi girin."
      );
      return;
    }

    if (
      start.getTime() >
      calculation.getTime()
    ) {
      setError(
        "İşe giriş tarihi hesaplama tarihinden sonra olamaz."
      );
      return;
    }

    if (
      birth.getTime() >
      calculation.getTime()
    ) {
      setError(
        "Doğum tarihi hesaplama tarihinden sonra olamaz."
      );
      return;
    }

    if (
      !Number.isFinite(used) ||
      used < 0
    ) {
      setError(
        "Kullanılan izin günü 0 veya daha büyük olmalıdır."
      );
      return;
    }

    const calculated =
      calculateLeave(
        start,
        calculation,
        birth,
        used
      );

    setResult(calculated);
  }

  function handleClear() {
    setStartDate("");
    setBirthDate("");
    setCalculationDate(
      defaultDate
    );
    setUsedLeaveDays("0");
    setResult(null);
    setError("");
  }

  return (
    <div className="calc-box">

      {/* FORM */}

      <div className="form-grid">

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
              setError("");
            }}
          />
        </label>

        <label className="field">
          Hesaplama Tarihi

          <input
            type="date"
            value={calculationDate}
            onChange={(event) => {
              setCalculationDate(
                event.target.value
              );
              setResult(null);
              setError("");
            }}
          />
        </label>

        <label className="field">
          Doğum Tarihi

          <input
            type="date"
            value={birthDate}
            onChange={(event) => {
              setBirthDate(
                event.target.value
              );
              setResult(null);
              setError("");
            }}
          />
        </label>

        <label className="field">
          Bu Dönem Kullanılan İzin
          
          <input
            type="number"
            min="0"
            step="1"
            value={usedLeaveDays}
            onChange={(event) => {
              setUsedLeaveDays(
                event.target.value
              );
              setResult(null);
              setError("");
            }}
            placeholder="0"
          />
        </label>

      </div>

      {/* BİLGİ */}

      <div
        style={{
          marginTop: 18,
          padding: 16,
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
          Yıllık izin nasıl belirlenir?
        </strong>

        <p
          style={{
            margin:
              "7px 0 0",
          }}
        >
          Aynı işverene bağlı en az
          bir yıllık çalışma sonrasında
          yıllık ücretli izin hakkı doğar.
          Hizmet süresine ve yaşa göre
          temel izin süresi hesaplanır.
        </p>
      </div>

      {/* HATA */}

      {error && (
        <div
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 14,
            background: "#fef2f2",
            border:
              "1px solid #fecaca",
            color: "#b91c1c",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      {/* BUTONLAR */}

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
            minWidth: 220,
            borderRadius: 14,
          }}
          onClick={
            handleCalculate
          }
        >
          Yıllık İzinimi Hesapla
        </button>

        <button
          type="button"
          className="btn btn-outline"
          style={{
            borderRadius: 14,
          }}
          onClick={
            handleClear
          }
        >
          Temizle
        </button>
      </div>

      {/* SONUÇ */}

      {result && (
        <>
          <div
            className="result"
            style={{
              marginTop: 24,
            }}
          >
            <div className="result-label">
              YILLIK İZİN HAKKI
            </div>

            <div
              className="result-value"
              style={{
                fontSize: 42,
              }}
            >
              {result.annualLeaveDays} gün
            </div>
          </div>

          <div
            style={{
              marginTop: 20,
              display: "grid",
              gap: 10,
            }}
          >

            <DetailRow
              label="Çalışma Süresi"
              value={`${result.years} yıl ${result.months} ay ${result.days} gün`}
            />

            <DetailRow
              label="Tamamlanan Hizmet Yılı"
              value={`${result.totalCompletedYears} yıl`}
            />

            <DetailRow
              label="Yıllık Yasal İzin Süresi"
              value={`${result.annualLeaveDays} gün`}
              highlight
            />

            <DetailRow
              label="Kullanılan İzin"
              value={`${result.usedLeaveDays} gün`}
            />

            <DetailRow
              label="Kalan İzin"
              value={`${result.remainingLeaveDays} gün`}
              highlight
            />

            <DetailRow
              label="Sonraki İzin Hakkı Tarihi"
              value={formatDate(
                result.nextEntitlementDate
              )}
            />

            <DetailRow
              label="Sonraki Hak Kazanımına Kalan"
              value={`${result.daysUntilNextEntitlement} gün`}
            />

          </div>

          {!result.eligible && (
            <div
              style={{
                marginTop: 20,
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
              ⚠️ Henüz bir yıllık çalışma
              süresi tamamlanmadığı için
              yıllık ücretli izin hakkınız
              henüz doğmamıştır.
            </div>
          )}

          {result.eligible && (
            <div
              style={{
                marginTop: 20,
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
              ℹ️ Bu araç kanunda belirtilen
              asgari yıllık izin süreleri
              üzerinden temel hesaplama yapar.
              İş sözleşmesi veya toplu iş
              sözleşmesiyle daha uzun izin
              süreleri belirlenebilir.
            </div>
          )}
        </>
      )}

    </div>
  );
}

function DetailRow({
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
        padding:
          "15px 17px",
        borderRadius: 15,
        background:
          highlight
            ? "#f0fdf4"
            : "#f8faf9",
        border:
          highlight
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
          color:
            highlight
              ? "#15803d"
              : "#10231a",
          textAlign: "right",
        }}
      >
        {value}
      </strong>
    </div>
  );
}