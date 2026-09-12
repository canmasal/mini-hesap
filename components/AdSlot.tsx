import AdBanner from "@/components/AdBanner";

type AdSlotProps = {
  position?: "top" | "middle" | "bottom";
};

export default function AdSlot({ position = "middle" }: AdSlotProps) {
  const heights = {
    top: 90,
    middle: 250,
    bottom: 90,
  };

  const slots = {
    top: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP,
    middle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_MIDDLE,
    bottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM,
  };

  return (
    <div className="ad-slot" style={{ width: "100%" }}>
      <AdBanner label="REKLAM" minHeight={heights[position]} slot={slots[position]} />
    </div>
  );
}
