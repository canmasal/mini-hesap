"use client";

import { useMemo, useState } from "react";

import ResultRow, { money, percent } from "./ResultRow";

/**
 * Taksitli alışverişin gerçek maliyeti.
 *
 * "Taksit farkı yok" denilen kampanyalarda bile peşin fiyat ile taksitli
 * toplam arasında fark olabilir. Bu araç aradaki farkı ve bu farkın
 * gizli aylık/yıllık faiz karşılığını (IRR) hesaplar.
 */

/**
 * Ödeme akışının aylık iç verim oranını bulur.
 * peşin = Σ taksit / (1 + r)^k   (k = 1..n)
 * Kök, ikiye bölme yöntemiyle aranır.
 */
function monthlyIrr(cash: number, payment: number, months: number) {
  const presentValue = (r: number) => {
    if (r === 0) return payment * months;

    let sum = 0;
    for (let k = 1; k <= months; k += 1) {
      sum += payment / Math.pow(1 + r, k);
    }
    return sum;
  };

  /* Taksitli toplam peşin fiyata eşit veya altındaysa faiz yok demektir */
  if (presentValue(0) <= cash) return 0;

  let low = 0;
  let high = 1; // aylık %100

  for (let i = 0; i < 200; i += 1) {
    const mid = (low + high) / 2;

    if (presentValue(mid) > cash) low = mid;
    else high = mid;
  }

  return (low + high) / 2;
}

export default function InstallmentCostCalculator() {
  const [cashPrice, setCashPrice] = useState("");
  const [months, setMonths] = useState("12");
  const [mode, setMode] = useState<"taksit" | "toplam">("taksit");
  const [amount, setAmount] = useState("");

  const result = useMemo(() => {
    const cash = Number(cashPrice);
    const n = Number(months);
    const entered = Number(amount);

    if (
      !cashPrice ||
      !amount ||
      !Number.isFinite(cash) ||
      cash <= 0 ||
      !Number.isFinite(n) ||
      n < 1 ||
      !Number.isFinite(entered) ||
      entered <= 0
    ) {
      return null;
    }

    const monthlyPayment = mode === "taksit" ? entered : entered / n;
    const totalPaid = monthlyPayment * n;
    const difference = totalPaid - cash;

    const r = monthlyIrr(cash, monthlyPayment, n);

    return {
      monthlyPayment,
      totalPaid,
      difference,
      differenceRate: (difference / cash) * 100,
      monthlyRate: r * 100,
      annualRate: (Math.pow(1 + r, 12) - 1) * 100,
    };
  }, [cashPrice, months, mode, amount]);

  function handleClear() {
    setCashPrice("");
    setMonths("12");
    setMode("taksit");
    setAmount("");
  }

  const isFree = result !== null && result.difference <= 0.5;

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Peşin Fiyat (₺)
          <input
            type="number"
            min="0"
            step="0.01"
            value={cashPrice}
            onChange={(event) => setCashPrice(event.target.value)}
            placeholder="30000"
          />
          <span className="field-hint">
            Tek çekimde / nakit ödenecek tutar.
          </span>
        </label>

        <label className="field">
          Taksit Sayısı
          <input
            type="number"
            min="1"
            max="60"
            step="1"
            value={months}
            onChange={(event) => setMonths(event.target.value)}
            placeholder="12"
          />
        </label>

        <label className="field">
          Ne Girmek İstiyorsunuz?
          <select
            value={mode}
            onChange={(event) =>
              setMode(event.target.value as "taksit" | "toplam")
            }
          >
            <option value="taksit">Aylık taksit tutarı</option>
            <option value="toplam">Taksitli toplam fiyat</option>
          </select>
        </label>

        <label className="field">
          {mode === "taksit" ? "Aylık Taksit (₺)" : "Taksitli Toplam (₺)"}
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder={mode === "taksit" ? "2750" : "33000"}
          />
        </label>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button
          type="button"
          className="btn btn-outline"
          style={{ borderRadius: 14 }}
          onClick={handleClear}
        >
          Temizle
        </button>
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow
            label="Aylık Taksit"
            value={money(result.monthlyPayment)}
          />

          <ResultRow
            label="Toplam Ödeyeceğiniz"
            value={money(result.totalPaid)}
            highlight
          />

          <ResultRow
            label="Peşin Fiyata Göre Fark"
            value={
              result.difference > 0
                ? `+ ${money(result.difference)}`
                : money(result.difference)
            }
            hint={`Peşin fiyatın ${percent(
              Math.abs(result.differenceRate)
            )} kadarı`}
            tone={result.difference > 0 ? "neg" : "pos"}
          />

          {isFree ? (
            <div className="notice notice-ok">
              <strong>Gerçekten taksit farkı yok.</strong> Taksitli toplam,
              peşin fiyatla aynı. Paranız elinizde kaldığı için taksitle almak
              bu durumda avantajlıdır.
            </div>
          ) : (
            <>
              <ResultRow
                label="Gizli Aylık Faiz"
                value={percent(result.monthlyRate)}
                hint="Bu ödeme planının karşılık geldiği aylık maliyet"
                tone="neg"
              />

              <ResultRow
                label="Yıllık Efektif Maliyet"
                value={percent(result.annualRate)}
                hint="Bileşik olarak yıllığa çevrilmiş hali"
                tone="neg"
              />

              <div className="notice notice-warn">
                Bu alışverişte taksit farkı{" "}
                <strong>{money(result.difference)}</strong>. Aynı parayı{" "}
                {months} ay vadeli mevduatta yıllık{" "}
                <strong>{percent(result.annualRate)}</strong> üzerinde net
                getiriyle değerlendirebiliyorsanız peşin almak yerine taksit
                kullanmak mantıklı olabilir; aksi halde peşin almak daha
                ucuza gelir.
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="notice">
          Peşin fiyatı, taksit sayısını ve aylık taksit tutarını girin.
          Taksitin size kaç lira fazlaya mal olduğunu ve bunun gizli faiz
          karşılığını hesaplayalım.
        </div>
      )}
    </div>
  );
}
