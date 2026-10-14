/*
 * Araç fotoğrafları — yalnızca lisansı doğrulanmış serbest görseller
 * (Wikimedia Commons: CC0, kamu malı, CC BY, CC BY-SA). Her kayıt yazar ve
 * lisans bilgisini taşır; sayfada fotoğrafın altında gösterilir. Kaydı
 * olmayan model için kasa tipine göre temsilî çizim kullanılır.
 *
 * Anahtar: "Marka|Model" (data/cars içindeki brand ve model alanları).
 * src: Commons küçük resmi, ör.
 *   https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Dosya.jpg/960px-Dosya.jpg
 */

export type CarPhoto = { src: string; page: string; author: string; license: string };

const PHOTOS: Record<string, CarPhoto> = {};

export const carPhoto = (brand: string, model: string): CarPhoto | undefined => PHOTOS[`${brand}|${model}`];
