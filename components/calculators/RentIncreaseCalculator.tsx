"use client";

import { useMemo, useState } from "react";

export default function RentIncreaseCalculator() {
  const [currentRent, setCurrentRent] = useState("");
  const [increaseRate, setIncreaseRate] = useState("");

  const result = useMemo(() => {
    const rent = Number(currentRent);
    const rate = Number(increaseRate);

    if (
      !currentRent ||
      !increaseRate ||
      !Number.isFinite(rent) ||
      !Number.isFinite(rate) ||
      rent <= 0 ||
      rate < 0
    ) {
      return null;
    }

    const increaseAmount = rent * (rate / 100);
    const newRent = rent + increaseAmount;
    const yearlyDifference = increaseAmount * 12;

    return {
      currentRent: rent,
      increaseRate: rate,
      increaseAmount,
      newRent,
      yearlyDifference,
    };
  }, [currentRent, increaseRate]);

  function money(value: number) {
    return value.toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function clearForm() {
    setCurrentRent("");
    setIncreaseRate("");
  }

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Mevcut Kira
          <input
            type="number"
            min="0"
            step="0.01"
            value={currentRent}
            onChange={(event) =>
              setCurrentRent(event.target.value)
            }
            placeholder="15000"
          />
        </label>

        <label className="field">
          Artış Oranı (%)
          <input
            type="number"
            min="0"
            step="0.01"
            value={increaseRate}
            onChange={(event) =>
              setIncreaseRate(event.target.value)
            }
            placeholder="25"
          />
        </label>
      </div>

      <div
        style={{
          marginTop: 18,
          padding: 16,
          borderRadius: 16,
          background: "#fff7ed",
          border: "1px solid #fed7aa",
          color: "#9a3412",
          fontSize: 13,
          lineHeight: 1.7,
        }}
      >
        <strong>Bilgi:</strong> Buradaki oranı siz girersiniz.
        Yasal kira artış oranını otomatik belirleme özelliğini
        daha sonra güncel resmi verilerle ayrıca ekleyeceğiz.
      </div>

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

      {result && (
        <div
          style={{
            marginTop: 22,
            display: "grid",
            gap: 10,
          }}
        >
          <ResultRow
            label="Mevcut Kira"
            value={`${money(result.currentRent)} ₺`}
          />

          <ResultRow
            label={`Artış Oranı (%${result.increaseRate})`}
            value={`+ ${money(result.increaseAmount)} ₺`}
          />

          <ResultRow
            label="Yeni Aylık Kira"
            value={`${money(result.newRent)} ₺`}
            highlight
          />

          <ResultRow
            label="Yıllık Ek Ödeme"
            value={`+ ${money(result.yearlyDifference)} ₺`}
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
          Örneğin <strong>15.000 TL</strong> kira ve
          <strong> %25</strong> artış girerseniz sistem yeni
          kira tutarını ve yıllık farkı hesaplar.
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
        background: highlight ? "#f0fdf4" : "#f8faf9",
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
          color: highlight ? "#15803d" : "#10231a",
          fontSize: 18,
        }}
      >
        {value}
      </strong>
    </div>
  );
}
