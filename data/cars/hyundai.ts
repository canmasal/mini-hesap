import type { CarVersion } from "./types";

/* Hyundai Türkiye — Ekim 2026 liste fiyatları (kampanyasız). */

const PRICE = "https://webtekno.com/ekim-2026-hyundai-fiyat-listesi-h226285.html";
const M = "2026-10";

const i20 = {
  brand: "Hyundai", model: "i20", year: 2026, body: "Hatchback", fuel: "Benzin", drive: "Önden çekiş",
  engineCc: 998, cylinders: 3, powerHp: 90, torqueNm: 172, tankL: 40,
  lengthMm: 4065, widthMm: 1775, heightMm: 1450, trunkL: 352, seats: 5,
  sources: ["https://www.sifiraracal.com/hyundai-modelleri/i20-ozellikleri/elite-gsr-ii-c-e-call", "https://www.sifiraracal.com/hyundai-modelleri/i20", PRICE],
} as const;
const i20Dct = { transmission: "DCT (çift kavramalı otomatik)", gears: 7, accel: 11.4, topSpeed: 185, consumption: 5.8, co2: 139 } as const;

export const hyundai: CarVersion[] = [
  { ...i20, id: "hyundai-i20-1-0-tgdi-90-jump-mt", version: "1.0 T-GDI 90 Jump (manuel)", transmission: "Manuel", gears: 6, priceTl: 1_582_000, priceMonth: M },
  { ...i20, ...i20Dct, id: "hyundai-i20-1-0-tgdi-90-jump-dct", version: "1.0 T-GDI 90 DCT Jump", priceTl: 1_759_000, priceMonth: M },
  { ...i20, ...i20Dct, id: "hyundai-i20-1-0-tgdi-90-style-dct", version: "1.0 T-GDI 90 DCT Style", priceTl: 1_965_000, priceMonth: M },
  { ...i20, ...i20Dct, id: "hyundai-i20-1-0-tgdi-90-elite-dct", version: "1.0 T-GDI 90 DCT Elite", priceTl: 2_091_000, priceMonth: M },
];
