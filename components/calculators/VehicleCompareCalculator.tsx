"use client";

import { useMemo, useState } from "react";

import { vehicleTco } from "@/lib/calculations/newTools";
import { money } from "./ResultRow";

const n = (s: string) => Number(s.replace(",", ".")) || 0;

type Car = {
  name: string;
  price: string;
  consumption: string;
  energyPrice: string;
  insurance: string;
  tax: string;
  maintenance: string;
  resale: string;
};

const empty = (name: string): Car => ({
  name,
  price: "",
  consumption: "",
  energyPrice: "",
  insurance: "",
  tax: "",
  maintenance: "",
  resale: "60",
});

const FIELDS: { key: keyof Car; label: string; hint?: string }[] = [
  { key: "price", label: "Alış fiyatı (₺)" },
  { key: "consumption", label: "Tüketim (100 km'de L veya kWh)" },
  { key: "energyPrice", label: "Yakıt / elektrik birim fiyatı (₺)" },
  { key: "insurance", label: "Yıllık sigorta + kasko (₺)" },
  { key: "tax", label: "Yıllık MTV (₺)" },
  { key: "maintenance", label: "Yıllık bakım + lastik (₺)" },
  { key: "resale", label: "Süre sonunda satış değeri (%)", hint: "Alış fiyatına göre" },
];

export default function VehicleCompareCalculator() {
  const [cars, setCars] = useState<Car[]>([empty("Araç A"), empty("Araç B")]);
  const [years, setYears] = useState("5");
  const [km, setKm] = useState("15000");

  const update = (i: number, key: keyof Car, value: string) =>
    setCars((prev) => prev.map((c, idx) => (idx === i ? { ...c, [key]: value } : c)));

  const results = useMemo(
    () =>
      cars.map((c) =>
        vehicleTco(
          {
            name: c.name,
            price: n(c.price),
            consumption: n(c.consumption),
            energyPrice: n(c.energyPrice),
            insurance: n(c.insurance),
            tax: n(c.tax),
            maintenance: n(c.maintenance),
            resaleRate: n(c.resale) / 100,
          },
          n(years),
          n(km),
        ),
      ),
    [cars, years, km],
  );

  const ready = results.every(Boolean);
  const [a, b] = results;
  const cheaper = ready && a && b ? (a.total <= b.total ? 0 : 1) : null;
  const diff = ready && a && b ? Math.abs(a.total - b.total) : 0;

  return (
    <div className="calc-box">
      <div className="form-grid">
        <label className="field">
          Elde tutma süresi (yıl)
          <input type="number" inputMode="numeric" min="1" max="30" value={years} onChange={(e) => setYears(e.target.value)} />
        </label>
        <label className="field">
          Yıllık yol (km)
          <input type="number" inputMode="numeric" min="0" value={km} onChange={(e) => setKm(e.target.value)} />
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18, marginTop: 18 }}>
        {cars.map((car, i) => (
          <fieldset key={i} style={{ border: "1px solid var(--line)", borderRadius: 16, padding: 16, margin: 0 }}>
            <legend style={{ fontWeight: 800, padding: "0 6px" }}>{car.name || `Araç ${i + 1}`}</legend>
            <div style={{ display: "grid", gap: 12 }}>
              <label className="field">
                Araç adı
                <input type="text" value={car.name} onChange={(e) => update(i, "name", e.target.value)} maxLength={40} />
              </label>
              {FIELDS.map((f) => (
                <label className="field" key={f.key}>
                  {f.label}
                  <input type="number" inputMode="decimal" min="0" value={car[f.key]} onChange={(e) => update(i, f.key, e.target.value)} />
                  {f.hint && <span className="field-hint">{f.hint}</span>}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      {ready && a && b ? (
        <div style={{ marginTop: 22, display: "grid", gap: 12 }}>
          <div className="notice notice-ok">
            <strong>{cars[cheaper!].name || `Araç ${cheaper! + 1}`}</strong>, {n(years)} yılda toplamda{" "}
            <strong>{money(diff)}</strong> daha ekonomik.
          </div>
          <div className="rates-table-wrap">
            <table className="rates-table">
              <thead>
                <tr>
                  <th scope="col">Kalem</th>
                  <th scope="col">{cars[0].name || "Araç A"}</th>
                  <th scope="col">{cars[1].name || "Araç B"}</th>
                </tr>
              </thead>
              <tbody>
                <tr><th scope="row">Yıllık yakıt / elektrik</th><td>{money(a.energyYearly)}</td><td>{money(b.energyYearly)}</td></tr>
                <tr><th scope="row">Yıllık işletme gideri</th><td>{money(a.runningYearly)}</td><td>{money(b.runningYearly)}</td></tr>
                <tr><th scope="row">Değer kaybı (alış − satış)</th><td>{money(a.depreciation)}</td><td>{money(b.depreciation)}</td></tr>
                <tr className="is-total"><th scope="row">Toplam sahip olma maliyeti</th><td>{money(a.total)}</td><td>{money(b.total)}</td></tr>
                <tr><th scope="row">Aylık ortalama</th><td>{money(a.monthly)}</td><td>{money(b.monthly)}</td></tr>
                <tr><th scope="row">Kilometre başına</th><td>{money(a.perKm)}</td><td>{money(b.perKm)}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="notice">
            Hesap bugünkü fiyatlarla yapılır; gelecekteki yakıt zammı, enflasyon ve kredi faizi
            dahil değildir. Krediyle alıyorsanız faiz maliyetini Kredi Hesaplama aracıyla ekleyin.
          </div>
        </div>
      ) : (
        <div className="calc-hint">İki aracın fiyatını girin; tüketim, sigorta ve bakım bilgilerini ekledikçe karşılaştırma netleşir.</div>
      )}
    </div>
  );
}
