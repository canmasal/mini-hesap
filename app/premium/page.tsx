import type { Metadata } from "next";
import Link from "next/link";

import Breadcrumb from "@/components/Breadcrumb";
import { premiumProducts, KIND_LABELS } from "@/data/premiumProducts";
import type { ProductKind } from "@/data/premiumProducts";
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

/* ---------------------------------------------------------------
   Sayfa iceriginin veriden turetilen parcalari
   --------------------------------------------------------------- */

/** Paketleri karsilastirma tablosunda urun turune gore gruplariz. */
const KIND_ORDER: ProductKind[] = ["excel", "veritabani", "program"];

const comparisonGroups = KIND_ORDER.map((kind) => ({
  kind,
  rows: premiumProducts
    .filter((product) => product.kind === kind)
    .map((product) => ({
      slug: product.slug,
      title: product.title,
      tagline: product.tagline,
      inPlan: plans.map((plan) => plan.productSlugs.includes(product.slug)),
    })),
})).filter((group) => group.rows.length > 0);

const valueProps = [
  {
    icon: "🔒",
    title: "Veriler sizde kalır",
    text: "Dosyalar kendi bilgisayarınızda çalışır. Hiçbir kayıt sunucuya gönderilmez, bulut aboneliği gerekmez.",
  },
  {
    icon: "⚡",
    title: "Kurulum derdi yok",
    text: "İndirin, açın, kullanmaya başlayın. Formüller, tablolar ve raporlar hazır kurulmuş hâlde gelir.",
  },
  {
    icon: "♾️",
    title: "Tek ödeme, ömür boyu",
    text: "Aylık ücret yok. Bir kez ödersiniz, dosyalar süresiz sizindir; 30 gün boyunca yeniden indirebilirsiniz.",
  },
  {
    icon: "🧾",
    title: "Muhasebenize uygun",
    text: "KDV, kâr marjı, cari bakiye ve vade takibi Türkiye'deki işleyişe göre kurgulandı.",
  },
];

