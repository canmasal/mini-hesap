"use client";

import { useMemo, useState } from "react";

type CalculationMode = "excluded" | "included";

export default function KdvCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("20");
  const [mode, setMode] =
    useState<CalculationMode>("excluded");

  const result = useMemo(() => {
    const numericAmount = Number(amount);
    const numericRate = Number(rate);

    if (
      !amount ||
      !Number.isFinite(numericAmount) ||
      numericAmount < 0 ||
      !Number.isFinite(numericRate) ||
      numericRate < 0
    ) {
      return null;
    }

    const rateDecimal =
      numericRate / 100;

    if (mode === "excluded") {
      const kdv =
        numericAmount *
        rateDecimal;

      const total =
        numericAmount + kdv;

      return {
        baseAmount: numericAmount,
        kdv,
        total,
      };
    }

    const baseAmount =
      numericAmount /
      (1 + rateDecimal);

    const kdv =
      numericAmount - baseAmount;

    return {
      baseAmount,
      kdv,
      total: numericAmount,
    };
  }, [amount, rate, mode]);

  function money(value: number) {
    return value.toLocaleString(
      "tr-TR",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  }

  function handleClear() {
    setAmount("");
    setRate("20");
    setMode("excluded");
  }

  return (
    <div className="calc-box">

      {/* FORM */}

      <div className="form-grid">

        <label className="field">
          Tutar

          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) =>
              setAmount(
                event.target.value
              )
            }
            placeholder="10000"
          />
        </label>

        <label className="field">
          KDV Oranı

          <select
            value={rate}
            onChange={(event) =>
              setRate(
                event.target.value
              )
            }
          >
            <option value="1">
              %1
            </option>

            <option value="10">
              %10
            </option>

            <option value="20">
              %20
            </option>
          </select>
        </label>

      </div>

      {/* MODE */}

      <label
        className="field"
        style={{
          marginTop: 18,
        }}
      >
        Tutarın durumu

        <select
          value={mode}
          onChange={(event) =>
            setMode(
              event.target.value as CalculationMode
            )
          }
        >
          <option value="excluded">
            KDV Hariç Tutar
          </option>

          <option value="included">
            KDV Dahil Tutar
          </option>
        </select>
      </label>

      {/* BUTTONS */}

      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 20,
        }}
      >
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

      {/* RESULT */}

      {result && (
        <div
          style={{
            marginTop: 22,
            display: "grid",
            gap: 10,
          }}
        >

          <ResultRow
            label="KDV Hariç Tutar"
            value={`${money(
              result.baseAmount
            )} ₺`}
          />

          <ResultRow
            label={`KDV (%${rate})`}
            value={`${money(
              result.kdv
            )} ₺`}
            highlight
          />

          <ResultRow
            label="Genel Toplam"
            value={`${money(
              result.total
            )} ₺`}
            highlight
          />

        </div>
      )}

      {!result && (
        <div
          style={{
            marginTop: 22,
            padding: 18,
            borderRadius: 18,
            background: "#f8faf9",
            border:
              "1px solid #e5eee8",
            color: "#617066",
            fontSize: 14,
            lineHeight: 1.7,
          }}
        >
          Tutarı girin ve KDV oranını
          seçin. Sistem KDV tutarını ve
          toplam tutarı otomatik hesaplar.
        </div>
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
        justifyContent:
          "space-between",
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
        {label}
      </span>

      <strong
        style={{
          color: highlight
            ? "#15803d"
            : "#10231a",
          fontSize: 18,
        }}
      >
        {value}
      </strong>
    </div>
  );
}