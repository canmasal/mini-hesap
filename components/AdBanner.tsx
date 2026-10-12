import AdSenseUnit from "@/components/AdSenseUnit";
import { ADSENSE_CLIENT_ID } from "@/lib/adsense";
import Link from "next/link";

type AdBannerProps = {
  label?: string;
  minHeight?: number;
  slot?: string;
};

/**
 * Reklam alanı çerçevesi.
 *
 * Yayıncı kimliği lib/adsense.ts'ten gelir. Alan, reklam yüklenene kadar
 * yerini korur (sayfa kaymasın diye) ve üstünde küçük "Reklam" etiketi taşır.
 * AdSense alanı dolduramazsa (data-ad-status="unfilled") globals.css'teki
 * kural bütün çerçeveyi gizler; ziyaretçi boş kutu görmez.
 */
export default function AdBanner({ label = "Reklam", minHeight = 90, slot }: AdBannerProps) {
  const clientId = ADSENSE_CLIENT_ID;

  if (!clientId || !slot) {
    return (
      <div className="ad-frame ad-frame--house">
        <Link href="/reklam" className="ad-house-link">
          Reklam vermek için iletişime geçiniz
        </Link>
      </div>
    );
  }

  return (
    <div className="ad-frame" aria-label="Reklam alanı">
      <span className="ad-label">{label}</span>
      <div className="ad-body" style={{ minHeight }}>
        <AdSenseUnit slot={slot} />
      </div>
    </div>
  );
}
