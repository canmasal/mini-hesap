/**
 * Araç kıyaslama veritabanının şeması.
 *
 * Her kayıt bir modelin satıştaki bir versiyonudur (motor + şanzıman +
 * donanım). Teknik veriler üreticinin Türkiye teknik bilgilerinden, fiyatlar
 * markanın ilan ettiği aylık liste fiyatlarından alınır; her kayıt kaynağını
 * ve fiyatın ait olduğu ayı taşır. Bilinmeyen alan boş bırakılır, tahmin
 * girilmez.
 */

export type Fuel = "Benzin" | "Dizel" | "Hibrit" | "Plug-in Hibrit" | "Elektrik" | "Benzin-LPG" | "Hafif Hibrit";
export type Body = "Hatchback" | "Sedan" | "SUV" | "Crossover" | "Station Wagon" | "MPV" | "Coupe" | "Cabrio" | "Pick-up";
export type Drive = "Önden çekiş" | "Arkadan itiş" | "Dört çeker";

export type CarVersion = {
  /** URL ve karşılaştırma bağlantıları için benzersiz kimlik */
  id: string;
  brand: string;
  model: string;
  /** Motor ve donanım adı, ör. "1.0 TCe 90 Evolution" */
  version: string;
  year: number;
  body: Body;
  fuel: Fuel;

  /* Motor */
  engineCc?: number;
  cylinders?: number;
  powerHp?: number;
  torqueNm?: number;
  /* Şanzıman */
  transmission?: string;
  gears?: number;
  drive?: Drive;
  /* Performans */
  accel?: number; // 0-100 km/s, saniye
  topSpeed?: number; // km/s
  /* Tüketim (WLTP karma) */
  consumption?: number; // L/100 km
  electricConsumption?: number; // kWh/100 km
  rangeKm?: number; // elektrikli menzil
  batteryKwh?: number;
  co2?: number; // g/km
  tankL?: number;
  /* Ölçüler */
  lengthMm?: number;
  widthMm?: number;
  heightMm?: number;
  wheelbaseMm?: number;
  trunkL?: number;
  weightKg?: number;
  seats?: number;
  /* Fiyat */
  priceTl?: number;
  /** Fiyatın ait olduğu ay, "2026-10" */
  priceMonth?: string;
  sources: readonly string[];
};
