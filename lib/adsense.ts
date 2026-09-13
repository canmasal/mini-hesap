/**
 * Google AdSense yayıncı kimliği için tek kaynak.
 *
 * Ortam değişkeni tanımlı değilse hesabın kimliğine düşülür; böylece
 * meta etiketi, ads.txt ve reklam betiği hiçbir zaman birbirinden farklı
 * kimlik göstermez.
 */
export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-5744638110984506";

/** ads.txt biçimindeki yayıncı kimliği ("ca-" öneki olmadan). */
export const ADSENSE_PUBLISHER_ID = ADSENSE_CLIENT_ID.replace(/^ca-/, "");
