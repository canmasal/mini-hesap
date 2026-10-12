import type { CarVersion } from "./types";
import { renault } from "./renault";
import { toyota } from "./toyota";
import { togg } from "./togg";
import { fiat } from "./fiat";
import { hyundai } from "./hyundai";
import { catalog } from "./catalog";

/** Tüm markaların versiyonları; yeni marka dosyaları buraya eklenir. */
export const cars: CarVersion[] = [...renault, ...toyota, ...togg, ...fiat, ...hyundai, ...catalog].sort(
  (a, b) =>
    a.brand.localeCompare(b.brand, "tr") ||
    a.model.localeCompare(b.model, "tr") ||
    (a.priceTl ?? Infinity) - (b.priceTl ?? Infinity),
);

export const carById = (id: string) => cars.find((c) => c.id === id);

/** Marka → model → versiyon ağacı (seçim kutuları için) */
export function carTree() {
  const tree: { brand: string; models: { model: string; versions: CarVersion[] }[] }[] = [];
  for (const car of cars) {
    let b = tree.find((x) => x.brand === car.brand);
    if (!b) tree.push((b = { brand: car.brand, models: [] }));
    let m = b.models.find((x) => x.model === car.model);
    if (!m) b.models.push((m = { model: car.model, versions: [] }));
    m.versions.push(car);
  }
  return tree;
}

export const brandCount = () => new Set(cars.map((c) => c.brand)).size;
export const modelCount = () => new Set(cars.map((c) => `${c.brand}|${c.model}`)).size;

/** Fiyatların en son güncellendiği ay ("2026-10") */
export const latestPriceMonth = () =>
  cars.reduce((m, c) => (c.priceMonth && c.priceMonth > m ? c.priceMonth : m), "");
