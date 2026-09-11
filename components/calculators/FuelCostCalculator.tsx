"use client";

import { useMemo, useState } from "react";

import ResultRow, { money } from "./ResultRow";

/**
 * Yakıt ve yol maliyeti hesaplama.
 *
 * Mesafe, aracın ortalama tüketimi ve güncel yakıt fiyatı üzerinden
 * gidiş, gidiş-dönüş, kişi başı ve aylık düzenli yol maliyetini hesaplar.
 */
export default function FuelCostCalculator() {
  const [distance, setDistance] = useState("");
  const [consumption, setConsumption] = useState("7.5");
  const [fuelPrice, setFuelPrice] = useState("");
  const [people, setPeople] = useState("1");
  const [roundTrip, setRoundTrip] = useState(true);
  const [tripsPerMonth, setTripsPerMonth] = useState("0");
  const [tolls, setTolls] = useState("0");

  const result = useMemo(() => {
    const km = Number(distance);
    const lt100 = Number(consumption);
    const price = Number(fuelPrice);
    const p = Math.max(1, Number(people) || 1);
    const trips = Number(tripsPerMonth) || 0;
    const toll = Number(tolls) || 0;

    if (
      !distance ||
      !fuelPrice ||
      !Number.isFinite(km) || km <= 0 ||
      !Number.isFinite(lt100) || lt100 <= 0 ||
      !Number.isFinite(price) || price <= 0
    ) {
      return null;
    }

    const totalKm = roundTrip ? km * 2 : km;
    const liters = (totalKm * lt100) / 100;
    const fuelCost = liters * price;
    const tollCost = roundTrip ? toll * 2 : toll;
    const tripCost = fuelCost + tollCost;

    return {
      totalKm,
      liters,
      fuelCost,
      tollCost,
      tripCost,
      perPerson: tripCost / p,
      perKm: tripCost / totalKm,
      monthly: trips > 0 ? tripCost * trips : null,
      yearly: trips > 0 ? tripCost * trips * 12 : null,
    };
  }, [distance, consumption, fuelPrice, people, roundTrip, tripsPerMonth, tolls]);

  function handleClear() {
    setDistance("");
    setFuelPrice("");
    setConsumption("7.5");
    setPeople("1");
    setRoundTrip(true);
    setTripsPerMonth("0");
    setTolls("0");
  }

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Mesafe (km)
          <input
            type="number" min="0" step="0.1"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="450"
          />
          <span className="field-hint">Tek yön mesafe.</span>
        </label>

        <label className="field">
          Ortalama Tüketim (lt / 100 km)
          <input
            type="number" min="0" step="0.1"
            value={consumption}
            onChange={(e) => setConsumption(e.target.value)}
          />
          <span className="field-hint">
            Aracın gösterge panelindeki ortalama değeri kullanın.
          </span>
        </label>

        <label className="field">
          Yakıt Fiyatı (₺ / lt)
          <input
            type="number" min="0" step="0.01"
            value={fuelPrice}
            onChange={(e) => setFuelPrice(e.target.value)}
            placeholder="48.50"
          />
        </label>

        <label className="field">
          Yolculuk Tipi
          <select
            value={roundTrip ? "gidis-donus" : "tek-yon"}
            onChange={(e) => setRoundTrip(e.target.value === "gidis-donus")}
          >
            <option value="gidis-donus">Gidiş - dönüş</option>
            <option value="tek-yon">Tek yön</option>
          </select>
        </label>

        <label className="field">
          Kişi Sayısı
          <input
            type="number" min="1" step="1"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
          />
          <span className="field-hint">Maliyeti bölüşmek için.</span>
        </label>

        <label className="field">
          Köprü / Otoyol Ücreti (₺)
          <input
            type="number" min="0" step="1"
            value={tolls}
            onChange={(e) => setTolls(e.target.value)}
          />
          <span className="field-hint">Tek yön için.</span>
        </label>

        <label className="field">
          Ayda Kaç Kez? (isteğe bağlı)
          <input
            type="number" min="0" step="1"
            value={tripsPerMonth}
            onChange={(e) => setTripsPerMonth(e.target.value)}
          />
          <span className="field-hint">
            İşe gidiş-geliş gibi düzenli yolculuklar için.
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
          <ResultRow
            label="Toplam Mesafe"
            value={`${result.totalKm.toLocaleString("tr-TR")} km`}
          />

          <ResultRow
            label="Harcanacak Yakıt"
            value={`${result.liters.toLocaleString("tr-TR", {
              maximumFractionDigits: 1,
            })} litre`}
          />

          <ResultRow label="Yakıt Maliyeti" value={money(result.fuelCost)} />

          {result.tollCost > 0 && (
            <ResultRow label="Köprü / Otoyol" value={money(result.tollCost)} />
          )}

          <ResultRow
            label="Toplam Yolculuk Maliyeti"
            value={money(result.tripCost)}
            highlight
          />

          {Number(people) > 1 && (
            <ResultRow
              label="Kişi Başı"
              value={money(result.perPerson)}
              hint={`${people} kişi arasında bölüşüldüğünde`}
              highlight
              tone="pos"
            />
          )}

          <ResultRow
            label="Kilometre Başına Maliyet"
            value={money(result.perKm)}
          />

          {result.monthly !== null && (
            <>
              <ResultRow
                label="Aylık Maliyet"
                value={money(result.monthly)}
                hint={`Ayda ${tripsPerMonth} yolculuk`}
                tone="neg"
                highlight
              />
              <ResultRow
                label="Yıllık Maliyet"
                value={money(result.yearly!)}
                tone="neg"
              />
            </>
          )}

          <div className="notice">
            Bu hesap yalnızca yakıt ve geçiş ücretini kapsar. Aracın gerçek
            kilometre maliyetine lastik, bakım, sigorta, MTV ve değer kaybı da
            eklenir; bunlar genelde yakıt kadar tutar.
          </div>
        </div>
      ) : (
        <div className="notice">
          Mesafeyi, aracınızın ortalama tüketimini ve güncel yakıt fiyatını
          girin. Yolculuk maliyetinizi ve kişi başı düşen tutarı hesaplayalım.
        </div>
      )}
    </div>
  );
}
