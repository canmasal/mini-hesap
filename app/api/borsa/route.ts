import { NextResponse } from "next/server";

import { fetchStocks } from "@/lib/stocks";

export const revalidate = 60;

/** Canlı borsa tablosunun dakikalık yenileme ucu */
export async function GET() {
  const data = await fetchStocks();
  if (!data) {
    return NextResponse.json({ error: "Borsa verisi şu an alınamıyor." }, { status: 503 });
  }

  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
