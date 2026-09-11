import Link from "next/link";

import { premiumForTool, KIND_LABELS } from "@/data/premiumProducts";

/**
 * Ücretsiz araç sayfalarında gösterilen premium yönlendirme kutusu.
 *
 * Kullanıcı aracı denedikten sonra "bu verileri kalıcı saklamak istiyorum"
 * noktasına geldiğinde ilgili ürünü önerir. İlgili ürün yoksa hiçbir şey
 * göstermez.
 */
export default function PremiumCta({ toolHref }: { toolHref: string }) {
  const products = premiumForTool(toolHref);

  if (products.length === 0) return null;

  /* En uygun fiyatlı olan öne çıkarılır; diğerleri alt satırda listelenir */
  const sorted = [...products].sort((a, b) => a.price - b.price);
  const main = sorted[0];
  const others = sorted.slice(1);

  return (
    <aside className="premium-cta">
      <div className="premium-cta__head">
        <div className="premium-cta__icon" aria-hidden="true">
          {main.icon}
        </div>

        <div>
          <h3>Verilerinizi kalıcı olarak saklamak ister misiniz?</h3>
          <span className={`product-card__kind is-${main.kind}`}>
            {KIND_LABELS[main.kind]}
          </span>
        </div>
      </div>

      <p>
        Bu araç tek seferlik hesap içindir; girdiğiniz veriler yalnızca bu
        tarayıcıda tutulur. <strong>{main.title}</strong> ile{" "}
        {main.tagline.toLocaleLowerCase("tr-TR")} — geçmişi takip eder, rapor
        alır ve yedekleyebilirsiniz.
      </p>

      <div className="premium-cta__row">
        <span className="premium-cta__price">
          {main.price.toLocaleString("tr-TR")} ₺
        </span>

        <Link className="btn btn-green" href={`/satin-al/${main.slug}`}>
          Satın Al →
        </Link>

        <Link className="btn btn-outline" href="/premium">
          Tüm premium hizmetler
        </Link>
      </div>

      {others.length > 0 && (
        <p style={{ margin: "14px 0 0", fontSize: 13, color: "var(--muted)" }}>
          Daha kapsamlı seçenekler:{" "}
          {others.map((p, i) => (
            <span key={p.slug}>
              {i > 0 && " · "}
              <Link
                href={`/satin-al/${p.slug}`}
                style={{
                  color: "var(--brand-dark)",
                  fontWeight: 700,
                  textDecoration: "underline",
                }}
              >
                {p.title} ({p.price.toLocaleString("tr-TR")} ₺)
              </Link>
            </span>
          ))}
        </p>
      )}
    </aside>
  );
}
