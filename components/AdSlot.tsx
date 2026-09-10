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

  return (
    <div className="ad-slot" style={{ width: "100%" }}>
      <AdBanner label="REKLAM" minHeight={heights[position]} />
    </div>
  );
}
