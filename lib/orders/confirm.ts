import { getOrderStore } from "@/lib/orders/store";
import { DOWNLOAD_WINDOW_DAYS, type Order } from "@/lib/orders/types";
import { sendOrderEmail } from "@/lib/mail/send";

/**
 * Havale/EFT siparişini "ödendi" yapar, indirme hakkını açar ve müşteriye
 * e-posta gönderir. Hem /api/siparis/onayla hem yönetim paneli kullanır.
 */
export async function confirmOrderPayment(order: Order, baseUrl: string) {
  const store = getOrderStore();

  const expires = new Date();
  expires.setDate(expires.getDate() + DOWNLOAD_WINDOW_DAYS);

  const updated = await store.update(order.id, {
    status: "odendi",
    providerRef: `havale_${order.id}`,
    paidAt: new Date().toISOString(),
    downloadExpiresAt: expires.toISOString(),
  });

  const mail = await sendOrderEmail(updated ?? order, `${baseUrl}/siparis/${order.id}`);

  return { updated, expires, emailSent: mail.sent };
}
