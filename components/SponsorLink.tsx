import { SPONSOR_DIRECT_LINK } from "@/lib/sponsor";

/** Etiketli sponsor bağlantısı; lib/sponsor.ts'te kapalıyken hiçbir şey çizmez. */
export default function SponsorLink() {
  if (!SPONSOR_DIRECT_LINK.enabled) return null;

  return (
    <div className="ad-frame">
      <span className="ad-label">{SPONSOR_DIRECT_LINK.label}</span>
      <a
        href={SPONSOR_DIRECT_LINK.url}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        className="ad-frame--house ad-house-link"
        style={{ display: "block" }}
      >
        {SPONSOR_DIRECT_LINK.text} →
      </a>
    </div>
  );
}
