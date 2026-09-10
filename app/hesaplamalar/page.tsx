import type { Metadata } from "next";

import AdSlot from "@/components/AdSlot";
import Breadcrumb from "@/components/Breadcrumb";
import CalculatorExplorer from "@/components/CalculatorExplorer";
import { calculators } from "@/data/calculators";

export const metadata: Metadata = {
  title: "Hesaplama Araçları",
  description:
    "Net maaş, kıdem tazminatı, ihbar tazminatı, KDV, yüzde, indirim, kira artışı, fazla mesai, yaş, yıllık izin, banka borç takip ve ön muhasebe hesaplama araçlarını tek yerde kullanın.",
  alternates: {
    canonical: "/hesaplamalar",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "MiniHesap Hesaplama Araçları",
  itemListElement: calculators.map((calculator, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: calculator.title,
    url: `${baseUrl}/hesaplamalar/${calculator.slug}`,
  })),
};

export default function HesaplamalarPage() {
  return (
    <main className="page">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Hesaplamalar" },
          ]}
        />
      </div>

      {/* BAŞLIK */}
      <section className="section" style={{ paddingTop: 10, paddingBottom: 30 }}>
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">POPÜLER HESAPLAMALAR</p>

            <h1
              style={{
                margin: "10px 0 14px",
                fontSize: "clamp(32px, 5vw, 54px)",
                lineHeight: 1.05,
              }}
            >
              Hesaplama Araçları
            </h1>

            <p className="page-lead" style={{ margin: "0 auto" }}>
              Günlük hayatta en çok ihtiyaç duyulan hesaplamaları tek yerde
              hızlı, kolay ve anlaşılır şekilde yapın.
            </p>
          </div>
        </div>
      </section>

      {/* ARAMA + FİLTRE + KARTLAR */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <CalculatorExplorer />
        </div>
      </section>

      <div className="container">
        <AdSlot position="middle" />
      </div>

      {/* SEO METNİ */}
      <section className="section" style={{ paddingTop: 35, paddingBottom: 40 }}>
        <div className="container">
          <article
            style={{
              maxWidth: 900,
              margin: "0 auto",
              padding: 28,
              borderRadius: "var(--r-lg)",
              background: "var(--surface)",
              border: "1px solid var(--line)",
            }}
          >
            <p className="eyebrow">MİNİHESAP</p>

            <h2 style={{ margin: "8px 0 14px", fontSize: 28 }}>
              Günlük hesaplamalarınızı kolaylaştırın
            </h2>

            <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.8 }}>
              MiniHesap; maaş, tazminat, KDV, yüzde, indirim, kira artışı, fazla
              mesai, yaş ve yıllık izin gibi farklı ihtiyaçlar için pratik
              hesaplama araçlarını bir araya getirir. Ayrıca banka borç takibi
              ve ön muhasebe takibi için gelişmiş finans araçları sunar. Tüm
              hesaplamalar tarayıcınızda çalışır; girdiğiniz veriler sunucuya
              gönderilmez.
            </p>
          </article>
        </div>
      </section>

      <div className="container">
        <AdSlot position="bottom" />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
    </main>
  );
}
