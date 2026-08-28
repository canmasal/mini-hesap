type CalculatorCardProps = {
  href: string;
  icon: string;
  title: string;
  description: string;
};

export default function CalculatorCard({
  href,
  icon,
  title,
  description
}: CalculatorCardProps) {
  return (
    <a className="card" href={href}>
      <div className="card-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="card-link">Hesapla →</div>
    </a>
  );
}
