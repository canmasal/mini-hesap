import type { Metadata } from "next";
import Link from "next/link";

import Breadcrumb from "@/components/Breadcrumb";
import { calculators } from "@/data/calculators";

export const metadata: Metadata = {
  title: "Reklam Alanı",
  description:
    "MiniHesap'ta reklam vermek ister misiniz? Ana sayfa, hesaplama araçları ve rehber sayfalarındaki reklam alanları ile sponsorluk için bizimle iletişime geçin.",
  alternates: { canonical: "/reklam" },
};

const placements = [
  {
    icon: "🏠",
    title: "Ana sayfa",
    text: "Siteye gelen ziyaretçinin ilk gördüğü alanda markanızı gösterin.",
  },
  {
    icon: "🧮",
    title: "Hesaplama araçları",
    text: `Maaş, tazminat, KDV, kredi ve sınav dahil ${calculators.length}+ aracın sayfasında, konuyla ilgili kitleye ulaşın.`,
  },
  {
    icon: "📚",
    title: "Rehberler",
    text: "Vergi, çalışma hayatı ve finans rehberlerinde içerikle uyumlu reklam veya sponsorluk.",
  },
  {
    icon: "🤝",
    title: "Sponsorluk ve iş birliği",
    text: "Belirli bir hesaplama aracına sponsor olma ya da size özel iş birliği seçenekleri.",
  },
];

export default function AdvertisePage() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  return (
    <main className="page">
      <div className="container">
        <Breadcrumb
          items={[{ label: "Ana Sayfa", href: "/" }, { label: "Reklam Alanı" }]}
        />

        <p className="eyebrow">MİNİHESAP</p>
        <h1>Reklam Alanı</h1>

        <p className="page-lead">
          Sitemizde reklam vermek isteyen firmalar bizimle iletişime
          geçebilir. Maaş, vergi, kredi ve tazminat gibi konularda hesaplama
          yapan ziyaretçilere markanızı doğrudan ulaştırın.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
            marginTop: 28,
          }}
        >
          {placements.map((item) => (
            <div
              key={item.title}
              style={{
                padding: 18,
                borderRadius: "var(--r-md)",
                background: "var(--surface)",
                border: "1px solid var(--line)",
              }}
            >
              <div style={{ fontSize: 24 }} aria-hidden="true">
                {item.icon}
              </div>
              <strong style={{ display: "block", marginTop: 8 }}>{item.title}</strong>
              <p style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <section
          style={{
            marginTop: 32,
            padding: 24,
            borderRadius: "var(--r-md)",
            background: "#f0fdf4",
            border: "1px solid var(--line)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Reklam vermek için iletişime geçin</h2>
          <p style={{ color: "var(--ink-soft)", lineHeight: 1.7 }}>
            Firmanızın adını, tanıtmak istediğiniz ürün veya hizmeti ve
            düşündüğünüz reklam alanını yazmanız yeterli. Fiyat ve yayın
            seçenekleriyle size en kısa sürede dönüş yapalım.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
            <Link className="btn btn-green" href="/iletisim?konu=reklam">
              İletişim formuna git →
            </Link>
            {contactEmail ? (
              <a
                className="btn btn-outline"
                href={`mailto:${contactEmail}?subject=${encodeURIComponent("MiniHesap reklam talebi")}`}
              >
                E-posta gönder
              </a>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
