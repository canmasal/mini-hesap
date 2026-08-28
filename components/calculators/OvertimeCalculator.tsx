"use client";

import { useMemo, useState } from "react";

export default function OvertimeCalculator() {
  const [monthlyGross, setMonthlyGross] = useState("");
  const [overtimeHours, setOvertimeHours] = useState("");
  const [multiplier, setMultiplier] = useState("1.5");

  const result = useMemo(() => {
    const gross = Number(monthlyGross);
    const hours = Number(overtimeHours);
    const rate = Number(multiplier);

    if (
      !monthlyGross ||
      !overtimeHours ||
      !Number.isFinite(gross) ||
      !Number.isFinite(hours) ||
      !Number.isFinite(rate) ||
      gross <= 0 ||
      hours <= 0 ||
      rate <= 0
    ) {
      return null;
    }

    const hourlyWage = gross / 225;

    const overtimeHourlyWage =
      hourlyWage * rate;

    const totalOvertime =
      overtimeHourlyWage * hours;

    return {
      gross,
      hours,
      rate,
      hourlyWage,
      overtimeHourlyWage,
      totalOvertime,
    };
  }, [
    monthlyGross,
    overtimeHours,
    multiplier,
  ]);

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
    setMonthlyGross("");
    setOvertimeHours("");
    setMultiplier("1.5");
  }

  return (
    <div className="calc-box">

      {/* FORM */}

      <div className="form-grid">

        <label className="field">
          Aylık Brüt Maaş

          <input
            type="number"
            min="0"
            step="0.01"
            value={monthlyGross}
            onChange={(event) =>
              setMonthlyGross(
                event.target.value
              )
            }
            placeholder="45000"
          />
        </label>

        <label className="field">
          Fazla Mesai Saati

          <input
            type="number"
            min="0"
            step="0.5"
            value={overtimeHours}
            onChange={(event) =>
              setOvertimeHours(
                event.target.value
              )
            }
            placeholder="10"
          />
        </label>

      </div>

      <label
        className="field"
        style={{
          marginTop: 18,
        }}
      >
        Mesai Katsayısı

        <select
          value={multiplier}
          onChange={(event) =>
            setMultiplier(
              event.target.value
            )
          }
        >
          <option value="1.5">
            1,5x — Fazla Mesai
          </option>

          <option value="2">
            2x — Çift Ücret
          </option>
        </select>
      </label>

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
          Nasıl hesaplanır?
        </strong>

        <p
          style={{
            margin: "7px 0 0",
          }}
        >
          Bu ilk sürümde saatlik ücret,
          aylık brüt ücretin 225'e bölünmesi
          üzerinden hesaplanmaktadır.
        </p>
      </div>

      {/* TEMİZLE */}

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

      {/* SONUÇ */}

      {result && (
        <div
          style={{
            marginTop: 22,
            display: "grid",
            gap: 10,
          }}
        >

          <ResultRow
            label="Aylık Brüt Maaş"
            value={`${money(
              result.gross
            )} ₺`}
          />

          <ResultRow
            label="Saatlik Brüt Ücret"
            value={`${money(
              result.hourlyWage
            )} ₺`}
          />

          <ResultRow
            label="Mesai Katsayısı"
            value={`${result.rate}x`}
          />

          <ResultRow
            label="Mesaili Saat Ücreti"
            value={`${money(
              result.overtimeHourlyWage
            )} ₺`}
          />

          <ResultRow
            label="Fazla Mesai Saati"
            value={`${result.hours} saat`}
          />

          <ResultRow
            label="TOPLAM FAZLA MESAİ"
            value={`${money(
              result.totalOvertime
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
          Örneğin <strong>45.000 TL</strong> brüt maaş,
          <strong> 10 saat</strong> fazla mesai ve
          <strong> 1,5x</strong> katsayı girerek
          tahmini fazla mesai tutarınızı görebilirsiniz.
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