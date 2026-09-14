/**
 * Sitenin tek kanonik adresi.
 *
 * Tüm canonical, sitemap, robots, Open Graph ve yapısal veri adresleri
 * buradan üretilir. Site www'suz kök alan adında yayınlanır; ortam
 * değişkeni yanlışlıkla "www." ile girilse bile önek temizlenir, sondaki
 * eğik çizgi kaldırılır. Böylece Google'a hiçbir yerde farklı alan adı
 * gösterilmez.
 */

function normalizeSiteUrl(url: string) {
  return url
    .trim()
    .replace(/\/+$/, "")
    .replace(/^(https?:\/\/)www\./i, "$1");
}

const envUrl = process.env.NEXT_PUBLIC_SITE_URL;

/** Kanonik site adresi (ör. https://minihesap.net), sonunda "/" yok. */
export const SITE_URL = normalizeSiteUrl(envUrl || "https://minihesap.net");

/**
 * Ortam değişkeni tanımlıysa normalize edilmiş hâli, değilse undefined.
 * Sipariş ve ödeme bağlantıları gibi, tanımsızken isteğin kendi adresine
 * düşmesi gereken yerlerde kullanılır.
 */
export const ENV_SITE_URL = envUrl ? normalizeSiteUrl(envUrl) : undefined;
