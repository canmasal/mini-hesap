/**
 * Google AdSense yayıncı kimliği için tek kaynak.
 *
 * Ortam değişkeni tanımlı değilse hesabın kimliğine düşülür; böylece
 * meta etiketi ve reklam betiği hiçbir zaman birbirinden farklı
 * kimlik göstermez.
 */
export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-5744638110984506";
