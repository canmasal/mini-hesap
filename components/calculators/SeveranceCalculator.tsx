"use client";

import { useMemo, useState } from "react";

const FIRST_HALF_2026_CEILING = 64948.77;
const SECOND_HALF_2026_CEILING = 73729.87;

const STAMP_TAX_RATE = 0.00759;

const LEAVING_REASONS = [
  "İşveren tarafından fesih",
  "İşçinin haklı nedenle feshi",
  "Emeklilik",
  "Askerlik",
  "Kadın işçinin evlilik nedeniyle ayrılması",
  "İşçinin vefatı",
  "Diğer",
];

function parseDate(value: string): Date | null {
  if (!value) {
    return null;
  }

  const parts = value.split("-").map(Number);

  if (parts.length !== 3) {
    return null;
  }

  const [year, month, day] = parts;

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return null;
  }

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatDate(value: string): string {
  const date = parseDate(value);

  if (!date) {
    return "-";
  }

  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function totalDaysBetween(
  startDate: Date,
  endDate: Date
): number {
  const start = Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );

  const end = Date.UTC(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );

  return Math.floor(
    (end - start) / 86400000
  ) + 1;
}

function calculateDuration(
  startDate: Date,
  endDate: Date
) {
  let years =
    endDate.getFullYear() -
    startDate.getFullYear();

  let months =
    endDate.getMonth() -
    startDate.getMonth();

  let days =
    endDate.getDate() -
    startDate.getDate();

  if (days < 0) {
    months -= 1;

    const previousMonthDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      0
    );

    days += previousMonthDate.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
  };
}

function get2026Ceiling(
  endDate: Date
): number {
  const year = endDate.getFullYear();
  const month = endDate.getMonth() + 1;

  if (year > 2026) {
    return SECOND_HALF_2026_CEILING;
  }

  if (year === 2026 && month >= 7) {
    return SECOND_HALF_2026_CEILING;
  }

  return FIRST_HALF_2026_CEILING;
}

