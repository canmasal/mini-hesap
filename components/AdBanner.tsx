type AdBannerProps = {
  label?: string;
  minHeight?: number;
};

export default function AdBanner({
  label = "REKLAM",
  minHeight = 90,
}: AdBannerProps) {
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
      <span
        style={{
          fontSize: "11px",
          color: "#94a39a",
          letterSpacing: "1px",
          fontWeight: 700,
        }}
      >
        {label}
      </span>
    </div>
  );
}