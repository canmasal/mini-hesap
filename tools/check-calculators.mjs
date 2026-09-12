import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../data/calculators.ts", import.meta.url), "utf8");
const pageSource = await readFile(new URL("../app/hesaplamalar/[slug]/page.tsx", import.meta.url), "utf8");
const slugs = [...source.matchAll(/slug:\s*["']([^"']+)["']/g)].map((match) => match[1]);
const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);

if (!slugs.length) {
  throw new Error("Hesaplama kataloğu boş görünüyor.");
}

if (duplicateSlugs.length) {
  throw new Error(`Tekrarlanan hesaplama slug'ları: ${[...new Set(duplicateSlugs)].join(", ")}`);
}

for (const slug of slugs) {
  if (!new RegExp(`(?:['"]${slug}['"]\\s*[:=]|\\b${slug}:)`).test(pageSource)) {
    throw new Error(`SEO içeriği eksik: ${slug}`);
  }
}

const requiredContentFields = ["title:", "description:", "intro:", "howItWorks:", "faqs:"];
for (const field of requiredContentFields) {
  if (!pageSource.includes(field)) {
    throw new Error(`SEO şablon alanı eksik: ${field}`);
  }
}

console.log(`Hesaplama kataloğu kontrol edildi: ${slugs.length} benzersiz araç.`);