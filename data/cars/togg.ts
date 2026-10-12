import type { CarVersion } from "./types";

/*
 * Togg — Ekim 2026 tavsiye edilen anahtar teslim fiyatlar. Teknik veriler
 * Togg'un yayımladığı değerlerden (togg.com.tr ve model sayfaları).
 * Doğrulanamayan alanlar boş bırakılmıştır.
 */

const PRICE = "https://www.webtekno.com/ekim-2026-togg-fiyat-listesi-h226564.html";
const M = "2026-10";

const t10x = {
  brand: "Togg", model: "T10X", year: 2026, body: "SUV", fuel: "Elektrik", transmission: "Tek vitesli otomatik",
  lengthMm: 4599, widthMm: 1886, heightMm: 1676, wheelbaseMm: 2890, seats: 5,
  sources: ["https://www.togg.com.tr/en/t10x", "https://en.wikipedia.org/wiki/Togg_T10X", PRICE],
} as const;
const t10xRwd = { drive: "Arkadan itiş", powerHp: 218, torqueNm: 350, topSpeed: 185 } as const;

const t10f = {
  brand: "Togg", model: "T10F", year: 2026, body: "Sedan", fuel: "Elektrik", transmission: "Tek vitesli otomatik",
  lengthMm: 4830, widthMm: 1881, heightMm: 1560, wheelbaseMm: 2890, seats: 5,
  sources: ["https://en.wikipedia.org/wiki/Togg_T10F", PRICE],
} as const;

export const togg: CarVersion[] = [
  { ...t10x, ...t10xRwd, id: "togg-t10x-v1-rwd-standart", version: "V1 RWD Standart Menzil", batteryKwh: 52.4, rangeKm: 314, priceTl: 1_909_048, priceMonth: M },
  { ...t10x, ...t10xRwd, id: "togg-t10x-v1-rwd-uzun", version: "V1 RWD Uzun Menzil", batteryKwh: 88.5, rangeKm: 523, priceTl: 2_219_668, priceMonth: M },
  { ...t10x, ...t10xRwd, id: "togg-t10x-v2-rwd-uzun", version: "V2 RWD Uzun Menzil", batteryKwh: 88.5, rangeKm: 523, priceTl: 2_411_000, priceMonth: M },
  { ...t10x, id: "togg-t10x-v2-4more", version: "V2 4More (AWD)", drive: "Dört çeker", powerHp: 435, torqueNm: 700, accel: 4.8, batteryKwh: 88.5, priceTl: 3_218_137, priceMonth: M },

  { ...t10f, id: "togg-t10f-v1-rwd-standart", version: "V1 RWD Standart Menzil", drive: "Arkadan itiş", powerHp: 218, batteryKwh: 52.4, priceTl: 1_884_980, priceMonth: M },
  { ...t10f, id: "togg-t10f-v1-rwd-uzun", version: "V1 RWD Uzun Menzil", drive: "Arkadan itiş", powerHp: 218, batteryKwh: 88.5, rangeKm: 623, priceTl: 2_195_600, priceMonth: M },
  { ...t10f, id: "togg-t10f-v2-rwd-uzun", version: "V2 RWD Uzun Menzil", drive: "Arkadan itiş", powerHp: 218, batteryKwh: 88.5, rangeKm: 623, priceTl: 2_370_930, priceMonth: M },
  { ...t10f, id: "togg-t10f-v2-4more", version: "V2 4More (AWD)", drive: "Dört çeker", powerHp: 435, batteryKwh: 88.5, priceTl: 3_217_937, priceMonth: M },
];
