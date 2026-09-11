import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

import { findPremiumProduct } from "@/data/premiumProducts";

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

/** Zamanlama saldırılarına karşı sabit süreli karşılaştırma */
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;

  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const token = searchParams.get("token") ?? "";
  const product = searchParams.get("product") ?? "";

  const secret = process.env.PREMIUM_DOWNLOAD_SECRET;

  if (!secret || !safeEqual(token, secret)) {
    return NextResponse.json(
      {
        success: false,
        message: "Premium Excel indirme yetkiniz bulunmuyor.",
      },
      { status: 403 }
    );
  }

  const selected = findPremiumProduct(product);

  if (!selected) {
    return NextResponse.json(
      {
        success: false,
        message: "Geçersiz Premium ürün.",
      },
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

    return new NextResponse(new Uint8Array(file), {
      status: 200,
      headers: {
        "Content-Type": contentTypeOf(selected.fileName),

        "Content-Disposition": `attachment; filename="${selected.fileName}"`,

        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Premium Excel indirme hatası:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Excel dosyası hazırlanırken bir hata oluştu.",
      },
      { status: 500 }
    );
  }
}
