import { NextResponse } from "next/server";

import { fetchMarket } from "@/lib/market";

export const revalidate = 60;

/** Canlı altın ve döviz panosunun dakikalık yenileme ucu */
export async function GET() {
  const data = await fetchMarket();
  if (!data) {
    return NextResponse.json({ error: "Piyasa verisi şu an alınamıyor." }, { status: 503 });
  }

  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
