import type { CarVersion } from "./types";

/*
 * Volkswagen Türkiye — Ekim 2026 liste fiyatları (kampanyasız, araclo.com).
 * Ölçüler ve bagaj Volkswagen Türkiye model sayfalarından; motor, tork,
 * vites, 0-100 ve azami hız Volkswagen'in resmî basın belgelerinden
 * (Golf için ADAC katalogundaki "Herstellerangabe" ile çapraz kontrol).
 * Türkiye'ye özgü WLTP tüketim ve ağırlık değerleri versiyon bazında
 * yayımlanmadığı için boş bırakılmıştır.
 */

const PRICE = "https://www.araclo.com/volkswagen-sifir-arac-fiyatlari";
const M = "2026-10";

const golf = {
  brand: "Volkswagen", model: "Golf", year: 2026, body: "Hatchback", drive: "Önden çekiş",
  engineCc: 1498, cylinders: 4,
  lengthMm: 4282, widthMm: 1789, heightMm: 1483, wheelbaseMm: 2620, trunkL: 381, seats: 5,
  sources: [
    "https://binekarac.vw.com.tr/tr/modeller-fiyatlar/arac-modelleri/yeni-golf.html",
    "https://www.vwpress.co.uk/assets/documents/original/37717-GolfPressPackJuly2024.pdf",
    "https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/vw/golf/viii-facelift/335244",
    PRICE,
  ],
} as const;
const golf116 = { powerHp: 116, torqueNm: 220, accel: 9.9 } as const;
const golf116Dsg = { ...golf116, fuel: "Hafif Hibrit", transmission: "DSG (çift kavramalı otomatik)", gears: 7, topSpeed: 203 } as const;
const golf150Dsg = { fuel: "Hafif Hibrit", powerHp: 150, torqueNm: 250, transmission: "DSG (çift kavramalı otomatik)", gears: 7, accel: 8.4, topSpeed: 224 } as const;

const troc = {
  brand: "Volkswagen", model: "T-Roc", year: 2026, body: "SUV", fuel: "Hafif Hibrit", drive: "Önden çekiş",
  engineCc: 1498, cylinders: 4, powerHp: 150, torqueNm: 250, transmission: "DSG (çift kavramalı otomatik)", gears: 7,
  accel: 8.9, topSpeed: 212, tankL: 50,
  lengthMm: 4373, widthMm: 1828, heightMm: 1559, wheelbaseMm: 2629, trunkL: 475, seats: 5,
  sources: [
    "https://binekarac.vw.com.tr/tr/modeller-fiyatlar/arac-modelleri/vw-yeni-t-roc.html",
    "https://www.volkswagen-newsroom.com/en/the-new-t-roc-international-media-drive-19983/drive-systems-19984",
    PRICE,
  ],
} as const;

export const volkswagen: CarVersion[] = [
  { ...golf, ...golf116, id: "volkswagen-golf-1-5-tsi-116-ps-manuel-impression", version: "1.5 TSI 116 PS Manuel Impression", fuel: "Benzin", transmission: "Manuel", gears: 6, priceTl: 2_390_000, priceMonth: M },
  { ...golf, ...golf116Dsg, id: "volkswagen-golf-1-5-etsi-116-ps-dsg-life", version: "1.5 eTSI 116 PS DSG Life", priceTl: 2_994_000, priceMonth: M },
  { ...golf, ...golf116Dsg, id: "volkswagen-golf-1-5-etsi-116-ps-dsg-style", version: "1.5 eTSI 116 PS DSG Style", priceTl: 3_378_000, priceMonth: M },
  { ...golf, ...golf150Dsg, id: "volkswagen-golf-1-5-etsi-150-ps-dsg-style", version: "1.5 eTSI 150 PS DSG Style", priceTl: 3_591_000, priceMonth: M },
  { ...golf, ...golf150Dsg, id: "volkswagen-golf-1-5-etsi-150-ps-dsg-r-line", version: "1.5 eTSI 150 PS DSG R-Line", priceTl: 4_030_000, priceMonth: M },
  { ...troc, id: "volkswagen-t-roc-1-5-etsi-act-150-ps-dsg-life", version: "1.5 eTSI ACT 150 PS DSG Life", priceTl: 2_916_000, priceMonth: M },
  { ...troc, id: "volkswagen-t-roc-1-5-etsi-act-150-ps-dsg-style", version: "1.5 eTSI ACT 150 PS DSG Style", priceTl: 3_505_000, priceMonth: M },
  { ...troc, id: "volkswagen-t-roc-1-5-etsi-act-150-ps-dsg-r-line", version: "1.5 eTSI ACT 150 PS DSG R-Line", priceTl: 3_620_000, priceMonth: M },
];
