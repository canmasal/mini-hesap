import type { Metadata } from "next";
import Link from "next/link";

import Breadcrumb from "@/components/Breadcrumb";
import { premiumProducts } from "@/data/premiumProducts";

export const metadata: Metadata = {
  title: "Premium Excel Şablonları",
  description:
    "Borç takip, ön muhasebe, kıdem-ihbar tazminat, kredi kapatma planlayıcı ve yıllık bütçe Excel şablonları. Hazır formüllerle indirin, kendi verinizi girin.",
  alternates: { canonical: "/premium" },
};

export default function PremiumPage() {
  return (
    <main className="page">
      <div className="container">
        <Breadcrumb
          items={[{ label: "Ana Sayfa", href: "/" }, { label: "Premium" }]}
        />

        <div className="section-head">
          <p className="eyebrow">💎 MİNİHESAP PREMIUM</p>

          <h1 style={{ margin: "10px 0 14px" }}>Premium Excel Şablonları</h1>

          <p className="page-lead" style={{ margin: "0 auto" }}>
            Sitedeki ücretsiz araçlar tek seferlik hesap içindir. Premium
            şablonlar verilerinizi kalıcı olarak saklamanız, geçmişi takip
            etmeniz ve rapor almanız için hazırlanmıştır.
          </p>
        </div>

        <div className="cards" style={{ marginTop: 40 }}>
          {premiumProducts.map((product) => (
            <article key={product.slug} className="card" style={{ cursor: "default" }}>
              <div className="card-icon" aria-hidden="true">
                {product.icon}
              </div>

              <h2 style={{ margin: "18px 0 0", fontSize: 20 }}>
                {product.title}
              </h2>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "var(--brand-dark)",
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                {product.tagline}
              </p>

              <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
                {product.description}
              </p>

              <ul
                style={{
                  margin: "4px 0 16px",
                  paddingLeft: 18,
                  color: "var(--ink-soft)",
                  fontSize: 13,
                  lineHeight: 1.8,
                }}
              >
                {product.features.slice(0, 4).map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              <p
                style={{
                  margin: "0 0 14px",
                  fontSize: 12,
                  color: "var(--muted)",
                }}
              >
                <strong>Sayfalar:</strong> {product.sheets.join(" · ")}
              </p>

              <div
                style={{
                  marginTop: "auto",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: "var(--brand-deep)",
                  }}
                >
                  {product.price} ₺
                </span>

                <Link className="btn btn-green" href={`/satin-al/${product.slug}`}>
                  Satın Al →
                </Link>

                {product.landingPage && (
                  <Link className="btn btn-outline" href={product.landingPage}>
                    İncele
                  </Link>
                )}
              </div>

              {product.relatedTool && (
                <p style={{ margin: "14px 0 0", fontSize: 13 }}>
                  Önce ücretsiz deneyin:{" "}
                  <Link
                    href={product.relatedTool.href}
                    style={{
                      color: "var(--brand-dark)",
                      fontWeight: 700,
                      textDecoration: "underline",
                    }}
                  >
                    {product.relatedTool.label}
                  </Link>
                </p>
              )}
            </article>
          ))}
        </div>

        <div className="notice" style={{ marginTop: 36 }}>
          <strong>Teslimat:</strong> Ödeme onaylandıktan hemen sonra indirme
          bağlantınız ekranda görünür ve e-posta adresinize gönderilir.
          Dijital ürün olduğu için indirme başladıktan sonra cayma hakkı sona
          erer;{" "}
          <Link href="/iade-kosullari" style={{ fontWeight: 700 }}>
            iptal ve iade koşullarına
          </Link>{" "}
          göz atın.
        </div>
      </div>
    </main>
  );
}
