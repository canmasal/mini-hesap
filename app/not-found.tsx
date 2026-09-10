import type { Metadata } from "next";
import Link from "next/link";

import CalculatorCard from "@/components/CalculatorCard";
import { calculators } from "@/data/calculators";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const suggestions = calculators.slice(0, 3);

  return (
    <main className="page">
      <div className="container">
        <div className="section-head">
          <div style={{ fontSize: 64 }} aria-hidden="true">
            🧭
          </div>

          <p className="eyebrow">404</p>
          <h1 style={{ marginTop: 6 }}>Sayfa bulunamadı</h1>

          <p className="page-lead" style={{ margin: "14px auto 0" }}>
            Aradığınız sayfa taşınmış veya hiç var olmamış olabilir. Aşağıdan
            devam edebilirsiniz.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
              marginTop: 26,
            }}
          >
            <Link className="btn btn-green" href="/hesaplamalar">
              Hesaplama araçları
            </Link>
            <Link className="btn btn-outline" href="/">
              Ana sayfaya dön
            </Link>
          </div>
        </div>

        <div className="cards">
          {suggestions.map((item) => (
            <CalculatorCard
              key={item.slug}
              href={`/hesaplamalar/${item.slug}`}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
