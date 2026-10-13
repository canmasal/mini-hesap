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
  ["renault-clio-1-2-tce-115-edc-evolution-plus", "hyundai-i20-1-0-tgdi-90-style-dct"],
  ["toyota-corolla-1-5-dream", "fiat-egea-sedan-1-6-mjet-dct-urban"],
  ["renault-megane-sedan-1-3-tce-140-edc-icon", "toyota-corolla-1-8-hybrid-dream"],
  ["togg-t10x-v2-rwd-uzun", "renault-scenic-e-tech-ev87-esprit-alpine"],
  ["toyota-c-hr-1-8-hybrid-flame", "renault-captur-mild-hybrid-140-edc-techno"],
  ["togg-t10f-v1-rwd-uzun", "toyota-corolla-1-8-hybrid-flame-x-pack"],
  ["volkswagen-golf-1-5-etsi-116-ps-dsg-life", "opel-astra-1-5-130-hp-dizel-at8-edition"],
  ["volkswagen-golf-1-5-etsi-116-ps-dsg-life", "peugeot-308-allure-1-5-bluehdi-130-hp-eat8"],
  ["skoda-octavia-1-5-e-tec-150-ps-dsg-premium", "toyota-corolla-1-8-hybrid-dream"],
  ["volkswagen-passat-1-5-etsi-150-ps-dsg-business", "skoda-superb-combi-1-5-e-tec-150-ps-dsg-prestige"],
  ["kia-sportage-1-6l-150-ps-dct-cool", "hyundai-tucson-1-6-t-gdi-180-ps-dct-prime"],
  ["volkswagen-tiguan-1-5-etsi-act-150-ps-dsg-life", "ford-kuga-1-5-ecoboost-186-ps-titanium"],
  ["nissan-qashqai-1-3-dig-t-mild-hybrid-158-ps-designpack", "peugeot-3008-allure-1-2-hybrid-145-hp-edcs6"],
  ["volkswagen-t-roc-1-5-etsi-act-150-ps-dsg-life", "peugeot-2008-allure-1-2-hybrid-145-hp-edcs6"],
  ["nissan-juke-1-0-dig-t-115-ps-dct-tekna-plus", "ford-puma-1-0-ecoboost-hybrid-125-ps-titanium"],
  ["hyundai-bayon-1-0-t-gdi-90-ps-dct-style", "kia-stonic-1-0l-100-ps-dct-elegance"],
  ["volkswagen-taigo-1-0-tsi-116-ps-dsg-life", "volkswagen-t-cross-1-0-tsi-116-ps-dsg-life"],
  ["fiat-egea-sedan-1-6-mjet-dct-urban", "dacia-logan-eco-g-120-expression-otomatik"],
  ["dacia-jogger-eco-g-120-extreme-otomatik-7-koltuklu", "citroen-berlingo-1-5-bluehdi-130-hp-eat8-plus"],
  ["togg-t10x-v1-rwd-uzun", "kia-ev3-150-kw-otomatik-cool-long-range"],
  ["togg-t10x-v2-rwd-uzun", "volkswagen-id-4-125-kw-170-ps-pure"],
  ["togg-t10x-v2-rwd-uzun", "hyundai-ioniq-5-160-kw-uzun-menzil-progressive"],
  ["renault-duster-tce-145-edc-evolution", "skoda-kamiq-1-5-tsi-150-ps-dsg-premium"],
  ["renault-clio-1-2-tce-115-edc-evolution-plus", "opel-corsa-hybrid-1-2-110-100hp-e-dct6-edition"],
  ["cupra-formentor-1-5-etsi-150-ps-dsg-impulse", "volkswagen-t-roc-1-5-etsi-act-150-ps-dsg-style"],
  ["skoda-kodiaq-1-5-e-tec-150-ps-dsg-premium", "volkswagen-tayron-1-5-etsi-act-150-ps-dsg-life"],
];

const slugify = (s: string) =>
  s
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
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
