import type { Metadata } from "next";
import Link from "next/link";

import BorcTakipDemo from "@/components/BorcTakipDemo";
import Breadcrumb from "@/components/Breadcrumb";
import PremiumCta from "@/components/PremiumCta";
import AdSlot from "@/components/AdSlot";
export const metadata: Metadata = {
  title: "Banka Borç Takip",
  description:
    "Tüm banka ve kredi kartı borçlarınızı tek tabloda takip edin. MiniHesap borç takip aracını ücretsiz demo olarak deneyin.",
  alternates: {
    canonical: "/borc-takip",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BorcTakipPage() {
  return (
    <main className="page">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Hesaplamalar", href: "/hesaplamalar" },
            { label: "Banka Borç Takip" },
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
            <div className="eyebrow">MİNİHESAP FİNANS ARAÇLARI</div>

            <h1
              style={{
                margin: "10px 0 14px",
                fontSize: "clamp(34px, 5vw, 54px)",
                lineHeight: 1.05,
              }}
            >
              💳 Borç Takip ve Banka Borç Durumu
            </h1>

            <p
              className="page-lead"
              style={{
                maxWidth: 760,
                margin: "0 auto",
              }}
            >
              Banka, kredi kartı ve nakit avans borçlarınızı tek tabloda
              görüntüleyin. Aşağıdaki demo üzerinden sistemi hemen deneyin.
            </p>
          </div>
        </div>
      </section>

      <BorcTakipDemo />

      <section className="section" style={{ paddingTop: 25, paddingBottom: 70 }}>
        <div className="container">
          <article
            style={{
              maxWidth: 900,
              margin: "0 auto",
              padding: 28,
              borderRadius: 22,
              background: "#ffffff",
              border: "1px solid #dce7df",
            }}
          >
            <div className="eyebrow">ÜCRETLİ SÜRÜM PLANI</div>

            <h2 style={{ margin: "8px 0 14px", fontSize: 28 }}>
              Profesyonel Borç Takip Excel'i
            </h2>

            <p style={{ color: "#617066", lineHeight: 1.8, marginBottom: 18 }}>
              Ücretli sürümde banka bazlı borç dağılımı, aylık ödeme geçmişi,
              taksit takibi, limit kullanım oranı, grafikler ve kişisel rapor
              alanlarını bir araya getireceğiz.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: 12,
              }}
            >
              {[
                "📊 Borç özet paneli",
                "🏦 Banka bazlı takip",
                "📅 Aylık ödeme geçmişi",
                "💳 Taksit takip alanı",
                "📈 Limit kullanım grafikleri",
                "📥 Excel / PDF raporu",
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
              <Link className="btn btn-green" href="/premium/borc-takip">
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
        <PremiumCta toolHref="/borc-takip" />
        <AdSlot position="bottom" />
      </div>
    </main>
  );
}
