import { NextResponse } from "next/server";

import { fetchStocks } from "@/lib/stocks";

export const revalidate = 60;

/**
 * Eski hisse ucu.
 *
 * Önceki sürüm Yahoo Finance v7 quote ucunu çağırıyordu, o uç artık
 * {"error":{"code":"Unauthorized"}} dönüyor. Aynı veriyi çalışan v8 chart
 * katmanından veren /api/borsa mantığına devrediyor, böylece eski adrese
 * gelen istekler kırılmıyor.
 */
export async function GET() {
  const data = await fetchStocks();
  if (!data) {
    return NextResponse.json({ error: "Borsa verisi şu an alınamıyor." }, { status: 503 });
  }

  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
