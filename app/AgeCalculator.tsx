"use client";

import { useMemo, useState } from "react";

type AgeResult = {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  nextBirthday: Date;
  daysUntilBirthday: number;
  birthdayAge: number;
};

function parseDate(value: string): Date | null {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

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

function getTotalDays(
  birthDate: Date,
  calculationDate: Date
): number {
  const birth = Date.UTC(
    birthDate.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );

  const current = Date.UTC(
    calculationDate.getFullYear(),
    calculationDate.getMonth(),
    calculationDate.getDate()
  );

  return Math.floor((current - birth) / 86400000);
}

function calculateAge(
  birthDate: Date,
  calculationDate: Date
): AgeResult {
  let years =
    calculationDate.getFullYear() -
    birthDate.getFullYear();

  let months =
    calculationDate.getMonth() -
    birthDate.getMonth();

  let days =
    calculationDate.getDate() -
    birthDate.getDate();

  if (days < 0) {
    months -= 1;

    const previousMonth = new Date(
      calculationDate.getFullYear(),
      calculationDate.getMonth(),
      0
    );

    days += previousMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = getTotalDays(
    birthDate,
    calculationDate
  );

  const currentYear =
    calculationDate.getFullYear();

  let nextBirthday = new Date(
    currentYear,
    birthDate.getMonth(),
    birthDate.getDate()
  );

  /*
   * 29 Şubat doğumlular için,
   * artık olmayan yıllarda 1 Mart
   * yaklaşımı kullanıyoruz.
   */
  if (
    birthDate.getMonth() === 1 &&
    birthDate.getDate() === 29 &&
    nextBirthday.getMonth() !== 1
  ) {
    nextBirthday = new Date(
      currentYear,
      2,
      1
    );
  }

  if (
    nextBirthday.getTime() <=
    calculationDate.getTime()
  ) {
    nextBirthday = new Date(
      currentYear + 1,
      birthDate.getMonth(),
      birthDate.getDate()
    );

    if (
      birthDate.getMonth() === 1 &&
      birthDate.getDate() === 29 &&
      nextBirthday.getMonth() !== 1
    ) {
      nextBirthday = new Date(
        currentYear + 1,
        2,
        1
      );
    }
  }

  const nextBirthdayUtc = Date.UTC(
    nextBirthday.getFullYear(),
    nextBirthday.getMonth(),
    nextBirthday.getDate()
  );

  const calculationUtc = Date.UTC(
    calculationDate.getFullYear(),
    calculationDate.getMonth(),
    calculationDate.getDate()
  );

  const daysUntilBirthday = Math.ceil(
    (nextBirthdayUtc - calculationUtc) /
      86400000
  );

  const birthdayAge =
    nextBirthday.getFullYear() -
    birthDate.getFullYear();

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    totalDays: Math.max(0, totalDays),
    nextBirthday,
    daysUntilBirthday: Math.max(
      0,
      daysUntilBirthday
    ),
    birthdayAge,
  };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(
    "tr-TR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
}

export default function AgeCalculator() {
  const today = new Date();

  const defaultToday =
    `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`;

  const [birthDate, setBirthDate] =
    useState("");

  const [calculationDate, setCalculationDate] =
    useState(defaultToday);

  const [result, setResult] =
    useState<AgeResult | null>(null);

  const [error, setError] =
    useState("");

  const preview = useMemo(() => {
    const birth = parseDate(birthDate);
    const current = parseDate(calculationDate);

    if (!birth || !current) {
      return null;
    }

    if (
      birth.getTime() >
      current.getTime()
    ) {
      return null;
    }

    return calculateAge(
      birth,
      current
    );
  }, [birthDate, calculationDate]);

  function handleCalculate() {
    setError("");
    setResult(null);

    const birth =
      parseDate(birthDate);

    const current =
      parseDate(calculationDate);

    if (!birth) {
      setError(
        "Lütfen geçerli bir doğum tarihi girin."
      );
      return;
    }

    if (!current) {
      setError(
        "Lütfen geçerli bir hesaplama tarihi girin."
      );
      return;
    }

    if (
      birth.getTime() >
      current.getTime()
    ) {
      setError(
        "Doğum tarihi hesaplama tarihinden sonra olamaz."
      );
      return;
    }

    setResult(
      calculateAge(
        birth,
        current
      )
    );
  }

  function handleClear() {
    setBirthDate("");
    setCalculationDate(
      defaultToday
    );
    setResult(null);
    setError("");
  }

  return (
    <div className="calc-box">

      <div className="form-grid">

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
            }}
          />
        </label>

      </div>

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
        Doğum tarihinizi ve hesaplamak
        istediğiniz tarihi girin. Yaşınız yıl,
        ay ve gün olarak hesaplanır.
      </div>

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
          }}
        >
          {error}
        </div>
      )}

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
          Yaşımı Hesapla
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

      {preview && !result && (
        <div
          style={{
            marginTop: 20,
            padding: 18,
            borderRadius: 18,
            background: "#f0fdf4",
            border:
              "1px solid #bbf7d0",
          }}
        >
          <div
            style={{
              color: "#617066",
              fontSize: 13,
            }}
          >
            Önizleme
          </div>

          <strong
            style={{
              display: "block",
              marginTop: 6,
              fontSize: 24,
              color: "#15803d",
            }}
          >
            {preview.years} yıl{" "}
            {preview.months} ay{" "}
            {preview.days} gün
          </strong>
        </div>
      )}

      {result && (
        <>
          <div
            className="result"
            style={{
              marginTop: 24,
            }}
          >
            <div className="result-label">
              HESAPLANAN YAŞ
            </div>

            <div
              className="result-value"
              style={{
                fontSize: 42,
              }}
            >
              {result.years} yıl{" "}
              {result.months} ay{" "}
              {result.days} gün
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
              label="Toplam Yaş"
              value={`${result.years} yaş`}
              highlight
            />

            <DetailRow
              label="Toplam Geçen Gün"
              value={`${result.totalDays.toLocaleString(
                "tr-TR"
              )} gün`}
            />

            <DetailRow
              label="Bir Sonraki Doğum Günü"
              value={formatDate(
                result.nextBirthday
              )}
            />

            <DetailRow
              label="Bir Sonraki Yaş"
              value={`${result.birthdayAge} yaş`}
            />

            <DetailRow
              label="Doğum Gününe Kalan"
              value={`${result.daysUntilBirthday} gün`}
              highlight
            />
          </div>

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
            ℹ️ Hesaplama, girilen doğum
            tarihi ile seçilen hesaplama tarihi
            arasındaki takvim farkına göre
            yapılır.
          </div>
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
          textAlign: "right",
        }}
      >
        {value}
      </strong>
    </div>
  );
}