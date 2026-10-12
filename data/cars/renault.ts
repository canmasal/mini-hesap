import type { CarVersion } from "./types";

/*
 * Renault Türkiye — fiyatlar Ekim 2026 liste fiyatıdır (kampanyasız).
 * Teknik veriler Renault Türkiye teknik broşürlerinden alınmıştır. Broşürde
 * aralık verilen tüketim/CO₂ değerlerinde üst değer kullanılmıştır.
 */

const PRICE = "https://www.webtekno.com/renault-ekim-2026-fiyat-listesi-aciklandi-duster-a-zam-h226433.html";
const M = "2026-10";

const clio = {
  brand: "Renault", model: "Clio", year: 2026, body: "Hatchback", fuel: "Benzin",
  engineCc: 1199, cylinders: 3, powerHp: 115, torqueNm: 190, transmission: "EDC (çift kavramalı otomatik)",
  drive: "Önden çekiş", accel: 10, topSpeed: 180, consumption: 5.3, co2: 121, tankL: 39,
  lengthMm: 4116, widthMm: 1768, heightMm: 1451, wheelbaseMm: 2591, trunkL: 391, weightKg: 1178, seats: 5,
  sources: ["https://cdn.group.renault.com/ren/tr/brochures/clio-cl6-ph1/CLIO-CL6-PH1-TEKNIK-BROSUR-16092026.pdf.asset.pdf/dc748f3855.pdf", PRICE],
} as const;

const duster = {
  brand: "Renault", model: "Duster", year: 2026, body: "SUV", drive: "Önden çekiş",
  lengthMm: 4343, widthMm: 1813, heightMm: 1656, wheelbaseMm: 2657, seats: 5,
  sources: ["https://cdn.group.renault.com/ren/tr/brochures/duster-p1311-ph1/RENAULT-DUSTER-P1311-PH1-BROSUR-01102026.pdf.asset.pdf/0af2d11a5a.pdf", PRICE],
} as const;

const dusterTce = { fuel: "Benzin", powerHp: 145, torqueNm: 245, transmission: "EDC (çift kavramalı otomatik)", gears: 7, accel: 9.4, consumption: 6.3, co2: 141, trunkL: 594 } as const;
const dusterFh = { fuel: "Hibrit", powerHp: 160, torqueNm: 270, transmission: "Çok modlu otomatik", consumption: 4.6, co2: 103 } as const;
const duster4x4 = { fuel: "Hafif Hibrit", powerHp: 150, transmission: "Otomatik", gears: 6, drive: "Dört çeker", consumption: 5.8, co2: 113 } as const;

const boreal = {
  brand: "Renault", model: "Boreal", year: 2026, body: "SUV", drive: "Önden çekiş", topSpeed: 180,
  lengthMm: 4556, widthMm: 1841, heightMm: 1659, wheelbaseMm: 2701, seats: 5,
  sources: ["https://cdn.group.renault.com/ren/tr/brochures/boreal-br1-ph1/RENAULT-BOREAL-BR1-PH1-BROSUR-20082026.pdf.asset.pdf/dfdbcc6c4d.pdf", PRICE],
} as const;
const borealTce = { fuel: "Benzin", powerHp: 145, torqueNm: 245, transmission: "EDC (çift kavramalı otomatik)", gears: 6, accel: 9.6 } as const;

const meganeSedan = {
  brand: "Renault", model: "Megane Sedan", year: 2026, body: "Sedan", drive: "Önden çekiş",
  lengthMm: 4632, widthMm: 1814, heightMm: 1443, wheelbaseMm: 2711, trunkL: 503, seats: 5,
  sources: ["https://cdn.group.renault.com/ren/tr/brochures/megane-sedan/MEGANE-SEDAN-LFF-PH2-MY26-BROSUR-30062026.pdf.asset.pdf/435e3c78c6.pdf", PRICE],
} as const;
const meganeTceEdc = {
  fuel: "Benzin", engineCc: 1332, cylinders: 4, powerHp: 140, torqueNm: 240, transmission: "EDC (çift kavramalı otomatik)", gears: 7,
  accel: 9.8, topSpeed: 180, consumption: 6.3, co2: 144, tankL: 50, weightKg: 1381,
} as const;

const austral = {
  brand: "Renault", model: "Austral", year: 2026, body: "SUV", drive: "Önden çekiş", topSpeed: 180,
  lengthMm: 4533, widthMm: 1830, heightMm: 1589, wheelbaseMm: 2667, seats: 5,
  sources: ["https://cdn.group.renault.com/ren/tr/brochures/austral-hhn-ph1-my25/AUSTRAL-HHN-PH1-MY25-BROSUR-04122025.pdf.asset.pdf/1a511665d0.pdf", PRICE],
} as const;
const australMh = { fuel: "Hafif Hibrit", powerHp: 150, torqueNm: 270, transmission: "Otomatik", accel: 9.9, consumption: 6.3, co2: 143, trunkL: 555 } as const;

