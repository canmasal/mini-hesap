import type { Order } from "@/lib/orders/types";

/**
 * Sipariş e-postası gönderimi.
 *
 * Resend (resend.com) üzerinden çalışır; RESEND_API_KEY tanımlı değilse
 * gönderim sessizce atlanır ve arayüzde e-posta sözü verilmez.
 *
 * E-postaya indirme jetonu KOYULMAZ. Bunun yerine sipariş sayfasının adresi
 * gönderilir; o sayfa her açıldığında kısa ömürlü yeni bir jeton üretir.
 * Böylece e-posta iletilse bile kalıcı bir indirme anahtarı sızmaz.
 */

export function emailEnabled() {
  return Boolean(process.env.RESEND_API_KEY && process.env.MAIL_FROM);
}

function escapeHtml(value: string) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function orderEmailHtml(order: Order, orderUrl: string) {
  const name = escapeHtml(order.fullName.split(" ")[0] ?? "");
  const product = escapeHtml(order.productTitle);
  const amount = (order.amountKurus / 100).toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
  });

  return `
<div style="font-family:system-ui,-apple-system,'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;color:#10231a">
  <div style="background:#16a34a;color:#fff;padding:22px 24px;border-radius:14px 14px 0 0">
    <div style="font-size:20px;font-weight:800">MiniHesap</div>
    <div style="font-size:13px;opacity:.9;margin-top:4px">Siparişiniz hazır</div>
  </div>

  <div style="border:1px solid #dce7df;border-top:0;border-radius:0 0 14px 14px;padding:24px">
    <p style="margin:0 0 14px">Merhaba ${name},</p>

    <p style="margin:0 0 18px;line-height:1.7">
      <strong>${product}</strong> için ödemeniz onaylandı. Dosyanızı aşağıdaki
      bağlantıdan indirebilirsiniz.
    </p>

    <p style="margin:0 0 24px">
      <a href="${orderUrl}"
         style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;
                padding:14px 26px;border-radius:999px;font-weight:800">
        Siparişime Git ve İndir
      </a>
    </p>

    <div style="background:#f8faf9;border:1px solid #e5eee8;border-radius:12px;padding:16px;font-size:14px;line-height:1.7">
      <div><strong>Sipariş no:</strong> ${escapeHtml(order.id)}</div>
      <div><strong>Tutar:</strong> ${amount} ₺</div>
      <div style="margin-top:8px;color:#617066">
        Bu bağlantı 30 gün boyunca geçerlidir ve en fazla 10 indirme hakkı tanır.
        Sayfayı yer imlerinize eklemenizi öneririz.
      </div>
    </div>

    <p style="margin:20px 0 0;font-size:13px;color:#617066;line-height:1.7">
      Sorun yaşarsanız bu e-postayı yanıtlayarak sipariş numaranızla birlikte
      bize yazabilirsiniz.
    </p>

    <p style="margin:18px 0 0;font-size:12px;color:#94a39a">
      MiniHesap · minihesap.net<br>
      Bu e-posta ${escapeHtml(order.email)} adresine bir satın alma nedeniyle gönderildi.
    </p>
  </div>
</div>`.trim();
}

/**
 * Sipariş onay e-postasını gönderir.
 * Hata durumunda istisna fırlatmaz; ödeme akışı e-posta yüzünden bozulmamalı.
 */
export async function sendOrderEmail(order: Order, orderUrl: string) {
  if (!emailEnabled()) return { sent: false, reason: "yapilandirilmadi" };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM,
        to: [order.email],
        subject: `Siparişiniz hazır — ${order.productTitle}`,
        html: orderEmailHtml(order, orderUrl),
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Sipariş e-postası gönderilemedi:", res.status, text);
      return { sent: false, reason: `http_${res.status}` };
    }

    return { sent: true };
  } catch (error) {
    console.error("Sipariş e-postası gönderilemedi:", error);
    return { sent: false, reason: "istisna" };
  }
}
