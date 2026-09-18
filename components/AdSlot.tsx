import AdBanner from "@/components/AdBanner";
import { ADSENSE_SLOTS, type AdPosition } from "@/lib/adsense";

/** Reklam alanının konuma göre ayırdığı en az yükseklik */
const MIN_HEIGHTS: Record<AdPosition, number> = {
  top: 90,
  middle: 250,
  bottom: 90,
};

export default function AdSlot({ position = "middle" }: { position?: AdPosition }) {
  return (
    <div className="ad-slot" style={{ width: "100%" }}>
      <AdBanner label="REKLAM" minHeight={MIN_HEIGHTS[position]} slot={ADSENSE_SLOTS[position]} />
    </div>
  );
}
