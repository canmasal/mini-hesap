import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

import { findPremiumProduct } from "@/data/premiumProducts";
import { getOrderStore } from "@/lib/orders/store";
import { verifyDownloadToken } from "@/lib/orders/tokens";
import { MAX_DOWNLOADS } from "@/lib/orders/types";

/** Dosya uzantısına göre içerik türü */
function contentTypeOf(fileName: string) {
  const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();

  const types: Record<string, string> = {
    ".xlsx":
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".xlsm": "application/vnd.ms-excel.sheet.macroEnabled.12",
    ".accdb": "application/msaccess",
    ".zip": "application/zip",
    ".pdf": "application/pdf",
  };

  return types[ext] ?? "application/octet-stream";
}

function deny(message: string, status = 403) {
  return NextResponse.json({ success: false, message }, { status });
}

/**
 * Premium ürün indirme.
 *
 * İki yetkilendirme yolu vardır:
 *
 *  1. Siparişe özel jeton (normal yol)
 *     Yalnızca o sipariş ve o ürün için geçerlidir, süre ve indirme
 *     adedi sınırlıdır.
 *
 *  2. Yönetici anahtarı (ADMIN_DOWNLOAD_SECRET)
 *     Kendi testiniz ve destek talepleri için. Tanımlı değilse kapalıdır.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const token = searchParams.get("token") ?? "";
  const productParam = searchParams.get("product") ?? "";

  let productSlug = productParam;
  let orderId: string | null = null;

  const adminSecret = process.env.ADMIN_DOWNLOAD_SECRET;
  const isAdmin =
    !!adminSecret && adminSecret.length >= 24 && token === adminSecret;

  if (!isAdmin) {
    const payload = verifyDownloadToken(token);

    if (!payload) {
      return deny(
        "İndirme bağlantısı geçersiz veya süresi dolmuş. Sipariş sayfanızdan yeni bağlantı alın."
      );
    }

    /* İstenen ürün jetondakiyle aynı olmalı; farklıysa sessizce başka
       dosya vermek yerine açıkça reddedilir. */
    if (productParam && productParam !== payload.productSlug) {
      return deny("Bu indirme bağlantısı istediğiniz ürüne ait değil.");
    }

    productSlug = payload.productSlug;
    orderId = payload.orderId;

    const store = getOrderStore();
    const order = await store.get(orderId);

    if (!order) return deny("Sipariş bulunamadı.", 404);

    if (order.status !== "odendi") {
      return deny("Bu siparişin ödemesi tamamlanmamış.");
    }

    if (order.productSlug !== productSlug) {
      return deny("Bu ürün siparişinize ait değil.");
    }

    if (
      order.downloadExpiresAt &&
      new Date(order.downloadExpiresAt).getTime() < Date.now()
    ) {
      return deny(
        "İndirme süreniz dolmuş. Destek için iletişim sayfasından yazın."
      );
    }

    if (order.downloadCount >= MAX_DOWNLOADS) {
      return deny(
        `İndirme hakkınız doldu (en fazla ${MAX_DOWNLOADS} kez). Destek için bize yazın.`
      );
    }

  }

  const selected = findPremiumProduct(productSlug);

  if (!selected) {
    return NextResponse.json(
      { success: false, message: "Geçersiz Premium ürün." },
      { status: 400 }
    );
  }

  try {
    const filePath = path.join(
      process.cwd(),
      "private",
      "products",
      selected.fileName
    );

    const file = await readFile(filePath);

    if (!isAdmin && orderId) {
      const downloadedAt = new Date().toISOString();
      const store = getOrderStore();
      const order = await store.get(orderId);

      if (order) {
        await store.update(orderId, {
          downloadCount: order.downloadCount + 1,
          firstDownloadedAt: order.firstDownloadedAt || downloadedAt,
          lastDownloadedAt: downloadedAt,
        });
      }
    }

    return new NextResponse(new Uint8Array(file), {
      status: 200,
      headers: {
        "Content-Type": contentTypeOf(selected.fileName),
        "Content-Disposition": `attachment; filename="${selected.fileName}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Premium indirme hatası:", error);

    return NextResponse.json(
      { success: false, message: "Dosya hazırlanırken bir hata oluştu." },
      { status: 500 }
    );
  }
}
