"use client";

import { useMemo, useState } from "react";

import {
  calculateNetSalary,
  type NetSalaryResult,
} from "../../lib/calculations/netSalary";

const months = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

function money(value: number): string {
  return `${value.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ₺`;
}

export default function NetSalaryCalculator() {
  const [grossSalary, setGrossSalary] = useState("");

  const [month, setMonth] = useState("1");

  const [
    previousCumulativeTaxBase,
    setPreviousCumulativeTaxBase,
  ] = useState("");

  const [result, setResult] =
    useState<NetSalaryResult | null>(null);

  const [yearlyResults, setYearlyResults] =
    useState<NetSalaryResult[]>([]);

  const [error, setError] =
    useState("");

  const [showYearlyTable, setShowYearlyTable] =
    useState(false);

  function handleCalculate() {
    setError("");
    setResult(null);
    setYearlyResults([]);
    setShowYearlyTable(false);

    const gross = Number(grossSalary);
    const selectedMonth = Number(month);
    const previousTaxBase = Number(
      previousCumulativeTaxBase || 0
    );

    if (
      !Number.isFinite(gross) ||
      gross <= 0
    ) {
      setError(
        "Lütfen geçerli bir brüt maaş girin."
      );
      return;
    }

    if (
      !Number.isFinite(selectedMonth) ||
      selectedMonth < 1 ||
      selectedMonth > 12
    ) {
      setError(
        "Lütfen geçerli bir hesaplama ayı seçin."
      );
      return;
    }

    if (
      !Number.isFinite(previousTaxBase) ||
      previousTaxBase < 0
    ) {
      setError(
        "Kümülatif vergi matrahı 0 veya daha büyük olmalıdır."
      );
      return;
    }

    const calculation =
      calculateNetSalary({
        grossSalary: gross,
        month: selectedMonth,
        previousCumulativeTaxBase:
          previousTaxBase,
      });

    setResult(calculation);
  }

  function handleYearlyCalculate() {
    setError("");
    setResult(null);
    setYearlyResults([]);
    setShowYearlyTable(false);

    const gross = Number(grossSalary);

    const startingTaxBase = Number(
      previousCumulativeTaxBase || 0
    );

    if (
      !Number.isFinite(gross) ||
      gross <= 0
    ) {
      setError(
        "Lütfen geçerli bir brüt maaş girin."
      );
      return;
    }

    if (
      !Number.isFinite(startingTaxBase) ||
      startingTaxBase < 0
    ) {
      setError(
        "Kümülatif vergi matrahı 0 veya daha büyük olmalıdır."
      );
      return;
    }

    const results: NetSalaryResult[] = [];

    let cumulativeTaxBase =
      startingTaxBase;

    for (let i = 1; i <= 12; i++) {
      const monthlyResult =
        calculateNetSalary({
          grossSalary: gross,
          month: i,
          previousCumulativeTaxBase:
            cumulativeTaxBase,
        });

      results.push(monthlyResult);

      cumulativeTaxBase =
        monthlyResult.cumulativeTaxBase;
    }

    setYearlyResults(results);
    setShowYearlyTable(true);
  }

  function handleClear() {
    setGrossSalary("");
    setMonth("1");
    setPreviousCumulativeTaxBase("");
    setResult(null);
    setYearlyResults([]);
    setShowYearlyTable(false);
    setError("");
  }

  const yearlySummary = useMemo(() => {
    if (yearlyResults.length === 0) {
      return null;
    }

    const grossTotal =
      yearlyResults.reduce(
        (total, item) =>
          total + item.grossSalary,
        0
      );

    const netTotal =
      yearlyResults.reduce(
        (total, item) =>
          total + item.netSalary,
        0
      );

    const sgkTotal =
      yearlyResults.reduce(
        (total, item) =>
          total + item.sgkEmployee,
        0
      );

    const unemploymentTotal =
      yearlyResults.reduce(
        (total, item) =>
          total +
          item.unemploymentEmployee,
        0
      );

    const incomeTaxTotal =
      yearlyResults.reduce(
        (total, item) =>
          total + item.incomeTax,
        0
      );

    const stampTaxTotal =
      yearlyResults.reduce(
        (total, item) =>
          total + item.stampTax,
        0
      );

    return {
      grossTotal,
      netTotal,
      sgkTotal,
      unemploymentTotal,
      incomeTaxTotal,
      stampTaxTotal,
    };
  }, [yearlyResults]);

  return (
    <div className="calc-box">

      {/* =========================
          FORM
      ========================= */}

      <div className="form-grid">

        <label className="field">
          Brüt Maaş

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
              setYearlyResults([]);
            }}
            placeholder="45000"
          />
        </label>

        <label className="field">
          Hesaplama Ayı

          <select
            value={month}
            onChange={(event) => {
              setMonth(event.target.value);

              setResult(null);
              setYearlyResults([]);
            }}
          >
            {months.map(
              (monthName, index) => (
                <option
                  key={monthName}
                  value={index + 1}
                >
                  {monthName} 2026
                </option>
              )
            )}
          </select>
        </label>

        <label className="field">
          Önceki Kümülatif Vergi Matrahı

          <input
            type="number"
            min="0"
            step="0.01"
            value={
              previousCumulativeTaxBase
            }
            onChange={(event) => {
              setPreviousCumulativeTaxBase(
                event.target.value
              );

              setResult(null);
              setYearlyResults([]);
            }}
            placeholder="0"
          />
        </label>

      </div>

      {/* =========================
          INFORMATION
      ========================= */}

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
          Kümülatif vergi matrahı nedir?
        </strong>

        <p
          style={{
            margin: "7px 0 0",
          }}
        >
          Yıl içinde önceki aylarda oluşan
          gelir vergisi matrahlarının toplamıdır.
          İlk ay için 0 bırakabilirsiniz.
        </p>
      </div>

      {/* =========================
          ERROR
      ========================= */}

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

      {/* =========================
          BUTTONS
      ========================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr 120px",
          gap: 10,
          marginTop: 20,
        }}
      >

        <button
          type="button"
          className="btn btn-green"
          style={{
            borderRadius: 14,
          }}
          onClick={
            handleCalculate
          }
        >
          Aylık Hesapla
        </button>

        <button
          type="button"
          className="btn btn-green"
          style={{
            borderRadius: 14,
          }}
          onClick={
            handleYearlyCalculate
          }
        >
          12 Aylık Hesapla
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
          MONTHLY RESULT
      ========================= */}

      {result && (
        <>
          <div className="result">

            <div className="result-label">
              {months[result.month - 1]} 2026
              TAHMİNİ NET MAAŞ
            </div>

            <div
              className="result-value"
              style={{
                fontSize: 42,
              }}
            >
              {money(
                result.netSalary
              )}
            </div>

          </div>

          <div
            style={{
              marginTop: 22,
              display: "grid",
              gap: 10,
            }}
          >

            <DetailRow
              label="Brüt Maaş"
              value={money(
                result.grossSalary
              )}
            />

            <DetailRow
              label="SGK İşçi Payı (%14)"
              value={`- ${money(
                result.sgkEmployee
              )}`}
            />

            <DetailRow
              label="İşsizlik Sigortası (%1)"
              value={`- ${money(
                result.unemploymentEmployee
              )}`}
            />

            <DetailRow
              label="Gelir Vergisi Matrahı"
              value={money(
                result.incomeTaxBase
              )}
            />

            <DetailRow
              label="Hesaplanan Gelir Vergisi"
              value={`- ${money(
                result.incomeTaxBeforeExemption
              )}`}
            />

            <DetailRow
              label="Asgari Ücret Gelir Vergisi İstisnası"
              value={`+ ${money(
                result.minimumWageIncomeTaxExemption
              )}`}
            />

            <DetailRow
              label="Ödenecek Gelir Vergisi"
              value={`- ${money(
                result.incomeTax
              )}`}
            />

            <DetailRow
              label="Damga Vergisi"
              value={`- ${money(
                result.stampTax
              )}`}
            />

            <DetailRow
              label="Kümülatif Vergi Matrahı"
              value={money(
                result.cumulativeTaxBase
              )}
            />

            <DetailRow
              label="NET MAAŞ"
              value={money(
                result.netSalary
              )}
              highlight
            />

          </div>
        </>
      )}

      {/* =========================
          YEARLY RESULT
      ========================= */}

      {showYearlyTable &&
        yearlyResults.length > 0 && (
          <div
            style={{
              marginTop: 35,
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                gap: 15,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div className="eyebrow">
                  2026 YILLIK ÖZET
                </div>

                <h2
                  style={{
                    margin:
                      "6px 0 0",
                    fontSize: 28,
                  }}
                >
                  Aylık Bordro Tablosu
                </h2>
              </div>

              <button
                type="button"
                className="btn btn-outline"
                style={{
                  borderRadius: 14,
                }}
                onClick={() =>
                  setShowYearlyTable(false)
                }
              >
                Tabloyu Kapat
              </button>
            </div>

            {/* SUMMARY CARDS */}

            {yearlySummary && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, 1fr)",
                  gap: 12,
                  marginTop: 20,
                }}
              >

                <SummaryCard
                  label="Yıllık Brüt"
                  value={money(
                    yearlySummary.grossTotal
                  )}
                />

                <SummaryCard
                  label="Yıllık Net"
                  value={money(
                    yearlySummary.netTotal
                  )}
                  highlight
                />

                <SummaryCard
                  label="Toplam SGK"
                  value={money(
                    yearlySummary.sgkTotal
                  )}
                />

                <SummaryCard
                  label="Toplam İşsizlik"
                  value={money(
                    yearlySummary.unemploymentTotal
                  )}
                />

                <SummaryCard
                  label="Toplam Gelir Vergisi"
                  value={money(
                    yearlySummary.incomeTaxTotal
                  )}
                />

                <SummaryCard
                  label="Toplam Damga Vergisi"
                  value={money(
                    yearlySummary.stampTaxTotal
                  )}
                />

              </div>
            )}

            {/* MONTH TABLE */}

            <div
              style={{
                marginTop: 20,
                overflowX: "auto",
                border:
                  "1px solid #dce7df",
                borderRadius: 20,
                background: "white",
              }}
            >
              <table
                style={{
                  width: "100%",
                  minWidth: 780,
                  borderCollapse:
                    "collapse",
                  fontSize: 14,
                }}
              >

                <thead>
                  <tr
                    style={{
                      background:
                        "#0d1b14",
                      color: "white",
                    }}
                  >
                    <th style={thStyle}>
                      Ay
                    </th>

                    <th style={thStyle}>
                      Brüt
                    </th>

                    <th style={thStyle}>
                      SGK
                    </th>

                    <th style={thStyle}>
                      İşsizlik
                    </th>

                    <th style={thStyle}>
                      Gelir Vergisi
                    </th>

                    <th style={thStyle}>
                      Damga
                    </th>

                    <th style={thStyle}>
                      Net
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {yearlyResults.map(
                    (item, index) => (
                      <tr
                        key={item.month}
                        style={{
                          borderBottom:
                            "1px solid #e5eee8",
                        }}
                      >
                        <td style={tdStyle}>
                          <strong>
                            {months[index]}
                          </strong>
                        </td>

                        <td style={tdStyle}>
                          {money(
                            item.grossSalary
                          )}
                        </td>

                        <td style={tdStyle}>
                          {money(
                            item.sgkEmployee
                          )}
                        </td>

                        <td style={tdStyle}>
                          {money(
                            item.unemploymentEmployee
                          )}
                        </td>

                        <td style={tdStyle}>
                          {money(
                            item.incomeTax
                          )}
                        </td>

                        <td style={tdStyle}>
                          {money(
                            item.stampTax
                          )}
                        </td>

                        <td
                          style={{
                            ...tdStyle,
                            color:
                              "#15803d",
                            fontWeight:
                              900,
                          }}
                        >
                          {money(
                            item.netSalary
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>

              </table>
            </div>

            {/* WARNING */}

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
              ⚠️ Bu yıllık tablo mevcut
              hesaplama motorumuzun geliştirme
              sürümüdür. Yayına çıkmadan önce
              bordro hesapları; güncel vergi,
              SGK, istisna, kümülatif matrah ve
              diğer mevzuat kurallarıyla ayrıca
              doğrulanacaktır.
            </div>

          </div>
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
        padding: "14px 16px",
        borderRadius: 14,
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

function SummaryCard({
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
        padding: 18,
        borderRadius: 18,
        background: highlight
          ? "#f0fdf4"
          : "#f8faf9",
        border: highlight
          ? "1px solid #bbf7d0"
          : "1px solid #e5eee8",
      }}
    >
      <div className="result-label">
        {label}
      </div>

      <div
        style={{
          marginTop: 6,
          fontSize: 22,
          fontWeight: 900,
          color: highlight
            ? "#15803d"
            : "#10231a",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "14px 12px",
  textAlign: "right",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "13px 12px",
  textAlign: "right",
  whiteSpace: "nowrap",
};