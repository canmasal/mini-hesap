"use client";

import { useMemo, useState } from "react";

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] =
    useState("");

  const [discountRate, setDiscountRate] =
    useState("");

  const result = useMemo(() => {
    const price = Number(originalPrice);
    const rate = Number(discountRate);

    if (
      !originalPrice ||
      !discountRate ||
      !Number.isFinite(price) ||
      !Number.isFinite(rate) ||
      price < 0 ||
      rate < 0
    ) {
      return null;
    }

    const discountAmount =
      (price * rate) / 100;

    const finalPrice =
      price - discountAmount;

    return {
      originalPrice: price,
      discountRate: rate,
      discountAmount,
      finalPrice,
    };
  }, [originalPrice, discountRate]);

  function money(value: number) {
    return value.toLocaleString(
      "tr-TR",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  }

  function clearForm() {
    setOriginalPrice("");
    setDiscountRate("");
  }

  return (
    <div className="calc-box">

      {/* FORM */}

      <div className="form-grid">

        <label className="field">
          Normal Fiyat

          <input
            type="number"
            min="0"
            step="0.01"
            value={originalPrice}
            onChange={(event) =>
              setOriginalPrice(
                event.target.value
              )
            }
            placeholder="2500"
          />
        </label>

        <label className="field">
          İndirim Oranı (%)

          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={discountRate}
            onChange={(event) =>
              setDiscountRate(
                event.target.value
              )
            }
            placeholder="20"
          />
        </label>

      </div>

      {/* BUTTON */}

      <button
        type="button"
        className="btn btn-outline"
        style={{
          marginTop: 20,
          borderRadius: 14,
        }}
        onClick={clearForm}
      >
        Temizle
      </button>

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
            label="Normal Fiyat"
            value={`${money(
              result.originalPrice
            )} ₺`}
          />

          <ResultRow
            label={`İndirim (%${result.discountRate})`}
            value={`- ${money(
              result.discountAmount
            )} ₺`}
          />

          <ResultRow
            label="Ödenecek Tutar"
            value={`${money(
              result.finalPrice
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
            border: "1px solid #e5eee8",
            color: "#617066",
            fontSize: 14,
            lineHeight: 1.7,
          }}
        >
          Örneğin <strong>2.500 TL</strong> fiyat ve
          <strong> %20 indirim</strong> girerseniz,
          sistem indirim tutarını ve ödenecek son
          fiyatı gösterir.
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