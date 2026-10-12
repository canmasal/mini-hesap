/**
 * Hazır "X mi Y mi" karşılaştırma sayfaları.
 *
 * Yalnızca gerçekten sık aranan, aynı segmentteki rakip modeller eklenir;
 * her sayfa veriden üretilen özgün bir değerlendirme metni taşır. Rastgele
 * kombinasyon üretilmez (kalıp sayfa çoğaltmak AdSense ve arama kalitesi
 * açısından zararlıdır).
 */

import { carById } from "./index";
import type { CarVersion } from "./types";

/** [1. araç kimliği, 2. araç kimliği] */
const PAIRS: [string, string][] = [
  ["renault-clio-1-2-tce-115-edc-evolution-plus", "renault-5-e-tech-ev52-techno"],
  ["renault-duster-tce-145-edc-techno", "renault-boreal-tce-145-edc-evolution"],
  ["renault-megane-sedan-1-3-tce-140-edc-icon", "renault-megane-e-tech-ev60-techno"],
  ["renault-captur-mild-hybrid-140-edc-techno", "renault-duster-tce-145-edc-evolution"],
  ["renault-austral-full-hybrid-200-esprit-alpine", "renault-rafale-full-hybrid-200-esprit-alpine"],
];

const slugify = (s: string) =>
  s
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const modelSlug = (c: CarVersion) => slugify(`${c.brand} ${c.model}`);

export type CarPair = { slug: string; a: CarVersion; b: CarVersion };

export function carPairs(): CarPair[] {
  return PAIRS.map(([ia, ib]) => {
    const a = carById(ia);
    const b = carById(ib);
    if (!a || !b) return null;
    return { slug: `${modelSlug(a)}-vs-${modelSlug(b)}`, a, b };
  }).filter((p): p is CarPair => p !== null);
}

export const findPair = (slug: string) => carPairs().find((p) => p.slug === slug);
