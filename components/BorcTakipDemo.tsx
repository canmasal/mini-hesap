"use client";

import { useEffect, useMemo, useState } from "react";

type BankRow = {
  bank: string;
  cashLimit: number;
  cashDebt: number;
  cardLimit: number;
  cardDebt: number;
};

const FREE_LIMIT = 3;

const initialBanks: BankRow[] = [
  {
    bank: "AKBANK",
    cashLimit: 0,
    cashDebt: 0,
    cardLimit: 0,
    cardDebt: 0,
  },
  {
    bank: "HALKBANK",
    cashLimit: 0,
    cashDebt: 0,
    cardLimit: 0,
    cardDebt: 0,
  },
  {
    bank: "İŞ BANKASI",
    cashLimit: 0,
    cashDebt: 0,
    cardLimit: 0,
    cardDebt: 0,
  },
  {
    bank: "ING BANK",
    cashLimit: 0,
    cashDebt: 0,
    cardLimit: 0,
    cardDebt: 0,
  },
  {
    bank: "YAPI KREDİ",
    cashLimit: 0,
    cashDebt: 0,
    cardLimit: 0,
    cardDebt: 0,
  },
  {
    bank: "TEB",
    cashLimit: 0,
    cashDebt: 0,
    cardLimit: 0,
    cardDebt: 0,
  },
  {
    bank: "QNB",
    cashLimit: 0,
    cashDebt: 0,
    cardLimit: 0,
    cardDebt: 0,
  },
  {
    bank: "GARANTİ BBVA",
    cashLimit: 0,
    cashDebt: 0,
    cardLimit: 0,
    cardDebt: 0,
  },
  {
    bank: "ZİRAAT BANKASI",
    cashLimit: 0,
    cashDebt: 0,
    cardLimit: 0,
    cardDebt: 0,
  },
  {
    bank: "VAKIFBANK",
    cashLimit: 0,
    cashDebt: 0,
    cardLimit: 0,
    cardDebt: 0,
  },
];

const money = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  }).format(value);

