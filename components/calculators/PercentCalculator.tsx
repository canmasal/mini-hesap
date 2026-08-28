"use client";

import { useMemo, useState } from "react";

export default function PercentCalculator() {
  const [amount, setAmount] = useState("");
  const [percent, setPercent] = useState("");

  const result = useMemo(() => {
    const number = Number(amount);
    const percentage = Number(percent);

    if (
      !amount ||
      !percent ||
      !Number.isFinite(number) ||
      !Number.isFinite(percentage)
    ) {
      return null;
    }

    const percentValue =
      (number * percentage) / 100;

    const increasedValue =
      number + percentValue;

    const decreasedValue =
      number - percentValue;

    return {
      number,
      percentage,
      percentValue,
      increasedValue,
      decreasedValue,
    };
  }, [amount, percent]);

  const money = (value: number) =>
    value.toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="calc-box">

      <div className="form-grid">

        <label className="field">
          Ana Tutar
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) =>
              setAmount(event.target.value)
            }
            placeholder="1000"
          />
        </label>

        <label className="field">
          Yüzde Oranı
          <input
            type="number"
            min="0"
            step="0.01"
            value={percent}
            onChange={(event) =>
              setPercent(event.target.value)
            }
            placeholder="18"
          />
        </label>

      </div>

      {result && (
        <div
          style={{
            marginTop: 22,
            display: "grid",
            gap: 12,
          }}
        >

          <ResultRow
            title={`${result.number.toLocaleString("tr-TR")} sayısının %${result.percentage}`}
            value={money(result.percentValue)}
            highlight
          />

          <ResultRow
            title="Yüzde eklenmiş tutar"
            value={money(result.increasedValue)}
          />

          <ResultRow
            title="Yüzde çıkarılmış tutar"
            value={money(result.decreasedValue)}
          />

        </div>
      )}

      {!result && (
        <div
          style={{
            marginTop: 22,
            padding: 20,
            borderRadius: 18,
            background: "#f8faf9",
            border: "1px solid #e5eee8",
            color: "#617066",
            lineHeight: 1.6,
            fontSize: 14,
          }}
        >
          Örneğin <strong>1000</strong> ve
          <strong> 18</strong> girerseniz sistem
          1000'in %18'ini, %18 eklenmiş halini ve
          %18 çıkarılmış halini gösterecektir.
        </div>
      )}

    </div>
  );
}

function ResultRow({
  title,
  value,
  highlight = false,
}: {
  title: string;
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
        padding: "16px 18px",
        borderRadius: 16,
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
        {title}
      </span>

      <strong
        style={{
          color: highlight
            ? "#15803d"
            : "#10231a",
          fontSize: 18,
          textAlign: "right",
        }}
      >
        {value}
      </strong>
    </div>
  );
}