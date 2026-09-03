import AdBanner from "@/components/AdBanner";

type AdSlotProps = {
  position?: "top" | "middle" | "bottom";
};

export default function AdSlot({
  position = "middle",
}: AdSlotProps) {
  const heights = {
    top: 90,
    middle: 250,
    bottom: 90,
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "0 0 1px 0",
      }}
    >
      <AdBanner
        label="REKLAM"
        minHeight={heights[position]}
      />
    </div>
  );
}