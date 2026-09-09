"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

type TransactionType = "Gelir" | "Gider";

type RecordRow = {
  date: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  payment: string;
  documentType: string;
  documentNo: string;
  counterparty: string;
  dueDate: string;
  vatRate: string;
};

type Totals = {
  income: number;
  expense: number;
  net: number;
  margin: number;
};

const FREE_LIMIT = 100;

const incomeCategories = [
  "Mal SatÄ±ÅŸÄ±",
  "Hizmet SatÄ±ÅŸÄ±",
  "E-Ticaret SatÄ±ÅŸÄ±",
  "Proje / Ä°ÅŸ Geliri",
  "DanÄ±ÅŸmanlÄ±k Geliri",
  "Kira Geliri",
  "Komisyon Geliri",
  "Faiz / Finansman Geliri",
  "DiÄŸer Faaliyet Geliri",
  "DiÄŸer Gelir",
];

const expenseCategories = [
  "Mal / Ticari Mal AlÄ±mÄ±",
  "Hammadde / Malzeme",
  "Ãœretim Gideri",
  "TaÅŸeron / DÄ±ÅŸarÄ±dan Hizmet",
  "Kargo / Nakliye",
  "Kira",
  "Personel Ãœcretleri",
  "SGK / Prim",
  "Elektrik",
  "Su",
  "DoÄŸalgaz",
  "Telefon",
  "Ä°nternet",
  "AkaryakÄ±t",
  "AraÃ§ Giderleri",
  "BakÄ±m / OnarÄ±m",
  "Ofis / KÄ±rtasiye",
  "YazÄ±lÄ±m / Abonelik",
  "Reklam / Pazarlama",
  "Muhasebe / Mali MÃ¼ÅŸavir",
  "Banka KomisyonlarÄ±",
  "Sigorta",
  "Vergi / HarÃ§",
  "Seyahat / Konaklama",
  "Yemek / Temsil",
  "Hukuk / DanÄ±ÅŸmanlÄ±k",
  "Amortisman",
  "Finansman / Kredi Faizi",
  "DiÄŸer Faaliyet Gideri",
  "DiÄŸer Gider",
];

const initialRows: RecordRow[] = [
  {
    date: "",
    type: "Gelir",
    category: "Mal SatÄ±ÅŸÄ±",
    description: "",
    amount: 0,
    payment: "Banka",
    documentType: "Fatura",
    documentNo: "",
    counterparty: "",
    dueDate: "",
    vatRate: "20",
  },
  {
    date: "",
    type: "Gider",
    category: "Kira",
    description: "",
    amount: 0,
    payment: "Banka",
    documentType: "Fatura",
    documentNo: "",
    counterparty: "",
    dueDate: "",
    vatRate: "20",
  },
  {
    date: "",
    type: "Gider",
    category: "Personel Ãœcretleri",
    description: "",
    amount: 0,
    payment: "Banka",
    documentType: "DiÄŸer",
    documentNo: "",
    counterparty: "",
    dueDate: "",
    vatRate: "0",
  },
  {
    date: "",
    type: "Gelir",
    category: "Hizmet SatÄ±ÅŸÄ±",
    description: "",
    amount: 0,
    payment: "Banka",
    documentType: "Fatura",
    documentNo: "",
    counterparty: "",
    dueDate: "",
    vatRate: "20",
  },
  {
    date: "",
    type: "Gider",
    category: "DiÄŸer Gider",
    description: "",
    amount: 0,
    payment: "Nakit",
    documentType: "FiÅŸ",
    documentNo: "",
    counterparty: "",
    dueDate: "",
    vatRate: "20",
  },
];

const money = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const inputStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
  maxWidth: "100%",
  boxSizing: "border-box",
  padding: "7px 5px",
  border: "1px solid #ccebd6",
  borderRadius: 7,
  background: "#ffffff",
  fontSize: 10,
  lineHeight: 1.2,
  outline: "none",
};

const cellStyle: CSSProperties = {
  padding: 3,
  border: "1px solid #dce7df",
  background: "#effaf2",
  overflow: "hidden",
  boxSizing: "border-box",
};

