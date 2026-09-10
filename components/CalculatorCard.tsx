import Link from "next/link";

type CalculatorCardProps = {
  href: string;
  icon: string;
  title: string;
  description: string;
  cta?: string;
  badge?: string;
};

export default function CalculatorCard({
  href,
  icon,
  title,
  description,
  cta = "Hesapla",
  badge,
}: CalculatorCardProps) {
  return (
    <Link className="card" href={href}>
      {badge && (
        <span
          style={{
            alignSelf: "flex-start",
            marginBottom: 12,
            padding: "5px 9px",
            borderRadius: 8,
            background: "var(--surface-mint)",
            color: "#008a43",
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          {badge}
        </span>
      )}

      <div className="card-icon" aria-hidden="true">
        {icon}
      </div>

      <h3>{title}</h3>
      <p>{description}</p>

      <div className="card-link">{cta} →</div>
    </Link>
  );
}
