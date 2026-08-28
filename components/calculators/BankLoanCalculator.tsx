"use client";

import { useMemo, useState } from "react";

type PaymentRow = {
  installment: number;
  date: Date;
  payment: number;
  interest: number;
  principal: number;
  remaining: number;
};

type LoanResult = {
  monthlyPayment: number;
  principal: number;
  totalInterest: number;
  totalPayment: number;
  schedule: PaymentRow[];
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

function addMonths(
  date: Date,
  months: number
): Date {
  const result = new Date(date);

  const originalDay =
    result.getDate();

  result.setDate(1);
  result.setMonth(
    result.getMonth() + months
  );

  const lastDay = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0
  ).getDate();

  result.setDate(
    Math.min(
      originalDay,
      lastDay
    )
  );

  return result;
}

function calculateLoan(
  principal: number,
  monthlyRatePercent: number,
  months: number,
  startDate: Date
): LoanResult {
  const monthlyRate =
    monthlyRatePercent / 100;

  let monthlyPayment = 0;

  if (monthlyRate === 0) {
    monthlyPayment =
      principal / months;
  } else {
    monthlyPayment =
      principal *
      (
        monthlyRate *
        Math.pow(
          1 + monthlyRate,
          months
        )
      ) /
      (
        Math.pow(
          1 + monthlyRate,
          months
        ) - 1
      );
  }

  monthlyPayment =
    Math.round(
      monthlyPayment * 100
    ) / 100;

  let remaining =
    Math.round(
      principal * 100
    ) / 100;

  const schedule: PaymentRow[] = [];

  for (
    let i = 1;
    i <= months;
    i++
  ) {
    const interest =
      monthlyRate === 0
        ? 0
        : remaining *
          monthlyRate;

    let payment =
      monthlyPayment;

    let principalPart =
      payment - interest;

    /*
     * Son taksitte yuvarlama
     * kaynaklı fark oluşmaması için
     * kalan borcu tamamen kapatıyoruz.
     */
    if (i === months) {
      principalPart =
        remaining;

      payment =
        principalPart +
        interest;
    }

    principalPart =
      Math.round(
        principalPart * 100
      ) / 100;

    payment =
      Math.round(
        payment * 100
      ) / 100;

    const interestRounded =
      Math.round(
        interest * 100
      ) / 100;

    remaining =
      Math.max(
        0,
        Math.round(
          (
            remaining -
            principalPart
          ) * 100
        ) / 100
      );

    schedule.push({
      installment: i,
      date: addMonths(
        startDate,
        i
      ),
      payment,
      interest:
        interestRounded,
      principal:
        principalPart,
      remaining,
    });
  }

  const totalPayment =
    schedule.reduce(
      (sum, row) =>
        sum + row.payment,
      0
    );

  const totalInterest =
    schedule.reduce(
      (sum, row) =>
        sum + row.interest,
      0
    );

  return {
    monthlyPayment,
    principal,
    totalInterest:
      Math.round(
        totalInterest * 100
      ) / 100,
    totalPayment:
      Math.round(
        totalPayment * 100
      ) / 100,
    schedule,
  };
}

