/**
 * Üçüncü taraf "direct link" sponsor bağlantısı (YouTarget).
 *
 * KAPALI: Site AdSense incelemesindeyken yönlendirme türü reklamlar onayı
 * riske atar. AdSense onayı geldikten sonra açmak için `enabled: true`
 * yapmak yeterli; bağlantı yalnızca tıklanınca yeni sekmede açılan, "Sponsorlu"
 * etiketli bir kutu olarak gösterilir. Otomatik yönlendirme veya açılır
 * pencere kullanılmaz.
 */
export const SPONSOR_DIRECT_LINK = {
  enabled: false,
  url: "https://clck1.tclcktlu.com/direct?id=55ec5352f84b4ed58f17125018020b5e&zone_id=809",
  label: "Sponsorlu",
  text: "Size özel fırsatları keşfedin",
} as const;
