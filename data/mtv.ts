/**
 * 2026 Motorlu Taşıtlar Vergisi tarifeleri.
 *
 * Dayanak: MTV Genel Tebliği Seri No: 58 (RG 31.12.2025 / 33124, 5. Mükerrer).
 * Tutarlar KPMG, Alomaliye, MuhasebeTR ve Ventera sirkülerinden karşılaştırmalı
 * olarak alınmıştır; dört kaynakta da birebir aynıdır.
 *
 * İki ayrı tarife vardır:
 * - (I) sayılı tarife: 1/1/2018 ve sonrasında tescil edilen otomobiller.
 *   Motor hacmi ve yaşın yanında taşıt değeri de dikkate alınır.
 * - (I/A) sayılı tarife: 31/12/2017 ve öncesinde tescil edilenler.
 *   Taşıt değeri kriteri yoktur.
 */

import type { Source } from "@/data/parameters";

export const MTV_YEAR = 2026;

export const MTV_SOURCE: Source = {
  label: "MTV Genel Tebliği Seri No: 58 (RG 31.12.2025) – KPMG özeti",
  url: "https://kpmgvergi.com/yayinlar/mali-bultenler/vergi/2026-yili-motorlu-tasitlar-vergisi-tutarlari/3352",
};

/** Yaş grubu sırası: 1-3, 4-6, 7-11, 12-15, 16+ */
export const AGE_GROUPS = ["1 – 3 yaş", "4 – 6 yaş", "7 – 11 yaş", "12 – 15 yaş", "16 yaş ve üzeri"] as const;

export type EngineRow = {
  /** Üst sınır (cm³); son satır için Infinity */
  upTo: number;
  label: string;
  /** Taşıt değeri dilimleri; (I) sayılı tarife için */
  brackets: Array<{
    /** Taşıt değeri üst sınırı (TL); son dilim için Infinity */
    valueUpTo: number;
    amounts: [number, number, number, number, number];
  }>;
};

/** (I) sayılı tarife — 1/1/2018 ve sonrası tescilli otomobiller */
export const TARIFF_I: EngineRow[] = [
  {
    upTo: 1300,
    label: "1300 cm³ ve aşağısı",
    brackets: [
      { valueUpTo: 309100, amounts: [5750, 4010, 2238, 1689, 593] },
      { valueUpTo: 541500, amounts: [6319, 4409, 2459, 1861, 655] },
      { valueUpTo: Infinity, amounts: [6902, 4807, 2693, 2032, 706] },
    ],
  },
  {
    upTo: 1600,
    label: "1301 – 1600 cm³",
    brackets: [
      { valueUpTo: 309100, amounts: [10016, 7510, 4354, 3077, 1181] },
      { valueUpTo: 541500, amounts: [11023, 8264, 4794, 3375, 1290] },
      { valueUpTo: Infinity, amounts: [12028, 9012, 5220, 3685, 1408] },
    ],
  },
  {
    upTo: 1800,
    label: "1601 – 1800 cm³",
    brackets: [
      { valueUpTo: 775100, amounts: [19472, 15226, 8948, 5458, 2113] },
      { valueUpTo: Infinity, amounts: [21251, 16600, 9775, 5964, 2307] },
    ],
  },
  {
    upTo: 2000,
    label: "1801 – 2000 cm³",
    brackets: [
      { valueUpTo: 775100, amounts: [30679, 23625, 13886, 8264, 3248] },
      { valueUpTo: Infinity, amounts: [33474, 25784, 15147, 9012, 3547] },
    ],
  },
  {
    upTo: 2500,
    label: "2001 – 2500 cm³",
    brackets: [
      { valueUpTo: 968100, amounts: [46027, 33413, 20874, 12465, 4930] },
      { valueUpTo: Infinity, amounts: [50217, 36448, 22768, 13606, 5378] },
    ],
  },
  {
    upTo: 3000,
    label: "2501 – 3000 cm³",
    brackets: [
      { valueUpTo: 1937500, amounts: [64175, 55837, 34878, 18758, 6875] },
      { valueUpTo: Infinity, amounts: [70018, 60905, 38053, 20466, 7503] },
    ],
  },
  {
    upTo: 3500,
    label: "3001 – 3500 cm³",
    brackets: [
      { valueUpTo: 1937500, amounts: [97744, 87954, 52976, 26443, 9684] },
      { valueUpTo: Infinity, amounts: [106641, 95940, 57791, 28839, 10578] },
    ],
  },
  {
    upTo: 4000,
    label: "3501 – 4000 cm³",
    brackets: [
      { valueUpTo: 3101800, amounts: [153684, 132712, 78152, 34878, 13886] },
      { valueUpTo: Infinity, amounts: [167671, 144770, 85271, 38053, 15147] },
    ],
  },
  {
    upTo: Infinity,
    label: "4001 cm³ ve yukarısı",
    brackets: [
      { valueUpTo: 3683200, amounts: [251554, 188627, 111714, 50202, 19472] },
      { valueUpTo: Infinity, amounts: [274415, 205781, 121873, 54769, 21251] },
    ],
  },
];

/** (I/A) sayılı tarife — 31/12/2017 ve öncesi tescilli otomobiller */
export const TARIFF_IA: Array<{ upTo: number; label: string; amounts: [number, number, number, number, number] }> = [
  { upTo: 1300, label: "1300 cm³ ve aşağısı", amounts: [5750, 4010, 2238, 1689, 593] },
  { upTo: 1600, label: "1301 – 1600 cm³", amounts: [10016, 7510, 4354, 3077, 1181] },
  { upTo: 1800, label: "1601 – 1800 cm³", amounts: [17705, 13829, 8145, 4957, 1917] },
  { upTo: 2000, label: "1801 – 2000 cm³", amounts: [27898, 21478, 12624, 7510, 2958] },
  { upTo: 2500, label: "2001 – 2500 cm³", amounts: [41840, 30372, 18977, 11333, 4479] },
  { upTo: 3000, label: "2501 – 3000 cm³", amounts: [58347, 50754, 31704, 17044, 6255] },
  { upTo: 3500, label: "3001 – 3500 cm³", amounts: [88859, 79955, 48158, 24031, 8813] },
  { upTo: 4000, label: "3501 – 4000 cm³", amounts: [139721, 120647, 71048, 31704, 12624] },
  { upTo: Infinity, label: "4001 cm³ ve yukarısı", amounts: [228681, 171485, 101555, 45632, 17705] },
];

/** Motosikletler — (I) sayılı tarife */
export const TARIFF_MOTORCYCLE: Array<{ upTo: number; label: string; amounts: [number, number, number, number, number] }> = [
  { upTo: 250, label: "100 – 250 cm³", amounts: [1069, 799, 589, 361, 136] },
  { upTo: 650, label: "251 – 650 cm³", amounts: [2214, 1676, 1069, 589, 362] },
  { upTo: 1200, label: "651 – 1200 cm³", amounts: [5719, 3298, 1676, 1069, 589] },
  { upTo: Infinity, label: "1201 cm³ ve yukarısı", amounts: [13876, 9167, 5719, 4540, 2214] },
];

/**
 * MTV yaşı: taşıt, tescil belgesindeki model yılında bir yaşındadır
 * (197 sayılı Kanun md. 2/18 ve 11/2).
 */
export function mtvAge(modelYear: number, year: number = MTV_YEAR) {
  return year - modelYear + 1;
}

/** Yaş grubunun tarife sütunundaki sırası */
export function ageIndex(age: number) {
  if (age <= 3) return 0;
  if (age <= 6) return 1;
  if (age <= 11) return 2;
  if (age <= 15) return 3;
  return 4;
}
