import type { CarVersion } from "./types";

/*
 * Toyota Türkiye — Ekim 2026 liste fiyatları (kampanyasız). Teknik veriler
 * Toyota Türkiye "Teknik ve Donanım Özellikleri" belgelerinden. Hibritlerde
 * güç, sistem toplam gücüdür; Toyota sistem toplam torkunu yayımlamadığı
 * için tork boş bırakılmıştır. Ağırlık, sürücü dahil en düşük değerdir.
 */

const PRICE = "https://www.cnbce.com/otomotiv/toyota-corollada-buyuk-indirim-fiyat-2-milyonun-altinda-iste-yeni-fiyat-listesi-g38492";
const DOC = "https://www.toyota.com.tr/content/dam/toyota/nmsc/turkey/cars/e-brosur";
const M = "2026-10";

const corolla = {
  brand: "Toyota", model: "Corolla", year: 2026, body: "Sedan", drive: "Önden çekiş",
  lengthMm: 4630, widthMm: 1780, heightMm: 1435, wheelbaseMm: 2700, trunkL: 471, seats: 5,
  sources: [`${DOC}/corolla/Corolla-Teknik-ve-Donanim-Ozellikleri-01-2026.pdf`, PRICE],
} as const;
const corolla15 = {
  fuel: "Benzin", engineCc: 1490, cylinders: 3, powerHp: 125, torqueNm: 153, transmission: "Multidrive S (CVT)",
  accel: 11.5, topSpeed: 190, consumption: 6.3, co2: 143, tankL: 50, weightKg: 1370,
} as const;
const corollaHy = {
  fuel: "Hibrit", engineCc: 1798, cylinders: 4, powerHp: 140, transmission: "e-CVT",
  accel: 9.3, topSpeed: 180, consumption: 4.7, co2: 106, tankL: 43, weightKg: 1430,
} as const;

const chr = {
  brand: "Toyota", model: "C-HR", year: 2026, body: "Crossover", fuel: "Hibrit", drive: "Önden çekiş",
  engineCc: 1798, cylinders: 4, powerHp: 140, transmission: "e-CVT", accel: 9.9, topSpeed: 175, consumption: 4.9, co2: 110,
  tankL: 43, lengthMm: 4362, widthMm: 1832, heightMm: 1558, wheelbaseMm: 2640, trunkL: 388, weightKg: 1505, seats: 5,
  sources: [`${DOC}/toyota-c-hr/TOYOTA_CHR_TeknikDonan%C4%B1m_ekim_2026.pdf`, PRICE],
} as const;

const cross = {
  brand: "Toyota", model: "Corolla Cross", year: 2026, body: "SUV", fuel: "Hibrit", drive: "Önden çekiş",
  engineCc: 1798, cylinders: 4, powerHp: 140, transmission: "e-CVT", accel: 10, topSpeed: 170, consumption: 5.1, co2: 115,
  tankL: 36, lengthMm: 4460, widthMm: 1825, heightMm: 1620, wheelbaseMm: 2640, weightKg: 1450, seats: 5,
  sources: [`${DOC}/corolla-cross/TOYOTA_CorollaCross_TeknikDonanim_2026_HR-1.pdf`, PRICE],
} as const;

const corollaHb = {
  brand: "Toyota", model: "Corolla Hatchback", year: 2026, body: "Hatchback", fuel: "Hibrit", drive: "Önden çekiş",
  engineCc: 1798, cylinders: 4, powerHp: 140, transmission: "e-CVT", accel: 9.1, topSpeed: 180, consumption: 4.7, co2: 105,
  tankL: 43, lengthMm: 4370, widthMm: 1790, heightMm: 1460, wheelbaseMm: 2640, trunkL: 361, weightKg: 1345, seats: 5,
  sources: [`${DOC}/corolla-hb/Corolla-Hatchback-Teknik-ve-Donanim-Ozellikleri-02-2026.pdf`, PRICE],
} as const;

const yaris = {
  brand: "Toyota", model: "Yaris", year: 2026, body: "Hatchback", fuel: "Hibrit", drive: "Önden çekiş",
  engineCc: 1490, cylinders: 3, transmission: "e-CVT", topSpeed: 175, consumption: 3.9, tankL: 36,
  lengthMm: 3940, widthMm: 1745, heightMm: 1500, wheelbaseMm: 2560, trunkL: 286, seats: 5,
  sources: [`${DOC}/yaris/Yaris-Hybrid-Teknik-Donanim-Ozellikleri.pdf`, PRICE],
} as const;

