/**
 * AdSense yayıncı kimliği ve reklam birimi kimlikleri için tek kaynak.
 *
 * Değerler önce ortam değişkeninden okunur, tanımlı değilse hesabın gerçek
 * kimliklerine düşer. Bu düşüş önemli: değişkenler canlıda hiç tanımlanmamıştı
 * ve birim kimliği boş kalan her reklam alanı, reklam yerine "Reklam vermek
 * için iletişime geçiniz" bağlantısı basıyordu. Kimlikler burada durduğu sürece
 * dağıtım ortamında ayar unutulsa bile reklamlar çalışır.
 *
 * Birimler AdSense panelinde "MiniHesap Üst / Orta / Alt" adlarıyla duruyor.
 */

export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-5744638110984506";

export type AdPosition = "top" | "middle" | "bottom";

export const ADSENSE_SLOTS: Record<AdPosition, string> = {
  top: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP || "8149660125",
  middle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_MIDDLE || "8761877526",
  bottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM || "5315166110",
};
