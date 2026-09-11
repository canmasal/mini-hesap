/**
 * Hesaplama sonuçlarında kullanılan ortak satır.
 * Mevcut hesaplayıcılar kendi kopyalarını taşıyor; yeni araçlar bunu kullanır.
 */
export default function ResultRow({
  label,
  value,
  hint,
  highlight = false,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  highlight?: boolean;
  tone?: "pos" | "neg";
}) {
  const valueColor =
    tone === "pos"
      ? "var(--brand-deep)"
      : tone === "neg"
        ? "var(--danger)"
        : highlight
          ? "var(--brand-deep)"
          : "var(--ink)";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
        padding: "16px 18px",
        borderRadius: 16,
        background: highlight ? "var(--surface-mint)" : "var(--surface-soft)",
        border: `1px solid ${
          highlight ? "var(--brand-line)" : "var(--line-soft)"
        }`,
      }}
    >
      <span>
        <span style={{ color: "var(--muted)", fontSize: 14 }}>{label}</span>
        {hint && (
          <span
            style={{
              display: "block",
              marginTop: 3,
              color: "var(--muted)",
              fontSize: 12,
              lineHeight: 1.5,
            }}
          >
            {hint}
          </span>
        )}
      </span>

      <strong
        style={{
          color: valueColor,
          fontSize: 18,
          whiteSpace: "nowrap",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

export const money = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const percent = (value: number, digits = 2) =>
  `%${new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}`;
