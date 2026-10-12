import type { CarVersion } from "./types";
import { renault } from "./renault";

/** Tüm markaların versiyonları; yeni marka dosyaları buraya eklenir. */
export const cars: CarVersion[] = [...renault].sort(
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