export default function OnMuhasebeDemo() {
  const [rows, setRows] = useState<RecordRow[]>(
    initialRows.map((row) => ({ ...row }))
  );

const [usage, setUsage] = useState(() => {
  if (typeof window === "undefined") return 0;

  try {
    const saved = localStorage.getItem(
      "miniHesapOnMuhasebeUsage"
    );

    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
});
  const [calculated, setCalculated] = useState<Totals | null>(null);
  const [showPremium, setShowPremium] = useState(false);

  const updateRow = (
    index: number,
    field: keyof RecordRow,
    value: string
  ) => {
    setRows((current) =>
      current.map((row, rowIndex) => {
        if (rowIndex !== index) {
          return row;
        }

        if (field === "type") {
          const newType = value as TransactionType;

          return {
            ...row,
            type: newType,
            category:
              newType === "Gelir"
                ? incomeCategories[0]
                : expenseCategories[0],
          };
        }

        if (field === "amount") {
          return {
            ...row,
            amount: Math.max(0, Number(value) || 0),
          };
        }

        return {
          ...row,
          [field]: value,
        };
      })
    );

    setCalculated(null);
  };

  const addRow = () => {
    setRows((current) => [
      ...current,
      {
        date: "",
        type: "Gelir",
        category: "Mal SatÄ±ÅŸÄ±",
        description: "",
        amount: 0,
        payment: "Banka",
        documentType: "Fatura",
        documentNo: "",
        counterparty: "",
        dueDate: "",
        vatRate: "20",
      },
    ]);

    setCalculated(null);
  };

  const calculateTotals = () => {
    if (usage >= FREE_LIMIT) {
      setShowPremium(true);
      return;
    }

    const totalIncome = rows
      .filter((row) => row.type === "Gelir")
      .reduce((sum, row) => sum + row.amount, 0);

    const totalExpense = rows
      .filter((row) => row.type === "Gider")
      .reduce((sum, row) => sum + row.amount, 0);

    const net = totalIncome - totalExpense;

    const margin =
      totalIncome > 0
        ? (net / totalIncome) * 100
        : 0;

    const nextUsage = usage + 1;

    setCalculated({
      income: totalIncome,
      expense: totalExpense,
      net,
      margin,
    });

    setUsage(nextUsage);

    try {
      localStorage.setItem(
        "miniHesapOnMuhasebeUsage",
        String(nextUsage)
      );
    } catch {
      // localStorage kullanÄ±lamazsa uygulama Ã§alÄ±ÅŸmaya devam eder.
    }
  };

  const reset = () => {
    setRows(initialRows.map((row) => ({ ...row })));
    setCalculated(null);
  };

  const remaining = Math.max(
    FREE_LIMIT - usage,
    0
  );

  const categorySummary = useMemo(() => {
    if (!calculated) {
      return [];
    }

    const summary = new Map<string, number>();

    rows.forEach((row) => {
      if (row.amount <= 0) {
        return;
      }

      const value =
        row.type === "Gelir"
          ? row.amount
          : -row.amount;

      summary.set(
        row.category,
        (summary.get(row.category) || 0) + value
      );
    });

    return Array.from(summary.entries())
      .sort(
        (a, b) =>
          Math.abs(b[1]) - Math.abs(a[1])
      )
      .slice(0, 8);
  }, [rows, calculated]);

  return (
    <section
      className="section"
      style={{
        paddingTop: 5,
        paddingBottom: 30,
      }}
    >
      <div className="container">
        <div
          style={{
            width: "100%",
            maxWidth: 1250,
            margin: "0 auto",
            boxSizing: "border-box",
            background: "#ffffff",
            border: "1px solid #dce7df",
            borderRadius: 22,
            padding: 14,
            boxShadow:
              "0 12px 35px rgba(16, 35, 26, 0.06)",
          }}
        >
          {/* ÃœST BÃ–LÃœM */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 14,
            }}
          >
            <div>
              <div className="eyebrow">
                ÃœCRETSÄ°Z DEMO
              </div>

              <h2
                style={{
                  margin: "5px 0 3px",
                  fontSize:
                    "clamp(22px, 3vw, 28px)",
                  lineHeight: 1.1,
                }}
              >
                Profesyonel Ã–n Muhasebe Takip
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#617066",
                  fontSize: 13,
                }}
              >
                Gelir, gider, fatura, cari ve
                Ã¶deme bilgilerinizi tek tabloda
                takip edin.
              </p>
            </div>

            <div
              style={{
                padding: "10px 15px",
                borderRadius: 13,
                background:
                  remaining > 0
                    ? "#effaf2"
                    : "#fef2f2",
                border:
                  remaining > 0
                    ? "1px solid #ccebd6"
                    : "1px solid #fecaca",
                textAlign: "center",
                minWidth: 135,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#617066",
                }}
              >
                ÃœCRETSÄ°Z KULLANIM
              </div>

              <div
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color:
                    remaining > 0
                      ? "#15803d"
                      : "#dc2626",
                }}
              >
                {usage} / {FREE_LIMIT}
              </div>

              <div
                style={{
                  fontSize: 10,
                  color: "#617066",
                }}
              >
                Kalan: {remaining}
              </div>
            </div>

            <button
              type="button"
              onClick={reset}
              style={{
                border:
                  "1px solid #dce7df",
                background: "#ffffff",
                borderRadius: 11,
                padding: "9px 14px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Temizle
            </button>
          </div>

          {/* BÄ°LGÄ° */}

          <div
            style={{
              padding: "10px 12px",
              marginBottom: 12,
              borderRadius: 12,
              background: "#f8faf9",
              border:
                "1px solid #e5eee8",
              color: "#47584d",
              fontSize: 11,
              lineHeight: 1.5,
            }}
          >
            <strong>
              Profesyonel kayÄ±t mantÄ±ÄŸÄ±:
            </strong>{" "}
            Ä°ÅŸlem tÃ¼rÃ¼nÃ¼ seÃ§in, uygun kategoriyi
            belirleyin; tutar, belge, cari, Ã¶deme
            ve vade bilgilerini girin. SonuÃ§lar
            yalnÄ±zca hesaplama butonuna basÄ±ldÄ±ÄŸÄ±nda
            gÃ¶sterilir.
          </div>

          {/* TABLO */}

          <div
            style={{
              width: "100%",
              overflow: "hidden",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: 0,
                tableLayout: "fixed",
                borderCollapse: "collapse",
                fontSize: 10,
              }}
            >
              <colgroup>
                <col style={{ width: "8%" }} />
                <col style={{ width: "5%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "9%" }} />
                <col style={{ width: "6%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "9%" }} />
              </colgroup>

              <thead>
                <tr>
                  {[
                    "TARÄ°H",
                    "TÃœR",
                    "KATEGORÄ°",
                    "AÃ‡IKLAMA",
                    "TUTAR",
                    "KDV",
                    "BELGE",
                    "BELGE NO",
                    "CARÄ° / MÃœÅTERÄ°",
                    "Ã–DEME",
                    "VADE",
                  ].map((title) => (
                    <th
                      key={title}
                      style={{
                        padding:
                          "7px 3px",
                        background:
                          "#15803d",
                        color: "#ffffff",
                        fontSize: 9,
                        lineHeight: 1.1,
                        border:
                          "1px solid #dce7df",
                        whiteSpace:
                          "normal",
                        wordBreak:
                          "break-word",
                        overflow:
                          "hidden",
                      }}
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map(
                  (row, index) => {
                    const categories =
                      row.type === "Gelir"
                        ? incomeCategories
                        : expenseCategories;

                    return (
                      <tr key={index}>
                        {/* TARÄ°H */}

                        <td style={cellStyle}>
                          <input
                            type="date"
                            value={row.date}
                            onChange={(event) =>
                              updateRow(
                                index,
                                "date",
                                event.target.value
                              )
                            }
                            style={inputStyle}
                          />
                        </td>

                        {/* TÃœR */}

                        <td style={cellStyle}>
                          <select
                            value={row.type}
                            onChange={(event) =>
                              updateRow(
                                index,
                                "type",
                                event.target.value
                              )
                            }
                            style={inputStyle}
                          >
                            <option value="Gelir">
                              Gelir
                            </option>

                            <option value="Gider">
                              Gider
                            </option>
                          </select>
                        </td>

                        {/* KATEGORÄ° */}

                        <td style={cellStyle}>
                          <select
                            value={row.category}
                            onChange={(event) =>
                              updateRow(
                                index,
                                "category",
                                event.target.value
                              )
                            }
                            style={inputStyle}
                          >
                            {categories.map(
                              (category) => (
                                <option
                                  key={category}
                                  value={category}
                                >
                                  {category}
                                </option>
                              )
                            )}
                          </select>
                        </td>

                        {/* AÃ‡IKLAMA */}

                        <td style={cellStyle}>
                          <input
                            type="text"
                            value={row.description}
                            onChange={(event) =>
                              updateRow(
                                index,
                                "description",
                                event.target.value
                              )
                            }
                            placeholder="AÃ§Ä±klama"
                            style={inputStyle}
                          />
                        </td>

                        {/* TUTAR */}

                        <td style={cellStyle}>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                              row.amount === 0
                                ? ""
                                : row.amount
                            }
                            onChange={(event) =>
                              updateRow(
                                index,
                                "amount",
                                event.target.value
                              )
                            }
                            placeholder="0"
                            style={inputStyle}
                          />
                        </td>

                        {/* KDV */}

                        <td style={cellStyle}>
                          <select
                            value={row.vatRate}
                            onChange={(event) =>
                              updateRow(
                                index,
                                "vatRate",
                                event.target.value
                              )
                            }
                            style={inputStyle}
                          >
                         <option value="0">
                         %0
                        </option>

                        <option value="1">
                          %1
</option>

<option value="8">
  %8
</option>

<option value="10">
  %10
</option>

<option value="10">
  %18
</option>

<option value="20">
  %20
</option>
                          </select>
                        </td>

                        {/* BELGE */}

                        <td style={cellStyle}>
                          <select
                            value={row.documentType}
                            onChange={(event) =>
                              updateRow(
                                index,
                                "documentType",
                                event.target.value
                              )
                            }
                            style={inputStyle}
                          >
                            <option>
                              Fatura
                            </option>

                            <option>
                              e-Fatura
                            </option>

                            <option>
                              e-ArÅŸiv
                            </option>

                            <option>
                              FiÅŸ
                            </option>

                            <option>
                              Makbuz
                            </option>

                            <option>
                              Banka Dekontu
                            </option>

                            <option>
                              DiÄŸer
                            </option>
                          </select>
                        </td>

                        {/* BELGE NO */}

                        <td style={cellStyle}>
                          <input
                            type="text"
                            value={row.documentNo}
                            onChange={(event) =>
                              updateRow(
                                index,
                                "documentNo",
                                event.target.value
                              )
                            }
                            placeholder="No"
                            style={inputStyle}
                          />
                        </td>

                        {/* CARÄ° */}

                        <td style={cellStyle}>
                          <input
                            type="text"
                            value={
                              row.counterparty
                            }
                            onChange={(event) =>
                              updateRow(
                                index,
                                "counterparty",
                                event.target.value
                              )
                            }
                            placeholder="Cari / mÃ¼ÅŸteri"
                            style={inputStyle}
                          />
                        </td>

                        {/* Ã–DEME */}

                        <td style={cellStyle}>
                          <select
                            value={row.payment}
                            onChange={(event) =>
                              updateRow(
                                index,
                                "payment",
                                event.target.value
                              )
                            }
                            style={inputStyle}
                          >
                            <option>
                              Banka
                            </option>

                            <option>
                              Nakit
                            </option>

                            <option>
                              Kredi KartÄ±
                            </option>

                            <option>
                              Havale / EFT
                            </option>

                            <option>
                              Ã‡ek
                            </option>

                            <option>
                              Senet
                            </option>

                            <option>
                              DiÄŸer
                            </option>
                          </select>
                        </td>

                        {/* VADE */}

                        <td style={cellStyle}>
                          <input
                            type="date"
                            value={row.dueDate}
                            onChange={(event) =>
                              updateRow(
                                index,
                                "dueDate",
                                event.target.value
                              )
                            }
                            style={inputStyle}
                          />
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>

          {/* BUTONLAR */}

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent:
                "center",
              alignItems: "center",
              flexWrap: "wrap",
              marginTop: 16,
            }}
          >
            <button
              type="button"
              onClick={addRow}
              style={{
                border:
                  "1px solid #ccebd6",
                background:
                  "#effaf2",
                color: "#166534",
                borderRadius: 11,
                padding:
                  "11px 18px",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              + SatÄ±r Ekle
            </button>

            <button
              type="button"
              onClick={calculateTotals}
              style={{
                width: "100%",
                maxWidth: 500,
                border: "none",
                borderRadius: 13,
                padding:
                  "13px 20px",
                background:
                  usage >= FREE_LIMIT
                    ? "#dc2626"
                    : "#16a34a",
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              {usage >= FREE_LIMIT
                ? "ğŸ”’ Premium'a GeÃ§"
                : "ğŸ§® Gelir / Gideri Hesapla"}
            </button>
          </div>

          {/* SONUÃ‡ YOKSA */}

          {!calculated && (
            <div
              style={{
                marginTop: 14,
                padding: 13,
                borderRadius: 13,
                background:
                  "#f8faf9",
                border:
                  "1px dashed #cbd5cf",
                textAlign:
                  "center",
                color:
                  "#617066",
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              ğŸ‘† KayÄ±tlarÄ±nÄ±zÄ± girin.
              Toplam gelir, toplam
              gider, net sonuÃ§ ve
              kategori Ã¶zetini gÃ¶rmek
              iÃ§in{" "}
              <strong>
                â€œGelir / Gideri Hesaplaâ€
              </strong>{" "}
              butonuna basÄ±n.
            </div>
          )}

          {/* SONUÃ‡LAR */}

          {calculated && (
            <>
              <div
                style={{
                  marginTop: 14,
                  padding: 13,
                  borderRadius: 13,
                  background:
                    "#effaf2",
                  border:
                    "1px solid #ccebd6",
                  color:
                    "#166534",
                  textAlign:
                    "center",
                  fontWeight: 800,
                  fontSize: 12,
                }}
              >
                âœ… Ã–n muhasebe Ã¶zeti
                hesaplandÄ±.
                <br />
                Bu kullanÄ±mÄ±nÄ±z:{" "}
                {usage} / {FREE_LIMIT}
              </div>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(170px, 1fr))",
                  gap: 10,
                  marginTop: 14,
                }}
              >
                <Summary
                  title="Toplam Gelir"
                  value={money(
                    calculated.income
                  )}
                />

                <Summary
                  title="Toplam Gider"
                  value={money(
                    calculated.expense
                  )}
                />

                <Summary
                  title="Net KÃ¢r / Zarar"
                  value={money(
                    calculated.net
                  )}
                  valueColor={
                    calculated.net >= 0
                      ? "#15803d"
                      : "#dc2626"
                  }
                />

                <Summary
                  title="KÃ¢r MarjÄ±"
                  value={`${calculated.margin.toFixed(
                    2
                  )}%`}
                />
              </div>

              {/* KATEGORÄ° Ã–ZETÄ° */}

              {categorySummary.length >
                0 && (
                <div
                  style={{
                    marginTop: 14,
                    padding: 16,
                    borderRadius: 15,
                    background:
                      "#f8faf9",
                    border:
                      "1px solid #e5eee8",
                  }}
                >
                  <h3
                    style={{
                      margin:
                        "0 0 10px",
                      fontSize: 17,
                    }}
                  >
                    ğŸ“Š Kategori Ã–zeti
                  </h3>

                  <div
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(190px, 1fr))",
                      gap: 8,
                    }}
                  >
                    {categorySummary.map(
                      ([category, value]) => (
                        <div
                          key={category}
                          style={{
                            padding: 11,
                            borderRadius: 11,
                            background:
                              "#ffffff",
                            border:
                              "1px solid #e5eee8",
                          }}
                        >
                          <div
                            style={{
                              color:
                                "#617066",
                              fontSize: 11,
                              fontWeight:
                                700,
                            }}
                          >
                            {category}
                          </div>

                          <div
                            style={{
                              marginTop: 3,
                              fontSize: 16,
                              fontWeight:
                                900,
                              color:
                                value >=
                                0
                                  ? "#15803d"
                                  : "#dc2626",
                            }}
                          >
                            {money(value)}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* PREMIUM */}

          <div
            style={{
              marginTop: 16,
              padding: 16,
              borderRadius: 14,
              background:
                "#f8faf9",
              border:
                "1px solid #e5eee8",
            }}
          >
            <div
              style={{
                fontWeight: 900,
                marginBottom: 9,
                textAlign:
                  "center",
                fontSize: 14,
              }}
            >
              ğŸ’ Profesyonel Ã–n
              Muhasebe Excel'i
            </div>

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(170px, 1fr))",
                gap: 7,
                color:
                  "#47584d",
                fontSize: 11,
                textAlign:
                  "center",
              }}
            >
              <div>
                ğŸ“Š YÄ±llÄ±k Dashboard
              </div>

              <div>
                ğŸ“… AylÄ±k Gelir / Gider
              </div>

              <div>
                ğŸ·ï¸ Kategori Analizi
              </div>

              <div>
                ğŸ‘¥ Cari Takip
              </div>

              <div>
                ğŸ’³ Ã–deme Takibi
              </div>

              <div>
                ğŸ“¥ Excel Raporu
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PREMIUM MODAL */}

      {showPremium && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background:
              "rgba(15,23,42,0.65)",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            padding: 20,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 500,
              background:
                "#ffffff",
              borderRadius: 24,
              padding: 30,
              textAlign:
                "center",
              boxShadow:
                "0 25px 70px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                fontSize: 45,
              }}
            >
              ğŸ”’
            </div>

            <div
              className="eyebrow"
              style={{
                marginTop: 8,
              }}
            >
              MÄ°NÄ°HESAP PREMIUM
            </div>

            <h2
              style={{
                fontSize: 27,
                margin:
                  "6px 0 12px",
              }}
            >
              Ãœcretsiz kullanÄ±m
              hakkÄ±nÄ±z doldu
            </h2>

            <p
              style={{
                color:
                  "#617066",
                lineHeight:
                  1.7,
              }}
            >
              Profesyonel Ã¶n
              muhasebe Excel'ini
              kullanmak iÃ§in
              Premium sÃ¼rÃ¼mÃ¼
              inceleyebilirsiniz.
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "/premium/on-muhasebe";
              }}
              style={{
                width: "100%",
                border: "none",
                borderRadius: 14,
                padding:
                  "14px 20px",
                background:
                  "#16a34a",
                color:
                  "#ffffff",
                fontWeight:
                  900,
                fontSize: 16,
                cursor:
                  "pointer",
              }}
            >
              ğŸ’ Premium'u Ä°ncele
            </button>

            <button
              type="button"
              onClick={() =>
                setShowPremium(false)
              }
              style={{
                marginTop: 10,
                border:
                  "1px solid #dce7df",
                background:
                  "#ffffff",
                borderRadius: 12,
                padding:
                  "10px 20px",
                fontWeight:
                  800,
                cursor:
                  "pointer",
              }}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function Summary({
  title,
  value,
  valueColor,
}: {
  title: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div
      style={{
        padding: 15,
        borderRadius: 14,
        background:
          "#f8faf9",
        border:
          "1px solid #e5eee8",
      }}
    >
      <div
        style={{
          fontSize: 12,
          color:
            "#617066",
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 20,
          fontWeight: 900,
          color:
            valueColor ||
            "#10231a",
        }}
      >
        {value}
      </div>
    </div>
  );
}