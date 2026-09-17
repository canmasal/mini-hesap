"use client";

import { useMemo, useState } from "react";

import { CREDIT_CARD } from "@/data/parameters";
import ResultRow, { money, percent } from "./ResultRow";

/**
 * Kredi kartı asgari ödeme ve faiz hesaplama.
 *
 * Asgari ödeme oranı kart limitine göre belirlenir (BDDK). Faiz ise dönem
 * borcuna göre kademelidir ve TCMB tarafından aylık ilan edilir. Yalnızca
 * asgari ödeme yapıldığında borcun nasıl seyrettiği ay ay hesaplanır.
 */

const MAX_MONTHS = 360;

const rateFor = (debt: number) =>
  CREDIT_CARD.tiers.find((t) => debt <= t.upTo) ?? CREDIT_CARD.tiers[CREDIT_CARD.tiers.length - 1];

const dmy = (iso: string) => iso.split("-").reverse().join(".");

export default function CreditCardMinimumCalculator() {
  const [debt, setDebt] = useState("");
  const [limit, setLimit] = useState("");
  const [newCard, setNewCard] = useState("hayir");
  const [cash, setCash] = useState("hayir");

  const result = useMemo(() => {
    const amount = Number(debt.replace(",", ".")) || 0;
    if (amount <= 0) return null;

    const cardLimit = Number(limit.replace(",", ".")) || 0;
    const min = CREDIT_CARD.minimumPayment;
    const minRate =
      newCard === "evet"
        ? min.newCardFirstYear
        : cardLimit > min.limitThreshold
          ? min.aboveThreshold
          : min.belowThreshold;

    const tier = rateFor(amount);
    const monthlyRate = cash === "evet" ? CREDIT_CARD.cashAdvance.contractual : tier.contractual;
    const lateRate = cash === "evet" ? CREDIT_CARD.cashAdvance.late : tier.late;
    const minimum = amount * minRate;

    /* Yalnızca asgari ödeyen biri için borç seyri */
    let remaining = amount;
    let paid = 0;
    let months = 0;
    let interestTotal = 0;
    const firstMonths: Array<{ month: number; payment: number; interest: number; remaining: number }> = [];

    while (remaining > 1 && months < MAX_MONTHS) {
      const payment = Math.min(remaining, Math.max(remaining * minRate, 1));
      const afterPayment = remaining - payment;
      const interest = afterPayment * rateFor(afterPayment).contractual;
      paid += payment;
      interestTotal += interest;
      remaining = afterPayment + interest;
      months += 1;
      if (months <= 6) firstMonths.push({ month: months, payment, interest, remaining });
      /* Borç azalmıyorsa (faiz ödemeyi aşıyorsa) döngüyü kes */
      if (months > 3 && remaining >= amount) break;
    }

    const neverEnds = remaining >= amount || months >= MAX_MONTHS;

    return {
      amount,
      minRate,
      minimum,
      monthlyRate,
      lateRate,
      /* Asgari ödeme sonrası kalan borca işleyecek ilk ay faizi */
      firstInterest: (amount - minimum) * rateFor(amount - minimum).contractual,
      months,
      paid,
      interestTotal,
      firstMonths,
      neverEnds,
    };
  }, [debt, limit, newCard, cash]);

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Dönem borcu (₺)
          <input type="number" inputMode="decimal" min="0" value={debt} onChange={(e) => setDebt(e.target.value)} placeholder="25000" />
          <span className="field-hint">Ekstrenizde yazan toplam dönem borcu.</span>
        </label>
        <label className="field">
          Kart limiti (₺)
          <input type="number" inputMode="decimal" min="0" value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="50000" />
          <span className="field-hint">
            Asgari ödeme oranı limite göre değişir: {percent(CREDIT_CARD.minimumPayment.belowThreshold * 100, 0)} veya{" "}
            {percent(CREDIT_CARD.minimumPayment.aboveThreshold * 100, 0)}.
          </span>
        </label>
        <label className="field">
          Kart son bir yıl içinde mi alındı?
          <select value={newCard} onChange={(e) => setNewCard(e.target.value)}>
            <option value="hayir">Hayır</option>
            <option value="evet">Evet (yeni kart)</option>
          </select>
          <span className="field-hint">Yeni kartlarda ilk yıl asgari oran %40 uygulanır.</span>
        </label>
        <label className="field">
          Borç nakit çekimden mi kaynaklanıyor?
          <select value={cash} onChange={(e) => setCash(e.target.value)}>
            <option value="hayir">Hayır (alışveriş)</option>
            <option value="evet">Evet (nakit avans)</option>
          </select>
          <span className="field-hint">Nakit çekimde en yüksek faiz kademesi uygulanır.</span>
        </label>
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow
            label={`Asgari ödeme tutarı (${percent(result.minRate * 100, 0)})`}
            value={money(result.minimum)}
            highlight
          />
          <ResultRow
            label="Kalan borca işleyecek ilk ay faizi"
            value={money(result.firstInterest)}
            hint={`Aylık akdi faiz oranı ${percent(result.monthlyRate * 100)}.`}
          />
          <ResultRow
            label="Asgari ödemeyi de kaçırırsanız (gecikme faizi)"
            value={percent(result.lateRate * 100)}
            tone="neg"
          />

          {result.neverEnds ? (
            <div className="notice notice-warn">
              Yalnızca asgari ödeme yapıldığında bu borç <strong>kapanmıyor</strong>: işleyen
              faiz, ödediğiniz tutara yetişiyor. Borcun erimesi için asgari tutarın üzerinde
              ödeme yapmanız gerekir.
            </div>
          ) : (
            <>
              <ResultRow label="Sadece asgari ödenirse borç kaç ayda biter?" value={`${result.months} ay`} tone="neg" />
              <ResultRow label="Bu sürede ödenecek toplam" value={money(result.paid)} />
              <ResultRow label="Bunun faiz olan kısmı" value={money(result.interestTotal)} tone="neg" />
            </>
          )}

          {result.firstMonths.length > 0 && (
            <div className="rates-table-wrap" style={{ marginTop: 4 }}>
              <table className="rates-table">
                <thead>
                  <tr>
                    <th scope="col">Ay</th>
                    <th scope="col">Asgari ödeme</th>
                    <th scope="col">İşleyen faiz</th>
                    <th scope="col">Kalan borç</th>
                  </tr>
                </thead>
                <tbody>
                  {result.firstMonths.map((row) => (
                    <tr key={row.month}>
                      <th scope="row">{row.month}. ay</th>
                      <td>{money(row.payment)}</td>
                      <td>{money(row.interest)}</td>
                      <td>{money(row.remaining)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="notice">
            Faiz oranları TCMB tarafından her ay yeniden ilan edilir; burada{" "}
            <strong>{dmy(CREDIT_CARD.validFrom)}</strong> tarihinden itibaren geçerli azami
            oranlar kullanılmıştır. Bankanız daha düşük oran uygulayabilir. Hesap, dönem
            içinde yeni harcama yapılmadığını varsayar.
          </div>
        </div>
      ) : (
        <div className="calc-hint">
          Dönem borcunuzu ve kart limitinizi girin; asgari ödeme tutarını ve yalnızca
          asgari ödemenin size kaça mal olacağını hesaplayalım.
        </div>
      )}
    </div>
  );
}
