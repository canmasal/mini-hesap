"use client";

import { useMemo, useState } from "react";

import { FREELANCE_RECEIPT } from "@/data/parameters";
import ResultRow, { money, percent } from "./ResultRow";

/**
 * Serbest meslek makbuzu (SMM) hesaplama.
 *
 * Brüt ücret üzerinden %20 gelir vergisi stopajı (makbuz vergi sorumlusuna,
 * yani şirkete kesiliyorsa) ve %20 KDV hesaplanır. Müşteri stopajı keserek
 * vergi dairesine yatırır, kalanı KDV ile birlikte serbest meslek erbabına öder.
 */

type Mode = "brut" | "net";

export default function FreelanceReceiptCalculator() {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<Mode>("net");
  const [withholding, setWithholding] = useState(true);
  const [vat, setVat] = useState(true);

  const result = useMemo(() => {
    const value = Number(amount.replace(",", ".")) || 0;
    if (value <= 0) return null;

    const w = withholding ? FREELANCE_RECEIPT.withholding : 0;
    const v = vat ? FREELANCE_RECEIPT.vat : 0;

    /* "Net" girildiğinde brüt, stopaj düşülünce bu tutar kalacak şekilde bulunur */
    const gross = mode === "brut" ? value : value / (1 - w);
    const stopaj = gross * w;
    const kdv = gross * v;
    const net = gross - stopaj;

    return { gross, stopaj, kdv, net, collected: net + kdv, clientCost: gross + kdv };
  }, [amount, mode, withholding, vat]);

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Hesaplama yönü
          <select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
            <option value="net">Eline geçecek net tutardan brüte</option>
            <option value="brut">Brüt ücretten nete</option>
          </select>
        </label>
        <label className="field">
          {mode === "net" ? "Almak istediğiniz net ücret (₺)" : "Brüt ücret (₺)"}
          <input type="number" inputMode="decimal" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="10000" />
          <span className="field-hint">KDV hariç tutar.</span>
        </label>
        <label className="field">
          Makbuzu kime kesiyorsunuz?
          <select value={withholding ? "evet" : "hayir"} onChange={(e) => setWithholding(e.target.value === "evet")}>
            <option value="evet">Şirkete / vergi sorumlusuna (stopajlı)</option>
            <option value="hayir">Şahsa / nihai tüketiciye (stopajsız)</option>
          </select>
        </label>
        <label className="field">
          KDV
          <select value={vat ? "evet" : "hayir"} onChange={(e) => setVat(e.target.value === "evet")}>
            <option value="evet">KDV mükellefiyim (%{FREELANCE_RECEIPT.vat * 100})</option>
            <option value="hayir">KDV&apos;den muafım</option>
          </select>
        </label>
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow label="Brüt ücret (makbuzdaki tutar)" value={money(result.gross)} highlight />
          {withholding && (
            <ResultRow
              label={`Gelir vergisi stopajı (${percent(FREELANCE_RECEIPT.withholding * 100, 0)})`}
              value={money(result.stopaj)}
              tone="neg"
              hint="Müşteriniz keser ve vergi dairesine yatırır"
            />
          )}
          <ResultRow label="Net ücret" value={money(result.net)} tone="pos" />
          {vat && (
            <ResultRow
              label={`KDV (${percent(FREELANCE_RECEIPT.vat * 100, 0)})`}
              value={money(result.kdv)}
              hint="Tahsil edip beyannameyle ödersiniz"
            />
          )}
          <ResultRow label="Hesabınıza yatacak tutar" value={money(result.collected)} hint="Net ücret + KDV" />
          <ResultRow label="Müşterinin toplam maliyeti" value={money(result.clientCost)} hint="Brüt + KDV" />

          <div className="notice">
            Stopaj, yıllık gelir vergisi beyannamesinde hesaplanan vergiden mahsup edilir; peşin
            ödenmiş vergi sayılır. Bazı hizmetlerde KDV tevkifatı uygulanabilir, bu araç
            tevkifatı hesaba katmaz.
          </div>
        </div>
      ) : (
        <div className="calc-hint">
          Tutarı girin; makbuza yazacağınız brüt ücreti, stopajı, KDV&apos;yi ve hesabınıza
          geçecek tutarı gösterelim.
        </div>
      )}
    </div>
  );
}
