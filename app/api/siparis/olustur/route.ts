import { NextResponse } from "next/server";

import { findPurchasable } from "@/data/plans";
import { getOrderStore } from "@/lib/orders/store";
import { newOrderId } from "@/lib/orders/tokens";
import type { Order } from "@/lib/orders/types";
import { activeProvider } from "@/lib/payments/provider";

/** İstemciden gelen veriye asla güvenmeyiz; fiyat sunucudan okunur. */
export async function POST(request: Request) {
  const provider = activeProvider();

  if (!provider) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Ödeme altyapısı henüz etkin değil. Satın almak için iletişim sayfasından bize yazın.",
      },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Geçersiz istek." },
      { status: 400 }
    );
  }

  const productSlug = String(body.productSlug ?? "");
  const email = String(body.email ?? "").trim();
  const fullName = String(body.fullName ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const terms = body.terms === true;

  const product = findPurchasable(productSlug);
  if (!product) {
    return NextResponse.json(
      { success: false, message: "Ürün bulunamadı." },
      { status: 404 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json(
      { success: false, message: "Geçerli bir e-posta adresi girin." },
      { status: 400 }
    );
  }

  if (fullName.length < 3) {
    return NextResponse.json(
      { success: false, message: "Ad soyad en az 3 karakter olmalı." },
      { status: 400 }
    );
  }

  /* Mesafeli satış mevzuatı gereği onay zorunlu */
  if (!terms) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Ön bilgilendirme formu ve mesafeli satış sözleşmesini onaylamanız gerekir.",
      },
      { status: 400 }
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  const order: Order = {
    id: newOrderId(),
    productSlug: product.slug,
    productTitle: product.title,
    /* Fiyat yalnızca sunucudaki üründen alınır */
    amountKurus: Math.round(product.price * 100),
    currency: "TRY",
    email,
    fullName,
    phone: phone || undefined,
    status: "bekliyor",
    provider: provider.id,
    createdAt: new Date().toISOString(),
    downloadCount: 0,
    ip:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      undefined,
  };

  const store = getOrderStore();

  try {
    await store.create(order);
  } catch (error) {
    console.error("Sipariş oluşturulamadı:", error);
    return NextResponse.json(
      { success: false, message: "Sipariş kaydedilemedi. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }

  try {
    const checkout = await provider.startCheckout(order, {
      successUrl: `${baseUrl}/siparis/${order.id}`,
      failUrl: `${baseUrl}/siparis/${order.id}?durum=basarisiz`,
      callbackUrl: `${baseUrl}/api/odeme/bildirim`,
    });

    return NextResponse.json({ success: true, orderId: order.id, checkout });
  } catch (error) {
    console.error("Ödeme başlatılamadı:", error);
    await store.update(order.id, { status: "basarisiz" });

    return NextResponse.json(
      { success: false, message: "Ödeme başlatılamadı. Lütfen tekrar deneyin." },
      { status: 502 }
    );
  }
}
