import type { Metadata } from "next";
import Link from "next/link";

import OnMuhasebeDemo from "@/components/OnMuhasebeDemo";
import Breadcrumb from "@/components/Breadcrumb";
import PremiumCta from "@/components/PremiumCta";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Ön Muhasebe Takip",
  description:
    "Gelir ve giderlerinizi takip edin, aylık ön muhasebe özetinizi oluşturun. MiniHesap ön muhasebe aracını ücretsiz demo olarak deneyin.",
  alternates: {
    canonical: "/on-muhasebe",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function OnMuhasebePage() {
  return (
    <main className="page">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Hesaplamalar", href: "/hesaplamalar" },
            { label: "Ön Muhasebe Takip" },
          ]}
        />
      </div>

      <section className="section" style={{ paddingTop: 10 }}>
        <div className="container">
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <div className="eyebrow">
              MİNİHESAP FİNANS ARAÇLARI
            </div>

            <h1
              style={{
                margin: "10px 0 14px",
                fontSize: "clamp(34px, 5vw, 54px)",
                lineHeight: 1.05,
              }}
            >
              📊 Ön Muhasebe Takip
            </h1>

            <p
              className="page-lead"
              style={{
                maxWidth: 760,
                margin: "0 auto",
              }}
            >
              Gelir ve giderlerinizi kolayca takip edin,
              net kâr veya zararınızı görün ve profesyonel
              Excel sürümüne geçin.
            </p>
          </div>
        </div>
      </section>

      <OnMuhasebeDemo />

      <section
        className="section"
        style={{
          paddingTop: 25,
          paddingBottom: 70,
        }}
      >
        <div className="container">
          <article
            style={{
              maxWidth: 900,
              margin: "0 auto",
              padding: 28,
              borderRadius: 22,
              background: "#fff",
              border: "1px solid #dce7df",
            }}
          >
            <div className="eyebrow">
              PREMIUM SÜRÜM
            </div>

            <h2
              style={{
                margin: "8px 0 14px",
                fontSize: 28,
              }}
            >
              Profesyonel Ön Muhasebe Excel'i
            </h2>

            <p
              style={{
                color: "#617066",
                lineHeight: 1.8,
                marginBottom: 18,
              }}
            >
              Profesyonel Excel sürümünde yıllık
              dashboard, aylık gelir-gider analizi,
              kategori raporları, cari takip, ödeme
              yöntemi analizi ve indirilebilir rapor
              alanlarını bir araya getireceğiz.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(210px, 1fr))",
                gap: 12,
              }}
            >
              {[
                "📊 Yıllık dashboard",
                "📅 Aylık gelir-gider",
                "📈 Kâr / zarar analizi",
                "🏷️ Kategori raporları",
                "👥 Cari / müşteri takibi",
                "📥 İndirilebilir Excel",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    padding: 15,
                    borderRadius: 14,
                    background: "#f8faf9",
                    border: "1px solid #e5eee8",
                    fontWeight: 700,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 20,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Link className="btn btn-green" href="/premium/on-muhasebe">
                Premium sürümü incele →
              </Link>

              <span style={{ color: "var(--muted)", fontSize: 14 }}>
                Yukarıdaki demo her zaman ücretsizdir.
              </span>
            </div>
          </article>
        </div>
      </section>

      <div className="container">
        <PremiumCta toolHref="/on-muhasebe" />
        <AdSlot position="bottom" />
      </div>
    </main>
  );
}
