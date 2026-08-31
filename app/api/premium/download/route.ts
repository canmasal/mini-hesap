import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const token = searchParams.get("token");
  const product = searchParams.get("product");

  // Premium indirme gizli anahtarı
  const secret = process.env.PREMIUM_DOWNLOAD_SECRET;

  if (!secret || token !== secret) {
    return NextResponse.json(
      {
        success: false,
        message: "Premium Excel indirme yetkiniz bulunmuyor.",
      },
      {
        status: 403,
      }
    );
  }

  /*
   * Ürün seçimi
   *
   * borc-takip
   * on-muhasebe
   */

  const products: Record<
    string,
    {
      fileName: string;
      downloadName: string;
    }
  > = {
    "borc-takip": {
      fileName: "MiniHesap_Profesyonel_Borc_Takip.xlsx",
      downloadName: "MiniHesap_Profesyonel_Borc_Takip.xlsx",
    },

    "on-muhasebe": {
      fileName: "MiniHesap_On_Muhasebe_Takip.xlsx",
      downloadName: "MiniHesap_On_Muhasebe_Takip.xlsx",
    },
  };

  const selectedProduct = products[product || ""];

  if (!selectedProduct) {
    return NextResponse.json(
      {
        success: false,
        message: "Geçersiz Premium ürün.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const filePath = path.join(
      process.cwd(),
      "private",
      "products",
      selectedProduct.fileName
    );

    const file = await readFile(filePath);

    return new NextResponse(new Uint8Array(file), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        "Content-Disposition": `attachment; filename="${selectedProduct.downloadName}"`,

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
      {
        status: 500,
      }
    );
  }
}