export const renault: CarVersion[] = [
  { ...clio, id: "renault-clio-1-2-tce-115-edc-evolution-plus", version: "1.2 TCe 115 EDC Evolution Plus", priceTl: 1_830_000, priceMonth: M },
  { ...clio, id: "renault-clio-1-2-tce-115-edc-esprit-alpine", version: "1.2 TCe 115 EDC Esprit Alpine", priceTl: 2_035_000, priceMonth: M },

  {
    id: "renault-5-e-tech-ev52-techno", brand: "Renault", model: "5 E-Tech", version: "EV52 150 hp Techno", year: 2026,
    body: "Hatchback", fuel: "Elektrik", powerHp: 150, torqueNm: 245, transmission: "Tek vitesli otomatik", drive: "Önden çekiş",
    accel: 8, batteryKwh: 52, rangeKm: 410, electricConsumption: 15.5, trunkL: 326, weightKg: 1460, seats: 5,
    lengthMm: 3922, widthMm: 1774, heightMm: 1498, wheelbaseMm: 2540,
    priceTl: 2_140_000, priceMonth: M,
    sources: ["https://cdn.group.renault.com/ren/tr/brochures/renault5-htb-ph1/RENAULT5-HTB-PH1-BROSUR-24072026.pdf.asset.pdf/f3075d50e7.pdf", PRICE],
  },

  {
    id: "renault-captur-mild-hybrid-140-edc-techno", brand: "Renault", model: "Captur", version: "Mild Hybrid 140 EDC Techno", year: 2026,
    body: "Crossover", fuel: "Hafif Hibrit", powerHp: 140, torqueNm: 245, transmission: "EDC (çift kavramalı otomatik)", drive: "Önden çekiş",
    accel: 9.3, topSpeed: 180, lengthMm: 4239, widthMm: 1797, heightMm: 1575, wheelbaseMm: 2639, trunkL: 484, weightKg: 1406, seats: 5,
    priceTl: 2_325_000, priceMonth: M,
    sources: ["https://cdn.group.renault.com/ren/tr/brochures/captur-hjb-ph2/CAPTUR-HJB-PH2-BROSUR-21072026.pdf.asset.pdf/f97d7986a5.pdf", PRICE],
  },

  { ...duster, id: "renault-duster-eco-g-120-evolution", version: "Eco-G 120 Evolution (LPG)", fuel: "Benzin-LPG", powerHp: 120, torqueNm: 200, transmission: "Manuel", gears: 6, trunkL: 594, priceTl: 1_865_000, priceMonth: M },
  { ...duster, ...dusterTce, id: "renault-duster-tce-145-edc-evolution", version: "TCe 145 EDC Evolution", priceTl: 2_050_000, priceMonth: M },
  { ...duster, ...dusterTce, id: "renault-duster-tce-145-edc-techno", version: "TCe 145 EDC Techno", priceTl: 2_200_000, priceMonth: M },
  { ...duster, ...dusterFh, id: "renault-duster-full-hybrid-160-techno", version: "E-Tech Full Hybrid 160 Techno", priceTl: 2_725_000, priceMonth: M },
  { ...duster, ...duster4x4, id: "renault-duster-hybrid-4x4-150-evolution", version: "Hybrid 4x4 150 Evolution", priceTl: 2_850_000, priceMonth: M },
  { ...duster, ...duster4x4, id: "renault-duster-hybrid-4x4-150-techno", version: "Hybrid 4x4 150 Techno", priceTl: 2_920_000, priceMonth: M },

  {
    id: "renault-megane-e-tech-ev60-techno", brand: "Renault", model: "Megane E-Tech", version: "EV60 220 hp Techno", year: 2026,
    body: "Crossover", fuel: "Elektrik", powerHp: 220, torqueNm: 300, transmission: "Tek vitesli otomatik", drive: "Önden çekiş",
    accel: 7.4, batteryKwh: 60, rangeKm: 468, electricConsumption: 15.2, lengthMm: 4200, widthMm: 1768, heightMm: 1505,
    trunkL: 440, weightKg: 1667, seats: 5, priceTl: 2_386_000, priceMonth: M,
    sources: ["https://cdn.group.renault.com/ren/tr/brochures/megane-bcb-ph1/MEGANE-E-TECH-BCB-PH1-BROSUR-14112025.pdf.asset.pdf/9fe1cbe908.pdf", PRICE],
  },

  { ...meganeSedan, id: "renault-megane-sedan-1-3-tce-140-touch", version: "1.3 TCe 140 Touch (manuel)", fuel: "Benzin", engineCc: 1332, cylinders: 4, powerHp: 140, torqueNm: 240, transmission: "Manuel", gears: 6, tankL: 50, priceTl: 1_841_000, priceMonth: M },
  { ...meganeSedan, ...meganeTceEdc, id: "renault-megane-sedan-1-3-tce-140-edc-touch", version: "1.3 TCe 140 EDC Touch", priceTl: 2_199_000, priceMonth: M },
  { ...meganeSedan, ...meganeTceEdc, id: "renault-megane-sedan-1-3-tce-140-edc-icon", version: "1.3 TCe 140 EDC Icon", priceTl: 2_349_000, priceMonth: M },
  {
    ...meganeSedan, id: "renault-megane-sedan-1-5-dci-115-edc-icon", version: "1.5 Blue dCi 115 EDC Icon", fuel: "Dizel",
    engineCc: 1461, cylinders: 4, powerHp: 115, torqueNm: 270, transmission: "EDC (çift kavramalı otomatik)", gears: 7,
    accel: 11.2, topSpeed: 180, consumption: 4.7, co2: 124, tankL: 49, weightKg: 1469, priceTl: 2_699_000, priceMonth: M,
  },

  { ...boreal, ...borealTce, id: "renault-boreal-tce-145-edc-evolution", version: "TCe 145 EDC Evolution", trunkL: 630, priceTl: 2_379_000, priceMonth: M },
  { ...boreal, ...borealTce, id: "renault-boreal-tce-145-edc-techno", version: "TCe 145 EDC Techno", trunkL: 630, priceTl: 2_899_000, priceMonth: M },
  { ...boreal, ...borealTce, id: "renault-boreal-tce-145-edc-iconic", version: "TCe 145 EDC Iconic", trunkL: 614, priceTl: 3_049_000, priceMonth: M },
  {
    ...boreal, id: "renault-boreal-full-hybrid-160-iconic", version: "E-Tech Full Hybrid 160 Iconic", fuel: "Hibrit",
    powerHp: 160, torqueNm: 270, transmission: "Çok modlu otomatik", accel: 10.2, consumption: 4.8, co2: 108, trunkL: 498,
    priceTl: 3_399_000, priceMonth: M,
  },

  { ...austral, ...australMh, id: "renault-austral-mild-hybrid-150-techno", version: "Mild Hybrid 150 Otomatik Techno", priceTl: 2_900_000, priceMonth: M },
  { ...austral, ...australMh, id: "renault-austral-mild-hybrid-150-esprit-alpine", version: "Mild Hybrid 150 Otomatik Esprit Alpine", priceTl: 3_220_000, priceMonth: M },
  {
    ...austral, id: "renault-austral-full-hybrid-200-esprit-alpine", version: "E-Tech Full Hybrid 200 Esprit Alpine", fuel: "Hibrit",
    powerHp: 200, transmission: "Çok modlu otomatik", accel: 8.4, consumption: 4.8, co2: 107, trunkL: 527, priceTl: 3_650_000, priceMonth: M,
  },

  {
    id: "renault-scenic-e-tech-ev87-esprit-alpine", brand: "Renault", model: "Scenic E-Tech", version: "EV87 220 hp Esprit Alpine", year: 2026,
    body: "Crossover", fuel: "Elektrik", powerHp: 220, torqueNm: 300, transmission: "Tek vitesli otomatik", drive: "Önden çekiş",
    batteryKwh: 87, rangeKm: 604, electricConsumption: 17.4, lengthMm: 4470, widthMm: 1864, wheelbaseMm: 2785,
    trunkL: 545, weightKg: 1898, seats: 5, priceTl: 3_490_000, priceMonth: M,
    sources: ["https://cdn.group.renault.com/ren/tr/brochures/scenic-hcb-ph1/SCENIC-HCB-PH1-BROSUR-23062026.pdf.asset.pdf/f7de535f9c.pdf", PRICE],
  },

  {
    id: "renault-rafale-full-hybrid-200-esprit-alpine", brand: "Renault", model: "Rafale", version: "E-Tech Full Hybrid 200 Esprit Alpine", year: 2026,
    body: "SUV", fuel: "Hibrit", powerHp: 200, transmission: "Çok modlu otomatik", drive: "Önden çekiş", accel: 8.9, topSpeed: 180,
    consumption: 5.0, co2: 110, tankL: 58, trunkL: 627, seats: 5, priceTl: 4_050_000, priceMonth: M,
    sources: ["https://cdn.group.renault.com/ren/tr/brochures/rafale-dhn-ph1/RENAULT-RAFALE-BROSUR-05082026.pdf.asset.pdf/27c362b7a3.pdf", PRICE],
  },
];
