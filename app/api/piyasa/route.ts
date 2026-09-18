import { NextResponse } from "next/server";

import { fetchMarket, marketLastError } from "@/lib/market";

export const revalidate = 60;

/** Canlı altın ve döviz panosunun dakikalık yenileme ucu */
export async function GET() {
  const data = await fetchMarket();
  if (!data) {
    const reason = marketLastError();
    /* Sebep yalnızca geliştirmede dönüyor, canlıda kullanıcıya gösterilmiyor */
    return NextResponse.json(
      {
        error: "Piyasa verisi şu an alınamıyor.",
        ...(process.env.NODE_ENV !== "production" && reason ? { reason } : {}),
      },
      { status: 503 },
    );
  }

  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
