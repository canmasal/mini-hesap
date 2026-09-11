import type { Metadata } from "next";
import Link from "next/link";

import AdSlot from "@/components/AdSlot";
import Breadcrumb from "@/components/Breadcrumb";
import { guides } from "@/data/guides";

export const metadata: Metadata = {
  title: "Rehberler",
  description:
    "Kıdem tazminatı, net maaş, ihbar tazminatı, KDV ve konut kredisi masrafları hakkında örnekli, anlaşılır rehberler.",
  alternates: { canonical: "/rehber" },
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const listSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "MiniHesap Rehberleri",
  itemListElement: guides.map((g, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: g.title,
    url: `${baseUrl}/rehber/${g.slug}`,
  })),
};

export default function GuidesPage() {
  return (
    <main className="page">
      <div className="container">
        <Breadcrumb
          items={[{ label: "Ana Sayfa", href: "/" }, { label: "Rehberler" }]}
        />

        <div className="section-head">
          <p className="eyebrow">BİLGİ MERKEZİ</p>
          <h1 style={{ margin: "10px 0 14px" }}>Rehberler</h1>
          <p className="page-lead" style={{ margin: "0 auto" }}>
            Hesaplamanın arkasındaki kuralları anlatan, örnekli ve sade
            rehberler. Önce konuyu anlayın, sonra hesaplayın.
          </p>
        </div>

        <div className="cards" style={{ marginTop: 40 }}>
          {guides.map((g) => (
            <Link key={g.slug} className="card" href={`/rehber/${g.slug}`}>
              <div className="card-icon" aria-hidden="true">
                {g.icon}
              </div>

              <span
                style={{
                  alignSelf: "flex-start",
                  marginTop: 14,
                  padding: "4px 10px",
                  borderRadius: "var(--r-pill)",
                  background: "var(--surface-mint)",
                  color: "var(--brand-deep)",
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                {g.category}
              </span>

              <h2 style={{ margin: "12px 0 0", fontSize: 19 }}>{g.title}</h2>

              <p style={{ color: "var(--muted)", lineHeight: 1.6, flex: 1 }}>
                {g.description}
              </p>

              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: 12,
                  color: "var(--muted)",
                }}
              >
                {g.readingMinutes} dakikalık okuma
              </p>

              <div className="card-link">Rehberi oku →</div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 40 }}>
          <AdSlot position="bottom" />
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />
    </main>
  );
}
