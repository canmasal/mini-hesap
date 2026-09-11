"use client";

import { useMemo, useState } from "react";

import ResultRow, { money } from "./ResultRow";

/**
 * İşsizlik maaşı (işsizlik ödeneği) hesaplama.
 *
 * Şartlar: son 120 gün kesintisiz hizmet akdine tabi olmak ve son 3 yılda
 * en az 600 gün işsizlik sigortası primi ödemiş olmak.
 *
 * Tutar: son 4 aylık prime esas kazancın günlük ortalamasının %40'ı.
 * Üst sınır: aylık brüt asgari ücretin %80'i.
 * Ödenekten yalnızca damga vergisi kesilir.
 */

/** Ödeme süresi prim gün sayısına göre kademelidir */
function paymentDays(premiumDays: number) {
  if (premiumDays >= 1080) return 300;
  if (premiumDays >= 900) return 240;
  if (premiumDays >= 600) return 180;
  return 0;
}

export default function UnemploymentCalculator() {
  const [avgGross, setAvgGross] = useState("");
  const [premiumDays, setPremiumDays] = useState("600");
  const [last120, setLast120] = useState("evet");
  /** Dönemin brüt asgari ücreti — üst sınır bundan hesaplanır */
  const [minWage, setMinWage] = useState("26005.50");
  const [stampRate, setStampRate] = useState("0.759");

  const result = useMemo(() => {
    const avg = Number(avgGross);
    const days = Number(premiumDays);
    const mw = Number(minWage);
    const stamp = Number(stampRate) / 100;

    if (
      !avgGross ||
      !Number.isFinite(avg) ||
      avg <= 0 ||
      !Number.isFinite(days) ||
      days < 0 ||
      !Number.isFinite(mw) ||
      mw <= 0
    ) {
      return null;
    }

    const eligible = last120 === "evet" && days >= 600;
    const payDays = paymentDays(days);

    /* Günlük kazanç: aylık ortalama brütün 30'a bölümü */
    const dailyEarning = avg / 30;
    const rawDaily = dailyEarning * 0.4;

    /* Üst sınır: brüt asgari ücretin %80'inin günlüğü */
    const capDaily = (mw * 0.8) / 30;

    const cappedDaily = Math.min(rawDaily, capDaily);
    const capped = rawDaily > capDaily;

    const grossMonthly = cappedDaily * 30;
    const stampTax = grossMonthly * stamp;
    const netMonthly = grossMonthly - stampTax;

    return {
      eligible,
      payDays,
      payMonths: payDays / 30,
      grossMonthly,
      stampTax,
      netMonthly,
      totalNet: netMonthly * (payDays / 30),
      capped,
      capMonthly: capDaily * 30,
    };
  }, [avgGross, premiumDays, last120, minWage, stampRate]);

  function handleClear() {
    setAvgGross("");
    setPremiumDays("600");
    setLast120("evet");
  }

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Son 4 Ayın Ortalama Brüt Ücreti (₺)
          <input
            type="number"
            min="0"
            step="0.01"
            value={avgGross}
            onChange={(e) => setAvgGross(e.target.value)}
            placeholder="45000"
          />
          <span className="field-hint">
            Prime esas kazancınızın son 4 aylık ortalaması.
          </span>
        </label>

        <label className="field">
          Son 3 Yıldaki Prim Gün Sayısı
          <input
            type="number"
            min="0"
            step="1"
            value={premiumDays}
            onChange={(e) => setPremiumDays(e.target.value)}
            placeholder="600"
          />
          <span className="field-hint">
            e-Devlet &gt; İşsizlik Ödeneği ekranından bakabilirsiniz.
          </span>
        </label>

        <label className="field">
          Son 120 Gün Kesintisiz Çalışma
          <select value={last120} onChange={(e) => setLast120(e.target.value)}>
            <option value="evet">Evet, kesintisiz çalıştım</option>
            <option value="hayir">Hayır, kesinti oldu</option>
          </select>
        </label>

        <label className="field">
          Brüt Asgari Ücret (₺)
          <input
            type="number"
            min="0"
            step="0.01"
            value={minWage}
            onChange={(e) => setMinWage(e.target.value)}
          />
          <span className="field-hint">
            Üst sınır bundan hesaplanır; güncel tutarı girin.
          </span>
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
          {!result.eligible && (
            <div className="notice notice-warn">
              <strong>Şartları sağlamıyor görünüyorsunuz.</strong>{" "}
              {last120 === "hayir"
                ? "Son 120 gün kesintisiz çalışma şartı sağlanmadığında işsizlik ödeneği bağlanmaz."
                : "Son 3 yılda en az 600 gün prim ödemiş olmanız gerekir."}{" "}
              Yine de SGK&apos;ya başvurup durumunuzu teyit ettirin.
            </div>
          )}

          <ResultRow
            label="Aylık Brüt Ödenek"
            value={money(result.grossMonthly)}
            hint="Son 4 ay ortalamasının %40'ı"
          />

          <ResultRow
            label={`Damga Vergisi (binde ${stampRate.replace(".", ",")})`}
            value={`- ${money(result.stampTax)}`}
            tone="neg"
          />

          <ResultRow
            label="Aylık Net İşsizlik Maaşı"
            value={money(result.netMonthly)}
            highlight
            tone="pos"
          />

          <ResultRow
            label="Ödeme Süresi"
            value={
              result.payDays > 0
                ? `${result.payDays} gün (${result.payMonths} ay)`
                : "Hak doğmuyor"
            }
            hint="600 gün → 180, 900 gün → 240, 1080 gün → 300 gün"
          />

          {result.payDays > 0 && (
            <ResultRow
              label="Toplam Alacağınız"
              value={money(result.totalNet)}
              hint={`${result.payMonths} ay boyunca`}
              highlight
            />
          )}

          {result.capped && (
            <div className="notice notice-warn">
              <strong>Üst sınır uygulandı.</strong> Hesaplanan tutar yasal üst
              sınırı aştığı için ödenek {money(result.capMonthly)} brüt ile
              sınırlandı. Üst sınır, brüt asgari ücretin %80&apos;idir.
            </div>
          )}

          <div className="notice">
            <strong>Başvuru:</strong> İş sözleşmeniz sona erdikten sonra{" "}
            <strong>30 gün içinde</strong> İŞKUR&apos;a başvurmanız gerekir.
            e-Devlet üzerinden de başvurabilirsiniz. İşten kendi isteğinizle
            ayrıldıysanız (istifa) ödenek bağlanmaz.
          </div>
        </div>
      ) : (
        <div className="notice">
          Son 4 ayın ortalama brüt ücretini ve prim gün sayınızı girin. Aylık
          net işsizlik maaşınızı ve kaç ay alacağınızı hesaplayalım.
        </div>
      )}
    </div>
  );
}
