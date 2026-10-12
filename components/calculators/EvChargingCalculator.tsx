"use client";

import { useMemo, useState } from "react";

import { evChargingCost } from "@/lib/calculations/newTools";
import ResultRow, { money } from "./ResultRow";

const n = (s: string) => Number(s.replace(",", ".")) || 0;

export default function EvChargingCalculator() {
  const [battery, setBattery] = useState("60");
  const [consumption, setConsumption] = useState("16");
  const [homePrice, setHomePrice] = useState("");
  const [fastPrice, setFastPrice] = useState("");
  const [fastShare, setFastShare] = useState("20");
  const [loss, setLoss] = useState("10");
  const [km, setKm] = useState("15000");
  const [fuelCons, setFuelCons] = useState("6.5");
  const [fuelPrice, setFuelPrice] = useState("");

  const result = useMemo(
    () =>
      evChargingCost({
        batteryKwh: n(battery),
        consumption: n(consumption),
        homePrice: n(homePrice),
        fastPrice: n(fastPrice),
        fastShare: n(fastShare) / 100,
        chargingLoss: n(loss) / 100,
        yearlyKm: n(km),
        fuelConsumption: n(fuelCons),
        fuelPrice: n(fuelPrice),
      }),
    [battery, consumption, homePrice, fastPrice, fastShare, loss, km, fuelCons, fuelPrice],
  );

  return (
    <div className="calc-box">
      <p className="field-hint" style={{ marginTop: 0, fontWeight: 700 }}>Elektrikli araç</p>
      <div className="form-grid">
        <label className="field">
          Batarya kapasitesi (kWh)
          <input type="number" inputMode="decimal" min="0" value={battery} onChange={(e) => setBattery(e.target.value)} />
        </label>
        <label className="field">
          Tüketim (kWh / 100 km)
          <input type="number" inputMode="decimal" min="0" value={consumption} onChange={(e) => setConsumption(e.target.value)} />
        </label>
        <label className="field">
          Evde elektrik birim fiyatı (₺/kWh)
          <input type="number" inputMode="decimal" min="0" value={homePrice} onChange={(e) => setHomePrice(e.target.value)} />
          <span className="field-hint">Faturanızdaki vergiler dahil kWh fiyatı.</span>
        </label>
        <label className="field">
          Hızlı (DC) şarj fiyatı (₺/kWh)
          <input type="number" inputMode="decimal" min="0" value={fastPrice} onChange={(e) => setFastPrice(e.target.value)} />
          <span className="field-hint">Kullandığınız şarj ağının güncel tarifesi.</span>
        </label>
        <label className="field">
          Hızlı şarj payı (%)
          <input type="number" inputMode="decimal" min="0" max="100" value={fastShare} onChange={(e) => setFastShare(e.target.value)} />
        </label>
        <label className="field">
          Şarj kaybı (%)
          <input type="number" inputMode="decimal" min="0" max="50" value={loss} onChange={(e) => setLoss(e.target.value)} />
        </label>
        <label className="field">
          Yıllık yol (km)
          <input type="number" inputMode="numeric" min="0" value={km} onChange={(e) => setKm(e.target.value)} />
        </label>
      </div>

      <p className="field-hint" style={{ marginTop: 18, fontWeight: 700 }}>Karşılaştırılacak yakıtlı araç</p>
      <div className="form-grid">
        <label className="field">
          Yakıt tüketimi (L / 100 km)
          <input type="number" inputMode="decimal" min="0" value={fuelCons} onChange={(e) => setFuelCons(e.target.value)} />
        </label>
        <label className="field">
          Yakıt litre fiyatı (₺)
          <input type="number" inputMode="decimal" min="0" value={fuelPrice} onChange={(e) => setFuelPrice(e.target.value)} />
        </label>
      </div>

      {result ? (
        <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
          <ResultRow label="Elektrikli araç: 100 km maliyeti" value={money(result.evPer100)} highlight hint={`Ortalama kWh fiyatı ${money(result.blendedPrice)} (ev + hızlı şarj karışımı)`} />
          {result.fuelPer100 !== null && <ResultRow label="Yakıtlı araç: 100 km maliyeti" value={money(result.fuelPer100)} />}
          <ResultRow label="Elektrikli araç: yıllık enerji gideri" value={money(result.evYearly)} />
          {result.fuelYearly !== null && <ResultRow label="Yakıtlı araç: yıllık yakıt gideri" value={money(result.fuelYearly)} />}
          {result.yearlySaving !== null && (
            <ResultRow
              label={result.yearlySaving >= 0 ? "Yıllık tasarruf (elektrikli lehine)" : "Yıllık ek maliyet (elektrikli aleyhine)"}
              value={money(Math.abs(result.yearlySaving))}
              tone={result.yearlySaving >= 0 ? "pos" : "neg"}
              highlight
            />
          )}
          {result.fullChargeHome !== null && <ResultRow label="Evde tam şarj (0–100%)" value={money(result.fullChargeHome)} />}
          {result.fullChargeFast !== null && <ResultRow label="Hızlı şarjda tam şarj" value={money(result.fullChargeFast)} />}
          {result.range !== null && <ResultRow label="Tam şarjla teorik menzil" value={`${result.range.toLocaleString("tr-TR")} km`} hint="Kış, yüksek hız ve klima menzili düşürür" />}
          <div className="notice">
            Hesap yalnızca enerji giderini karşılaştırır. Satın alma fiyatı, sigorta, bakım,
            MTV ve değer kaybıyla birlikte toplam maliyet için Araç Karşılaştırma aracını kullanın.
          </div>
        </div>
      ) : (
        <div className="calc-hint">Evdeki elektrik kWh fiyatını girin; yakıt fiyatını da yazarsanız benzinli/dizel araçla karşılaştıralım.</div>
      )}
    </div>
  );
}