const yarisCross = {
  brand: "Toyota", model: "Yaris Cross", year: 2026, body: "Crossover", fuel: "Hibrit", drive: "Önden çekiş",
  engineCc: 1490, cylinders: 3, powerHp: 130, transmission: "e-CVT", accel: 10.7, topSpeed: 170, consumption: 4.7, co2: 106,
  tankL: 36, lengthMm: 4167, widthMm: 1765, heightMm: 1595, wheelbaseMm: 2560, trunkL: 397, weightKg: 1275, seats: 5,
  sources: [`${DOC}/yeni-yaris-cross/Toyota_YeniYarisCross_TeknikDonan%C4%B1m_Ekim_2026.pdf`, PRICE],
} as const;

export const toyota: CarVersion[] = [
  { ...corolla, ...corolla15, id: "toyota-corolla-1-5-vision-plus", version: "1.5 Vision Plus Multidrive S", priceTl: 2_545_500, priceMonth: M },
  { ...corolla, ...corolla15, id: "toyota-corolla-1-5-dream", version: "1.5 Dream Multidrive S", priceTl: 2_753_500, priceMonth: M },
  { ...corolla, ...corolla15, id: "toyota-corolla-1-5-flame-x-pack", version: "1.5 Flame X-Pack Multidrive S", priceTl: 3_126_000, priceMonth: M },
  { ...corolla, ...corollaHy, id: "toyota-corolla-1-8-hybrid-dream", version: "1.8 Hybrid Dream e-CVT", priceTl: 2_968_000, priceMonth: M },
  { ...corolla, ...corollaHy, id: "toyota-corolla-1-8-hybrid-flame-x-pack", version: "1.8 Hybrid Flame X-Pack e-CVT", priceTl: 3_297_000, priceMonth: M },

  { ...corollaHb, id: "toyota-corolla-hb-1-8-hybrid-flame", version: "1.8 Hybrid Flame e-CVT", priceTl: 2_960_000, priceMonth: M },
  { ...corollaHb, id: "toyota-corolla-hb-1-8-hybrid-gr-sport", version: "1.8 Hybrid GR Sport e-CVT", priceTl: 3_050_000, priceMonth: M },

  { ...cross, id: "toyota-corolla-cross-1-8-hybrid-flame", version: "1.8 Hybrid Flame e-CVT", trunkL: 436, priceTl: 3_413_000, priceMonth: M },
  { ...cross, id: "toyota-corolla-cross-1-8-hybrid-passion", version: "1.8 Hybrid Passion e-CVT", trunkL: 436, priceTl: 3_660_000, priceMonth: M },

  { ...chr, id: "toyota-c-hr-1-8-hybrid-flame", version: "1.8 Hybrid Flame e-CVT", priceTl: 2_859_000, priceMonth: M },
  { ...chr, id: "toyota-c-hr-1-8-hybrid-passion", version: "1.8 Hybrid Passion e-CVT", priceTl: 3_112_000, priceMonth: M },
  { ...chr, id: "toyota-c-hr-1-8-hybrid-gr-sport", version: "1.8 Hybrid GR Sport e-CVT", priceTl: 3_577_000, priceMonth: M },

  { ...yaris, id: "toyota-yaris-1-5-hybrid-116-flame", version: "1.5 Hybrid 116 Flame e-CVT", powerHp: 117, accel: 9.7, co2: 87, weightKg: 1090, priceTl: 2_521_000, priceMonth: M },
  { ...yaris, id: "toyota-yaris-1-5-hybrid-130-passion-x-pack", version: "1.5 Hybrid 130 Passion X-Pack e-CVT", powerHp: 130, accel: 9.2, co2: 88, weightKg: 1235, priceTl: 2_918_000, priceMonth: M },

  { ...yarisCross, id: "toyota-yaris-cross-1-5-hybrid-130-dream", version: "1.5 Hybrid 130 Dream e-CVT", priceTl: 2_820_000, priceMonth: M },
  { ...yarisCross, id: "toyota-yaris-cross-1-5-hybrid-130-flame-x-pack", version: "1.5 Hybrid 130 Flame X-Pack e-CVT", priceTl: 3_345_000, priceMonth: M },
];
