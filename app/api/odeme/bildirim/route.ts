import { NextResponse } from "next/server";

import { getOrderStore } from "@/lib/orders/store";
import { DOWNLOAD_WINDOW_DAYS } from "@/lib/orders/types";
import { activeProvider } from "@/lib/payments/provider";

/**
 * Ödeme sağlayıcısının bildirim (callback / webhook) uç noktası.
 *
 * Güvenlik kuralları:
 *  - Bildirim imzası doğrulanmadan hiçbir sipariş "ödendi" yapılmaz.
 *  - Ödenen tutar sipariş tutarıyla karşılaştırılır (eksik ödeme kabul edilmez).
 *  - Zaten ödenmiş sipariş tekrar işlenmez (mükerrer bildirim koruması).
 */
async function handle(request: Request) {
  const provider = activeProvider();

  if (!provider) {
    return NextResponse.json(
      { success: false, message: "Ödeme altyapısı etkin değil." },
      { status: 503 }
    );
  }

  let raw = "";
  try {
    raw = await request.text();
  } catch {
    raw = "";
  }

  const result = await provider.verifyWebhook(request, raw);

  if (!result) {
    console.warn("Ödeme bildirimi doğrulanamadı.");
    return NextResponse.json(
      { success: false, message: "Bildirim doğrulanamadı." },
      { status: 400 }
    );
  }

  const store = getOrderStore();
  const order = await store.get(result.orderId);

  if (!order) {
    return NextResponse.json(
      { success: false, message: "Sipariş bulunamadı." },
      { status: 404 }
    );
  }

  /* Mükerrer bildirim: zaten ödenmişse dokunma */
  if (order.status === "odendi") {
    return redirectOrJson(request, order.id, true);
  }

  if (!result.success) {
    await store.update(order.id, {
      status: "basarisiz",
      providerRef: result.providerRef,
    });
    return redirectOrJson(request, order.id, false);
  }

  /* Tutar doğrulaması: sağlayıcı tutar bildiriyorsa eşleşmeli */
  if (
    typeof result.amountKurus === "number" &&
    result.amountKurus !== order.amountKurus
  ) {
    console.error(
      `Tutar uyuşmazlığı: sipariş ${order.amountKurus}, bildirim ${result.amountKurus}`
    );

    await store.update(order.id, {
      status: "basarisiz",
      providerRef: result.providerRef,
    });

    return NextResponse.json(
      { success: false, message: "Ödeme tutarı eşleşmiyor." },
      { status: 400 }
    );
  }

  const expires = new Date();
  expires.setDate(expires.getDate() + DOWNLOAD_WINDOW_DAYS);

  await store.update(order.id, {
    status: "odendi",
    providerRef: result.providerRef,
    paidAt: new Date().toISOString(),
    downloadExpiresAt: expires.toISOString(),
  });

  return redirectOrJson(request, order.id, true);
}

/**
 * Bazı sağlayıcılar kullanıcıyı buraya yönlendirir (tarayıcı isteği),
 * bazıları sunucudan sunucuya bildirim gönderir. İkisini de destekleriz.
 */
function redirectOrJson(request: Request, orderId: string, ok: boolean) {
  const accept = request.headers.get("accept") ?? "";
  const isBrowser = accept.includes("text/html");

  if (!isBrowser) {
    return NextResponse.json({ success: ok, orderId });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  const target = ok
    ? `${baseUrl}/siparis/${orderId}`
    : `${baseUrl}/siparis/${orderId}?durum=basarisiz`;

  return NextResponse.redirect(target, 303);
}

export async function POST(request: Request) {
  return handle(request);
}

export async function GET(request: Request) {
  return handle(request);
}