function money(value: number): string {
  return value.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function SeveranceCalculator() {
  const [grossSalary, setGrossSalary] =
    useState("");

  const [foodAllowance, setFoodAllowance] =
    useState("");

  const [transportAllowance, setTransportAllowance] =
    useState("");

  const [otherBenefits, setOtherBenefits] =
    useState("");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [reason, setReason] =
    useState(LEAVING_REASONS[0]);

  const [result, setResult] =
    useState<ReturnType<
      typeof calculateResult
    > | null>(null);

  const [error, setError] =
    useState("");

  function calculateResult() {
    const gross = Number(grossSalary);

    const food = Number(
      foodAllowance || 0
    );

    const transport = Number(
      transportAllowance || 0
    );

    const other = Number(
      otherBenefits || 0
    );

    const start = parseDate(
      startDate
    );

    const end = parseDate(
      endDate
    );

    if (
      !Number.isFinite(gross) ||
      gross <= 0
    ) {
      throw new Error(
        "Brüt ücret geçerli olmalıdır."
      );
    }

    if (!start || !end) {
      throw new Error(
        "İşe giriş ve işten çıkış tarihlerini girin."
      );
    }

    if (
      end.getTime() <
      start.getTime()
    ) {
      throw new Error(
        "İşten çıkış tarihi işe giriş tarihinden önce olamaz."
      );
    }

    if (
      food < 0 ||
      transport < 0 ||
      other < 0
    ) {
      throw new Error(
        "Yan hak tutarları negatif olamaz."
      );
    }

    const totalDays =
      totalDaysBetween(
        start,
        end
      );

    const duration =
      calculateDuration(
        start,
        end
      );

    /*
     * Kıdem tazminatı için temel hizmet
     * süresi koşulu 1 yıldır.
     */
    if (totalDays < 365) {
      return {
        eligible: false as const,
        totalDays,
        duration,
      };
    }

    /*
     * Giydirilmiş brüt ücret:
     * düzenli yan haklar dahil edilir.
     */
    const regularBenefits =
      food +
      transport +
      other;

    const dressedGross =
      gross +
      regularBenefits;

    /*
     * Çıkış tarihindeki 2026 tavanı.
     */
    const ceiling =
      get2026Ceiling(end);

    /*
     * Kıdeme esas aylık ücret,
     * tavanı geçemez.
     */
    const severanceBasis =
      Math.min(
        dressedGross,
        ceiling
      );

    /*
     * Her tam yıl için 30 günlük ücret;
     * artan hizmet süresi oransal hesaplanır.
     *
     * Gün hesabında 365 gün esas alınır.
     */
    const grossSeverance =
      severanceBasis *
      (totalDays / 365);

    /*
     * Kıdem tazminatından yalnızca
     * damga vergisi kesilir.
     */
    const stampTax =
      grossSeverance *
      STAMP_TAX_RATE;

    const netSeverance =
      grossSeverance -
      stampTax;

    return {
      eligible: true as const,

      startDate,
      endDate,

      totalDays,
      duration,

      grossSalary: gross,

      foodAllowance: food,
      transportAllowance: transport,
      otherBenefits: other,

      regularBenefits,
      dressedGross,

      ceiling,
      severanceBasis,

      grossSeverance,
      stampTax,
      netSeverance,

      reason,
    };
  }

  function handleCalculate() {
    setError("");
    setResult(null);

    try {
      const calculation =
        calculateResult();

      setResult(calculation);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Hesaplama sırasında bir hata oluştu."
        );
      }
    }
  }

  function handleClear() {
    setGrossSalary("");
    setFoodAllowance("");
    setTransportAllowance("");
    setOtherBenefits("");
    setStartDate("");
    setEndDate("");
    setReason(
      LEAVING_REASONS[0]
    );
    setError("");
    setResult(null);
  }

  const isEligible =
    result &&
    result.eligible === true;

  return (
    <div className="calc-box">

      {/* ÜCRET */}

      <div className="form-grid">

        <label className="field">
          İşten Çıkış Tarihindeki Brüt Ücret

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
            }}
            placeholder="76000"
          />
        </label>

        <label className="field">
          Aylık Yemek Yardımı

          <input
            type="number"
            min="0"
            step="0.01"
            value={foodAllowance}
            onChange={(event) => {
              setFoodAllowance(
                event.target.value
              );
              setResult(null);
            }}
            placeholder="0"
          />
        </label>

        <label className="field">
          Aylık Yol / Servis Yardımı

          <input
            type="number"
            min="0"
            step="0.01"
            value={transportAllowance}
            onChange={(event) => {
              setTransportAllowance(
                event.target.value
              );
              setResult(null);
            }}
            placeholder="0"
          />
        </label>

        <label className="field">
          Diğer Düzenli Yan Haklar

          <input
            type="number"
            min="0"
            step="0.01"
            value={otherBenefits}
            onChange={(event) => {
              setOtherBenefits(
                event.target.value
              );
              setResult(null);
            }}
            placeholder="0"
          />
        </label>

      </div>

      {/* TARİHLER */}

      <div
        className="form-grid"
        style={{ marginTop: 18 }}
      >

        <label className="field">
          İşe Giriş Tarihi

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

        <label className="field">
          İşten Çıkış Tarihi

          <input
            type="date"
            value={endDate}
            onChange={(event) => {
              setEndDate(
                event.target.value
              );
              setResult(null);
            }}
          />
        </label>

      </div>

      {/* AYRILMA NEDENİ */}

      <div
        className="form-grid"
        style={{ marginTop: 18 }}
      >

        <label className="field">
          İşten Ayrılma Nedeni

          <select
            value={reason}
            onChange={(event) => {
              setReason(
                event.target.value
              );
              setResult(null);
            }}
          >
            {LEAVING_REASONS.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </select>
        </label>

      </div>

      {/* BİLGİ */}

      <div
        style={{
          marginTop: 18,
          padding: 17,
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
          Giydirilmiş brüt ücret
        </strong>

        <p
          style={{
            margin: "7px 0 0",
          }}
        >
          Düzenli olarak sağlanan ve para ile
          ölçülebilen bazı menfaatler kıdem
          hesabında dikkate alınabilir. Yemek,
          yol/servis ve diğer düzenli yan hakları
          ayrıca girebilirsiniz.
        </p>
      </div>

      {/* HATA */}

      {error && (
        <div
          style={{
            marginTop: 18,
            padding: 15,
            borderRadius: 14,
            background: "#fef2f2",
            border:
              "1px solid #fecaca",
            color: "#b91c1c",
            fontWeight: 700,
            lineHeight: 1.6,
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
          marginTop: 20,
          flexWrap: "wrap",
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
          Kıdemimi Hesapla
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

      {/* 1 YILDAN AZ */}

      {result &&
        result.eligible === false && (
          <div
            style={{
              marginTop: 20,
              padding: 18,
              borderRadius: 16,
              background: "#fff7ed",
              border:
                "1px solid #fed7aa",
              color: "#9a3412",
              lineHeight: 1.7,
            }}
          >
            Girilen çalışma süresi:

            <strong>
              {" "}
              {result.duration.years} yıl{" "}
              {result.duration.months} ay{" "}
              {result.duration.days} gün
            </strong>

            <br />

            Temel hesaplama kuralı açısından
            1 yıldan az hizmet süresinde kıdem
            tazminatı oluşmaz.
          </div>
        )}

      {/* SONUÇ */}

      {isEligible && (
        <>
          {/* ANA NET SONUÇ */}

          <div
            className="result"
            style={{
              marginTop: 25,
            }}
          >
            <div className="result-label">
              NET KIDEM TAZMİNATI
            </div>

            <div
              className="result-value"
              style={{
                fontSize: 40,
              }}
            >
              {money(
                result.netSeverance
              )}{" "}
              ₺
            </div>
          </div>

          {/* DETAYLAR */}

          <div
            style={{
              marginTop: 22,
              display: "grid",
              gap: 10,
            }}
          >

            <ResultRow
              label="İşe Giriş Tarihi"
              value={formatDate(
                result.startDate
              )}
            />

            <ResultRow
              label="İşten Çıkış Tarihi"
              value={formatDate(
                result.endDate
              )}
            />

            <ResultRow
              label="Çalışma Süresi"
              value={`${result.duration.years} yıl ${result.duration.months} ay ${result.duration.days} gün`}
              highlight
            />

            <ResultRow
              label="Toplam Hizmet Günü"
              value={`${result.totalDays} gün`}
            />

            <ResultRow
              label="İşten Ayrılma Nedeni"
              value={result.reason}
            />

            <ResultRow
              label="Brüt Ücret"
              value={`${money(
                result.grossSalary
              )} ₺`}
            />

            <ResultRow
              label="Yemek Yardımı"
              value={`${money(
                result.foodAllowance
              )} ₺`}
            />

            <ResultRow
              label="Yol / Servis Yardımı"
              value={`${money(
                result.transportAllowance
              )} ₺`}
            />

            <ResultRow
              label="Diğer Düzenli Yan Haklar"
              value={`${money(
                result.otherBenefits
              )} ₺`}
            />

            <ResultRow
              label="Toplam Düzenli Yan Haklar"
              value={`${money(
                result.regularBenefits
              )} ₺`}
            />

            <ResultRow
              label="Giydirilmiş Brüt Ücret"
              value={`${money(
                result.dressedGross
              )} ₺`}
            />

            <ResultRow
              label="2026 Kıdem Tazminatı Tavanı"
              value={`${money(
                result.ceiling
              )} ₺`}
            />

            <ResultRow
              label="Kıdeme Esas Brüt Ücret"
              value={`${money(
                result.severanceBasis
              )} ₺`}
              highlight
            />

            <ResultRow
              label="Brüt Kıdem Tazminatı"
              value={`${money(
                result.grossSeverance
              )} ₺`}
              highlight
            />

            <ResultRow
              label="Damga Vergisi (%0,759)"
              value={`- ${money(
                result.stampTax
              )} ₺`}
            />

            <ResultRow
              label="NET KIDEM TAZMİNATI"
              value={`${money(
                result.netSeverance
              )} ₺`}
              highlight
            />

          </div>

          {/* FORMÜL */}

          <div
            style={{
              marginTop: 22,
              padding: 17,
              borderRadius: 16,
              background: "#f8faf9",
              border:
                "1px solid #e5eee8",
              color: "#617066",
              fontSize: 13,
              lineHeight: 1.7,
            }}
          >
            <strong>
              Hesaplama özeti
            </strong>

            <p
              style={{
                margin: "7px 0 0",
              }}
            >
              Kıdeme esas ücret, giydirilmiş brüt
              ücret ile ilgili dönemin kıdem
              tazminatı tavanı karşılaştırılarak
              belirlenir. Hizmet süresi yıl, ay ve
              gün olarak hesaplanır; artan süre
              orantılı şekilde hesaba katılır.
            </p>
          </div>

          {/* UYARI */}

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
            ⚠️ Bu araç bilgilendirme amaçlı bir
            hesaplamadır. Kıdem tazminatına hak
            kazanma koşulları ve özel bordro
            durumları ayrıca değerlendirilmelidir.
          </div>
        </>
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
        padding: "15px 17px",
        borderRadius: 15,
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
          fontSize: 16,
          textAlign: "right",
        }}
      >
        {value}
      </strong>
    </div>
  );
}