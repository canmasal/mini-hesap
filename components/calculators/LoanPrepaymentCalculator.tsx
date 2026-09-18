"use client";

import { useMemo, useState } from "react";

import { CONSUMER_LOAN_TAXES, EARLY_REPAYMENT } from "@/data/parameters";
import ResultRow, { money } from "./ResultRow";

/**
 * Kredi erken kapatma hesaplama.
 *
 * Eşit taksitli kredide ödenen taksitlerden sonra kalan anapara bulunur.
 * Erken kapatmada kalan taksitlerin içindeki gelecek faiz ödenmez; yalnızca
 * kalan anapara ve (sabit faizli konut kredisinde) erken ödeme tazminatı ödenir.
 * İhtiyaç ve taşıt kredisinde KKDF ve BSMV faize eklenerek taksit hesaplanır.
 */

type Kind = "ihtiyac" | "konut-sabit" | "konut-degisken";

export default function LoanPrepaymentCalculator() {
  const [kind, setKind] = useState<Kind>("ihtiyac");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [term, setTerm] = useState("36");
  const [paid, setPaid] = useState("12");

  const result = useMemo(() => {
    const principal = Number(amount.replace(",", ".")) || 0;
    const monthlyRate = (Number(rate.replace(",", ".")) || 0) / 100;
    const n = Math.round(Number(term) || 0);
    const k = Math.round(Number(paid) || 0);
    if (principal <= 0 || monthlyRate < 0 || n <= 0 || k < 0) return null;
    if (k >= n) return { error: "Ödenen taksit sayısı vadeden küçük olmalı." } as const;

    /* Konut kredisinde KKDF ve BSMV yoktur */
    const taxes = kind === "ihtiyac" ? CONSUMER_LOAN_TAXES.kkdf + CONSUMER_LOAN_TAXES.bsmv : 0;
    const r = monthlyRate * (1 + taxes);

    const installment = r === 0 ? principal / n : (principal * r) / (1 - Math.pow(1 + r, -n));
    const remaining =
      r === 0
        ? principal - installment * k
        : principal * Math.pow(1 + r, k) - installment * ((Math.pow(1 + r, k) - 1) / r);

    const left = n - k;
    const feeRate =
      kind === "konut-sabit"
        ? left <= EARLY_REPAYMENT.thresholdMonths
          ? EARLY_REPAYMENT.shortRate
          : EARLY_REPAYMENT.longRate
        : 0;
    const fee = remaining * feeRate;
    const payoff = remaining + fee;
    const remainingInstallments = installment * left;

    return {
      installment,
      remaining,
      left,
      feeRate,
      fee,
      payoff,
      remainingInstallments,
      saving: remainingInstallments - payoff,
    };
  }, [kind, amount, rate, term, paid]);

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Kredi türü
          <select value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
            <option value="ihtiyac">İhtiyaç / taşıt kredisi</option>
            <option value="konut-sabit">Konut kredisi (sabit faizli)</option>
            <option value="konut-degisken">Konut kredisi (değişken faizli)</option>
          </select>
        </label>
        <label className="field">
          Çekilen kredi tutarı (₺)
          <input type="number" inputMode="decimal" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="300000" />
        </label>
        <label className="field">
          Aylık faiz oranı (%)
          <input type="number" inputMode="decimal" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="3,5" />
          <span className="field-hint">
            {kind === "ihtiyac" ? "Vergisiz akdi faiz; KKDF ve BSMV otomatik eklenir." : "Sözleşmedeki aylık akdi faiz."}
          </span>
        </label>
        <label className="field">
          Vade (ay)
          <input type="number" inputMode="numeric" min="1" value={term} onChange={(e) => setTerm(e.target.value)} />
        </label>
        <label className="field">
          Ödenen taksit sayısı
          <input type="number" inputMode="numeric" min="0" value={paid} onChange={(e) => setPaid(e.target.value)} />
        </label>
      </div>

      {result ? (
        "error" in result ? (
          <div className="notice notice-warn" style={{ marginTop: 22 }}>{result.error}</div>
        ) : (
          <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
            <ResultRow label="Erken kapatma tutarı" value={money(result.payoff)} highlight />
            <ResultRow label="Kalan anapara" value={money(result.remaining)} />
            <ResultRow
              label="Erken ödeme tazminatı"
              value={money(result.fee)}
              tone={result.fee > 0 ? "neg" : undefined}
              hint={
                kind === "konut-sabit"
                  ? `Kalan vade ${result.left} ay → kalan anaparanın %${result.feeRate * 100}'i`
                  : "Bu kredi türünde erken ödeme tazminatı alınamaz"
              }
            />
            <ResultRow label="Aylık taksit" value={money(result.installment)} />
            <ResultRow
              label={`Kalan ${result.left} taksitin toplamı`}
              value={money(result.remainingInstallments)}
            />
            <ResultRow label="Erken kapatmayla ödemeyeceğiniz faiz" value={money(result.saving)} tone="pos" />

            <div className="notice">
              Tutar, son taksit ödendiği gün kapatıldığı varsayımıyla hesaplanır. Ay içinde
              kapatırsanız banka o güne kadar işleyen faizi ekler; kesin tutarı bankanızdan
              &quot;erken kapama tutarı&quot; olarak isteyin.
            </div>
          </div>
        )
      ) : (
        <div className="calc-hint">
          Kredi bilgilerinizi girin; bugün kapatırsanız ne ödeyeceğinizi ve ne kadar faizden
          kurtulacağınızı gösterelim.
        </div>
      )}
    </div>
  );
}
