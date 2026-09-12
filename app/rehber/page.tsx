import type { Metadata } from "next";
import Link from "next/link";

import AdSlot from "@/components/AdSlot";
import Breadcrumb from "@/components/Breadcrumb";
import { guides } from "@/data/guides";
import { calculators, categories } from "@/data/calculators";

export const metadata: Metadata = {
  title: "Rehberler",
  description:
    "Net maaş, kıdem tazminatı, KDV, kredi, emeklilik, kira artışı ve diğer hesaplama araçlarını açıklayan örnekli rehberler.",
  alternates: { canonical: "/rehber" },
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://minihesap.net";

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

const faqItems = [
  {
    question: "Hesaplama rehberleri ne işe yarar?",
    answer:
      "Rehberler, hesaplamada kullanılan temel kuralları, formülleri ve dikkat edilmesi gereken noktaları açıklar. Böylece sonucu görmeden önce hangi verilerin önemli olduğunu anlarsınız.",
  },
  {
    question: "Hesaplama araçları ücretsiz mi?",
    answer:
      "MiniHesap üzerindeki temel hesaplama araçları ücretsizdir ve üyelik gerektirmez. Sonuçlar bilgilendirme amaçlı tahminlerdir.",
  },
  {
    question: "Hesaplama sonucu resmi belge yerine geçer mi?",
    answer:
      "Hayır. Maaş, vergi, tazminat ve finans sonuçları bilgilendirme amaçlıdır. Resmi işlem öncesinde işveren, banka veya yetkili uzmanla doğrulama yapılmalıdır.",
  },
];

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

        <section className="section section-white" style={{ marginTop: 48, padding: "52px 0" }}>
          <div className="section-head">
            <p className="eyebrow">HESAPLAMA ARAÇLARI REHBERİ</p>
            <h2>Hangi araç ne zaman kullanılır?</h2>
            <p>
              İhtiyacınız olan hesabı seçin. Her araç sayfasında nasıl hesaplandığını, hangi verilerin gerektiğini ve sık sorulan soruları bulabilirsiniz.
            </p>
          </div>

          <div className="cards" style={{ marginTop: 28 }}>
            {categories.filter((category) => category.id !== "all").map((category) => (
              <div className="card" key={category.id}>
                <span className="eyebrow">{category.label.toUpperCase()}</span>
                <h3 style={{ marginTop: 10 }}>{category.label} hesapları</h3>
                <ul style={{ paddingLeft: 18, margin: "14px 0 0", color: "var(--muted)" }}>
                  {calculators.filter((calculator) => calculator.category === category.id).map((calculator) => (
                    <li key={calculator.slug} style={{ marginTop: 7 }}>
                      <Link href={`/hesaplamalar/${calculator.slug}`} style={{ color: "var(--brand-dark)", fontWeight: 700 }}>
                        {calculator.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="prose" style={{ margin: "54px auto 0", maxWidth: 820 }}>
          <h2>MiniHesap rehberleri nasıl kullanılır?</h2>
          <p>
            Önce ihtiyacınıza uygun rehberi okuyun, ardından aynı konuya bağlı hesaplama aracında kendi bilgilerinizi kullanın. Böylece formüldeki kavramları ve sonucu etkileyen verileri daha doğru yorumlayabilirsiniz.
          </p>
          <div className="faq-list">
            {faqItems.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          }),
        }}
      />
    </main>
  );
}
