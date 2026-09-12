export function GET() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";
  const publisherId = clientId.replace(/^ca-/, "");
  const body = publisherId
    ? `google.com, ${publisherId}, f08c47fec0942fa0, DIRECT\n`
    : "# AdSense publisher ID is not configured yet.\n";

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}