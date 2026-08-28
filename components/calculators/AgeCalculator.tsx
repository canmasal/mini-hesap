"use client";

import { useState } from "react";

type AgeResult = {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  nextBirthday: Date;
  daysUntilBirthday: number;
  nextAge: number;
};

function parseLocalDate(value: string): Date | null {
  if (!value) {
    return null;
  }

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
    (endUtc - startUtc) /
      86400000
  );
}

function createBirthdayForYear(
  birthDate: Date,
  year: number
): Date {
  /*
   * 29 Şubat doğumlarında artık olmayan
   * yıllar için 1 Mart yaklaşımı kullanıyoruz.
   */
  if (
    birthDate.getMonth() === 1 &&
    birthDate.getDate() === 29
  ) {
    const candidate = new Date(
      year,
      1,
      29
    );

    if (
      candidate.getMonth() !== 1 ||
      candidate.getDate() !== 29
    ) {
      return new Date(
        year,
        2,
        1
      );
    }

    return candidate;
  }

  return new Date(
    year,
    birthDate.getMonth(),
    birthDate.getDate()
  );
}

function calculateAge(
  birthDate: Date,
  calculationDate: Date
): AgeResult {
  const birth = startOfDay(
    birthDate
  );

  const current = startOfDay(
    calculationDate
  );

  let years =
    current.getFullYear() -
    birth.getFullYear();

  let months =
    current.getMonth() -
    birth.getMonth();

  let days =
    current.getDate() -
    birth.getDate();

  if (days < 0) {
    months -= 1;

    const previousMonthLastDay =
      new Date(
        current.getFullYear(),
        current.getMonth(),
        0
      ).getDate();

    days +=
      previousMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  /*
   * Güvenlik kontrolü
   */
  years = Math.max(0, years);
  months = Math.max(0, months);
  days = Math.max(0, days);

  const totalDays = Math.max(
    0,
    differenceInDays(
      birth,
      current
    )
  );

  const currentYear =
    current.getFullYear();

  let nextBirthday =
    createBirthdayForYear(
      birth,
      currentYear
    );

  if (
    nextBirthday.getTime() <=
    current.getTime()
  ) {
    nextBirthday =
      createBirthdayForYear(
        birth,
        currentYear + 1
      );
  }

  const daysUntilBirthday =
    Math.max(
      0,
      differenceInDays(
        current,
        nextBirthday
      )
    );

  const nextAge =
    nextBirthday.getFullYear() -
    birth.getFullYear();

  return {
    years,
    months,
    days,
    totalDays,
    nextBirthday,
    daysUntilBirthday,
    nextAge,
  };
}

function formatDate(
  date: Date
): string {
  return date.toLocaleDateString(
    "tr-TR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
}

function moneyLikeNumber(
  value: number
): string {
  return value.toLocaleString(
    "tr-TR"
  );
}

export default function AgeCalculator() {
  const today = startOfDay(
    new Date()
  );

  const defaultCalculationDate =
    `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`;

  const [birthDate, setBirthDate] =
    useState("");

  const [
    calculationDate,
    setCalculationDate,
  ] = useState(
    defaultCalculationDate
  );

  const [result, setResult] =
    useState<AgeResult | null>(
      null
    );

  const [error, setError] =
    useState("");

  function handleCalculate() {
    setError("");
    setResult(null);

    const birth =
      parseLocalDate(birthDate);

    const current =
      parseLocalDate(
        calculationDate
      );

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

    const calculated =
      calculateAge(
        birth,
        current
      );

    setResult(calculated);
  }

  function handleClear() {
    setBirthDate("");

    setCalculationDate(
      defaultCalculationDate
    );

    setResult(null);
    setError("");
  }

  return (
    <div className="calc-box">

      {/* FORM */}
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
              setError("");
            }}
          />
        </label>

        <label className="field">
          Hesaplama Tarihi

          <input
            type="date"
            value={
              calculationDate
            }
            onChange={(event) => {
              setCalculationDate(
                event.target.value
              );

              setResult(null);
              setError("");
            }}
          />
        </label>

      </div>

      {/* BİLGİ */}
      <div
        style={{
          marginTop: 18,
          padding: 16,
          borderRadius: 16,
          background:
            "#f8faf9",
          border:
            "1px solid #e5eee8",
          color: "#617066",
          fontSize: 14,
          lineHeight: 1.7,
        }}
      >
        <strong>
          Nasıl hesaplanır?
        </strong>

        <p
          style={{
            margin:
              "7px 0 0",
          }}
        >
          Doğum tarihinizi ve
          hesaplama tarihini
          girin. Yaşınız yıl,
          ay ve gün olarak
          hesaplanır. Ayrıca
          toplam geçen gün ve
          bir sonraki doğum
          gününüze kalan süre
          gösterilir.
        </p>
      </div>

      {/* HATA */}
      {error && (
        <div
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 14,
            background:
              "#fef2f2",
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
          Yaşımı Hesapla
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
              label="Yaş"
              value={`${result.years} yaş`}
              highlight
            />

            <DetailRow
              label="Toplam Geçen Gün"
              value={`${moneyLikeNumber(
                result.totalDays
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
              value={`${result.nextAge} yaş`}
            />

            <DetailRow
              label="Doğum Gününe Kalan"
              value={`${moneyLikeNumber(
                result.daysUntilBirthday
              )} gün`}
              highlight
            />
          </div>

          <div
            style={{
              marginTop: 20,
              padding: 16,
              borderRadius: 16,
              background:
                "#fff7ed",
              border:
                "1px solid #fed7aa",
              color: "#9a3412",
              fontSize: 13,
              lineHeight: 1.7,
            }}
          >
            ℹ️ Hesaplama, doğum
            tarihi ile seçilen
            hesaplama tarihi
            arasındaki takvim
            farkına göre yapılır.
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