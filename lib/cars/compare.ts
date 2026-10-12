/**
 * Araç karşılaştırma alanları ve üstünlük kuralları.
 *
 * Her alan için "better" yönü tanımlıdır: higher (yüksek olan iyi), lower
 * (düşük olan iyi) veya none (karşılaştırılmaz, yalnızca gösterilir).
 */

import type { CarVersion } from "@/data/cars/types";

type Key = keyof CarVersion;

export type Field = {
  key: Key;
  label: string;
  unit?: string;
  better: "higher" | "lower" | "none";
  digits?: number;
};

export type FieldGroup = { title: string; fields: Field[] };

export const FIELD_GROUPS: FieldGroup[] = [
  {
    title: "Fiyat",
    fields: [{ key: "priceTl", label: "Liste fiyatı", unit: "TL", better: "lower" }],
  },
  {
    title: "Motor",
    fields: [
      { key: "fuel", label: "Yakıt türü", better: "none" },
      { key: "engineCc", label: "Motor hacmi", unit: "cc", better: "none" },
      { key: "cylinders", label: "Silindir sayısı", better: "none" },
      { key: "powerHp", label: "Motor gücü", unit: "HP", better: "higher" },
      { key: "torqueNm", label: "Tork", unit: "Nm", better: "higher" },
    ],
  },
  {
    title: "Şanzıman ve çekiş",
    fields: [
      { key: "transmission", label: "Şanzıman", better: "none" },
      { key: "gears", label: "Vites sayısı", better: "none" },
      { key: "drive", label: "Çekiş", better: "none" },
    ],
  },
  {
    title: "Performans",
    fields: [
      { key: "accel", label: "0-100 km/s", unit: "sn", better: "lower", digits: 1 },
      { key: "topSpeed", label: "Azami hız", unit: "km/s", better: "higher" },
    ],
  },
  {
    title: "Tüketim ve menzil (WLTP)",
    fields: [
      { key: "consumption", label: "Ortalama yakıt tüketimi", unit: "L/100 km", better: "lower", digits: 1 },
      { key: "electricConsumption", label: "Elektrik tüketimi", unit: "kWh/100 km", better: "lower", digits: 1 },
      { key: "rangeKm", label: "Elektrikli menzil", unit: "km", better: "higher" },
      { key: "batteryKwh", label: "Batarya kapasitesi", unit: "kWh", better: "higher", digits: 1 },
      { key: "co2", label: "CO₂ emisyonu", unit: "g/km", better: "lower" },
      { key: "tankL", label: "Yakıt deposu", unit: "L", better: "higher" },
    ],
  },
  {
    title: "Ölçüler ve kapasite",
    fields: [
      { key: "body", label: "Kasa tipi", better: "none" },
      { key: "lengthMm", label: "Uzunluk", unit: "mm", better: "none" },
      { key: "widthMm", label: "Genişlik", unit: "mm", better: "none" },
      { key: "heightMm", label: "Yükseklik", unit: "mm", better: "none" },
      { key: "wheelbaseMm", label: "Aks mesafesi", unit: "mm", better: "higher" },
      { key: "trunkL", label: "Bagaj hacmi", unit: "L", better: "higher" },
      { key: "weightKg", label: "Boş ağırlık", unit: "kg", better: "none" },
      { key: "seats", label: "Koltuk sayısı", better: "higher" },
    ],
  },
];

export function formatField(field: Field, value: unknown): string {
  if (value === undefined || value === null || value === "") return "—";
  if (typeof value === "number") {
    const text = value.toLocaleString("tr-TR", {
      minimumFractionDigits: field.digits ?? 0,
      maximumFractionDigits: field.digits ?? 0,
    });
    return field.unit ? `${text} ${field.unit}` : text;
  }
  return String(value);
}

/** -1: a üstün, 1: b üstün, 0: eşit veya karşılaştırılamaz */
export function compareField(field: Field, a: CarVersion, b: CarVersion): -1 | 0 | 1 {
  if (field.better === "none") return 0;
  const va = a[field.key];
  const vb = b[field.key];
  if (typeof va !== "number" || typeof vb !== "number" || va === vb) return 0;
  const aBetter = field.better === "higher" ? va > vb : va < vb;
  return aBetter ? -1 : 1;
}

export function score(a: CarVersion, b: CarVersion) {
  let aWins = 0;
  let bWins = 0;
  for (const group of FIELD_GROUPS) {
    for (const field of group.fields) {
      const r = compareField(field, a, b);
      if (r === -1) aWins += 1;
      if (r === 1) bWins += 1;
    }
  }
  return { aWins, bWins };
}

export const carLabel = (c: CarVersion) => `${c.brand} ${c.model} ${c.version}`;

/** Bir alanın iki araçta da boş olup olmadığı (tabloda gizlemek için) */
export function isEmptyForBoth(field: Field, a: CarVersion, b: CarVersion) {
  const empty = (v: unknown) => v === undefined || v === null || v === "";
  return empty(a[field.key]) && empty(b[field.key]);
}
