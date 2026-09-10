import Link from "next/link";

export type Crumb = {
  label: string;
  href?: string;
};

/**
 * Görsel breadcrumb + schema.org BreadcrumbList.
 * Son öğe her zaman geçerli sayfadır ve link içermez.
 */
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${baseUrl}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <nav className="breadcrumb" aria-label="Site içi konum">
        <ol>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={item.label} aria-current={isLast ? "page" : undefined}>
                {item.href && !isLast ? (
                  <Link href={item.href}>{item.label}</Link>
                ) : (
                  <span>{item.label}</span>
                )}

                {!isLast && (
                  <span className="sep" aria-hidden="true">
                    {" "}
                    ›
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