function formatMoney(
  value: number
): string {
  return value.toLocaleString(
    "tr-TR",
    {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
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

export default function BankLoanCalculator() {
  const today = new Date();

  const defaultDate =
    `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`;

  const [loanType, setLoanType] =
    useState("İhtiyaç Kredisi");

  const [principal, setPrincipal] =
    useState("500000");

  const [monthlyRate, setMonthlyRate] =
    useState("3.25");

  const [months, setMonths] =
    useState("36");

  const [startDate, setStartDate] =
    useState(defaultDate);

  const [result, setResult] =
    useState<LoanResult | null>(
      null
    );

  const [error, setError] =
    useState("");

  const preview = useMemo(() => {
    const amount =
      Number(principal);

    const rate =
      Number(monthlyRate);

    const term =
      Number(months);

    const date =
      parseDate(startDate);

    if (
      !Number.isFinite(amount) ||
      !Number.isFinite(rate) ||
      !Number.isFinite(term) ||
      !date ||
      amount <= 0 ||
      rate < 0 ||
      term <= 0
    ) {
      return null;
    }

    return calculateLoan(
      amount,
      rate,
      Math.floor(term),
      date
    );
  }, [
    principal,
    monthlyRate,
    months,
    startDate,
  ]);

  function handleCalculate() {
    setError("");
    setResult(null);

    const amount =
      Number(principal);

    const rate =
      Number(monthlyRate);

    const term =
      Number(months);

    const date =
      parseDate(startDate);

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setError(
        "Lütfen geçerli bir kredi tutarı girin."
      );
      return;
    }

    if (
      !Number.isFinite(rate) ||
      rate < 0
    ) {
      setError(
        "Aylık faiz oranı 0 veya daha büyük olmalıdır."
      );
      return;
    }

    if (
      !Number.isFinite(term) ||
      term <= 0
    ) {
      setError(
        "Lütfen geçerli bir vade girin."
      );
      return;
    }

    if (!Number.isInteger(term)) {
      setError(
        "Vade ay cinsinden tam sayı olmalıdır."
      );
      return;
    }

    if (term > 600) {
      setError(
        "Vade en fazla 600 ay olabilir."
      );
      return;
    }

    if (!date) {
      setError(
        "Lütfen geçerli bir başlangıç tarihi seçin."
      );
      return;
    }

    setResult(
      calculateLoan(
        amount,
        rate,
        term,
        date
      )
    );
  }

  function handleClear() {
    setLoanType(
      "İhtiyaç Kredisi"
    );
    setPrincipal("500000");
    setMonthlyRate("3.25");
    setMonths("36");
    setStartDate(defaultDate);
    setResult(null);
    setError("");
  }

  return (
    <div className="calc-box">

      {/* FORM */}

      <div className="form-grid">

        <label className="field">
          Kredi Türü

          <select
            value={loanType}
            onChange={(event) => {
              setLoanType(
                event.target.value
              );
              setResult(null);
            }}
          >
            <option>
              İhtiyaç Kredisi
            </option>

            <option>
              Konut Kredisi
            </option>

            <option>
              Taşıt Kredisi
            </option>

            <option>
              Diğer
            </option>
          </select>
        </label>

        <label className="field">
          Kredi Tutarı (TL)

          <input
            type="number"
            min="0"
            step="100"
            value={principal}
            onChange={(event) => {
              setPrincipal(
                event.target.value
              );
              setResult(null);
            }}
            placeholder="500000"
          />
        </label>

        <label className="field">
          Aylık Faiz Oranı (%)

          <input
            type="number"
            min="0"
            step="0.01"
            value={monthlyRate}
            onChange={(event) => {
              setMonthlyRate(
                event.target.value
              );
              setResult(null);
            }}
            placeholder="3.25"
          />
        </label>

        <label className="field">
          Vade (Ay)

          <input
            type="number"
            min="1"
            max="600"
            step="1"
            value={months}
            onChange={(event) => {
              setMonths(
                event.target.value
              );
              setResult(null);
            }}
            placeholder="36"
          />
        </label>

        <label className="field">
          Başlangıç Tarihi

          <input
            type="date"
            value={startDate}
            onChange={(event) => {
              setStartDate(
                event.target.value
              );
              setResult(null);
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
          background: "#f8faf9",
          border:
            "1px solid #e5eee8",
          color: "#617066",
          fontSize: 14,
          lineHeight: 1.7,
        }}
      >
        <strong>
          Kredi hesaplama nasıl yapılır?
        </strong>

        <p
          style={{
            margin:
              "7px 0 0",
          }}
        >
          Kredi tutarı, aylık faiz oranı
          ve vade bilgilerine göre eşit
          taksitli ödeme planı oluşturulur.
          Sonuçlara toplam faiz ve toplam
          geri ödeme dahil edilir.
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
          Kredimi Hesapla
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
              AYLIK TAKSİT
            </div>

            <div
              className="result-value"
              style={{
                fontSize: 42,
              }}
            >
              {formatMoney(
                result.monthlyPayment
              )}
            </div>
          </div>

          <div
            style={{
              marginTop: 20,
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 10,
            }}
          >
            <SummaryCard
              label="Kredi Tutarı"
              value={formatMoney(
                result.principal
              )}
            />

            <SummaryCard
              label="Toplam Faiz"
              value={formatMoney(
                result.totalInterest
              )}
              highlight
            />

            <SummaryCard
              label="Toplam Geri Ödeme"
              value={formatMoney(
                result.totalPayment
              )}
              highlight
            />

            <SummaryCard
              label="Vade"
              value={`${result.schedule.length} ay`}
            />
          </div>

          {/* ÖDEME PLANI */}

          <div
            style={{
              marginTop: 28,
            }}
          >
            <div className="eyebrow">
              ÖDEME PLANI
            </div>

            <h2
              style={{
                margin:
                  "6px 0 14px",
                fontSize: 27,
              }}
            >
              Aylık Ödeme Planı
            </h2>

            <div
              style={{
                overflowX:
                  "auto",
                border:
                  "1px solid #dce7df",
                borderRadius:
                  18,
                background:
                  "white",
              }}
            >
              <table
                style={{
                  width: "100%",
                  minWidth: 760,
                  borderCollapse:
                    "collapse",
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr
                    style={{
                      background:
                        "#f8faf9",
                    }}
                  >
                    <th style={thStyle}>
                      Ay
                    </th>

                    <th style={thStyle}>
                      Tarih
                    </th>

                    <th style={thStyle}>
                      Taksit
                    </th>

                    <th style={thStyle}>
                      Faiz
                    </th>

                    <th style={thStyle}>
                      Anapara
                    </th>

                    <th style={thStyle}>
                      Kalan Borç
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {result.schedule.map(
                    (row) => (
                      <tr
                        key={
                          row.installment
                        }
                      >
                        <td
                          style={
                            tdStyle
                          }
                        >
                          {row.installment}
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {formatDate(
                            row.date
                          )}
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {formatMoney(
                            row.payment
                          )}
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {formatMoney(
                            row.interest
                          )}
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {formatMoney(
                            row.principal
                          )}
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {formatMoney(
                            row.remaining
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* BİLGİ */}

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
            ℹ️ Bu hesaplama, kullanıcının
            girdiği aylık faiz oranı üzerinden
            eşit taksitli temel amortisman
            yöntemiyle hazırlanmıştır. Banka
            tahsis ücreti, sigorta, vergi/fon
            ve diğer masraflar bu ilk sürümde
            ayrıca hesaplanmamaktadır.
          </div>

          {/* GELECEK PRO ÖZELLİKLER */}

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
            <strong
              style={{
                color: "#15803d",
              }}
            >
              Yakında:
            </strong>

            <span
              style={{
                color: "#405248",
                marginLeft: 6,
              }}
            >
              Excel ödeme planı, PDF rapor,
              erken ödeme simülasyonu ve
              farklı senaryoları karşılaştırma.
            </span>
          </div>
        </>
      )}

      {/* CANLI ÖNİZLEME */}

      {!result && preview && (
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
            Aylık{" "}
            {formatMoney(
              preview.monthlyPayment
            )}
          </strong>
        </div>
      )}

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
        borderRadius: 16,
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
      <div
        style={{
          color: "#617066",
          fontSize: 13,
        }}
      >
        {label}
      </div>

      <strong
        style={{
          display: "block",
          marginTop: 5,
          color:
            highlight
              ? "#15803d"
              : "#10231a",
          fontSize: 19,
        }}
      >
        {value}
      </strong>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding:
    "13px 12px",
  textAlign:
    "right",
  borderBottom:
    "1px solid #dce7df",
  color:
    "#405248",
  whiteSpace:
    "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding:
    "12px",
  textAlign:
    "right",
  borderBottom:
    "1px solid #edf2ee",
  whiteSpace:
    "nowrap",
};