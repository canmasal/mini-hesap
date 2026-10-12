import type { CarVersion } from "./types";

/* Fiat Türkiye — Ekim 2026 anahtar teslim liste fiyatları (kampanyasız). */

const PRICE = "https://www.webtekno.com/ekim-2026-fiat-fiyat-listesi-h226429.html";
const M = "2026-10";

const egea = {
  brand: "Fiat", model: "Egea Sedan", year: 2026, body: "Sedan", fuel: "Dizel", drive: "Önden çekiş",
  engineCc: 1598, cylinders: 4, powerHp: 130, torqueNm: 320, consumption: 4.6, tankL: 50,
  lengthMm: 4532, widthMm: 1792, heightMm: 1497, wheelbaseMm: 2636, trunkL: 520, seats: 5,
} as const;
const egeaMt = {
  transmission: "Manuel", gears: 6, accel: 9.6, topSpeed: 212, co2: 120, weightKg: 1300,
  sources: ["https://arabakarsilastirma.com.tr/fiat/egea/2026/fiat-egea-sedan-2026-urban-1-6-multijet-130-hp", PRICE],
} as const;
const egeaDct = {
  transmission: "DCT (çift kavramalı otomatik)", gears: 6, accel: 9.8, topSpeed: 209, co2: 122, weightKg: 1355,
  sources: ["https://arabakarsilastirma.com.tr/fiat/egea/2026/fiat-egea-sedan-2026-urban-1-6-multijet-dct-130-hp", PRICE],
} as const;

const egeaCross = {
  brand: "Fiat", model: "Egea Cross", year: 2026, body: "Crossover", fuel: "Dizel", drive: "Önden çekiş",
  engineCc: 1568, cylinders: 4, powerHp: 130, torqueNm: 320, transmission: "DCT (çift kavramalı otomatik)", gears: 6,
  accel: 9.8, topSpeed: 200, consumption: 4.5, co2: 115, tankL: 50, lengthMm: 4386, widthMm: 1802, heightMm: 1556,
  trunkL: 440, seats: 5,
  sources: ["https://www.sifiraracal.com/fiat-modelleri/egea-cross-ozellikleri/street-1-6-m-jet-130-hp-dct-gsr-traction", PRICE],
} as const;

export const fiat: CarVersion[] = [
  { ...egea, ...egeaMt, id: "fiat-egea-sedan-1-6-mjet-easy", version: "1.6 Multijet 130 Easy (manuel)", priceTl: 1_499_900, priceMonth: M },
  { ...egea, ...egeaMt, id: "fiat-egea-sedan-1-6-mjet-urban", version: "1.6 Multijet 130 Urban (manuel)", priceTl: 1_599_900, priceMonth: M },
  { ...egea, ...egeaMt, id: "fiat-egea-sedan-1-6-mjet-lounge", version: "1.6 Multijet 130 Lounge (manuel)", priceTl: 1_674_900, priceMonth: M },
  { ...egea, ...egeaDct, id: "fiat-egea-sedan-1-6-mjet-dct-easy", version: "1.6 Multijet 130 DCT Easy", priceTl: 1_950_900, priceMonth: M },
  { ...egea, ...egeaDct, id: "fiat-egea-sedan-1-6-mjet-dct-urban", version: "1.6 Multijet 130 DCT Urban", priceTl: 2_020_900, priceMonth: M },
  { ...egea, ...egeaDct, id: "fiat-egea-sedan-1-6-mjet-dct-lounge", version: "1.6 Multijet 130 DCT Lounge", priceTl: 2_090_900, priceMonth: M },

  { ...egeaCross, id: "fiat-egea-cross-1-6-mjet-dct-street", version: "1.6 Multijet 130 DCT Street", priceTl: 1_990_900, priceMonth: M },
  { ...egeaCross, id: "fiat-egea-cross-1-6-mjet-dct-lounge", version: "1.6 Multijet 130 DCT Lounge", priceTl: 2_062_900, priceMonth: M },
  { ...egeaCross, id: "fiat-egea-cross-1-6-mjet-dct-limited", version: "1.6 Multijet 130 DCT Limited", priceTl: 2_099_900, priceMonth: M },

  {
    id: "fiat-grande-panda-elektrikli-la-prima", brand: "Fiat", model: "Grande Panda", version: "Elektrikli 44 kWh La Prima", year: 2026,
    body: "Hatchback", fuel: "Elektrik", powerHp: 113, transmission: "Tek vitesli otomatik", drive: "Önden çekiş",
    batteryKwh: 44, rangeKm: 320, lengthMm: 3999, widthMm: 1763, heightMm: 1573, trunkL: 361, seats: 5,
    priceTl: 1_584_900, priceMonth: M,
    sources: ["https://www.sifiraracal.com/fiat-modelleri/grande-panda-ozellikleri/la-prima-83-kw-113-hp---44-kwh", PRICE],
  },
  {
    id: "fiat-600-elektrikli-la-prima", brand: "Fiat", model: "600", version: "Elektrikli 54 kWh La Prima", year: 2026,
    body: "Crossover", fuel: "Elektrik", powerHp: 156, torqueNm: 260, transmission: "Tek vitesli otomatik", drive: "Önden çekiş",
    batteryKwh: 54, rangeKm: 409, lengthMm: 4171, heightMm: 1523, wheelbaseMm: 2562, trunkL: 360, weightKg: 1520, seats: 5,
    priceTl: 1_989_900, priceMonth: M,
    sources: ["https://www.whatcar.com/fiat/600e/suv/54kwh-la-prima-suv-5dr-electric-auto-156-ps/version", PRICE],
  },
];
