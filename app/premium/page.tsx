import type { Metadata } from "next";
import Link from "next/link";

import Breadcrumb from "@/components/Breadcrumb";
import { premiumProducts, KIND_LABELS } from "@/data/premiumProducts";
import {
  plans,
  planProducts,
  planListValue,
  planSavingPercent,
} from "@/data/plans";

export const metadata: Metadata = {
  title: "Premium Paketler — Standart, Plus ve Pro",
  description:
    "Standart, Plus ve Pro paketlerle işletme takibinizi tek seferde kurun. Excel şablonları, Access veritabanı ve Windows programı; abonelik yok, ömür boyu kullanım.",
  alternates: { canonical: "/premium" },
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const listSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "MiniHesap Premium Paketler",
  itemListElement: plans.map((plan, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: `MiniHesap ${plan.name}`,
    url: `${baseUrl}/satin-al/${plan.slug}`,
  })),
};

/* Karsilastirma tablosunun satirlari: her urun bir satir, paketlerde
   bulunup bulunmadigi isaretlenir. */
const comparisonRows = premiumProducts.map((product) => ({
  slug: product.slug,
  title: product.title,
  kind: product.kind,
  inPlan: plans.map((plan) => plan.productSlugs.includes(product.slug)),
}));

export default function PremiumPage() {
  return (
    <main className="page">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Premium Paketler" },
          ]}
        />

        <div className="section-head">
          <p className="eyebrow">💎 MİNİHESAP PREMIUM</p>

          <h1 style={{ margin: "10px 0 14px" }}>
            İşletmenize uygun paketi seçin
          </h1>

          <p className="page-lead" style={{ margin: "0 auto" }}>
            Sitedeki ücretsiz araçlar tek seferlik hesap içindir. Premium
            paketler verilerinizi kalıcı olarak saklamanız, geçmişi takip
            etmeniz ve rapor almanız için hazırlandı. Abonelik yok — bir kez
            ödersiniz, ömür boyu kullanırsınız.
          </p>
        </div>

        {/* ============ PAKETLER ============ */}
        <section className="plan-grid" aria-label="Premium paketler">
          {plans.map((plan) => {
            const products = planProducts(plan);
            const listValue = planListValue(plan);
            const saving = planSavingPercent(plan);

            return (
              <article
                key={plan.id}
                className={`plan-card${plan.featured ? " is-featured" : ""}`}
              >
                {plan.badge && (
                  <span className="plan-card__badge">{plan.badge}</span>
                )}

                <p className="plan-card__audience">{plan.audience}</p>
                <h2 className="plan-card__name">{plan.name}</h2>
                <p className="plan-card__tagline">{plan.tagline}</p>

                <div className="plan-card__price">
                  <b>{plan.price.toLocaleString("tr-TR")} ₺</b>
                  <span>tek seferlik · KDV dâhil</span>
                </div>

                {saving > 0 && (
                  <p className="plan-card__saving">
                    <s>{listValue.toLocaleString("tr-TR")} ₺</s> değerinde
                    içerik · <strong>%{saving} avantaj</strong>
                  </p>
                )}

                <Link
                  className={`btn plan-card__cta${
                    plan.featured ? " btn-green" : " btn-ghost"
                  }`}
                  href={`/satin-al/${plan.slug}`}
                >
                  {plan.name} paketini al →
                </Link>

                <ul className="plan-card__perks">
                  {plan.perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>

                <details className="plan-card__contents">
                  <summary>
                    Pakete dahil {products.length} ürünü gör
                  </summary>
                  <ul>
                    {products.map((product) => (
                      <li key={product.slug}>
                        <span aria-hidden="true">{product.icon}</span>{" "}
                        {product.title}
                      </li>
                    ))}
                  </ul>
                </details>
              </article>
            );
          })}
        </section>

        <p className="plan-note">
          Ödeme havale/EFT ile alınır. Ödemeniz onaylandıktan sonra indirme
          bağlantınız e-posta ile iletilir.{" "}
          <Link href="/iletisim">Sorunuz mu var?</Link>
        </p>

        {/* ============ KARSILASTIRMA ============ */}
        <section className="section-head" style={{ marginTop: 56 }}>
          <h2>Paketler neleri kapsıyor?</h2>
          <p className="page-lead" style={{ margin: "0 auto" }}>
            Her paket, bir alt paketteki her şeyi içerir.
          </p>
        </section>

        <div className="plan-compare-wrap">
          <table className="plan-compare">
            <thead>
              <tr>
                <th scope="col">Ürün</th>
                {plans.map((plan) => (
                  <th key={plan.id} scope="col">
                    {plan.name}
                    <span>{plan.price.toLocaleString("tr-TR")} ₺</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.slug}>
                  <th scope="row">
                    {row.title}
                    <span>{KIND_LABELS[row.kind]}</span>
                  </th>
                  {row.inPlan.map((included, index) => (
                    <td
                      key={plans[index].id}
                      className={included ? "is-yes" : "is-no"}
                    >
                      <span className="sr-only">
                        {included ? "Dahil" : "Dahil değil"}
                      </span>
                      <span aria-hidden="true">{included ? "✓" : "—"}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ============ TEKIL URUNLER ============ */}
        <section className="section-head" style={{ marginTop: 56 }}>
          <h2>Tek ürün de satın alabilirsiniz</h2>
          <p className="page-lead" style={{ margin: "0 auto" }}>
            Sadece bir dosyaya ihtiyacınız varsa ürünleri tek tek de
            alabilirsiniz.
          </p>
        </section>

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

              <h3 className="product-card__title">{product.title}</h3>

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

              {/* Ikincil baglantilar esnek alanda durur; boylece alttaki
                  fiyat + buton blogu her kartta ayni yukseklikte kalir. */}
              <div className="product-card__links">
                {product.relatedTool && (
                  <span>
                    Ücretsiz dene:{" "}
                    <Link href={product.relatedTool.href}>
                      {product.relatedTool.label}
                    </Link>
                  </span>
                )}

                {product.landingPage && (
                  <Link href={product.landingPage}>Ayrıntılı incele</Link>
                )}
              </div>

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
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />
    </main>
  );
}
