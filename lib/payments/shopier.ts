import crypto from "crypto";

import type { Order } from "@/lib/orders/types";
import type { CheckoutResult, PaymentProvider, WebhookResult } from "./provider";

/**
 * Shopier ödeme entegrasyonu.
 *
 * Akış:
 *  1. Sunucu, imzalı bir HTML formu üretir.
 *  2. Form tarayıcıda otomatik gönderilir, kullanıcı Shopier'in güvenli
 *     ödeme sayfasına gider. Kart bilgileri bize hiç uğramaz.
 *  3. Ödeme sonrası Shopier, callback adresimize POST yapar.
 *  4. Gelen imza API gizli anahtarıyla yeniden üretilip karşılaştırılır;
 *     eşleşmezse bildirim reddedilir.
 *
 * Gerekli ortam değişkenleri:
 *   SHOPIER_API_KEY
 *   SHOPIER_API_SECRET
 *   SHOPIER_WEBSITE_INDEX  (birden fazla siteniz yoksa 1)
 */

const SHOPIER_URL = "https://www.shopier.com/ShowProduct/api_pay4.php";

/** Shopier para birimi kodları: 0 = TL, 1 = USD, 2 = EUR */
const CURRENCY_TRY = 0;

/** 0 = materyal, 1 = indirilebilir sanal ürün */
const PRODUCT_TYPE_DIGITAL = 1;

function cfg() {
  return {
    apiKey: process.env.SHOPIER_API_KEY ?? "",
    apiSecret: process.env.SHOPIER_API_SECRET ?? "",
    websiteIndex: process.env.SHOPIER_WEBSITE_INDEX ?? "1",
  };
}

/** HTML enjeksiyonunu önlemek için öznitelik değerlerini kaçış karakterlerine çevirir. */
function esc(value: string) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function hmacBase64(data: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(data).digest("base64");
}

/** "Ali Veli Kaya" -> { name: "Ali", surname: "Veli Kaya" } */
function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { name: parts[0], surname: parts[0] };
  return { name: parts[0], surname: parts.slice(1).join(" ") };
}

export const shopierProvider: PaymentProvider = {
  id: "shopier",
  label: "Shopier",

  isConfigured() {
    const c = cfg();
    return Boolean(c.apiKey && c.apiSecret);
  },

  async startCheckout(order: Order, opts): Promise<CheckoutResult> {
    const c = cfg();

    if (!this.isConfigured()) {
      throw new Error("SHOPIER_API_KEY veya SHOPIER_API_SECRET tanımlı değil.");
    }

    const { name, surname } = splitName(order.fullName);

    /* Shopier tutarı nokta ayraçlı ve iki ondalıklı bekler */
    const totalValue = (order.amountKurus / 100).toFixed(2);
    const randomNr = String(Math.floor(Math.random() * 1_000_000));

    /* İmza: random_nr + platform_order_id + total_order_value + currency */
    const signature = hmacBase64(
      randomNr + order.id + totalValue + String(CURRENCY_TRY),
      c.apiSecret
    );

    /* Adres alanları Shopier tarafından zorunlu tutuluyor; dijital üründe
       teslimat adresi anlamsız olduğu için yer tutucu gönderilir. */
    const fields: Record<string, string> = {
      API_key: c.apiKey,
      website_index: c.websiteIndex,
      platform_order_id: order.id,
      product_name: order.productTitle,
      product_type: String(PRODUCT_TYPE_DIGITAL),
      buyer_name: name,
      buyer_surname: surname,
      buyer_email: order.email,
      buyer_account_age: "0",
      buyer_id_nr: order.id,
      buyer_phone: order.phone ?? "",
      billing_address: "Dijital teslimat",
      billing_city: "Istanbul",
      billing_country: "Turkiye",
      billing_postcode: "34000",
      shipping_address: "Dijital teslimat",
      shipping_city: "Istanbul",
      shipping_country: "Turkiye",
      shipping_postcode: "34000",
      total_order_value: totalValue,
      currency: String(CURRENCY_TRY),
      platform: "0",
      is_in_frame: "0",
      current_language: "0",
      modul_version: "1.0.0",
      random_nr: randomNr,
      signature,
      callback_url: opts.callbackUrl,
    };

    const inputs = Object.entries(fields)
      .map(
        ([k, v]) =>
          `<input type="hidden" name="${esc(k)}" value="${esc(v)}" />`
      )
      .join("\n");

    const html = `
<form id="shopier-form" method="post" action="${SHOPIER_URL}" accept-charset="UTF-8">
${inputs}
<noscript>
  <button type="submit">Ödemeye devam et</button>
</noscript>
</form>`.trim();

    return { kind: "form", html };
  },

  async verifyWebhook(req: Request, body: string): Promise<WebhookResult | null> {
    const c = cfg();
    if (!this.isConfigured()) return null;

    /* Shopier form-encoded POST gönderir */
    const params = new URLSearchParams(body);

    const orderId = params.get("platform_order_id") ?? "";
    const randomNr = params.get("random_nr") ?? "";
    const signature = params.get("signature") ?? "";
    const status = (params.get("status") ?? "").toLowerCase();

    if (!orderId || !randomNr || !signature) {
      console.warn("Shopier bildiriminde zorunlu alanlar eksik.");
      return null;
    }

    /* Callback imzası: random_nr + platform_order_id */
    const expected = hmacBase64(randomNr + orderId, c.apiSecret);

    const a = Buffer.from(signature);
    const b = Buffer.from(expected);

    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      console.warn("Shopier bildirim imzası doğrulanamadı.");
      return null;
    }

    const paymentId = params.get("payment_id") ?? orderId;

    /* Shopier tutarı bildirirse doğrulamak için kuruşa çeviririz */
    const reported = params.get("total_order_value");
    const amountKurus = reported
      ? Math.round(parseFloat(reported.replace(",", ".")) * 100)
      : undefined;

    return {
      providerRef: `shopier_${paymentId}`,
      orderId,
      success: status === "success",
      amountKurus: Number.isFinite(amountKurus as number)
        ? (amountKurus as number)
        : undefined,
      message: params.get("installment")
        ? `Taksit: ${params.get("installment")}`
        : undefined,
    };
  },
};
