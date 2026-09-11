"use client";

import { useMemo, useState } from "react";

import ResultRow, { money, percent } from "./ResultRow";

/**
 * BES (Bireysel Emeklilik Sistemi) birikim hesaplama.
 *
 * Devlet katkısı, ödenen katkı payının %30'udur ve yıllık brüt asgari
 * ücretin toplamıyla sınırlıdır. Devlet katkısına hak kazanma kademelidir:
 *   3 yıl → %15, 6 yıl → %35, 10 yıl → %60, emeklilik → %100
 */

function vestingRate(years: number) {
  if (years >= 10) return 0.6;
  if (years >= 6) return 0.35;
  if (years >= 3) return 0.15;
  return 0;
}

export default function PensionFundCalculator() {
  const [monthly, setMonthly] = useState("");
  const [years, setYears] = useState("10");
  const [annualReturn, setAnnualReturn] = useState("35");
  const [retire, setRetire] = useState("hayir");
  const [minWage, setMinWage] = useState("26005.50");

  const result = useMemo(() => {
    const m = Number(monthly);
    const y = Number(years);
    const r = Number(annualReturn) / 100;
    const mw = Number(minWage);

    if (
      !monthly ||
      !Number.isFinite(m) || m <= 0 ||
      !Number.isFinite(y) || y <= 0 ||
      !Number.isFinite(r) || r < 0 ||
      !Number.isFinite(mw) || mw <= 0
    ) {
      return null;
    }

    const months = Math.round(y * 12);
    const monthlyRate = Math.pow(1 + r, 1 / 12) - 1;

    /* Devlet katkısı yıllık üst sınırı: brüt asgari ücretin yıllık toplamı */
    const annualCap = mw * 12;
    const annualContribution = m * 12;
    const annualStateRaw = annualContribution * 0.3;
    const annualState = Math.min(annualStateRaw, annualCap);
    const capped = annualStateRaw > annualCap;
    const monthlyState = annualState / 12;

    /* Aylık düzenli ödemenin gelecek değeri (dönem sonu ödemeli anüite) */
    const fv = (payment: number) =>
      monthlyRate === 0
        ? payment * months
        : payment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

    const ownFund = fv(m);
    const stateFund = fv(monthlyState);

    const totalPaid = m * months;
    const totalState = monthlyState * months;

    const rate = retire === "evet" ? 1 : vestingRate(y);
    const stateEarned = stateFund * rate;

    const total = ownFund + stateEarned;

    return {
      months,
      totalPaid,
      totalState,
      ownFund,
      ownGain: ownFund - totalPaid,
      stateFund,
      stateEarned,
      vesting: rate,
      total,
      totalGain: total - totalPaid,
      capped,
      annualCap,
    };
  }, [monthly, years, annualReturn, retire, minWage]);

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Aylık Katkı Payı (₺)
          <input
            type="number" min="0" step="50"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
            placeholder="3000"
          />
        </label>

        <label className="field">
          Kalış Süresi (yıl)
          <input
            type="number" min="1" max="50" step="1"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
          <span className="field-hint">
            Devlet katkısı hak edişi süreye bağlıdır.
          </span>
        </label>

        <label className="field">
          Yıllık Getiri Beklentisi (%)
          <input
            type="number" min="0" step="0.5"
            value={annualReturn}
            onChange={(e) => setAnnualReturn(e.target.value)}
          />
          <span className="field-hint">
            Fon performansı garanti değildir; tahmini bir oran girin.
          </span>
        </label>

        <label className="field">
          Emeklilik Hakkı Kazanılacak mı?
          <select value={retire} onChange={(e) => setRetire(e.target.value)}>
            <option value="hayir">Hayır, süre sonunda çıkacağım</option>
            <option value="evet">Evet (56 yaş + 10 yıl)</option>
          </select>
          <span className="field-hint">
            Emeklilikte devlet katkısının tamamı alınır.
          </span>
        </label>

        <label className="field">
          Brüt Asgari Ücret (₺)
          <input
            type="number" min="0" step="0.01"
            value={minWage}
            onChange={(e) => setMinWage(e.target.value)}
          />
          <span className="field-hint">
            Devlet katkısı üst sınırı bundan hesaplanır.
          </span>
        </label>
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow
            label="Toplam Ödeyeceğiniz"
            value={money(result.totalPaid)}
            hint={`${result.months} ay boyunca`}
          />

          <ResultRow
            label="Kendi Birikiminiz"
            value={money(result.ownFund)}
            hint={`Getiri ${money(result.ownGain)}`}
          />

          <ResultRow
            label="Devlet Katkısı (toplam)"
            value={money(result.stateFund)}
            hint="Katkı payının %30'u, getirisiyle birlikte"
          />

          <ResultRow
            label="Hak Edeceğiniz Devlet Katkısı"
            value={money(result.stateEarned)}
            hint={`Hak ediş oranı ${percent(result.vesting * 100, 0)} · ${
              retire === "evet"
                ? "emeklilikte tamamı"
                : `${years} yıl kalışta`
            }`}
            tone="pos"
          />

          <ResultRow
            label="TOPLAM BİRİKİM"
            value={money(result.total)}
            hint={`Net kazancınız ${money(result.totalGain)}`}
            highlight
            tone="pos"
          />

          {result.capped && (
            <div className="notice notice-warn">
              <strong>Devlet katkısı üst sınırı uygulandı.</strong> Yıllık
              devlet katkısı, brüt asgari ücretin yıllık toplamını
              ({money(result.annualCap)}) aşamaz. Bu sınırın üzerindeki
              katkı paylarınıza devlet katkısı işlemez.
            </div>
          )}

          <div className="notice notice-warn">
            <strong>Hak ediş kademeleri:</strong> 3 yıl sonunda devlet
            katkısının %15&apos;i, 6 yılda %35&apos;i, 10 yılda %60&apos;ı;
            56 yaşını doldurup 10 yılı tamamlayarak emekli olduğunuzda ise
            tamamı size ödenir. Erken çıkışta hak edilmeyen kısım devlete geri
            döner.
          </div>

          <div className="notice">
            Hesaplama fon yönetim giderlerini ve giriş aidatını içermez.
            Sözleşmenizdeki kesinti oranlarını şirketinizden teyit edin.
            Getiri oranı geçmiş performansa dayalı bir tahmindir, garanti
            değildir.
          </div>
        </div>
      ) : (
        <div className="notice">
          Aylık katkı payınızı ve planladığınız süreyi girin. Devlet katkısı
          dâhil toplam birikiminizi ve hak edeceğiniz tutarı hesaplayalım.
        </div>
      )}
    </div>
  );
}