const faqs = [
  {
    q: "Paketi aldıktan sonra dosyaları nasıl alıyorum?",
    a: "Ödemeniz onaylandığı anda sipariş sayfanızda indirme bağlantıları açılır ve e-posta adresinize gönderilir. Paket aldıysanız her dosya için ayrı bir bağlantı görürsünüz.",
  },
  {
    q: "Abonelik mi, tek seferlik ödeme mi?",
    a: "Tek seferlik ödeme. Aylık veya yıllık yenileme yoktur; indirdiğiniz dosyalar süresiz olarak sizindir.",
  },
  {
    q: "Dosyaları kaç kez indirebilirim?",
    a: "Satın alma tarihinden itibaren 30 gün boyunca en fazla 10 kez indirebilirsiniz. Süre dolduktan sonra destek için bize yazmanız yeterli.",
  },
  {
    q: "Excel'im yok, yine de kullanabilir miyim?",
    a: "Excel şablonları LibreOffice ve Google E-Tablolar ile de açılır. Office'i hiç kullanmak istemiyorsanız Pro paketindeki Windows programı hiçbir ek yazılım gerektirmez.",
  },
  {
    q: "Önce küçük paketi alıp sonra yükseltebilir miyim?",
    a: "Evet. Aradaki farkı ödeyerek üst pakete geçebilirsiniz; iletişim sayfasından sipariş numaranızla yazmanız yeterli.",
  },
  {
    q: "İade mümkün mü?",
    a: "Dijital ürünlerde indirme başladıktan sonra cayma hakkı mevzuat gereği sona erer. İndirmeden önce vazgeçerseniz ödemeniz iade edilir.",
  },
];

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

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function PremiumPage() {
  const totalProducts = premiumProducts.length;

  return (
    <main className="page premium-page">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Premium Paketler" },
          ]}
        />

        {/* ================= HERO ================= */}
        <section className="premium-hero">
          <div className="premium-hero__main">
            <p className="premium-hero__eyebrow">
              <span aria-hidden="true">💎</span> MİNİHESAP PREMIUM
            </p>

            <h1>
              İşletmenizin takibini
              <br />
              <em>bugün</em> kurun
            </h1>

            <p className="premium-hero__lead">
              Ücretsiz araçlar tek seferlik hesap içindir. Premium paketler
              verilerinizi kalıcı olarak saklamanız, geçmişi izlemeniz ve rapor
              almanız için hazırlandı — kurulum, formül ve tablo işi bitmiş
              hâlde.
            </p>

            <div className="premium-hero__actions">
              <a className="btn btn-green" href="#paketler">
                Paketleri incele →
              </a>
              <Link className="btn btn-on-dark" href="/iletisim">
                Bize sorun
              </Link>
            </div>

            <ul className="premium-hero__trust">
              <li>Tek seferlik ödeme</li>
              <li>Abonelik yok</li>
              <li>Ömür boyu kullanım</li>
              <li>Veriler cihazınızda</li>
            </ul>
          </div>

          <dl className="premium-hero__stats">
            <div>
              <dt>Hazır ürün</dt>
              <dd>{totalProducts}</dd>
            </div>
            <div>
              <dt>Paket</dt>
              <dd>{plans.length}</dd>
            </div>
            <div>
              <dt>İndirme hakkı</dt>
              <dd>30 gün</dd>
            </div>
          </dl>
        </section>

        {/* ================= KARSILASTIRMA ================= */}
        <section className="premium-section">
          <div className="section-head">
            <p className="eyebrow">KARŞILAŞTIRMA</p>
            <h2>Paketler neleri kapsıyor?</h2>
            <p>Tabloyu yana kaydırarak tüm paketleri görebilirsiniz.</p>
          </div>

          <div className="plan-compare-wrap">
            <table className="plan-compare">
              <caption className="sr-only">
                Standart, Plus ve Pro paketlerinin içerdiği ürünler
              </caption>

              <thead>
                <tr>
                  <th scope="col">Ürün</th>
                  {plans.map((plan) => (
                    <th
                      key={plan.id}
                      scope="col"
                      className={plan.featured ? "is-featured" : undefined}
                    >
                      {plan.name}
                      <span>{plan.price.toLocaleString("tr-TR")} ₺</span>
                    </th>
                  ))}
                </tr>
              </thead>

              {comparisonGroups.map((group) => (
                <tbody key={group.kind}>
                  <tr className="plan-compare__group">
                    <th scope="colgroup" colSpan={plans.length + 1}>
                      {KIND_LABELS[group.kind]}
                    </th>
                  </tr>

                  {group.rows.map((row) => (
                    <tr key={row.slug}>
                      <th scope="row">
                        {row.title}
                        <span>{row.tagline}</span>
                      </th>
                      {row.inPlan.map((included, index) => (
                        <td
                          key={plans[index].id}
                          className={`${included ? "is-yes" : "is-no"}${
                            plans[index].featured ? " is-featured" : ""
                          }`}
                        >
                          <span className="sr-only">
                            {included ? "Dahil" : "Dahil değil"}
                          </span>
                          <span aria-hidden="true">{included ? "✓" : "–"}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}

              <tfoot>
                <tr>
                  <th scope="row">Paketi al</th>
                  {plans.map((plan) => (
                    <td
                      key={plan.id}
                      className={plan.featured ? "is-featured" : undefined}
                    >
                      <Link
                        className="plan-compare__cta"
                        href={`/satin-al/${plan.slug}`}
                      >
                        Seç
                      </Link>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* ================= PAKETLER ================= */}
        <section id="paketler" className="premium-section">
          <div className="section-head">
            <p className="eyebrow">PAKETLER</p>
            <h2>İşletmenize uygun paketi seçin</h2>
            <p>
              Her paket bir alt paketteki her şeyi içerir. Emin değilseniz çoğu
              işletmenin tercih ettiği <strong>Plus</strong> ile başlayın.
            </p>
          </div>

          <div className="plan-grid">
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
                  <h3 className="plan-card__name">{plan.name}</h3>
                  <p className="plan-card__tagline">{plan.tagline}</p>

                  <div className="plan-card__price">
                    <b>
                      {plan.price.toLocaleString("tr-TR")}
                      <i>₺</i>
                    </b>
                    <span>tek seferlik · KDV dâhil</span>
                  </div>

                  {saving > 0 && (
                    <p className="plan-card__saving">
                      <s>{listValue.toLocaleString("tr-TR")} ₺</s> değerinde
                      içerik
                      <span className="plan-card__saving-pill">
                        %{saving} avantaj
                      </span>
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
                    <summary>Pakete dahil {products.length} ürün</summary>
                    <ul>
                      {products.map((product) => (
                        <li key={product.slug}>
                          <span aria-hidden="true">{product.icon}</span>
                          {product.title}
                        </li>
                      ))}
                    </ul>
                  </details>
                </article>
              );
            })}
          </div>

          <p className="plan-note">
            Ödeme havale/EFT ile alınır. Ödemeniz onaylandıktan sonra indirme
            bağlantınız e-posta ile iletilir.{" "}
            <Link href="/iade-kosullari">İptal ve iade koşulları</Link>
          </p>
        </section>

        {/* ================= NEDEN PREMIUM ================= */}
        <section className="premium-section">
          <div className="section-head">
            <p className="eyebrow">NEDEN PREMIUM?</p>
            <h2>Hazır kurulmuş bir sistem satın alıyorsunuz</h2>
          </div>

          <div className="value-grid">
            {valueProps.map((item) => (
              <article key={item.title} className="value-card">
                <span className="value-card__icon" aria-hidden="true">
                  {item.icon}
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ================= SSS ================= */}
        <section className="premium-section">
          <div className="section-head">
            <p className="eyebrow">SIKÇA SORULANLAR</p>
            <h2>Aklınıza takılanlar</h2>
          </div>

          <div className="faq-list">
            {faqs.map((item) => (
              <details key={item.q} className="faq-item">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ================= TEKIL URUNLER ================= */}
        <section className="premium-section">
          <div className="section-head">
            <p className="eyebrow">TEK ÜRÜN</p>
            <h2>Sadece bir dosya da alabilirsiniz</h2>
            <p>
              Paket almak istemiyorsanız ürünleri tek tek satın alabilirsiniz.
            </p>
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
        </section>

        {/* ================= KAPANIS ================= */}
        <section className="premium-cta">
          <h2>Hangi paketin size uyduğundan emin değil misiniz?</h2>
          <p>
            İşinizi kısaca anlatın, hangi dosyaların işinizi göreceğini
            söyleyelim. Satış baskısı yok.
          </p>
          <div className="premium-cta__actions">
            <Link className="btn btn-green" href="/iletisim">
              Bize yazın →
            </Link>
            <Link className="btn btn-on-dark" href="/program-talebi">
              Özel çözüm isteyin
            </Link>
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  );
}
