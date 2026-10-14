import type { CarVersion } from "./types";

/*
 * Kia Türkiye — Ekim 2026 liste fiyatları (kampanyasız, araclo.com).
 * Motor, tork, şanzıman, 0-100, azami hız, WLTP tüketim/CO2, ölçüler,
 * bagaj ve depo hacmi Kia Türkiye teknik özellikler sayfalarından.
 * Sayfalarda belirtilmeyen alanlar (silindir sayısı, 2WD'de çekiş yönü,
 * versiyon bazında ağırlık, Sportage Cool'un tüketimi) boş bırakılmıştır.
 */

const PRICE = "https://www.araclo.com/kia-sifir-arac-fiyatlari";
const M = "2026-10";

const sportage = {
  brand: "Kia", model: "Sportage", year: 2026, body: "SUV", fuel: "Benzin",
  engineCc: 1598, transmission: "DCT (çift kavramalı otomatik)", gears: 7, tankL: 54,
  lengthMm: 4540, widthMm: 1865, heightMm: 1645, wheelbaseMm: 2680, trunkL: 591, seats: 5,
  sources: ["https://www.kia.com/tr/modeller/sportage/teknik-ozellikler.html", PRICE],
} as const;
const sportage150 = { powerHp: 150, torqueNm: 250, accel: 9.4, topSpeed: 195 } as const;
const sportage180 = { powerHp: 180, torqueNm: 265, accel: 9.8, topSpeed: 203, drive: "Dört çeker" } as const;

const stonic = {
  brand: "Kia", model: "Stonic", year: 2026, body: "Crossover", fuel: "Benzin",
  engineCc: 998, powerHp: 100, torqueNm: 172, transmission: "DCT (çift kavramalı otomatik)", gears: 7,
  accel: 12.1, topSpeed: 179, tankL: 45,
  lengthMm: 4165, widthMm: 1760, heightMm: 1485, wheelbaseMm: 2580, trunkL: 352, seats: 5,
  sources: ["https://www.kia.com/tr/modeller/stonic/teknik-ozellikler.html", PRICE],
} as const;

export const kia: CarVersion[] = [
  { ...stonic, id: "kia-stonic-1-0l-100-ps-dct-cool", version: "1.0L 100 PS DCT Cool", consumption: 5.6, co2: 127, priceTl: 1_960_000, priceMonth: M },
  { ...stonic, id: "kia-stonic-1-0l-100-ps-dct-elegance", version: "1.0L 100 PS DCT Elegance", consumption: 5.6, co2: 127, priceTl: 1_995_000, priceMonth: M },
  { ...stonic, id: "kia-stonic-1-0l-100-ps-dct-prestige", version: "1.0L 100 PS DCT Prestige", consumption: 5.7, co2: 130, priceTl: 2_290_000, priceMonth: M },
  { ...sportage, ...sportage150, id: "kia-sportage-1-6l-150-ps-dct-live", version: "1.6L 150 PS DCT Live", consumption: 6.9, co2: 157, priceTl: 2_249_000, priceMonth: M },
  { ...sportage, ...sportage150, id: "kia-sportage-1-6l-150-ps-dct-vision", version: "1.6L 150 PS DCT Vision", consumption: 7.0, co2: 158, priceTl: 2_550_000, priceMonth: M },
  { ...sportage, ...sportage150, id: "kia-sportage-1-6l-150-ps-dct-cool", version: "1.6L 150 PS DCT Cool", priceTl: 2_750_000, priceMonth: M },
  { ...sportage, ...sportage150, id: "kia-sportage-1-6l-150-ps-dct-elegance", version: "1.6L 150 PS DCT Elegance", consumption: 7.1, co2: 161, priceTl: 3_075_000, priceMonth: M },
  { ...sportage, ...sportage150, id: "kia-sportage-1-6l-150-ps-dct-prestige", version: "1.6L 150 PS DCT Prestige", consumption: 7.1, co2: 161, priceTl: 3_340_000, priceMonth: M },
  { ...sportage, ...sportage180, id: "kia-sportage-1-6l-180-ps-4x4-dct-gt-line", version: "1.6L 180 PS 4X4 DCT GT-Line", consumption: 7.8, co2: 177, priceTl: 3_650_000, priceMonth: M },
];
