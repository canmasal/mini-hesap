import type { Order } from "@/lib/orders/types";
import type { CheckoutResult, PaymentProvider, WebhookResult } from "./provider";

/**
 * Havale / EFT ile ödeme.
 *
 * Ödeme sağlayıcısı olmadan satış yapabilmek için. Müşteri sipariş verir,
 * IBAN bilgilerini görür, parayı gönderir; siz dekontu görünce siparişi
 * yönetim bağlantısıyla onaylarsınız ve indirme açılır.
 *
 * Otomatik onay YOKTUR; bu bilinçli bir tercihtir. Banka bildirimi
 * doğrulanamayacağı için ödeme yapılmadan indirme açılmamalıdır.
 *
 * Gerekli ortam değişkenleri:
 *   HAVALE_IBAN
 *   HAVALE_ALICI        (hesap sahibinin adı)
 *   HAVALE_BANKA        (banka adı)
 *   ADMIN_ORDER_SECRET  (siparişi onaylamak için, en az 24 karakter)
 */

export function havaleInfo() {
  return {
    iban: process.env.HAVALE_IBAN ?? "",
    alici: process.env.HAVALE_ALICI ?? "",
    banka: process.env.HAVALE_BANKA ?? "",
  };
}

export const havaleProvider: PaymentProvider = {
  id: "havale",
  label: "Havale / EFT",

  isConfigured() {
    const i = havaleInfo();
    return Boolean(i.iban && i.alici);
  },

  async startCheckout(order: Order, opts): Promise<CheckoutResult> {
    if (!this.isConfigured()) {
      throw new Error("HAVALE_IBAN veya HAVALE_ALICI tanımlı değil.");
    }

    /* Ödeme sayfası yok; müşteri doğrudan sipariş sayfasına gider ve
       orada havale bilgilerini görür. */
    return { kind: "redirect", url: opts.successUrl };
  },

  /**
   * Havale otomatik doğrulanamaz. Onay, yönetici bağlantısı üzerinden
   * /api/siparis/onayla uç noktasından yapılır.
   */
  async verifyWebhook(): Promise<WebhookResult | null> {
    return null;
  },
};
