import { NextResponse } from "next/server";

import { ENV_SITE_URL } from "@/lib/site";
import { getOrderStore } from "@/lib/orders/store";
import { safeEqual } from "@/lib/orders/tokens";
import { confirmOrderPayment } from "@/lib/orders/confirm";

/**
 * Havale/EFT siparişini elle onaylama.
 *
 * Yalnızca site sahibi kullanır: dekontu gördükten sonra bu adrese girer,
 * sipariş "ödendi" olur ve müşterinin indirme hakkı açılır.
 *
 * Güvenlik: ADMIN_ORDER_SECRET tanımlı değilse veya 24 karakterden kısaysa
 * uç nokta tamamen kapalıdır.
 */
async function handle(request: Request) {
  const { searchParams } = new URL(request.url);

  const secret = process.env.ADMIN_ORDER_SECRET;
  const token = searchParams.get("key") ?? "";
  const orderId = searchParams.get("siparis") ?? "";
  const action = searchParams.get("islem") ?? "onayla";

  if (!secret || secret.length < 24) {
    return NextResponse.json(
      { success: false, message: "Onay uç noktası etkin değil." },
      { status: 503 }
    );
  }

  if (!safeEqual(token, secret)) {
    return NextResponse.json(
      { success: false, message: "Yetkiniz yok." },
      { status: 403 }
    );
  }

  if (!orderId) {
    return NextResponse.json(
      { success: false, message: "Sipariş numarası gerekli." },
      { status: 400 }
    );
  }

  const store = getOrderStore();
  const order = await store.get(orderId);

  if (!order) {
    return NextResponse.json(
      { success: false, message: "Sipariş bulunamadı." },
      { status: 404 }
    );
  }

  /* İptal / iade */
  if (action === "iptal") {
    await store.update(orderId, { status: "basarisiz" });
    return NextResponse.json({
      success: true,
      message: `${orderId} iptal edildi.`,
    });
  }

  if (action === "iade") {
    await store.update(orderId, { status: "iade" });
    return NextResponse.json({
      success: true,
      message: `${orderId} iade olarak işaretlendi; indirme kapatıldı.`,
    });
  }

  if (order.status === "odendi") {
    return NextResponse.json({
      success: true,
      message: `${orderId} zaten onaylı.`,
      alreadyPaid: true,
    });
  }

  const baseUrl =
    ENV_SITE_URL ?? new URL(request.url).origin;

  const { expires, emailSent } = await confirmOrderPayment(order, baseUrl);

  return NextResponse.json({
    success: true,
    message: `${orderId} onaylandı. Müşteri artık indirebilir.`,
    order: {
      id: orderId,
      product: order.productTitle,
      amount: order.amountKurus / 100,
      email: order.email,
    },
    emailSent,
    downloadUntil: expires.toISOString().slice(0, 10),
  });
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
