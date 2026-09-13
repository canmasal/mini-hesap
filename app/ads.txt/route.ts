import { ADSENSE_PUBLISHER_ID } from "@/lib/adsense";

/* İçerik yalnızca derleme anındaki kimliğe bağlı; her istekte yeniden
   üretilmesine gerek yok. */
export const dynamic = "force-static";

export function GET() {
  return new Response(
    `google.com, ${ADSENSE_PUBLISHER_ID}, f08c47fec0942fa0, DIRECT\n`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
}
