type AdBannerProps = {
  label?: string;
  minHeight?: number;
  slot?: string;
};

import AdSenseUnit from "@/components/AdSenseUnit";
import Link from "next/link";

export default function AdBanner({
  label = "REKLAM",
  minHeight = 90,
  slot,
}: AdBannerProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <div
      aria-label="Reklam alanı"
      style={{
        width: "100%",
        minHeight: `${minHeight}px`,
        margin: "20px auto",
        padding: "8px",
        boxSizing: "border-box",
        border: "1px dashed #cbd5d1",
        borderRadius: "14px",
        background: "#fafcfb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {clientId && slot ? (
        <AdSenseUnit slot={slot} />
      ) : (
        <Link
          href="/iletisim?konu=reklam"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: `${Math.max(minHeight - 16, 44)}px`,
            padding: "10px 18px",
            color: "var(--brand-dark)",
            fontSize: "13px",
            fontWeight: 700,
            textAlign: "center",
            textDecoration: "none",
          }}
        >
          Reklam vermek için iletişime geçiniz
        </Link>
      )}
    </div>
  );
}