export default function BorcTakipDemo() {
  const [rows, setRows] = useState<BankRow[]>(initialBanks);

  const [usage, setUsage] = useState(0);

  const [showPremium, setShowPremium] = useState(false);

  /*
   * Hesaplama yapıldı mı?
   *
   * FALSE:
   * Toplamlar gizli
   *
   * TRUE:
   * Toplamlar gösterilir
   */
  const [calculated, setCalculated] = useState(false);

  /*
   * =====================================================
   * LOCAL STORAGE
   * =====================================================
   */

  useEffect(() => {
    const saved = Number(
      window.localStorage.getItem(
        "miniHesapBorcTakipUsage"
      ) || "0"
    );

    setUsage(
      Math.min(saved, FREE_LIMIT)
    );
  }, []);

  /*
   * =====================================================
   * TOPLAMLAR
   * =====================================================
   *
   * Burada hesaplama yapılmaya devam ediyor.
   *
   * Fakat kullanıcıya sadece
   * "calculated === true" olduğunda
   * göstereceğiz.
   */

  const totals = useMemo(() => {
    const cashLimit = rows.reduce(
      (sum, row) =>
        sum + row.cashLimit,
      0
    );

    const cashDebt = rows.reduce(
      (sum, row) =>
        sum + row.cashDebt,
      0
    );

    const cardLimit = rows.reduce(
      (sum, row) =>
        sum + row.cardLimit,
      0
    );

    const cardDebt = rows.reduce(
      (sum, row) =>
        sum + row.cardDebt,
      0
    );

    const debt =
      cashDebt + cardDebt;

    const limit =
      cashLimit + cardLimit;

    const remaining =
      limit - debt;

    const ratio =
      limit > 0
        ? debt / limit
        : 0;

    return {
      cashLimit,
      cashDebt,
      cardLimit,
      cardDebt,
      debt,
      limit,
      remaining,
      ratio,
    };
  }, [rows]);

  /*
   * =====================================================
   * BANKA BİLGİSİ GÜNCELLE
   * =====================================================
   */

  const update = (
    index: number,
    field: keyof Omit<
      BankRow,
      "bank"
    >,
    value: string
  ) => {
    const numeric =
      Math.max(
        0,
        Number(value) || 0
      );

    setRows(
      (current) =>
        current.map(
          (row, i) =>
            i === index
              ? {
                  ...row,
                  [field]:
                    numeric,
                }
              : row
        )
    );

    /*
     * Kullanıcı yeni rakam girdiğinde
     * eski sonucu tekrar gizle.
     *
     * Böylece:
     *
     * Hesapla
     * ↓
     * Sonuç
     *
     * sonra rakam değişirse
     *
     * Sonuç tekrar gizlenir.
     */

    setCalculated(false);
  };

  /*
   * =====================================================
   * HESAPLA
   * =====================================================
   */

  const handleCalculate = () => {
    // Ücretsiz kullanım hakkı bittiyse sonuç gösterme,
    // doğrudan Premium ekranına yönlendir.
    if (usage >= FREE_LIMIT) {
      setShowPremium(true);
      return;
    }

    // Bu tıklamayı bir kullanım olarak say.
    const nextUsage = usage + 1;

    setUsage(nextUsage);

    try {
      window.localStorage.setItem(
        "miniHesapBorcTakipUsage",
        String(nextUsage)
      );
    } catch {
      // LocalStorage kullanılamıyorsa hesaplamayı yine de engelleme.
    }

    // ÖNEMLİ: Sonuçların görünmesini sağlayan tek durum budur.
    setCalculated(true);
  };

  /*
   * =====================================================
   * TEMİZLE
   * =====================================================
   */

  const reset = () => {
    setRows(
      initialBanks
    );

    setCalculated(
      false
    );
  };

  /*
   * =====================================================
   * LIMIT KULLANIM RENGİ
   * =====================================================
   */

  const getUsageColor =
    () => {
      const percentage =
        totals.ratio *
        100;

      if (
        percentage <=
        40
      ) {
        return "#15803d";
      }

      if (
        percentage <=
        70
      ) {
        return "#d97706";
      }

      return "#dc2626";
    };

  /*
   * =====================================================
   * KALAN ÜCRETSİZ KULLANIM
   * =====================================================
   */

  const remainingFreeUsage =
    Math.max(
      FREE_LIMIT -
        usage,
      0
    );

  return (
    <section
      className="section"
      style={{
        paddingTop: 5,
      }}
    >
      <div className="container">

        <div
          style={{
            maxWidth: 1200,
            margin:
              "0 auto",
            background:
              "#ffffff",
            border:
              "1px solid #dce7df",
            borderRadius: 22,
            padding: 18,
            boxShadow:
              "0 12px 35px rgba(16,35,26,0.06)",
          }}
        >

          {/* =====================================================
              ÜST BİLGİ
          ===================================================== */}

          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              gap: 15,
              flexWrap:
                "wrap",
              marginBottom:
                18,
            }}
          >

            <div>

              <div className="eyebrow">
                ÜCRETSİZ DEMO
              </div>

              <h2
                style={{
                  margin:
                    "6px 0 4px",
                  fontSize: 28,
                }}
              >
                Borç Durum Tablosu
              </h2>

              <p
                style={{
                  margin: 0,
                  color:
                    "#617066",
                }}
              >
                Banka ve kredi
                kartı borçlarınızı
                tek tabloda takip
                edin.
              </p>

            </div>

            {/* =====================================================
                KULLANIM SAYACI
            ===================================================== */}

            <div
              style={{
                padding:
                  "12px 16px",
                borderRadius:
                  14,
                background:
                  remainingFreeUsage >
                  0
                    ? "#effaf2"
                    : "#fef2f2",
                border:
                  remainingFreeUsage >
                  0
                    ? "1px solid #ccebd6"
                    : "1px solid #fecaca",
                textAlign:
                  "center",
                minWidth:
                  180,
              }}
            >

              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color:
                    "#617066",
                  marginBottom:
                    4,
                }}
              >
                ÜCRETSİZ KULLANIM
              </div>

              <div
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color:
                    remainingFreeUsage >
                    0
                      ? "#15803d"
                      : "#dc2626",
                }}
              >
                {usage} /{" "}
                {FREE_LIMIT}
              </div>

              <div
                style={{
                  fontSize: 12,
                  marginTop: 3,
                  color:
                    "#617066",
                }}
              >
                Kalan:{" "}
                {
                  remainingFreeUsage
                }
              </div>

            </div>

            {/* TEMİZLE */}

            <button
              type="button"
              onClick={
                reset
              }
              style={{
                border:
                  "1px solid #dce7df",
                background:
                  "#ffffff",
                borderRadius:
                  12,
                padding:
                  "10px 15px",
                fontWeight:
                  800,
                cursor:
                  "pointer",
              }}
            >
              Temizle
            </button>

          </div>

          {/* =====================================================
              TABLO
          ===================================================== */}

          <div
            style={{
              overflowX:
                "auto",
            }}
          >

            <table
              style={{
                width:
                  "100%",
                minWidth:
                  1050,
                borderCollapse:
                  "collapse",
              }}
            >

              <thead>

                <tr>

                  {[
                    "BANKA",
                    "NAKİT LİMİTİ",
                    "NAKİT AVANS BORCU",
                    "KART LİMİTİ",
                    "KART BORCU",
                    "TOPLAM BORÇ",
                    "TOPLAM LİMİT",
                    "KALAN LİMİT",
                  ].map(
                    (
                      head
                    ) => (
                      <th
                        key={
                          head
                        }
                        style={{
                          padding:
                            12,
                          background:
                            "#15803d",
                          color:
                            "#ffffff",
                          fontSize:
                            12,
                          textAlign:
                            "center",
                          border:
                            "1px solid #dce7df",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {
                          head
                        }
                      </th>
                    )
                  )}

                </tr>

              </thead>

              <tbody>

                {rows.map(
                  (
                    row,
                    index
                  ) => {

                    const debt =
                      row.cashDebt +
                      row.cardDebt;

                    const limit =
                      row.cashLimit +
                      row.cardLimit;

                    const remaining =
                      limit -
                      debt;

                    return (
                      <tr
                        key={
                          row.bank
                        }
                      >

                        {/* BANKA */}

                        <td
                          style={{
                            padding:
                              11,
                            border:
                              "1px solid #dce7df",
                            fontWeight:
                              800,
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {
                            row.bank
                          }
                        </td>

                        {/* GİRİŞLER */}

                        {(
                          [
                            [
                              "cashLimit",
                              row.cashLimit,
                            ],
                            [
                              "cashDebt",
                              row.cashDebt,
                            ],
                            [
                              "cardLimit",
                              row.cardLimit,
                            ],
                            [
                              "cardDebt",
                              row.cardDebt,
                            ],
                          ] as const
                        ).map(
                          ([
                            field,
                            value,
                          ]) => (
                            <td
                              key={
                                field
                              }
                              style={{
                                padding:
                                  7,
                                border:
                                  "1px solid #dce7df",
                                background:
                                  "#effaf2",
                              }}
                            >

                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={
                                  value ||
                                  ""
                                }
                                onChange={(
                                  e
                                ) =>
                                  update(
                                    index,
                                    field,
                                    e
                                      .target
                                      .value
                                  )
                                }
                                style={{
                                  width:
                                    "100%",
                                  boxSizing:
                                    "border-box",
                                  padding:
                                    "9px 8px",
                                  border:
                                    "1px solid #ccebd6",
                                  borderRadius:
                                    9,
                                  background:
                                    "#ffffff",
                                  fontWeight:
                                    700,
                                }}
                              />

                            </td>
                          )
                        )}

                        {/* =================================================
                            TOPLAM BORÇ
                            HESAPLANMADAN GİZLİ
                        ================================================= */}

                        <td
                          style={{
                            padding:
                              11,
                            border:
                              "1px solid #dce7df",
                            textAlign:
                              "right",
                            fontWeight:
                              800,
                          }}
                        >
                          {calculated
                            ? money(
                                debt
                              )
                            : "—"}
                        </td>

                        {/* TOPLAM LİMİT */}

                        <td
                          style={{
                            padding:
                              11,
                            border:
                              "1px solid #dce7df",
                            textAlign:
                              "right",
                            fontWeight:
                              800,
                          }}
                        >
                          {calculated
                            ? money(
                                limit
                              )
                            : "—"}
                        </td>

                        {/* KALAN LİMİT */}

                        <td
                          style={{
                            padding:
                              11,
                            border:
                              "1px solid #dce7df",
                            textAlign:
                              "right",
                            fontWeight:
                              900,
                            color:
                              calculated
                                ? remaining <
                                  0
                                  ? "#b91c1c"
                                  : "#15803d"
                                : "#617066",
                          }}
                        >
                          {calculated
                            ? money(
                                remaining
                              )
                            : "—"}
                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

              {/* =====================================================
                  TOPLAM SATIRI
              ===================================================== */}

              <tfoot>

                <tr>

                  <td
                    style={{
                      padding:
                        13,
                      border:
                        "1px solid #dce7df",
                      fontWeight:
                        900,
                      color:
                        "#dc2626",
                    }}
                  >
                    TOPLAM
                  </td>

                  <td
                    style={{
                      padding:
                        13,
                      border:
                        "1px solid #dce7df",
                      fontWeight:
                        900,
                    }}
                  >
                    {calculated
                      ? money(
                          totals.cashLimit
                        )
                      : "—"}
                  </td>

                  <td
                    style={{
                      padding:
                        13,
                      border:
                        "1px solid #dce7df",
                      fontWeight:
                        900,
                    }}
                  >
                    {calculated
                      ? money(
                          totals.cashDebt
                        )
                      : "—"}
                  </td>

                  <td
                    style={{
                      padding:
                        13,
                      border:
                        "1px solid #dce7df",
                      fontWeight:
                        900,
                    }}
                  >
                    {calculated
                      ? money(
                          totals.cardLimit
                        )
                      : "—"}
                  </td>

                  <td
                    style={{
                      padding:
                        13,
                      border:
                        "1px solid #dce7df",
                      fontWeight:
                        900,
                    }}
                  >
                    {calculated
                      ? money(
                          totals.cardDebt
                        )
                      : "—"}
                  </td>

                  <td
                    style={{
                      padding:
                        13,
                      border:
                        "1px solid #dce7df",
                      fontWeight:
                        900,
                    }}
                  >
                    {calculated
                      ? money(
                          totals.debt
                        )
                      : "—"}
                  </td>

                  <td
                    style={{
                      padding:
                        13,
                      border:
                        "1px solid #dce7df",
                      fontWeight:
                        900,
                    }}
                  >
                    {calculated
                      ? money(
                          totals.limit
                        )
                      : "—"}
                  </td>

                  <td
                    style={{
                      padding:
                        13,
                      border:
                        "1px solid #dce7df",
                      fontWeight:
                        900,
                    }}
                  >
                    {calculated
                      ? money(
                          totals.remaining
                        )
                      : "—"}
                  </td>

                </tr>

              </tfoot>

            </table>

          </div>

          {/* =====================================================
              HESAPLA BUTONU
          ===================================================== */}

          <div
            style={{
              marginTop:
                20,
              display:
                "flex",
              justifyContent:
                "center",
            }}
          >

            <button
              type="button"
              onClick={
                handleCalculate
              }
              style={{
                width:
                  "100%",
                maxWidth:
                  500,
                padding:
                  "15px 24px",
                border:
                  "none",
                borderRadius:
                  14,
                background:
                  usage >=
                  FREE_LIMIT
                    ? "#dc2626"
                    : "#16a34a",
                color:
                  "#ffffff",
                fontSize:
                  16,
                fontWeight:
                  900,
                cursor:
                  "pointer",
                boxShadow:
                  "0 8px 20px rgba(22,163,74,0.18)",
              }}
            >
              {usage >=
              FREE_LIMIT
                ? "🔒 Premium'a Geç"
                : "🧮 Borçları Hesapla"}
            </button>

          </div>

          {/* =====================================================
              HESAPLAMA SONUCU MESAJI
          ===================================================== */}

          {calculated && (
            <div
              style={{
                marginTop:
                  16,
                padding:
                  14,
                borderRadius:
                  14,
                background:
                  "#effaf2",
                border:
                  "1px solid #ccebd6",
                color:
                  "#166534",
                textAlign:
                  "center",
                fontWeight:
                  800,
              }}
            >
              ✅ Borç analizi
              hesaplandı.

              <br />

              Bu kullanımınız:

              <strong>
                {" "}
                {usage} /{" "}
                {FREE_LIMIT}
              </strong>
            </div>
          )}

          {/* =====================================================
              ÖZET KARTLARI
              HESAPLAMA YAPILMADAN GİZLİ
          ===================================================== */}

          {calculated && (
            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(190px, 1fr))",
                gap: 12,
                marginTop:
                  20,
              }}
            >

              <SummaryCard
                title="Toplam Borç"
                value={money(
                  totals.debt
                )}
              />

              <SummaryCard
                title="Toplam Limit"
                value={money(
                  totals.limit
                )}
              />

              <SummaryCard
                title="Kullanılabilir Limit"
                value={money(
                  totals.remaining
                )}
              />

              <SummaryCard
                title="Limit Kullanımı"
                value={`${(
                  totals.ratio *
                  100
                ).toFixed(2)}%`}
                valueColor={
                  getUsageColor()
                }
              />

            </div>
          )}

          {/* =====================================================
              HESAPLANMADI MESAJI
          ===================================================== */}

          {!calculated && (
            <div
              style={{
                marginTop:
                  18,
                padding:
                  16,
                borderRadius:
                  14,
                background:
                  "#f8faf9",
                border:
                  "1px dashed #cbd5cf",
                textAlign:
                  "center",
                color:
                  "#617066",
                fontWeight:
                  700,
              }}
            >
              👆 Banka bilgilerinizi
              girin ve toplam borcunuzu
              görmek için{" "}
              <strong>
                "Borçları Hesapla"
              </strong>{" "}
              butonuna basın.
            </div>
          )}

          {/* =====================================================
              PREMIUM BİLGİ
          ===================================================== */}

          <div
            style={{
              marginTop:
                20,
              padding:
                16,
              borderRadius:
                15,
              background:
                "#f8faf9",
              border:
                "1px solid #e5eee8",
              textAlign:
                "center",
            }}
          >

            <div
              style={{
                fontWeight:
                  900,
                marginBottom:
                  5,
              }}
            >
              💎 Profesyonel Excel
            </div>

            <div
              style={{
                color:
                  "#617066",
                fontSize:
                  14,
                lineHeight:
                  1.6,
              }}
            >
              Ücretsiz demo ile
              borçlarınızı
              hesaplayın.
              Profesyonel Excel
              sürümünde daha
              gelişmiş borç
              takip özellikleri
              sunacağız.
            </div>

          </div>

        </div>
      </div>

      {/* =====================================================
          PREMIUM POPUP
      ===================================================== */}

      {showPremium && (
        <div
          style={{
            position:
              "fixed",
            inset: 0,
            zIndex:
              9999,
            background:
              "rgba(15,23,42,0.65)",
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            padding: 20,
          }}
        >

          <div
            style={{
              width:
                "100%",
              maxWidth:
                500,
              background:
                "#ffffff",
              borderRadius:
                24,
              padding:
                30,
              boxShadow:
                "0 25px 70px rgba(0,0,0,0.25)",
              textAlign:
                "center",
            }}
          >

            <div
              style={{
                fontSize:
                  45,
                marginBottom:
                  10,
              }}
            >
              🔒
            </div>

            <div
              className="eyebrow"
              style={{
                marginBottom:
                  8,
              }}
            >
              MİNİHESAP PREMIUM
            </div>

            <h2
              style={{
                fontSize:
                  28,
                margin:
                  "5px 0 12px",
              }}
            >
              Ücretsiz kullanım
              hakkınız doldu
            </h2>

            <p
              style={{
                color:
                  "#617066",
                lineHeight:
                  1.7,
                margin:
                  "0 0 20px",
              }}
            >
              Borç takip sistemini
              daha gelişmiş
              özelliklerle kullanmak
              için profesyonel Excel
              sürümünü
              inceleyebilirsiniz.
            </p>

            <div
              style={{
                display:
                  "grid",
                gap: 10,
                textAlign:
                  "left",
                marginBottom:
                  22,
              }}
            >

              {[
                "✅ Daha fazla banka",
                "✅ Aylık borç geçmişi",
                "✅ Taksit takip sistemi",
                "✅ Limit kullanım analizi",
                "✅ Grafik ve raporlar",
                "✅ Excel / PDF çıktısı",
              ].map(
                (
                  feature
                ) => (
                  <div
                    key={
                      feature
                    }
                    style={{
                      padding:
                        "10px 12px",
                      borderRadius:
                        10,
                      background:
                        "#f8faf9",
                      fontWeight:
                        700,
                    }}
                  >
                    {
                      feature
                    }
                  </div>
                )
              )}

            </div>

            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "/premium/borc-takip";
              }}
              style={{
                width:
                  "100%",
                border:
                  "none",
                borderRadius:
                  14,
                padding:
                  "14px 20px",
                background:
                  "#16a34a",
                color:
                  "#ffffff",
                fontSize:
                  16,
                fontWeight:
                  900,
                cursor:
                  "pointer",
                marginBottom:
                  10,
              }}
            >
              💎 Profesyonel Excel'i
              İncele
            </button>

            <button
              type="button"
              onClick={() =>
                setShowPremium(
                  false
                )
              }
              style={{
                border:
                  "1px solid #dce7df",
                background:
                  "#ffffff",
                borderRadius:
                  12,
                padding:
                  "10px 20px",
                fontWeight:
                  800,
                cursor:
                  "pointer",
              }}
            >
              Şimdilik Kapat
            </button>

          </div>

        </div>
      )}

    </section>
  );
}

/*
 * =========================================================
 * ÖZET KARTI
 * =========================================================
 */

function SummaryCard({
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
        padding:
          18,
        borderRadius:
          16,
        background:
          "#f8faf9",
        border:
          "1px solid #e5eee8",
      }}
    >

      <div
        style={{
          fontSize:
            13,
          color:
            "#617066",
          marginBottom:
            7,
          fontWeight:
            700,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize:
            22,
          fontWeight:
            900,
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