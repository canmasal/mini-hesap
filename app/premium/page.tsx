import type { Metadata } from "next";
import Link from "next/link";

import Breadcrumb from "@/components/Breadcrumb";
import { premiumProducts, KIND_LABELS } from "@/data/premiumProducts";

export const metadata: Metadata = {
  title: "Premium Hizmetler",
  description:
    "Windows programı, Access veritabanı paketi ve profesyonel Excel şablonları. Cari, stok, bordro, kira, e-ticaret ve şantiye takibi için hazır çözümler.",
  alternates: { canonical: "/premium" },
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const listSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "MiniHesap Premium Hizmetler",
  itemListElement: premiumProducts.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: p.title,
    url: `${baseUrl}/satin-al/${p.slug}`,
  })),
};

export default function PremiumPage() {
  /* Tür sayıları, üstteki özet rozetleri için */
  const kinds = (["program", "veritabani", "excel"] as const).map((id) => ({
    id,
    count: premiumProducts.filter((p) => p.kind === id).length,
  }));

  return (
    <main className="page">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Premium Hizmetler" },
          ]}
        />

        <div className="section-head">
          <p className="eyebrow">💎 MİNİHESAP PREMIUM</p>

          <h1 style={{ margin: "10px 0 14px" }}>Premium Hizmetler</h1>

          <p className="page-lead" style={{ margin: "0 auto" }}>
            Sitedeki ücretsiz araçlar tek seferlik hesap içindir. Premium
            çözümler verilerinizi kalıcı olarak saklamanız, geçmişi takip
            etmeniz ve rapor almanız için hazırlandı.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            {kinds
              .filter((k) => k.count > 0)
              .map((k) => (
                <span
                  key={k.id}
                  className={`product-card__kind is-${k.id}`}
                  style={{ padding: "7px 14px", fontSize: 12 }}
                >
                  {KIND_LABELS[k.id]} · {k.count}
                </span>
              ))}
          </div>
        </div>

        <div className="product-grid">
          {premiumProducts.map((product) => (
            <article key={product.slug} className="product-card">
              <div className="product-card__top">
                <div className="product-card__icon" aria-hidden="true">
                  {product.icon}
                </div>
                <span className={`product-card__kind is-${product.kind}`}>
                  {KIND_LABELS[product.kind]}
                </span>
              </div>

              <h2 className="product-card__title">{product.title}</h2>

              <p className="product-card__tagline">{product.tagline}</p>

              <p className="product-card__desc">{product.description}</p>

              <ul className="product-card__features">
                {product.features.slice(0, 4).map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              <p className="product-card__sheets">
                <strong>İçerik:</strong> {product.sheets.length} bölüm ·{" "}
                {product.sheets.slice(0, 3).join(", ")}
                {product.sheets.length > 3 && "…"}
              </p>

              <div className="product-card__foot">
                <div className="product-card__price">
                  <b>{product.price.toLocaleString("tr-TR")} ₺</b>
                  <span>tek seferlik · KDV dâhil</span>
                </div>

                <div className="product-card__actions">
                  <Link
                    className="btn btn-green"
                    href={`/satin-al/${product.slug}`}
                  >
                    Satın Al →
                  </Link>

                  {product.landingPage && (
                    <Link className="btn btn-outline" href={product.landingPage}>
                      Ayrıntılı İncele
                    </Link>
                  )}
                </div>

                {product.relatedTool && (
                  <p className="product-card__try">
                    Önce ücretsiz deneyin:{" "}
                    <Link href={product.relatedTool.href}>
                      {product.relatedTool.label}
                    </Link>
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="notice" style={{ marginTop: 36 }}>
          <strong>Teslimat:</strong> Ödeme onaylandıktan hemen sonra indirme
          bağlantınız ekranda görünür. Siparişiniz 30 gün boyunca en fazla 10
          kez indirilebilir. Dijital ürün olduğu için indirme başladıktan sonra
          cayma hakkı sona erer;{" "}
          <Link href="/iade-kosullari" style={{ fontWeight: 700 }}>
            iptal ve iade koşullarına
          </Link>{" "}
          göz atın.
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />
    </main>
  );
}
