import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import AdSlot from "@/components/AdSlot";
import Breadcrumb from "@/components/Breadcrumb";
import { guides, findGuide } from "@/data/guides";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = findGuide(slug);

  if (!guide) return { title: "Rehber bulunamadı" };

  return {
    title: guide.metaTitle,
    description: guide.description,
    alternates: { canonical: `/rehber/${slug}` },
    openGraph: {
      type: "article",
      title: guide.metaTitle,
      description: guide.description,
      publishedTime: guide.published,
      modifiedTime: guide.updated,
      url: `/rehber/${slug}`,
    },
  };
}

/** "- " ile başlayan ardışık satırları listeye, diğerlerini paragrafa çevirir */
function renderBody(lines: string[]) {
  const blocks: { type: "p" | "ul"; items: string[] }[] = [];

  for (const line of lines) {
    const isItem = line.startsWith("- ");
    const last = blocks[blocks.length - 1];

    if (isItem) {
      if (last?.type === "ul") last.items.push(line.slice(2));
      else blocks.push({ type: "ul", items: [line.slice(2)] });
    } else {
      blocks.push({ type: "p", items: [line] });
    }
  }

  return blocks.map((b, i) =>
    b.type === "ul" ? (
      <ul key={i}>
        {b.items.map((item, j) => (
          <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>
    ) : (
      <p key={i} dangerouslySetInnerHTML={{ __html: b.items[0] }} />
    )
  );
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = findGuide(slug);

  if (!guide) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://minihesap.net";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.published,
    dateModified: guide.updated,
    inLanguage: "tr-TR",
    author: { "@type": "Organization", name: "MiniHesap", url: baseUrl },
    publisher: { "@type": "Organization", name: "MiniHesap", url: baseUrl },
    mainEntityOfPage: `${baseUrl}/rehber/${guide.slug}`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const related = guide.related
    .map((s) => findGuide(s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  return (
    <main className="page">
      <div className="container">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Rehberler", href: "/rehber" },
            { label: guide.title },
          ]}
        />

        <article style={{ maxWidth: 760 }}>
          <p className="eyebrow">{guide.category.toUpperCase()}</p>

          <h1 style={{ fontSize: "clamp(28px, 4.5vw, 42px)" }}>
            {guide.title}
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              color: "var(--muted)",
              fontSize: 13,
            }}
          >
            {guide.readingMinutes} dakikalık okuma · Güncelleme:{" "}
            {new Date(guide.updated).toLocaleDateString("tr-TR")}
          </p>

          <p className="page-lead" style={{ marginTop: 18 }}>
            {guide.intro}
          </p>

          {/* Aracı erken göster: okuyucu hemen hesaplamak isteyebilir */}
          <div className="notice notice-ok" style={{ marginTop: 22 }}>
            <strong>Hemen hesaplamak isterseniz:</strong>{" "}
            <Link
              href={`/hesaplamalar/${guide.tool.slug}`}
              style={{ fontWeight: 700, textDecoration: "underline" }}
            >
              {guide.tool.label}
            </Link>{" "}
            aracını kullanabilirsiniz.
          </div>

          {/* İçindekiler */}
          <nav
            aria-label="İçindekiler"
            style={{
              marginTop: 26,
              padding: 18,
              borderRadius: "var(--r-md)",
              background: "var(--surface)",
              border: "1px solid var(--line)",
            }}
          >
            <strong style={{ fontSize: 14 }}>İçindekiler</strong>
            <ol
              style={{
                margin: "10px 0 0",
                paddingLeft: 20,
                lineHeight: 1.9,
                fontSize: 14,
              }}
            >
              {guide.sections.map((s, i) => (
                <li key={s.heading}>
                  <a
                    href={`#bolum-${i + 1}`}
                    style={{ color: "var(--brand-dark)" }}
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="prose" style={{ maxWidth: "none" }}>
            {guide.sections.map((s, i) => (
              <section key={s.heading} id={`bolum-${i + 1}`}>
                <h2 style={{ scrollMarginTop: 90 }}>{s.heading}</h2>
                {renderBody(s.body)}

                {/* Uzun yazılarda ortaya bir reklam alanı */}
                {i === Math.floor(guide.sections.length / 2) && (
                  <AdSlot position="middle" />
                )}
              </section>
            ))}

            <h2>Sık Sorulan Sorular</h2>
            <div style={{ display: "grid", gap: 12 }}>
              {guide.faqs.map((f) => (
                <details
                  key={f.question}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: "var(--r-md)",
                    padding: "16px 18px",
                  }}
                >
                  <summary style={{ cursor: "pointer", fontWeight: 800 }}>
                    {f.question}
                  </summary>
                  <p style={{ margin: "12px 0 0" }}>{f.answer}</p>
                </details>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: 34,
              padding: 24,
              borderRadius: "var(--r-lg)",
              background: "var(--surface-mint)",
              border: "1px solid var(--brand-line)",
              textAlign: "center",
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: 20 }}>
              Şimdi kendi durumunuz için hesaplayın
            </h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
              Bu rehberdeki kuralları kendi rakamlarınıza uygulayın.
            </p>
            <Link
              className="btn btn-green"
              href={`/hesaplamalar/${guide.tool.slug}`}
              style={{ marginTop: 8 }}
            >
              {guide.tool.label} →
            </Link>
          </div>

          <p className="notice notice-warn" style={{ marginTop: 26 }}>
            <strong>Bilgilendirme:</strong> Bu rehber genel bilgilendirme
            amaçlıdır ve hukuki veya mali danışmanlık yerine geçmez. Mevzuat
            değişebilir; bağlayıcı bir karar almadan önce mali müşavirinize
            veya avukatınıza danışın.
          </p>

          {related.length > 0 && (
            <div style={{ marginTop: 34 }}>
              <h2 style={{ fontSize: 20 }}>İlgili rehberler</h2>
              <div className="cards" style={{ marginTop: 16 }}>
                {related.map((r) => (
                  <Link key={r.slug} className="card" href={`/rehber/${r.slug}`}>
                    <div className="card-icon" aria-hidden="true">
                      {r.icon}
                    </div>
                    <h3>{r.title}</h3>
                    <p>{r.description}</p>
                    <div className="card-link">Oku →</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  );
}
