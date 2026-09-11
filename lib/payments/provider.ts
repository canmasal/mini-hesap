import type { Order } from "@/lib/orders/types";
import { shopierProvider } from "./shopier";

/**
 * Ödeme sağlayıcısı arayüzü.
 *
 * Site tek bir sağlayıcıya bağlı kalmasın diye soyutlandı. Yeni bir sağlayıcı
 * eklemek için bu arayüzü uygulayan bir dosya yazıp aşağıdaki listeye eklemek
 * yeterlidir; sipariş akışı ve indirme sistemi değişmez.
 */

export type CheckoutResult =
  /** Kullanıcı sağlayıcının ödeme sayfasına yönlendirilir */
  | { kind: "redirect"; url: string }
  /** Sağlayıcının HTML formu sayfaya gömülür ve otomatik gönderilir */
  | { kind: "form"; html: string }
  /** Test modu: ödeme simüle edilir */
  | { kind: "test"; url: string };

export type WebhookResult = {
  /** Sağlayıcının kendi referansı */
  providerRef: string;
  /** Bizim sipariş kimliğimiz */
  orderId: string;
  success: boolean;
  /** Doğrulanan tutar (kuruş). Sipariş tutarıyla karşılaştırılır. */
  amountKurus?: number;
  message?: string;
};

export interface PaymentProvider {
  readonly id: string;
  readonly label: string;

  /** Ortam değişkenleri tanımlı mı? */
  isConfigured(): boolean;

  /** Ödeme başlatır. */
  startCheckout(order: Order, opts: {
    successUrl: string;
    failUrl: string;
    callbackUrl: string;
  }): Promise<CheckoutResult>;

  /**
   * Sağlayıcıdan gelen bildirimi doğrular.
   * İmza geçersizse null döner; asla "başarılı" varsayılmaz.
   */
  verifyWebhook(req: Request, body: string): Promise<WebhookResult | null>;
}

/* =========================================================
   TEST SAĞLAYICISI
   Gerçek sağlayıcı bağlanana kadar akışın uçtan uca çalışmasını sağlar.
   Yalnızca PAYMENT_PROVIDER=test iken devreye girer.
========================================================= */

export const testProvider: PaymentProvider = {
  id: "test",
  label: "Test Modu (gerçek tahsilat yapılmaz)",

  isConfigured: () => process.env.PAYMENT_PROVIDER === "test",

  async startCheckout(order, opts) {
    const url = new URL(opts.callbackUrl);
    url.searchParams.set("test", "1");
    url.searchParams.set("orderId", order.id);
    return { kind: "test", url: url.toString() };
  },

  async verifyWebhook(req) {
    if (process.env.PAYMENT_PROVIDER !== "test") return null;

    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId");
    if (!orderId) return null;

    return {
      providerRef: `test_${orderId}`,
      orderId,
      success: url.searchParams.get("fail") !== "1",
      message: "Test modu ödemesi",
    };
  },
};

/* =========================================================
   KAYIT
========================================================= */

const providers: PaymentProvider[] = [testProvider, shopierProvider];

export function activeProvider(): PaymentProvider | null {
  const wanted = process.env.PAYMENT_PROVIDER;
  if (!wanted) return null;

  const p = providers.find((x) => x.id === wanted);
  return p && p.isConfigured() ? p : null;
}

export function registerProvider(p: PaymentProvider) {
  if (!providers.some((x) => x.id === p.id)) providers.push(p);
}

/** Ödeme altyapısı yayına hazır mı? */
export function paymentsEnabled() {
  return activeProvider() !== null;
}
